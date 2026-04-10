import "dotenv/config";
import express from "express";
import whatsappRoutes from "./routes/whatsapp.routes.js";
import { initDB } from "./config/db.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
    res.json({ message: "🤖 WhatsApp Bot API funcionando correctamente" });
});

app.use("/webhook", whatsappRoutes);

app.listen(process.env.PORT || 3000, async () => {
    await initDB();
    console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});
