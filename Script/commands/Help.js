const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
  name: "help",
  version: "2.0.1",
  hasPermssion: 0,
  credits: "𝐇𝐫𝐢𝐝𝐨𝐲 𝐇𝐨𝐬𝐬𝐞𝐧",
  description: "Shows all available bot commands with details.",
  commandCategory: "System",
  usages: "[command name / page number]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

module.exports.languages = {
  en: {
    moduleInfo: `
╭━━━━━━━━━━━━━━━━╮
┃ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨
┣━━━━━━━━━━━━━━━┫
┃ 🔖 Name: %1
┃ 📄 Usage: %2
┃ 📜 Description: %3
┃ 🔑 Permission: %4
┃ 👨‍💻 Credit: %5
┃ 📂 Category: %6
┃ ⏳ Cooldown: %7s
┣━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: %8
┃ 🤖 Bot Name: %9
┃ 👑 Owner: 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍
╰━━━━━━━━━━━━━━━━╯`,
    helpList: "[ There are %1 commands. Use: \"%2help commandName\" to view more. ]",
    user: "User",
    adminGroup: "Admin Group",
    adminBot: "Admin Bot"
  }
};

// তোমার দেওয়া ইমেজ লিংক ✅
const helpImages = ["https://i.imgur.com/0IKTM64.jpeg"];

// 🔧 Helper function: download images into cache
function downloadImages(callback) {
  const cachePath = path.join(__dirname, "cache");
  if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

  const files = [];
  let completed = 0;

  helpImages.forEach((url, index) => {
    const filePath = path.join(cachePath, `help${index}.jpg`);
    files.push(filePath);

    request(url)
      .pipe(fs.createWriteStream(filePath))
      .on("close", () => {
        completed++;
        if (completed === helpImages.length) callback(files);
      });
  });
}

// 📘 Auto trigger on “help commandName”
module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;
  if (!body || !body.toLowerCase().startsWith("help ")) return;

  const args = body.split(/\s+/);
  const cmdName = args[1]?.toLowerCase();
  if (!cmdName || !commands.has(cmdName)) return;

  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(cmdName);
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  const info = getText(
    "moduleInfo",
    command.config.name,
    command.config.usages || "Not Provided",
    command.config.description || "Not Provided",
    command.config.hasPermssion,
    command.config.credits || "Unknown",
    command.config.commandCategory || "Unknown",
    command.config.cooldowns || 0,
    prefix,
    global.config.BOTNAME || "𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞"
  );

  downloadImages(files => {
    const attachments = files.map(f => fs.createReadStream(f));
    api.sendMessage({ body: info, attachment: attachments }, threadID, () => {
      files.forEach(f => fs.unlinkSync(f));
    }, messageID);
  });
};

// 📗 Main command: help / help <page>
module.exports.run = function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  // যদি নির্দিষ্ট কমান্ড লেখা হয়
  if (args[0] && commands.has(args[0].toLowerCase())) {
    const command = commands.get(args[0].toLowerCase());
    const detail = getText(
      "moduleInfo",
      command.config.name,
      command.config.usages || "Not Provided",
      command.config.description || "Not Provided",
      command.config.hasPermssion,
      command.config.credits || "Unknown",
      command.config.commandCategory || "Unknown",
      command.config.cooldowns || 0,
      prefix,
      global.config.BOTNAME || "𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞"
    );

    downloadImages(files => {
      const attachments = files.map(f => fs.createReadStream(f));
      api.sendMessage({ body: detail, attachment: attachments }, threadID, () => {
        files.forEach(f => fs.unlinkSync(f));
      }, messageID);
    });
    return;
  }

  // 🔢 Pagination logic
  const commandNames = Array.from(commands.keys()).sort();
  const perPage = 20;
  const page = Math.max(parseInt(args[0]) || 1, 1);
  const totalPages = Math.ceil(commandNames.length / perPage);
  const start = (page - 1) * perPage;
  const view = commandNames.slice(start, start + perPage);

  const list = view.map(cmd => `┃ ✪ ${cmd}`).join("\n");
  const text = `
╭━━━━━━━━━━━━━━━━╮
┃ 📜 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 📜
┣━━━━━━━━━━━━━━━┫
┃ 📄 Page: ${page}/${totalPages}
┃ 🧮 Total: ${commandNames.length}
┣━━━━━━━━━━━━━━━┫
${list}
┣━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: ${prefix}
┃ 🤖 Bot Name: ${global.config.BOTNAME || "𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞"}
┃ 👑 Owner: 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍
╰━━━━━━━━━━━━━━━━╯`;

  downloadImages(files => {
    const attachments = files.map(f => fs.createReadStream(f));
    api.sendMessage({ body: text, attachment: attachments }, threadID, () => {
      files.forEach(f => fs.unlinkSync(f));
    }, messageID);
  });
};
