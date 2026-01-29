module.exports.config = {
  name: "نيم",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "SAI",
  description: "تغيير اسم المجموعة",
  commandCategory: "نظام",
  usages: "[الاسم الجديد]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const newName = args.join(" ");

  if (!newName) return api.sendMessage("الرجاء إدخال الاسم الجديد.", threadID, messageID);

  try {
    await api.setTitle(newName, threadID);
    api.sendMessage(`تم تغيير اسم المجموعة إلى: ${newName}`, threadID, messageID);
  } catch (e) {
    api.sendMessage("حدث خطأ أثناء محاولة تغيير الاسم.", threadID, messageID);
  }
};
