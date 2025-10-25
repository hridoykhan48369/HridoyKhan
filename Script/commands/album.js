const axios = require("axios");
const path = require("path");
const fs = require("fs");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json");
  return base.data.api;
};

module.exports.config = {
  name: "album",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐁𝐎𝐓 💫 (Modified by Sahu)",
  description: "Watch or Add various album videos/photos",
  commandCategory: "Media",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  if (!args[0]) {
    api.setMessageReaction("🎵", event.messageID, () => {}, true);
    const menu = `
╔════════════════════╗
║   🎬 𝐀𝐋𝐁𝐔𝐌 𝐕𝐈𝐃𝐄𝐎 𝐌𝐄𝐍𝐔 🎶
╠════════════════════╣
║ 01️⃣ Funny Video 😂
║ 02️⃣ Islamic Video ☪️
║ 03️⃣ Sad Video 😢
║ 04️⃣ Anime Video 🎎
║ 05️⃣ Cartoon Video 🐾
║ 06️⃣ Lofi Video 🎧
║ 07️⃣ Horny Video 🔥
║ 08️⃣ Love Video 💞
║ 09️⃣ Flower Video 🌸
║ 10️⃣ Random Photo 🖼️
║ 11️⃣ Aesthetic Video 🌌
║ 12️⃣ Sigma Rule 🦁
║ 13️⃣ Lyrics Video 🎶
║ 14️⃣ Cat Video 🐱
║ 15️⃣ 18+ Video 🚫
║ 16️⃣ Free Fire 🎮
║ 17️⃣ Football ⚽
║ 18️⃣ Girl Video 👧
║ 19️⃣ Friends 👫
║ 20️⃣ Cricket 🏏
╠════════════════════╣
║ 🕹️ Reply the number 
║    of category to play 🎥
╚════════════════════╝

𝐁𝐘: 𝐇𝐑𝐈𝐃𝐎𝐘 𝐁𝐎𝐓 💫`;

    return api.sendMessage(
      { body: menu },
      event.threadID,
      (error, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
        });
      },
      event.messageID
    );
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  api.unsendMessage(handleReply.messageID);
  const admin = "100048786044500"; // এখানে নিজের FB ID বসাও

  const reply = parseInt(event.body);
  if (isNaN(reply) || reply < 1 || reply > 20)
    return api.sendMessage("⚠️ ১ থেকে ২০ এর মধ্যে একটি নাম্বার দাও!", event.threadID, event.messageID);

  const queryMap = {
    1: ["funny", "😂 𝐅𝐮𝐧𝐧𝐲 𝐕𝐢𝐝𝐞𝐨"],
    2: ["islamic", "☪️ 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨"],
    3: ["sad", "😢 𝐒𝐚𝐝 𝐕𝐢𝐝𝐞𝐨"],
    4: ["anime", "🎎 𝐀𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨"],
    5: ["cartoon", "🐾 𝐂𝐚𝐫𝐭𝐨𝐨𝐧 𝐕𝐢𝐝𝐞𝐨"],
    6: ["lofi", "🎧 𝐋𝐨𝐟𝐢 𝐕𝐢𝐝𝐞𝐨"],
    7: ["horny", "🔥 𝐇𝐨𝐫𝐧𝐲 𝐕𝐢𝐝𝐞𝐨"],
    8: ["love", "💞 𝐋𝐨𝐯𝐞 𝐕𝐢𝐝𝐞𝐨"],
    9: ["flower", "🌸 𝐅𝐥𝐨𝐰𝐞𝐫 𝐕𝐢𝐝𝐞𝐨"],
    10: ["photo", "🖼️ 𝐑𝐚𝐧𝐝𝐨𝐦 𝐏𝐡𝐨𝐭𝐨"],
    11: ["aesthetic", "🌌 𝐀𝐞𝐬𝐭𝐡𝐞𝐭𝐢𝐜 𝐕𝐢𝐝𝐞𝐨"],
    12: ["sigma", "🦁 𝐒𝐢𝐠𝐦𝐚 𝐑𝐮𝐥𝐞"],
    13: ["lyrics", "🎶 𝐋𝐲𝐫𝐢𝐜𝐬 𝐕𝐢𝐝𝐞𝐨"],
    14: ["cat", "🐱 𝐂𝐚𝐭 𝐕𝐢𝐝𝐞𝐨"],
    15: ["sex", "🚫 18+ 𝐕𝐢𝐝𝐞𝐨"],
    16: ["ff", "🎮 𝐅𝐫𝐞𝐞 𝐅𝐢𝐫𝐞 𝐕𝐢𝐝𝐞𝐨"],
    17: ["football", "⚽ 𝐅𝐨𝐨𝐭𝐛𝐚𝐥𝐥 𝐕𝐢𝐝𝐞𝐨"],
    18: ["girl", "👧 𝐆𝐢𝐫𝐥 𝐕𝐢𝐝𝐞𝐨"],
    19: ["friend", "🫶 𝐅𝐫𝐢𝐞𝐧𝐝𝐬 𝐕𝐢𝐝𝐞𝐨"],
    20: ["cricket", "🏏 𝐂𝐫𝐢𝐜𝐤𝐞𝐭 𝐕𝐢𝐝𝐞𝐨"],
  };

  let [query, caption] = queryMap[reply];

  if ((reply === 7 || reply === 15) && event.senderID !== admin)
    return api.sendMessage("❌ এই অপশন শুধুমাত্র Admin ব্যবহার করতে পারবে!", event.threadID, event.messageID);

  try {
    const res = await axios.get(`${await baseApiUrl()}/album?type=${query}`);
    const mediaUrl = res.data.data;

    const response = await axios.get(mediaUrl, { responseType: "arraybuffer" });
    const fileType = mediaUrl.endsWith(".mp4") ? ".mp4" : ".jpg";
    const filePath = path.join(__dirname, `cache/${Date.now()}${fileType}`);
    fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

    api.sendMessage(
      { body: `💫 ${caption}\n\n🔰 Powered by 𝐇𝐑𝐈𝐃𝐎𝐘 𝐁𝐎𝐓 💫`, attachment: fs.createReadStream(filePath) },
      event.threadID,
      () => fs.unlinkSync(filePath),
      event.messageID
    );
  } catch (error) {
    console.error(error);
    api.sendMessage(`⚠️ Error: ${error.message}`, event.threadID, event.messageID);
  }
};