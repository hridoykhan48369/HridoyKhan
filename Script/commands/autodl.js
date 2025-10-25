module.exports = {
  config: {
    name: "autodl",
    version: "0.0.2",
    hasPermssion: 0,
    credits: "Hridoy Hossen",
    description: "auto video download",
    commandCategory: "user",
    usages: "",
    cooldowns: 5,
  },

  run: async function({ api, event, args }) {},

  handleEvent: async function ({ api, event, args }) {
    const axios = require("axios");
    const request = require("request");
    const fs = require("fs-extra");
    const content = event.body ? event.body : '';
    const body = content.toLowerCase();
    const { alldown } = require("shaon-videos-downloader");

    if (body.startsWith("https://")) {
      api.setMessageReaction("⚠️", event.messageID, (err) => {}, true);

      const data = await alldown(content);
      console.log(data);

      let videoUrl = data.url;
      api.setMessageReaction("☢️", event.messageID, (err) => {}, true);

      const video = (await axios.get(videoUrl, {
        responseType: "arraybuffer",
      })).data;

      fs.writeFileSync(__dirname + "/cache/auto.mp4", Buffer.from(video, "utf-8"));

      return api.sendMessage({
        body: `🔥🚀 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞🔥💻 
📥⚡𝗔𝘂𝘁𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿⚡📂
🎬 𝐄𝐧𝐣𝐨𝐲 𝐭𝐡𝐞 𝐕𝐢𝐝𝐞𝐨 🎀`,
        attachment: fs.createReadStream(__dirname + "/cache/auto.mp4")
      }, event.threadID, event.messageID);
    }
  }
};