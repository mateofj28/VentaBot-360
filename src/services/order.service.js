// services/order.service.js
import pool from "../config/db.js";

export const createOrder = async (orderData) => {
    const {
        phone,
        customer_name,
        customer_address,
        customer_phone,
        product_name,
        quantity,
        total,
        payment_method,
    } = orderData;

    // Buscar el producto por nombre
    const productRes = await pool.query(
        "SELECT id FROM products WHERE LOWER(name) LIKE $1 AND active = true LIMIT 1",
        [`%${product_name.toLowerCase()}%`]
    );
    const product_id = productRes.rows[0]?.id || null;

    const { rows } = await pool.query(
        `INSERT INTO orders (phone, customer_name, customer_address, customer_phone, product_id, product_name, quantity, total, payment_method)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [phone, customer_name, customer_address, customer_phone, product_id, product_name, quantity || 1, total, payment_method]
    );

    // Descontar stock si encontramos el producto
    if (product_id) {
        await pool.query(
            "UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1",
            [quantity || 1, product_id]
        );
    }

    console.log(`🛒 Pedido #${rows[0].id} creado para ${customer_name}`);
    return rows[0];
};

export const getOrders = async () => {
    const { rows } = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    return rows;
};

export const updateOrderStatus = async (id, status) => {
    const { rows } = await pool.query(
        "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
        [status, id]
    );
    return rows[0];
};
