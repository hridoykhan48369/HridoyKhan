// mycoins.js
module.exports.config = {
  name: "mycoins",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Show own balance quickly",
  commandCategory: "economy",
  usages: "",
  cooldowns: 2
};

module.exports.run = async function({ api, event, Users }) {
  const econ = require("./Economy.js");
  const { threadID, messageID, senderID } = event;
  const bal = await econ.getBalance(senderID);
  const name = await Users.getNameUser(senderID);
  api.sendMessage(`💠 ${name}\nYour balance: ${bal} coin`, threadID, messageID);
};
