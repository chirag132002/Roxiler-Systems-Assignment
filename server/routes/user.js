import express from "express";
import { auth } from "../middleware/auth.js";
import { db } from "../config/db.js";

const router = express.Router();

/**
 * View/Search all stores (with avg + user's rating)
 */
router.get("/stores", auth(["user", "owner", "admin"]), async (req, res) => {
  try {
    const { name, address } = req.query;
    let sql = `
      SELECT s.id, s.name, s.email, s.address,
             COALESCE(AVG(r.rating), 0) AS avgRating,
             (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) AS userRating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [req.user.id];

    if (name) {
      sql += " AND s.name LIKE ?";
      params.push(`%${name}%`);
    }
    if (address) {
      sql += " AND s.address LIKE ?";
      params.push(`%${address}%`);
    }

    sql += " GROUP BY s.id";

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Submit or update rating for a store
 */
router.post("/ratings/:storeId", auth(["user"]), async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be 1–5" });
    }

    await db.query(
      "INSERT INTO ratings (store_id, user_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating)",
      [storeId, req.user.id, rating]
    );

    res.json({ message: "Rating submitted/updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
