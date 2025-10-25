module.exports = {
  config: {
    name: "age",
    version: "2.2",
    author: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
    hasPermission: 0,
    commandCategory: "utility",
    cooldowns: 5,
    description: "Calculate your age using your birth date",
    usage: "[DD/MM/YYYY]",
    dependencies: {
      "moment-timezone": "",
      "fs-extra": "",
      "axios": ""
    }
  },

  run: async function ({ api, event, args }) {
    const fs = require("fs-extra");
    const moment = require("moment-timezone");
    const axios = require("axios");

    if (!args[0]) {
      return api.sendMessage(
        "⚠️ Please provide your birth date in this format:\n👉 Example: age 16/12/2006",
        event.threadID
      );
    }

    const [day, month, year] = args[0].split("/").map(Number);

    if (!day || !month || !year || day > 31 || month > 12 || year > new Date().getFullYear()) {
      return api.sendMessage("❌ Invalid date format. Use DD/MM/YYYY correctly!", event.threadID);
    }

    const birthDate = moment.tz(`${year}-${month}-${day}`, "YYYY-MM-DD", "Asia/Dhaka");
    const now = moment.tz("Asia/Dhaka");

    if (birthDate.isAfter(now)) {
      return api.sendMessage("❌ You can’t be born in the future! 😅", event.threadID);
    }

    const duration = moment.duration(now.diff(birthDate));
    const years = duration.years();
    const months = duration.months();
    const days = duration.days();
    const totalMonths = years * 12 + months;
    const totalDays = Math.floor(duration.asDays());
    const totalHours = Math.floor(duration.asHours());

    const avatarPath = `${__dirname}/cache/${event.senderID}.jpg`;
    const avatarUrl = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    try {
      const response = await axios.get(avatarUrl, { responseType: "stream" });
      const writer = fs.createWriteStream(avatarPath);
      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    } catch {
      return api.sendMessage("⚠️ Couldn't load profile picture.", event.threadID);
    }

    const message = {
      body: `╭─────────────❂\n│ 🎂 𝗔𝗚𝗘 𝗖𝗔𝗟𝗖𝗨𝗟𝗔𝗧𝗢𝗥 🎂\n│─────────────────❂\n│ 📅 𝗗𝗮𝘁𝗲 𝗼𝗳 𝗕𝗶𝗿𝘁𝗵: ${day}/${month}/${year}\n│ 🧮 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗔𝗴𝗲: ${years} years ${months} months ${days} days\n│─────────────────❂\n│ 🗓️ ${totalMonths} Months\n│ 📆 ${totalDays} Days\n│ ⏰ ${totalHours} Hours\n│─────────────────❂\n│ 🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞\n│ 👑 𝗢𝘄𝗻𝗲𝗿: 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍\n╰─────────────❂`,
      attachment: fs.createReadStream(avatarPath)
    };

    await api.sendMessage(message, event.threadID);
    fs.unlinkSync(avatarPath);
  }
};