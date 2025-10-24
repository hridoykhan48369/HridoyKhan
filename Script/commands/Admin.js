const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
 name: "admin",
 version: "1.0.1",
 hasPermssion: 0,
 credits: "𝗛𝗿𝗶𝗱𝗼𝘆 𝗛𝗼𝘀𝘀𝗲𝗻",
 description: "Show Owner Info",
 commandCategory: "info",
 usages: "admin",
 cooldowns: 2
};

module.exports.run = async function({ api, event }) {
 const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

 const callback = () => api.sendMessage({
 body: `
┌───────────────⭓
│ 𝗢𝗪𝗡𝗘𝗥 𝗗𝗘𝗧𝗔𝗜𝗟𝗦
├───────────────
│ 👤 𝐍𝐚𝐦𝐞 : 𝐇𝐫𝐢𝐝𝐨𝐲 𝐇𝐨𝐬𝐬𝐞𝐧
│ 🚹 𝐆𝐞𝐧𝐝𝐞𝐫 : 𝐌𝐚𝐥𝐞
│ ❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧 : 𝐒𝐢𝐧𝐠𝐥𝐞
│ 🎂 𝐀𝐠𝐞 : 𝟐𝟎
│ 🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧 : 𝐈𝐬𝐥𝐚𝐦
│ 🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 : 𝐉𝐚𝐬𝐡𝐨𝐫𝐞, 𝐁𝐚𝐧𝐠𝐥𝐚𝐝𝐞𝐬𝐡
└───────────────⭓

┌───────────────⭓
│ 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗟𝗜𝗡𝗞𝗦
├───────────────
│ 📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸:
│ https://fb.com/100048786044500
│ 💬 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽:
│ https://wa.me/0174495****
└───────────────⭓

┌───────────────⭓
│ 🕒 𝗨𝗽𝗱𝗮𝘁𝗲𝗱 𝗧𝗶𝗺𝗲
├───────────────
│ ${time}
└───────────────⭓

🧠 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥: 𝐇𝐫𝐢𝐝𝐨𝐲 𝐇𝐨𝐬𝐬𝐞𝐧
⚡ 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬: 𝗛𝗿𝗶𝗱𝗼𝘆 𝗕𝗢𝗧
 `,
 attachment: fs.createReadStream(__dirname + "/cache/owner.jpg")
 }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/owner.jpg"));

 return request("https://i.imgur.com/0IKTM64.jpeg")
 .pipe(fs.createWriteStream(__dirname + '/cache/owner.jpg'))
 .on('close', () => callback());
};
