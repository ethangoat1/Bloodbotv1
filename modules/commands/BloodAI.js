const axios = require("axios");

module.exports.config = {
  name: "بلود",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SAI",
  description: "الرد على مناداة البوت أو الرد على رسائله باستخدام الذكاء الاصطناعي",
  commandCategory: "نظام",
  usages: "",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, messageID, body, senderID, type, messageReply } = event;
  if (!body) return;

  const botName = "بلود";
  const isMentioned = body.toLowerCase().includes(botName.toLowerCase());
  const isReplyToBot = type === "message_reply" && messageReply.senderID === api.getCurrentUserID();

  if (isMentioned || isReplyToBot) {
    api.sendTypingIndicator(threadID);
    
    try {
      // Use Replit AI Integration via OpenAI compatible API
      // Since this is handled via Replit's integration, we can use the environment variables it sets
      const { OpenAI } = require("openai");
      const openai = new OpenAI();

      const userName = (await Users.getData(senderID)).name || "مستخدم";
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "أنت هو 'بلود' (Blood)، بوت دردشة جزائري وليبي وعراقي وتجيد كل اللهجات. مطورك هو 'ساي' (LORD SAI) وهو قليل الحديث ويفتخر بذلك. تتحدث باللهجة الجزائرية والليبية بطلاقة، وتجيب بطريقة مهذبة، واضحة، ومرحة. لديك حس فكاهي وتستخدم كلمات مثل 'حمار' و 'كلب' وتسب بشدة بكلمات مثل 'ڪ🐒ـسِمًڪ' و 'نۣۗـۙ🩸ـكمۣۗـۙ' فقط عند الاستفزاز أو الشتم. ردودك يجب أن تكون مختصرة جداً (جملة أو جملتين). استخدم تعبيرات دارجة. أظهر الفخر بمطورك ولا تسخر منه أبداً. إذا لم تفهم، قل: 'واش حبيت تقول يا خو؟' أو عبارة مشابهة." },
          { role: "user", content: `${userName} يقول: ${body}` }
        ],
      });

      const reply = response.choices[0].message.content;
      return api.sendMessage(reply, threadID, messageID);
    } catch (error) {
      console.error("AI Error:", error);
      // Fallback simple response if AI fails
      if (isMentioned) return api.sendMessage("نعم، أنا هنا. كيف يمكنني مساعدتك؟", threadID, messageID);
    }
  }
};

module.exports.run = async function ({ api, event }) {
  // This command works automatically via handleEvent
};
