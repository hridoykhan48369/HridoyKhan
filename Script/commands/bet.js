// bet.js
module.exports.config = {
  name: "bet",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Bet an amount, 50% win double, 50% lose",
  commandCategory: "economy",
  usages: "<amount>",
  cooldowns: 2
};

module.exports.run = async function({ api, event, args, Users }) {
  const econ = require("./Economy.js");
  const { threadID, messageID, senderID } = event;
  const amount = Math.floor(Number(args[0]));
  if (!amount || amount <= 0) return api.sendMessage("Usage: bet <amount>", threadID, messageID);
  const bal = await econ.getBalance(senderID);
  if (bal < amount) return api.sendMessage("Insufficient balance.", threadID, messageID);

  // Random outcome
  const win = Math.random() < 0.5;
  if (win) {
    const winAmount = amount; // profit (double)
    await econ.addMoney(senderID, winAmount, "bet win");
    const newBal = await econ.getBalance(senderID);
    const name = await Users.getNameUser(senderID);
    return api.sendMessage(`${name} 🎉 You won ${winAmount} coins! New balance: ${newBal}`, threadID, messageID);
  } else {
    await econ.removeMoney(senderID, amount, "bet lost");
    const newBal = await econ.getBalance(senderID);
    const name = await Users.getNameUser(senderID);
    return api.sendMessage(`${name} 😢 You lost ${amount} coins. New balance: ${newBal}`, threadID, messageID);
  }
};
