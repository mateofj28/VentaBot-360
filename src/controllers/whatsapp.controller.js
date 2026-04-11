// controllers/whatsapp.controller.js
import { getAIResponse, extractOrderData } from "../services/ai.service.js";
import { sendWhatsAppMessage } from "../services/whatsapp.service.js";
import { saveMessage, getConversation } from "../services/db.service.js";
import { createOrder } from "../services/order.service.js";

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

        // Verificar si hay un pedido confirmado
        const fullHistory = await getConversation(from);
        const orderData = await extractOrderData(fullHistory);

        if (orderData.confirmed) {
            try {
                const order = await createOrder({
                    phone: from,
                    customer_name: orderData.customer_name,
                    customer_address: orderData.customer_address,
                    customer_phone: orderData.customer_phone || from,
                    product_name: orderData.product_name,
                    quantity: orderData.quantity || 1,
                    total: orderData.total,
                    payment_method: orderData.payment_method,
                });

                const confirmMsg = `✅ ¡Pedido #${order.id} registrado exitosamente!\n\n📦 Producto: ${order.product_name}\n💰 Total: $${order.total}\n📍 Envío a: ${order.customer_address}\n\nTe contactaremos pronto para coordinar. ¡Gracias por tu compra!`;

                await saveMessage(from, "bot", confirmMsg);
                await sendWhatsAppMessage(from, confirmMsg);
            } catch (err) {
                console.error("❌ Error creando pedido:", err.message);
            }
        }

        res.set("Content-Type", "text/xml");
        res.send("<Response></Response>");
    } catch (error) {
        console.error("❌ Error en webhook:", error);
        res.set("Content-Type", "text/xml");
        res.send("<Response></Response>");
    }
};
