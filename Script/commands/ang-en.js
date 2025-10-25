module.exports.config = {
  name: "en",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐁𝐎𝐓 💫 (Modified by Islamick Cyber Chat)",
  usePrefix: false,
  description: "Translate any text to your selected language (auto detects source)",
  commandCategory: "Tools",
  usages: "en [langCode] [text] or reply to a message\nExample: en bn I love you",
  cooldowns: 3,
  dependencies: { "axios": "" }
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");

  try {
    if (args.length === 0 && !event.messageReply)
      return api.sendMessage(
        "⚠️ Please provide a language code and text to translate.\n\nExample:\n• en bn I love you\n• reply a message with → en hi",
        event.threadID,
        event.messageID
      );

    // Default values
    let langCode = "en";
    let text;

    // যদি reply করা মেসেজ অনুবাদ করতে চায়
    if (event.messageReply) {
      text = event.messageReply.body;
      if (args[0]) langCode = args[0].toLowerCase();
    } else {
      langCode = args[0].toLowerCase();
      text = args.slice(1).join(" ");
    }

    if (!text)
      return api.sendMessage(
        "⚠️ Please enter the text you want to translate!",
        event.threadID,
        event.messageID
      );

    // Google Translate API
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(langCode)}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await axios.get(url);
    const translated = res.data[0].map(item => item[0]).join("");
    const fromLang = res.data[2];

    const message = `🌐 𝗚𝗼𝗼𝗴𝗹𝗲 𝗧𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗲
━━━━━━━━━━━━━━━━━
🔹 From: ${fromLang.toUpperCase()}
🔹 To: ${langCode.toUpperCase()}
━━━━━━━━━━━━━━━━━
🗣️ Original: ${text}
💬 Translated: ${translated}
━━━━━━━━━━━━━━━━━
💠 Credit: 𝐇𝐑𝐈𝐃𝐎𝐘 𝐁𝐎𝐓 💫`;

    return api.sendMessage(message, event.threadID, event.messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ Translation failed. Please try again later!", event.threadID, event.messageID);
  }
};