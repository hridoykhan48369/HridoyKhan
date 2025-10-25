const economy = require("./Economy.js");

module.exports.config = {
  name: "slot",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Play slot machine and win or lose coins",
  commandCategory: "economy",
  usages: "[bet amount]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const userID = event.senderID;
  const bet = parseInt(args[0]);

  if (isNaN(bet) || bet <= 0) {
    return api.sendMessage("⚠️ সঠিকভাবে কয়েন এমাউন্ট লিখুন। উদাহরণ: slot 100", event.threadID, event.messageID);
  }

  const balance = economy.getBalance(userID);

  if (balance < bet) {
    return api.sendMessage("❌ পর্যাপ্ত কয়েন নেই!", event.threadID, event.messageID);
  }

  const items = ["🍎", "🍌", "🍒", "🍇", "💎"];
  const slot1 = items[Math.floor(Math.random() * items.length)];
  const slot2 = items[Math.floor(Math.random() * items.length)];
  const slot3 = items[Math.floor(Math.random() * items.length)];

  let result, win = false;
  if (slot1 === slot2 && slot2 === slot3) {
    win = true;
    economy.addBalance(userID, bet * 5);
    result = `🎉 জয়! আপনি জিতেছেন ${bet * 5} কয়েন!`;
  } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
    win = true;
    economy.addBalance(userID, bet * 2);
    result = `✨ কাছাকাছি! আপনি জিতেছেন ${bet * 2} কয়েন!`;
  } else {
    economy.subtractBalance(userID, bet);
    result = `😢 হেরে গেছেন ${bet} কয়েন...`;
  }

  const total = economy.getBalance(userID);

  return api.sendMessage(
    `🎰 SLOT MACHINE 🎰\n━━━━━━━━━━━━━━━\n${slot1} | ${slot2} | ${slot3}\n━━━━━━━━━━━━━━━\n${result}\n💰 আপনার নতুন ব্যালান্স: ${total.toLocaleString()} কয়েন`,
    event.threadID,
    event.messageID
  );
};
