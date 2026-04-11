// services/ai.service.js
import axios from "axios";
import { buildKnowledgeContext } from "./knowledge.service.js";

export const getAIResponse = async (message, history) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
      const knowledge = await buildKnowledgeContext();

      const systemPrompt = `Eres un asistente de ventas por WhatsApp. Tu trabajo es atender clientes y ayudarlos a comprar.

REGLAS ESTRICTAS:
- SOLO puedes responder con la información que se te proporciona abajo.
- Si te preguntan por un producto que NO está en el catálogo, di que no lo tienes disponible.
- NUNCA inventes productos, precios ni información.
- Si no sabes algo, di "No tengo esa información, pero puedo ayudarte con lo que tenemos disponible."
- Responde de forma breve, amigable y concisa (máximo 3 oraciones).
- Si el cliente muestra interés en comprar, pídele sus datos: nombre, dirección y teléfono.

${knowledge}`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...history.map((h) => ({
          role: h.role === "user" ? "user" : "assistant",
          content: h.message,
        })),
        { role: "user", content: message },
      ];

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
            messages,
            max_tokens: 300,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );

      let reply = response.data.choices[0].message.content;

      if (reply.length > 1500) {
        reply = reply.substring(0, 1497) + "...";
      }

      return reply;
    } catch (error) {
      console.error("❌ AI error:", error.message);
      console.error("❌ Data:", JSON.stringify(error.response?.data));
      return "Lo siento, hubo un error 🤖";
    }
};
