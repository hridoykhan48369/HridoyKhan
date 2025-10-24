/**
 * autosend.js (Upgraded Version)
 * Sends automatic messages to all threads at a specific time.
 * Credit: Hridoy Hossen
 * Bot Name: 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞
 */

module.exports.config = {
  name: "autosend",
  eventType: [],
  version: "1.0.2",
  credits: "Hridoy Hossen",
  description: "Automatically sends a message to all threads at a specific time"
};

module.exports.run = async ({ api, Threads }) => {
  try {
    const moment = require("moment-timezone");
    const currentTime = moment.tz("Asia/Dhaka").format("HH:mm:ss");

    // 🔁 এখানে সময় পরিবর্তন করো (২৪ ঘন্টার ফরম্যাটে)
    const targetTime = "17:22:00"; // এখানে নিজের সময় দাও
    const message = "🌸 Assalamu Alaikum!\n\nএই মেসেজটা এসেছে স্বয়ংক্রিয়ভাবে 🤖\n\n— 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞 💫";

    // যদি সময় মিলে যায়
    if (currentTime === targetTime) {
      const cantsend = [];
      const allThreads = global.data.allThreadID || [];

      for (const threadID of allThreads) {
        if (isNaN(parseInt(threadID))) continue;

        await new Promise(resolve => setTimeout(resolve, 500)); // ছোট delay
        api.sendMessage(message, threadID, (error) => {
          if (error) cantsend.push(threadID);
        });
      }

      // যদি কোনো গ্রুপে মেসেজ পাঠানো না যায়, তা হলে adminদের জানাবে
      if (cantsend.length > 0 && global.config.ADMINBOT) {
        for (const adminID of global.config.ADMINBOT) {
          api.sendMessage(
            `⚠️ কিছু থ্রেডে মেসেজ পাঠাতে সমস্যা হয়েছে:\n\n${cantsend.join("\n")}`,
            adminID
          );
        }
      }
    }
  } catch (err) {
    console.error("autosend error:", err);
  }
};
