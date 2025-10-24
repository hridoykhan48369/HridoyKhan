const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "emoji_voice",
  version: "10.1",
  hasPermssion: 0,
  credits: "𝐇𝐫𝐢𝐝𝐨𝐲 𝐇𝐨𝐬𝐬𝐞𝐧",
  description: "ইমোজি দিলে কিউট মেয়ের ভয়েস পাঠাবে 😍",
  commandCategory: "No Prefix",
  usages: "🥰😘😍",
  cooldowns: 3
};

const emojiAudioMap = {
  "🥱": "https://files.catbox.moe/9pou40.mp3",
  "😁": "https://files.catbox.moe/60cwcg.mp3",
  "😌": "https://files.catbox.moe/epqwbx.mp3",
  "🥺": "https://files.catbox.moe/wc17iq.mp3",
  "🤭": "https://files.catbox.moe/cu0mpy.mp3",
  "😅": "https://files.catbox.moe/jl3pzb.mp3",
  "😏": "https://files.catbox.moe/z9e52r.mp3",
  "😞": "https://files.catbox.moe/tdimtx.mp3",
  "🤫": "https://files.catbox.moe/0uii99.mp3",
  "🍼": "https://files.catbox.moe/p6ht91.mp3",
  "🤔": "https://files.catbox.moe/hy6m6w.mp3",
  "🥰": "https://files.catbox.moe/dv9why.mp3",
  "🤦": "https://files.catbox.moe/ivlvoq.mp3",
  "😘": "https://files.catbox.moe/sbws0w.mp3",
  "😑": "https://files.catbox.moe/p78xfw.mp3",
  "😢": "https://files.catbox.moe/shxwj1.mp3",
  "🙊": "https://files.catbox.moe/3bejxv.mp3",
  "🤨": "https://files.catbox.moe/4aci0r.mp3",
  "😡": "https://files.catbox.moe/shxwj1.mp3",
  "🙈": "https://files.catbox.moe/3qc90y.mp3",
  "😍": "https://files.catbox.moe/qjfk1b.mp3",
  "😭": "https://files.catbox.moe/itm4g0.mp3",
  "😱": "https://files.catbox.moe/mu0kka.mp3",
  "😻": "https://files.catbox.moe/y8ul2j.mp3",
  "😿": "https://files.catbox.moe/tqxemm.mp3",
  "💔": "https://files.catbox.moe/6yanv3.mp3",
  "🤣": "https://files.catbox.moe/2sweut.mp3",
  "🥹": "https://files.catbox.moe/jf85xe.mp3",
  "😩": "https://files.catbox.moe/b4m5aj.mp3",
  "🫣": "https://files.catbox.moe/ttb6hi.mp3",
  "🐸": "https://files.catbox.moe/utl83s.mp3"
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, messageID, body } = event;
  if (!body || body.length > 3) return; // ছোট emoji ছাড়া অন্য কিছু হলে ignore করো

  const emoji = body.trim();
  const audioUrl = emojiAudioMap[emoji];
  if (!audioUrl) return;

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const filePath = path.join(cacheDir, `${encodeURIComponent(emoji)}.mp3`);

  try {
    const response = await axios({
      method: "GET",
      url: audioUrl,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body: `🎧 ${emoji} — তোমার জন্য একটা কিউট ভয়েস 💞`,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => fs.unlink(filePath, () => {}),
        messageID
      );
    });

    writer.on("error", () => {
      api.sendMessage("ইমোজি কাজ করেনি জান 🥺 আবার দিও 😘", threadID, messageID);
    });
  } catch (error) {
    console.error("Error:", error);
    api.sendMessage("ভয়েস আনতে সমস্যা হইছে 😢", threadID, messageID);
  }
};

module.exports.run = () => {};
