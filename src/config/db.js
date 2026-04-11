// config/db.js
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      phone VARCHAR(20),
      role VARCHAR(10),
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      price DECIMAL(12,2) NOT NULL,
      stock INTEGER DEFAULT 0,
      category VARCHAR(100),
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS business_info (
      id SERIAL PRIMARY KEY,
      key VARCHAR(100) UNIQUE NOT NULL,
      value TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      phone VARCHAR(20) NOT NULL,
      customer_name VARCHAR(200),
      customer_address TEXT,
      customer_phone VARCHAR(20),
      product_id INTEGER REFERENCES products(id),
      product_name VARCHAR(200),
      quantity INTEGER DEFAULT 1,
      total DECIMAL(12,2),
      payment_method VARCHAR(50),
      status VARCHAR(20) DEFAULT 'pendiente',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ Tablas listas (messages, products, business_info, orders)");
}

export default pool;