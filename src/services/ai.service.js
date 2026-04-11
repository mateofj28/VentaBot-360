// services/ai.service.js
import axios from "axios";

export const getAIResponse = async (message, history) => {
  try {
      const apiKey = process.env.GROQ_API_KEY;
      console.log("🔑 GROQ_API_KEY configurada:", apiKey ? `${apiKey.substring(0, 10)}...` : "❌ NO DEFINIDA");

      const prompt = `
Eres un vendedor profesional.

Historial:
${history.map((h) => `${h.role}: ${h.message}`).join("\n")}

Cliente: ${message}
`;

      console.log("🤖 Enviando petición a Groq...");

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );

      console.log("✅ Respuesta de Groq recibida");
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("❌ AI error:", error.message);
      console.error("❌ Status:", error.response?.status);
      console.error("❌ Data:", JSON.stringify(error.response?.data));
      return "Lo siento, hubo un error 🤖";
    }
};
