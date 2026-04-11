// services/whatsapp.service.js
import axios from "axios";

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export const sendWhatsAppMessage = async (to, message) => {
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;

    const params = new URLSearchParams();
    params.append("From", `whatsapp:${TWILIO_NUMBER}`);
    params.append("To", `whatsapp:${to}`);
    params.append("Body", message);

    await axios.post(url, params, {
      auth: { username: TWILIO_SID, password: TWILIO_AUTH },
    });

      console.log(`📤 Mensaje enviado a ${to}`);
    } catch (error) {
      console.error("Error enviando mensaje:", error.response?.data || error.message);
    }
};
