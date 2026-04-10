import "dotenv/config";
import express from "express";
import whatsappRoutes from "./routes/whatsapp.routes.js";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({ message: "🤖 WhatsApp Bot API funcionando correctamente" });
});

app.use("/webhook", whatsappRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});
