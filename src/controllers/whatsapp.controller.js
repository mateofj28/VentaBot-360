// controllers/whatsapp.controller.js
import { getAIResponse } from "../services/ai.service.js";
import { sendWhatsAppMessage } from "../services/whatsapp.service.js";
import { saveMessage, getConversation } from "../services/db.service.js";

export const handleIncomingMessage = async (req, res) => {
    try {
        const from = req.body.From?.replace("whatsapp:", "");
        const message = req.body.Body;

        if (!from || !message) {
            res.set("Content-Type", "text/xml");
            return res.send("<Response></Response>");
        }

        console.log(`📩 Mensaje de ${from}: ${message}`);

        await saveMessage(from, "user", message);
        const history = await getConversation(from);
        const reply = await getAIResponse(message, history);
        await saveMessage(from, "bot", reply);
        await sendWhatsAppMessage(from, reply);

        res.set("Content-Type", "text/xml");
        res.send("<Response></Response>");
    } catch (error) {
        console.error("❌ Error en webhook:", error);
        res.set("Content-Type", "text/xml");
        res.send("<Response></Response>");
    }
};
