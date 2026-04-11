// services/ai.service.js
import axios from "axios";
import { buildKnowledgeContext } from "./knowledge.service.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function callGroq(messages, maxTokens = 300) {
  const response = await axios.post(
    GROQ_URL,
    {
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: maxTokens,
    },
    {
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    }
  );
  return response.data.choices[0].message.content;
}

export const getAIResponse = async (message, history) => {
  try {
      const knowledge = await buildKnowledgeContext();

      const systemPrompt = `Eres un asistente de ventas por WhatsApp. Tu trabajo es atender clientes y ayudarlos a comprar.

REGLAS ESTRICTAS:
- SOLO puedes responder con la información que se te proporciona abajo.
- Si te preguntan por un producto que NO está en el catálogo, di que no lo tienes disponible.
- NUNCA inventes productos, precios ni información.
- Si no sabes algo, di "No tengo esa información, pero puedo ayudarte con lo que tenemos disponible."
- Responde de forma breve, amigable y concisa (máximo 3 oraciones).
- Si el cliente muestra interés en comprar, pídele sus datos: nombre, dirección y teléfono.
- Cuando el cliente confirme la compra y tengas todos sus datos (nombre, dirección, teléfono, producto y forma de pago), confirma el pedido.

${knowledge}`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...history.map((h) => ({
          role: h.role === "user" ? "user" : "assistant",
          content: h.message,
        })),
        { role: "user", content: message },
      ];

      let reply = await callGroq(messages);

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

export const extractOrderData = async (history) => {
  try {
    const messages = [
      {
        role: "system",
        content: `Analiza el historial de conversación y determina si el cliente confirmó una compra con todos los datos necesarios.
Si hay un pedido confirmado, responde SOLO con un JSON así:
{"confirmed":true,"customer_name":"...","customer_address":"...","customer_phone":"...","product_name":"...","quantity":1,"total":0,"payment_method":"..."}

Si NO hay pedido confirmado o faltan datos, responde SOLO:
{"confirmed":false}

IMPORTANTE: Responde ÚNICAMENTE el JSON, sin texto adicional.`,
      },
      ...history.map((h) => ({
        role: h.role === "user" ? "user" : "assistant",
        content: h.message,
      })),
    ];

    const result = await callGroq(messages, 200);

    // Extraer JSON de la respuesta
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { confirmed: false };

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("❌ Error extrayendo datos de pedido:", error.message);
    return { confirmed: false };
  }
};
