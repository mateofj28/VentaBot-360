// services/db.service.js
import pool from "../config/db.js";

export const saveMessage = async (phone, role, message) => {
    await pool.query(
        "INSERT INTO messages (phone, role, message) VALUES ($1, $2, $3)",
        [phone, role, message]
    );
};

export const getConversation = async (phone) => {
    const res = await pool.query(
        "SELECT role, message FROM messages WHERE phone = $1 ORDER BY created_at DESC LIMIT 10",
        [phone]
    );

    return res.rows.reverse();
};
