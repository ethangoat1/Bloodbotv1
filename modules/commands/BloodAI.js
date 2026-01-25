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
          { role: "system", content: "أنت هو 'بلود' (Blood)، مساعد ذكي وشخصية غامضة قليلاً ولكنها ودودة وتتحدث كالبشر تماماً باللغة العربية. مطورك هو LORD SAI. يجب أن تكون ردودك قصيرة، طبيعية، وغير روبوتية. لا تذكر أنك ذكاء اصطناعي إلا إذا سُئلت بشكل مباشر جداً." },
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
