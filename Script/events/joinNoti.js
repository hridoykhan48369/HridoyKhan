/**
 * joinnoti.js
 * Auto Welcome Message (Updated for Hridoy Hossen)
 * Bot Name: 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞
 * Credit: Hridoy Hossen
 */

module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "1.0.3",
  credits: "Hridoy Hossen",
  description: "Send a beautiful welcome message (with image/video)",
  dependencies: { "fs-extra": "", "path": "" }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const paths = [
    join(__dirname, "cache", "joinGif"),
    join(__dirname, "cache", "randomgif")
  ];
  for (const path of paths) if (!existsSync(path)) mkdirSync(path, { recursive: true });
};

module.exports.run = async function({ api, event }) {
  const fs = require("fs");
  const path = require("path");
  const { threadID } = event;
  const prefix = global.config.PREFIX || "/";
  const botName = "𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞";

  // When bot is added
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    await api.changeNickname(`[ ${prefix} ] • ${botName}`, threadID, api.getCurrentUserID());
    
    const randomPath = path.join(__dirname, "cache", "randomgif");
    const files = fs.readdirSync(randomPath).filter(f =>
      [".mp4", ".jpg", ".png", ".jpeg", ".gif", ".mp3"].some(ext => f.endsWith(ext))
    );
    const file = files.length ? fs.createReadStream(path.join(randomPath, files[Math.floor(Math.random() * files.length)])) : null;

    const message = `
╭•┄┅═══❁🌺❁═══┅┄•╮
আ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ
╰•┄┅═══❁🌺❁═══┅┄•╯

✨ আমি চলে এসেছি — ${botName} ✨  
তোমাদের সাথে আড্ডা দিতে, সাহায্য করতে আর মজা করতে! 😄

📜 কমান্ড দেখতে:
${prefix}help
${prefix}info
${prefix}admin

★ হেল্প লাগলে যোগাযোগ করো Owner এর সাথে ★
👑 Hridoy Hossen  
📩 Messenger: https://m.me/100048786044500  
📞 WhatsApp: https://wa.me/100048786044500

❖⋆═══════════════════════⋆❖`;

    return api.sendMessage(file ? { body: message, attachment: file } : { body: message }, threadID);
  }

  // When new member joins
  try {
    const { createReadStream, readdirSync } = global.nodemodule["fs-extra"];
    let { threadName, participantIDs } = await api.getThreadInfo(threadID);
    const threadData = global.data.threadData.get(parseInt(threadID)) || {};
    const added = event.logMessageData.addedParticipants;

    const names = added.map(p => p.fullName);
    const mentions = added.map(p => ({ tag: p.fullName, id: p.userFbId }));
    const total = participantIDs.length;

    let msg = (threadData.customJoin || `
╭•┄┅═══❁🌺❁═══┅┄•╮
আ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ
╰•┄┅═══❁🌺❁═══┅┄•╯

🤗 স্বাগতম {name}  
তুমি এখন এই গ্রুপের {soThanhVien} নম্বর সদস্য 🌸  

গ্রুপ: {threadName}

💬 ভালো ব্যবহার করো, হাসিখুশি থাকো 🌺  
❖⋆═══════════════════════⋆❖  
      𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞`).trim();

    msg = msg
      .replace(/\{name}/g, names.join(", "))
      .replace(/\{soThanhVien}/g, total)
      .replace(/\{threadName}/g, threadName);

    const joinGifPath = path.join(__dirname, "cache", "joinGif");
    const gifFiles = readdirSync(joinGifPath).filter(f =>
      [".mp4", ".jpg", ".png", ".jpeg", ".gif", ".mp3"].some(ext => f.endsWith(ext))
    );
    const randomFile = gifFiles.length ? createReadStream(path.join(joinGifPath, gifFiles[Math.floor(Math.random() * gifFiles.length)])) : null;

    return api.sendMessage(randomFile ? { body: msg, attachment: randomFile, mentions } : { body: msg, mentions }, threadID);
  } catch (e) {
    console.error(e);
  }
};
