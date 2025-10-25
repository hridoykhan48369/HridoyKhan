module.exports.config = {
  name: "ckbot",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "বট, ইউজার বা গ্রুপের বিস্তারিত তথ্য জানুন",
  commandCategory: "Information",
  usages: "[user | box | admin]",
  cooldowns: 4,
  dependencies: {
    "request": "",
    "fs": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const fs = global.nodemodule["fs-extra"];
  const request = global.nodemodule["request"];
  const threadSetting = global.data.threadData.get(parseInt(event.threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  // ==== HELP ====
  if (args.length === 0) {
    return api.sendMessage(
`📋 ব্যবহার:
${prefix}${this.config.name} user → নিজের ইনফো দেখবে।
${prefix}${this.config.name} user @[Tag] → ট্যাগ করা ইউজারের ইনফো।
${prefix}${this.config.name} box → গ্রুপ ইনফো।
${prefix}${this.config.name} admin → বট অ্যাডমিনের তথ্য।`,
      event.threadID,
      event.messageID
    );
  }

  // ==== BOX INFO ====
  if (args[0] === "box") {
    const info = await api.getThreadInfo(event.threadID);
    const img = info.imageSrc;
    const male = info.userInfo.filter(u => u.gender === "MALE").length;
    const female = info.userInfo.filter(u => u.gender === "FEMALE").length;
    const approval = info.approvalMode ? "✅ চালু আছে" : "❌ বন্ধ আছে";

    const msg = `🏠 গ্রুপ নাম: ${info.threadName}
🆔 TID: ${event.threadID}
🔒 অনুমোদন: ${approval}
😀 ইমোজি: ${info.emoji || "None"}
👥 সদস্য: ${info.participantIDs.length}
👑 অ্যাডমিন: ${info.adminIDs.length}
👦 ছেলেঃ ${male} জন
👧 মেয়েঃ ${female} জন
💬 মোট মেসেজঃ ${info.messageCount}`;

    if (!img) return api.sendMessage(msg, event.threadID, event.messageID);
    const file = __dirname + "/cache/box.png";
    return request(encodeURI(img))
      .pipe(fs.createWriteStream(file))
      .on("close", () => {
        api.sendMessage({ body: msg, attachment: fs.createReadStream(file) }, event.threadID, () => fs.unlinkSync(file));
      });
  }

  // ==== ADMIN INFO ====
  if (args[0] === "admin") {
    const adminPic = __dirname + "/cache/admin.png";
    return request(`https://graph.facebook.com/100048786044500/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
      .pipe(fs.createWriteStream(adminPic))
      .on("close", () => {
        api.sendMessage({
          body: `👑 ──『 𝐁𝐎𝐓 𝐀𝐃𝐌𝐈𝐍 𝐈𝐍𝐅𝐎 』──
👤 নাম: 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍
🌐 Facebook: facebook.com/100048786044500
💬 Messenger: m.me/100048786044500
📞 WhatsApp: wa.me/+880174495****

💝 ধন্যবাদ ব্যবহার করার জন্য ─꯭─⃝‌‌𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞`,
          attachment: fs.createReadStream(adminPic)
        }, event.threadID, () => fs.unlinkSync(adminPic));
      });
  }

  // ==== USER INFO ====
  if (args[0] === "user") {
    let id;
    if (!args[1]) {
      id = event.type === "message_reply" ? event.messageReply.senderID : event.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
      id = Object.keys(event.mentions)[0];
    } else id = args[1];

    const info = await api.getUserInfo(id);
    const user = info[id];
    const name = user.name;
    const gender = user.gender == 2 ? "পুরুষ" : user.gender == 1 ? "মহিলা" : "নির্দিষ্ট নয়";
    const isFriend = user.isFriend ? "হ্যাঁ 💚" : "না ❌";
    const username = user.vanity ? `https://facebook.com/${user.vanity}` : `https://facebook.com/profile.php?id=${id}`;

    const file = __dirname + "/cache/user.png";
    return request(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
      .pipe(fs.createWriteStream(file))
      .on("close", () => {
        api.sendMessage({
          body: `👤 নাম: ${name}
🆔 UID: ${id}
🌐 প্রোফাইল: ${username}
⚧️ লিঙ্গ: ${gender}
💞 বটের ফ্রেন্ড: ${isFriend}`,
          attachment: fs.createReadStream(file)
        }, event.threadID, () => fs.unlinkSync(file));
      });
  }
};