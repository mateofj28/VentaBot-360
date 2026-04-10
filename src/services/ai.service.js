// services/ai.service.js
import axios from "axios";

export const getAIResponse = async (message, history) => {
  try {
    const prompt = `
Eres un vendedor profesional.

Historial:
${history.map(h => `${h.role}: ${h.message}`).join("\n")}

Cliente: ${message}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("AI error:", error.message);
    return "Lo siento, hubo un error 🤖";
  }
};