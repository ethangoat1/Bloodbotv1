const axios = require("axios");

module.exports.config = {
  name: "سين",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SAI",
  description: "الدردشة مع Google Gemini AI",
  commandCategory: "الذكاء الاصطناعي",
  usages: "[النص]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const prompt = args.join(" ");
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!prompt) return api.sendMessage("الرجاء إدخال سؤال أو نص للدردشة مع Gemini.", threadID, messageID);
  if (!apiKey) return api.sendMessage("عذراً، مفتاح API لـ Gemini غير متوفر حالياً.", threadID, messageID);

  api.sendTypingIndicator(threadID);

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const reply = response.data.candidates[0].content.parts[0].text;
    return api.sendMessage(reply, threadID, messageID);
  } catch (error) {
    console.error("Gemini Error:", error.response ? error.response.data : error.message);
    return api.sendMessage("حدث خطأ أثناء الاتصال بـ Gemini. تأكد من صحة مفتاح API.", threadID, messageID);
  }
};
