// routes/admin.routes.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// --- PRODUCTOS ---

router.get("/products", async (_req, res) => {
    const { rows } = await pool.query("SELECT * FROM products ORDER BY id");
    res.json(rows);
});

router.post("/products", async (req, res) => {
    const { name, description, price, stock, category } = req.body;
    const { rows } = await pool.query(
        "INSERT INTO products (name, description, price, stock, category) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [name, description, price, stock || 0, category]
    );
    res.status(201).json(rows[0]);
});

router.put("/products/:id", async (req, res) => {
    const { name, description, price, stock, category, active } = req.body;
    const { rows } = await pool.query(
        "UPDATE products SET name=$1, description=$2, price=$3, stock=$4, category=$5, active=$6 WHERE id=$7 RETURNING *",
        [name, description, price, stock, category, active, req.params.id]
    );
    res.json(rows[0]);
});

router.delete("/products/:id", async (req, res) => {
    await pool.query("DELETE FROM products WHERE id=$1", [req.params.id]);
    res.json({ deleted: true });
});

// --- INFO DEL NEGOCIO ---

router.get("/info", async (_req, res) => {
    const { rows } = await pool.query("SELECT * FROM business_info ORDER BY key");
    res.json(rows);
});

router.post("/info", async (req, res) => {
    const { key, value } = req.body;
    const { rows } = await pool.query(
        `INSERT INTO business_info (key, value) VALUES ($1,$2)
         ON CONFLICT (key) DO UPDATE SET value=$2 RETURNING *`,
        [key, value]
    );
    res.status(201).json(rows[0]);
});

router.delete("/info/:key", async (req, res) => {
    await pool.query("DELETE FROM business_info WHERE key=$1", [req.params.key]);
    res.json({ deleted: true });
});

export default router;
