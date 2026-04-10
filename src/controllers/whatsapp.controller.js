// controllers/whatsapp.controller.js

import { getAIResponse } from "../services/ai.service.js";
import { sendWhatsAppMessage } from "../services/whatsapp.service.js";
import { saveMessage, getConversation } from "../services/db.service.js";
import { detectIntent } from "../utils/intentDetector.js";

export const handleIncomingMessage = async (req, res) => {
    try {
        const from = req.body.From.replace("whatsapp:", "");
        const message = req.body.Body;

        console.log("📩 Mensaje recibido:", message);

        // 1. Guardar mensaje
        await saveMessage(from, "user", message);

        // 2. Obtener historial
        const history = await getConversation(from);

        // 3. Detectar intención
        const intent = detectIntent(message);

        let reply;

        // 4. Lógica de negocio
        if (intent === "SALUDO") {
            reply = "Hola 👋 ¿En qué puedo ayudarte?";
        } else if (intent === "PRECIO") {
            reply = "Claro, tenemos productos desde $20.000 💸";
        } else {
            // 5. IA
            reply = await getAIResponse(message, history);
        }

        // 6. Guardar respuesta
        await saveMessage(from, "bot", reply);

        // 7. Responder a WhatsApp
        await sendWhatsAppMessage(from, reply);

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};