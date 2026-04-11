import "dotenv/config";
import express from "express";
import cors from "cors";
import whatsappRoutes from "./routes/whatsapp.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { initDB } from "./config/db.js";

const app = express();
app.use(cors({
    origin: "https://ventabot-360-admin-production.up.railway.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
    res.json({ message: "🤖 WhatsApp Bot API funcionando correctamente" });
});

app.use("/webhook", whatsappRoutes);
app.use("/api/admin", adminRoutes);

app.listen(process.env.PORT || 3000, async () => {
    await initDB();
    console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});
