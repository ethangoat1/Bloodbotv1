module.exports.config = {
  name: "هلب",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "عمر",
  description: "الاوامر",
  commandCategory: "خدمات",
  usages: "[دليل المستخدم ]",
  cooldowns: 1,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 300
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": "『 %1』\n%2\n←كيفية الاستخدام: %3\n←فئة: %4\n←وقت الانتظار: %5 ثواني(s)\n←من لديه الصلاحية: %6\n\n←طور بواسطة %7",
    "helpList": '[ There are %1 commands on this bot, Use: "%2help nameCommand" to know how to use! ]',
    "user": "『الكل』",
    "adminGroup": "『مسؤل القروب』",
    "adminBot": "『 𝕃𝕆ℝ𝔻 𝕊𝔸𝕀 | 𝙇𝙊𝙍𝘿 𝙎𝘼𝙄 🩶🪽 』"
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || typeof body == "undefined" || body.indexOf("اوامر") != 0) return;
  const splitBody = body.slice(body.indexOf("اوامر")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
  return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
}

module.exports. run = function({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  if (!command) {
    const arrayInfo = [];
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 20;
    let i = 0;
    let msg = "";

    for (var [name, value] of (commands)) {
      name += ``;
      arrayInfo.push(name);
    }

    arrayInfo.sort();

    const startSlice = numberOfOnePage*page - numberOfOnePage;
    i = startSlice;
    const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);

    for (let item of returnArray) msg += `𖠄 ‹ ${item} › 𖠄\n\n`;

    const header = `⏤͟͟͞͞ َ🕸️ 𝕭ᷭ͢𝐨𝐭 𝖝 𝕭ᷭ͜𝐥𝐨͡𝐨͜بد 🩸\n\n        𖡩 ⥔𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬 𝕷͜𝗜𝗦Т⥕  𖡩\n\n`;
    const footer = `---------------------------------------\n\n🩸⏤͟͟͞͞ َ𝕾̸̷̶ 𝐁𝐥𝖔𝖔𝐝 • 𝕷͜𝗜𝗦͡Т  -   ♟\n   \n--◜𓆩𝕭𝖑𝖔𝖔𝐝𓆩𖠻𓆪 ͟𝖇𝐲̰ 𝗦𝖆𝖎𓆪◝--\n\n🪄🎩 تفضل سيدي، هذه قائمة أوامري المتاحة 𓆩𖠻𓆪`;

    return api.sendMessage(header + msg + footer, threadID, async (error, info) => {
      if (autoUnsend) {
        await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
        return api.unsendMessage(info.messageID);
      } else return;
    }, event.messageID);
  }

  return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
};
