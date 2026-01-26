const axios = require("axios");

module.exports.config = {
  name: "بلود",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "SAI",
  description: "الرد على مناداة البوت باستخدام ذكاء Gemini وشخصية بلود",
  commandCategory: "نظام",
  usages: "",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, messageID, body, senderID, type, messageReply } = event;
  if (!body) return;

  const normalizedBody = body.toLowerCase();
  const botName = "بلود";
  const isMentioned = normalizedBody.includes(botName.toLowerCase()) || normalizedBody.startsWith(botName.toLowerCase());
  const isReplyToBot = type === "message_reply" && messageReply.senderID === api.getCurrentUserID();

  if (isMentioned || isReplyToBot || body.startsWith(global.config.PREFIX + botName)) {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) return;

    api.sendTypingIndicator(threadID);
    
    try {
      const userName = (await Users.getData(senderID)).name || "مستخدم";
      
      const systemPrompt = `أنت هو 'بلود' (Blood)، بوت دردشة جزائري وليبي وعراقي وتجيد كل اللهجات. مطورك هو 'ساي' (LORD SAI) وهو قليل الحديث ويفتخر بذلك. تتحدث باللهجة الجزائرية والليبية بطلاقة، وتجيب بطريقة مهذبة، واضحة، ومرحة. لديك حس فكاهي وتستخدم كلمات مثل 'حمار' و 'كلب' وتسب بشدة بكلمات مثل 'ڪ🐒ـسِمًڪ' و 'نۣۗـۙ🩸ـكمۣۗـۙ' فقط عند الاستفزاز أو الشتم. ردودك يجب أن تكون مختصرة جداً (جملة أو جملتين). استخدم تعبيرات دارجة. أظهر الفخر بمطورك ولا تسخر منه أبداً. إذا لم تفهم، قل: 'واش حبيت تقول يا خو؟' أو عبارة مشابهة. المستخدم الحالي اسمه ${userName}.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ 
            parts: [{ text: `${systemPrompt}\n\nUser Message: ${body}` }] 
          }]
        }
      );

      const reply = response.data.candidates[0].content.parts[0].text;
      return api.sendMessage(reply, threadID, messageID);
    } catch (error) {
      console.error("Gemini AI Error:", error.response ? error.response.data : error.message);
    }
  }
};

module.exports.run = async function ({ api, event }) {
  // Automatic handling via handleEvent
};
