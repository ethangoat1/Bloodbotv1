module.exports.config = {
  name: "كنيات",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "عمر",
  description: "حماية كنيات المجموعة بتغييرها باستمرار",
  commandCategory: "نظام",
  usages: "[تشغيل/ايقاف] [الكنية]",
  cooldowns: 5
};

let nicknameIntervals = {};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const action = args[0];
  const nickname = args.slice(1).join(" ");

  if (action === "تشغيل") {
    if (!nickname) return api.sendMessage("الرجاء إدخال الكنية المطلوبة بعد كلمة تشغيل.", threadID, messageID);
    if (nicknameIntervals[threadID]) return api.sendMessage("حماية الكنيات مفعلة بالفعل في هذه المجموعة.", threadID, messageID);

    api.sendMessage(`تم تفعيل حماية الكنيات! سأقوم بتغيير كنيات جميع الأعضاء إلى: ${nickname} باستمرار.`, threadID);
    
    const protectNicknames = async () => {
      try {
        const threadInfo = await api.getThreadInfo(threadID);
        const { participantIDs } = threadInfo;
        for (let userID of participantIDs) {
          await api.changeNickname(nickname, threadID, userID);
        }
      } catch (e) {
        console.log(e);
      }
    };

    await protectNicknames(); // Run once immediately
    nicknameIntervals[threadID] = setInterval(protectNicknames, 60000); // Repeat every minute
  } 
  else if (action === "ايقاف") {
    if (!nicknameIntervals[threadID]) return api.sendMessage("حماية الكنيات غير مفعلة حالياً.", threadID, messageID);
    
    clearInterval(nicknameIntervals[threadID]);
    delete nicknameIntervals[threadID];
    api.sendMessage("تم إيقاف حماية الكنيات بنجاح.", threadID, messageID);
  } 
  else {
    api.sendMessage("الاستخدام: كنيات [تشغيل/ايقاف] [الكنية]", threadID, messageID);
  }
};
