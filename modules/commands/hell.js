module.exports.config = {
  name: "الجحيم",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "الوكيل",
  description: "يرسل رسالة كل 30 ثانية",
  commandCategory: "نظام",
  usages: "[تشغيل/ايقاف] [الرسالة]",
  cooldowns: 5
};

let intervals = {};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const action = args[0];
  const message = args.slice(1).join(" ");

  if (action === "تشغيل") {
    if (!message) return api.sendMessage("يرجى كتابة الرسالة التي تريد إرسالها.", threadID, messageID);
    if (intervals[threadID]) return api.sendMessage("الأمر يعمل بالفعل في هذه المجموعة.", threadID, messageID);

    api.sendMessage("تم تشغيل الجحيم! سأقوم بإرسال الرسالة كل 30 ثانية.", threadID);
    
    intervals[threadID] = setInterval(() => {
      api.sendMessage(message, threadID);
    }, 30000);
  } 
  else if (action === "ايقاف") {
    if (!intervals[threadID]) return api.sendMessage("الأمر غير مفعل حالياً.", threadID, messageID);
    
    clearInterval(intervals[threadID]);
    delete intervals[threadID];
    api.sendMessage("تم إيقاف الجحيم بنجاح.", threadID, messageID);
  } 
  else {
    api.sendMessage("الاستخدام: الجحيم [تشغيل/ايقاف] [الرسالة]", threadID, messageID);
  }
};
