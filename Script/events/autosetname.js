/**
 * autosetname.js (Upgraded Version)
 * Automatically set nicknames for new members.
 * Bot: 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞
 * Credit: Hridoy Hossen
 */

module.exports.config = {
  name: "autosetname",
  eventType: ["log:subscribe"],
  version: "1.1.0",
  credits: "Hridoy Hossen",
  description: "Automatically set a nickname for new members when they join the group"
};

module.exports.run = async function ({ api, event, Users }) {
  try {
    const { threadID } = event;
    const fs = require("fs-extra");
    const path = require("path");

    // নতুন ইউজারদের লিস্ট
    const memJoin = event.logMessageData.addedParticipants.map(i => i.userFbId);

    // JSON ফাইল যেখানে prefix name গুলো সেভ থাকে
    const pathData = path.join(__dirname, "cache", "autosetname.json");
    if (!fs.existsSync(pathData)) fs.writeFileSync(pathData, JSON.stringify([]));

    const dataJson = JSON.parse(fs.readFileSync(pathData, "utf-8"));
    const thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };

    // Prefix না থাকলে কিছু করবে না
    if (!thisThread.nameUser.length) return;

    for (const idUser of memJoin) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userInfo = await api.getUserInfo(idUser);
      const fullName = userInfo[idUser].name;
      const prefix = thisThread.nameUser[0];
      const newNick = `${prefix} ${fullName}`;

      api.changeNickname(newNick, threadID, idUser);
    }

    return api.sendMessage(
      `🌸 নতুন মেম্বারদের নিকনেম অটোসেট করা হয়েছে সফলভাবে!\nBot: 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞 💫`,
      threadID
    );

  } catch (err) {
    console.error("autosetname error:", err);
  }
};
