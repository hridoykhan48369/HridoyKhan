const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "helpall",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Displays all available commands in one beautiful page",
  commandCategory: "system",
  usages: "[No args]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  // ✅ সব কমান্ডের লিস্ট তৈরি
  const allCommands = Array.from(commands.keys())
    .filter(cmd => cmd && cmd.trim() !== "")
    .sort();

  // ✅ ফাইনাল টেক্সট
  const finalText = `
╭──────────────────────╮
│ 🌟 𝐀𝐋𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 🌟
├──────────────────────┤
${allCommands.map(cmd => `│ ✪ ${cmd}`).join("\n")}
├──────────────────────┤
│ ⚙ Prefix: ${global.config.PREFIX || "!"}
│ 🤖 Bot: 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞
│ 👑 Owner: 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍
│ 📦 Total Commands: ${allCommands.length}
╰──────────────────────╯
`;

  // ✅ ব্যাকগ্রাউন্ড ইমেজ (তোমার কাস্টম)
  const imgURL = "https://i.imgur.com/0IKTM64.jpeg";
  const imgPath = __dirname + "/cache/helpallbg.jpg";

  // ✅ ইমেজ ডাউনলোড করে মেসেজ পাঠানো
  const callback = () => {
    api.sendMessage(
      {
        body: finalText,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );
  };

  request(encodeURI(imgURL))
    .pipe(fs.createWriteStream(imgPath))
    .on("close", () => callback());
};
