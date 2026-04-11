// services/ai.service.js
import axios from "axios";

export const getAIResponse = async (message, history) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;

      const prompt = `
Eres un vendedor profesional. Responde de forma breve y concisa, máximo 3 oraciones.

Historial:
${history.map((h) => `${h.role}: ${h.message}`).join("\n")}

Cliente: ${message}
`;

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
              max_tokens: 300,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );

      let reply = response.data.choices[0].message.content;

      // Twilio limita a 1600 caracteres
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
