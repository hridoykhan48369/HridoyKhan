const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
  name: "owner",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU // modifies By Hridoy",
  description: "Show Owner Info with styled box & random photo",
  commandCategory: "Information",
  usages: "owner",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {
  const info = `
╔═════════════════════ ✿
║ ✨ 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ✨
╠═════════════════════ ✿
║ 👑 𝗡𝗮𝗺𝗲 : 𝐇𝐫𝐢𝐝𝐨𝐲 𝐇𝐨𝐬𝐬𝐞𝐧
║ 🧸 𝗡𝗶𝗰𝗸 𝗡𝗮𝗺𝗲 : KAKASHI
║ 🎂 𝗔𝗴𝗲 : 20
║ 💘 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻 : 𝗦𝗶𝗻𝗴𝗹𝗲
║ 🎓 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻 : 𝗦𝘁𝘂𝗱𝗲𝗻𝘁
║ 📚 𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻 : 𝗛𝗦𝗖
║ 🏡 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 : 𝐉𝐚𝐬𝐡𝐨𝐫𝐞
╠═════════════════════ ✿
║ 🔗 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗟𝗜𝗡𝗞𝗦
╠═════════════════════ ✿
║ 📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 :
║ fb.com/100048786044500
║ 💬 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿 :
║ m.me/100048786044500
║ 📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 :
║ wa.me/0174495****
║ ✈️ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 :
║ এডা দিয়ে কি করবি।
╚═════════════════════ ✿
`;

  const images = [
    "https://i.imgur.com/0IKTM64.jpeg"
  ];

  const randomImg = images[Math.floor(Math.random() * images.length)];
  const imgPath = __dirname + "/cache/owner.jpg";

  try {
    request(encodeURI(randomImg))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", () => {
        api.sendMessage(
          {
            body: info,
            attachment: fs.createReadStream(imgPath)
          },
          event.threadID,
          () => fs.unlinkSync(imgPath)
        );
      })
      .on("error", () => {
        api.sendMessage(info, event.threadID);
      });
  } catch (err) {
    console.error(err);
    api.sendMessage(info, event.threadID);
  }
};
