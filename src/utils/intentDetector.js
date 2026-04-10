// utils/intentDetector.js

export const detectIntent = (message) => {
  const text = message.toLowerCase();

  if (text.includes("hola")) return "SALUDO";
  if (text.includes("precio") || text.includes("cuesta")) return "PRECIO";

  return "IA";
};