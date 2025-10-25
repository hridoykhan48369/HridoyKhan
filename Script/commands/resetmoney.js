// resetmoney.js
module.exports.config = {
  name: "resetmoney",
  version: "1.0.0",
  hasPermssion: 2, // admin only
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Admin: reset user's balance or set to amount. Usage: resetmoney <uid/all> [amount]",
  commandCategory: "admin",
  usages: "<uid|all> [amount]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args, Users }) {
  const econ = require("./Economy.js");
  const { threadID, messageID } = event;
  if (!args[0]) return api.sendMessage("Usage: resetmoney <uid|all> [amount]", threadID, messageID);
  const target = args[0].toLowerCase();
  const amt = args[1] ? parseInt(args[1]) : 0;

  if (target === "all") {
    await econ.resetAll(0);
    return api.sendMessage("All balances reset to 0.", threadID, messageID);
  } else {
    const uid = args[0];
    if (isNaN(uid)) return api.sendMessage("Invalid UID", threadID, messageID);
    await econ.setBalance(uid, isNaN(amt) ? 0 : amt);
    const name = await Users.getNameUser(uid);
    return api.sendMessage(`Set ${name}'s balance to ${amt}`, threadID, messageID);
  }
};
