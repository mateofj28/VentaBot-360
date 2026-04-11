// services/knowledge.service.js
import pool from "../config/db.js";

export const getActiveProducts = async () => {
    const res = await pool.query(
        "SELECT name, description, price, stock, category FROM products WHERE active = true ORDER BY category, name"
    );
    return res.rows;
};

export const getBusinessInfo = async () => {
    const res = await pool.query("SELECT key, value FROM business_info");
    const info = {};
    res.rows.forEach((row) => {
        info[row.key] = row.value;
    });
    return info;
};

export const buildKnowledgeContext = async () => {
    const products = await getActiveProducts();
    const info = await getBusinessInfo();

    let context = "";

    // Info del negocio
    if (Object.keys(info).length > 0) {
        context += "INFORMACIÓN DEL NEGOCIO:\n";
        for (const [key, value] of Object.entries(info)) {
            context += `- ${key}: ${value}\n`;
        }
        context += "\n";
    }

    // Productos
    if (products.length > 0) {
        context += "CATÁLOGO DE PRODUCTOS DISPONIBLES:\n";
        products.forEach((p) => {
            const stock = p.stock > 0 ? `(${p.stock} disponibles)` : "(SIN STOCK)";
            context += `- ${p.name}: $${p.price} ${stock}`;
            if (p.description) context += ` — ${p.description}`;
            if (p.category) context += ` [${p.category}]`;
            context += "\n";
        });
    } else {
        context += "No hay productos cargados en el sistema.\n";
    }

    return context;
};
