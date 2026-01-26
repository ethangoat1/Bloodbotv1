module.exports.config = {
  name: "نيم",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "SAI",
  description: "حماية اسم البوت بتغييره وتكراره باستمرار",
  commandCategory: "نظام",
  usages: "[تشغيل/ايقاف] [الاسم]",
  cooldowns: 5
};

let nameIntervals = {};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const action = args[0];
  const botName = args.slice(1).join(" ");

  if (action === "تشغيل") {
    if (!botName) return api.sendMessage("الرجاء إدخال الاسم المطلوب بعد كلمة تشغيل.", threadID, messageID);
    if (nameIntervals[threadID]) return api.sendMessage("حماية الاسم مفعلة بالفعل في هذه المجموعة.", threadID, messageID);

    api.sendMessage(`تم تفعيل حماية الاسم! سأقوم بتغيير اسمي إلى: ${botName} باستمرار كل 5 ثوانٍ.`, threadID);
    
    const protectName = async () => {
      try {
        await api.setTitle(botName, threadID);
      } catch (e) {
        console.log("Name Protection Error:", e);
      }
    };

    await protectName(); 
    nameIntervals[threadID] = setInterval(protectName, 5000); // Repeat every 5 seconds
  } 
  else if (action === "ايقاف") {
    if (!nameIntervals[threadID]) return api.sendMessage("حماية الاسم غير مفعلة حالياً.", threadID, messageID);
    
    clearInterval(nameIntervals[threadID]);
    delete nameIntervals[threadID];
    api.sendMessage("تم إيقاف حماية الاسم بنجاح.", threadID, messageID);
  } 
  else {
    api.sendMessage("الاستخدام: نيم [تشغيل/ايقاف] [الاسم]", threadID, messageID);
  }
};
