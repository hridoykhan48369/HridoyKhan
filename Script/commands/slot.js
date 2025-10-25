// slot.js
module.exports.config = {
  name: "slot",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Simple 3-reel slot. Usage: slot <amount>",
  commandCategory: "economy",
  usages: "<amount>",
  cooldowns: 2
};

module.exports.run = async function({ api, event, args, Users }) {
  const econ = require("./Economy.js");
  const { threadID, messageID, senderID } = event;
  const bet = Math.floor(Number(args[0]));
  if (!bet || bet <= 0) return api.sendMessage("Usage: slot <amount>", threadID, messageID);

  const bal = await econ.getBalance(senderID);
  if (bal < bet) return api.sendMessage("Insufficient balance.", threadID, messageID);

  const symbols = ["🍒","🍋","🔔","⭐","7️⃣"];
  const r = () => symbols[Math.floor(Math.random() * symbols.length)];
  const s1 = r(), s2 = r(), s3 = r();

  // payouts:
  // triple 7 => x10, triple star => x5, triple bell => x4, triple same => x3, two same => x1.5
  let payout = 0;
  if (s1 === s2 && s2 === s3) {
    if (s1 === "7️⃣") payout = bet * 10;
    else if (s1 === "⭐") payout = bet * 5;
    else if (s1 === "🔔") payout = bet * 4;
    else payout = bet * 3;
  } else if (s1 === s2 || s2 === s3 || s1 === s3) {
    payout = Math.floor(bet * 1.5);
  } else payout = -bet;

  if (payout > 0) {
    await econ.addMoney(senderID, payout, "slot win");
    const newBal = await econ.getBalance(senderID);
    return api.sendMessage(`🎰 [ ${s1} | ${s2} | ${s3} ]\nYou won ${payout} coins! New balance: ${newBal}`, threadID, messageID);
  } else {
    await econ.removeMoney(senderID, bet, "slot lose");
    const newBal = await econ.getBalance(senderID);
    return api.sendMessage(`🎰 [ ${s1} | ${s2} | ${s3} ]\nYou lost ${bet} coins. New balance: ${newBal}`, threadID, messageID);
  }
};
