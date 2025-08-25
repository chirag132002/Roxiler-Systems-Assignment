import express from "express";
import { auth } from "../middleware/auth.js";
import { db } from "../config/db.js";

const router = express.Router();

/**
 * Admin Dashboard
 * Shows counts: users, stores, ratings
 */
router.get("/dashboard", auth(["admin"]), async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");
    const [[{ totalStores }]] = await db.query("SELECT COUNT(*) AS totalStores FROM stores");
    const [[{ totalRatings }]] = await db.query("SELECT COUNT(*) AS totalRatings FROM ratings");

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Add new user
 */
router.post("/users", auth(["admin"]), async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Name, email, password, and role are required" });
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, role]
    );

    res.json({ message: "User created successfully", userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Add new store (linked to owner_id if provided)
 */
router.post("/stores", auth(["admin"]), async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({ error: "Name, email, and address are required" });
    }

    await db.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address, owner_id || null]
    );

    res.json({ message: "Store added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * View all stores (with avg rating)
 */
router.get("/stores", auth(["admin"]), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.id, s.name, s.email, s.address,
             COALESCE(AVG(r.rating), 0) AS avgRating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * View all users (filter by role, name, email, address)
 */
router.get("/users", auth(["admin"]), async (req, res) => {
  try {
    const { role, name, email, address } = req.query;
    let sql = "SELECT id, name, email, address, role FROM users WHERE 1=1";
    const params = [];

    if (role) {
      sql += " AND role = ?";
      params.push(role);
    }
    if (name) {
      sql += " AND name LIKE ?";
      params.push(`%${name}%`);
    }
    if (email) {
      sql += " AND email LIKE ?";
      params.push(`%${email}%`);
    }
    if (address) {
      sql += " AND address LIKE ?";
      params.push(`%${address}%`);
    }

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
