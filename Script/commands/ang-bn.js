module.exports.config = {
  name: "bn",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐁𝐎𝐓 💫 (Modified by Sahu)",
  usePrefix: false,
  description: "Text translation to Bengali, Arabic, English, Hindi, Vietnamese etc.",
  commandCategory: "Tools",
  usages: "bn [langCode] [text]\n\nExample:\n• bn en আমি তোমাকে ভালোবাসি\n• bn hi I love you\n• reply + bn ar",
  cooldowns: 3,
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");

  try {
    if (args.length === 0 && !event.messageReply)
      return api.sendMessage("⚠️ অনুগ্রহ করে একটি ভাষা কোড ও টেক্সট দিন!\nউদাহরণ: bn en আমি তোমাকে ভালোবাসি", event.threadID, event.messageID);

    // যদি reply মেসেজ অনুবাদ করতে চায়
    let langCode = "bn"; // default
    let text;

    if (event.messageReply) {
      text = event.messageReply.body;
      if (args[0]) langCode = args[0].toLowerCase();
    } else {
      langCode = args[0].toLowerCase();
      text = args.slice(1).join(" ");
    }

    if (!text) return api.sendMessage("⚠️ দয়া করে অনুবাদ করার জন্য টেক্সট দিন!", event.threadID, event.messageID);

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(langCode)}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await axios.get(url);

    const translated = res.data[0].map(item => item[0]).join("");
    const sourceLang = res.data[2];

    const message = `🌐 𝗚𝗼𝗼𝗴𝗹𝗲 𝗧𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗲
━━━━━━━━━━━━━━━
🔹 𝗙𝗿𝗼𝗺: ${sourceLang.toUpperCase()}
🔹 𝗧𝗼: ${langCode.toUpperCase()}
━━━━━━━━━━━━━━━
🗣️ 𝗢𝗿𝗶𝗴𝗶𝗻𝗮𝗹: ${text}
💬 𝗧𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗲𝗱: ${translated}
━━━━━━━━━━━━━━━
💠 𝗖𝗿𝗲𝗱𝗶𝘁: 𝐇𝐑𝐈𝐃𝐎𝐘 𝐁𝐎𝐓 💫`;

    return api.sendMessage(message, event.threadID, event.messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ অনুবাদ করতে সমস্যা হয়েছে!", event.threadID, event.messageID);
  }
};