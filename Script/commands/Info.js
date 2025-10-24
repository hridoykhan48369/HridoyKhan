const fs = require("fs-extra");
const request = require("request");
const moment = require("moment-timezone");

module.exports.config = {
  name: "info",
  version: "1.2.7",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Show bot's system and owner info",
  commandCategory: "system",
  usages: "[No args]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  const { threadID } = event;

  const { configPath } = global.client;
  delete require.cache[require.resolve(configPath)];
  const config = require(configPath);

  const { commands } = global.client;
  const threadSetting = (await Threads.getData(String(threadID))).data || {};
  const prefix = threadSetting.PREFIX || config.PREFIX;

  // 🕒 Uptime calculation
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;
  const ping = Date.now() - event.timestamp;

  const msg = `
╭──────────────────────────────╮
│ 🌺 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 🌺
├──────────────────────────────┤
│ 🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 : 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞
│ ⚙️ 𝗣𝗿𝗲𝗳𝗶𝘅 : ${config.PREFIX}
│ 📦 𝗣𝗿𝗲𝗳𝗶𝘅 (Box) : ${prefix}
│ 🔰 𝗠𝗼𝗱𝘂𝗹𝗲𝘀 : ${commands.size}
│ ⚡ 𝗣𝗶𝗻𝗴 : ${ping}ms
╰──────────────────────────────╯

╭──────────────────────────────╮
│ 👑 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎
├──────────────────────────────┤
│ 👤 𝗡𝗮𝗺𝗲 : 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍
│ 🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 : facebook.com/100048786044500
│ 💬 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿 : m.me/100048786044500
│ 📱 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 : wa.me/+880174495****
╰──────────────────────────────╯

╭──────────────────────────────╮
│ 🕒 𝐁𝐎𝐓 𝐀𝐂𝐓𝐈𝐕𝐈𝐓𝐘
├──────────────────────────────┤
│ ⏰ 𝗔𝗰𝘁𝗶𝘃𝗲 𝗧𝗶𝗺𝗲 : ${hours}h ${minutes}m ${seconds}s
│ 💭 𝗚𝗿𝗼𝘂𝗽𝘀 : ${totalThreads}
│ 👥 𝗨𝘀𝗲𝗿𝘀 : ${totalUsers}
╰──────────────────────────────╯

💖 𝗧𝗵𝗮𝗻𝗸 𝗬𝗼𝘂 𝗙𝗼𝗿 𝗨𝘀𝗶𝗻𝗴 𝙆𝙖𝙜𝙪𝙮𝙖 𝗕𝗼𝘁 💝`;

  // 🖼️ Random image
  const imgURL = "https://i.imgur.com/0IKTM64.jpeg";
  const cachePath = __dirname + "/cache/info.jpg";

  const callback = () => {
    api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(cachePath),
      },
      threadID,
      () => fs.unlinkSync(cachePath)
    );
  };

  request(encodeURI(imgURL))
    .pipe(fs.createWriteStream(cachePath))
    .on("close", callback);
};
