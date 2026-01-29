module.exports.config = {
  name: "نيم",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "SAI",
  description: "حماية اسم المجموعة",
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
    if (nameIntervals[threadID]) return api.sendMessage("حماية الاسم مفعلة بالفعل.", threadID, messageID);

    api.sendMessage(`تم تفعيل حماية الاسم: ${botName}`, threadID);
    
    const protectName = async () => {
      try {
        const threadInfo = await api.getThreadInfo(threadID);
        if (threadInfo.threadName !== botName) await api.setTitle(botName, threadID);
      } catch (e) {}
    };

    await protectName(); 
    nameIntervals[threadID] = setInterval(protectName, 5000);
  } 
  else if (action === "ايقاف") {
    if (!nameIntervals[threadID]) return api.sendMessage("حماية الاسم غير مفعلة.", threadID, messageID);
    clearInterval(nameIntervals[threadID]);
    delete nameIntervals[threadID];
    api.sendMessage("تم الإيقاف.", threadID, messageID);
  } 
  else {
    api.sendMessage("نيم [تشغيل/ايقاف] [الاسم]", threadID, messageID);
  }
};
