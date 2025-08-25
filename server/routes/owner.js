import express from "express";
import { auth } from "../middleware/auth.js";
import { db } from "../config/db.js";

const router = express.Router();

/**
 * Get store owned by logged-in owner
 */
router.get("/store", auth(["owner"]), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.id, s.name, s.address,
              COALESCE(AVG(r.rating), 0) AS avgRating
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.owner_id = ?
       GROUP BY s.id`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No store assigned to this owner" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get all ratings for owner’s store
 */
router.get("/store/ratings", auth(["owner"]), async (req, res) => {
  try {
    const [store] = await db.query("SELECT id FROM stores WHERE owner_id = ?", [req.user.id]);
    if (store.length === 0) {
      return res.status(404).json({ error: "No store found for this owner" });
    }

    const storeId = store[0].id;

    const [ratings] = await db.query(
      `SELECT u.name, u.email, r.rating, r.created_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?`,
      [storeId]
    );

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
