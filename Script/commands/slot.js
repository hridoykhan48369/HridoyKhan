const economy = require("./Economy.js");

module.exports.config = {
  name: "slot",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Spin the slot machine to win or lose coins",
  commandCategory: "games",
  usages: "slot <bet amount>",
  cooldowns: 5
};

const symbols = ["🍎", "🍇", "🍒", "🍋", "🍉", "⭐", "💎"];

module.exports.run = async ({ api, event, args }) => {
  const userID = event.senderID;
  const bet = parseInt(args[0]);

  if (!bet || isNaN(bet) || bet <= 0) {
    return api.sendMessage("⚠️ দয়া করে একটি সঠিক বেট পরিমাণ দিন (যেমন: slot 100)", event.threadID, event.messageID);
  }

  const balance = economy.getBalance(userID);
  if (balance < bet) {
    return api.sendMessage(`❌ আপনার ব্যালান্স যথেষ্ট নয়! 💰 বর্তমান ব্যালান্স: ${balance}`, event.threadID, event.messageID);
  }

  // ৩টি র‍্যান্ডম সিম্বল তৈরি
  const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
  const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
  const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

  let result = `🎰 | ${slot1} | ${slot2} | ${slot3} | 🎰\n\n`;

  if (slot1 === slot2 && slot2 === slot3) {
    const win = bet * 5;
    economy.addBalance(userID, win);
    const newBalance = economy.getBalance(userID);
    result += `🎉 জিতেছো! তুমি পেয়েছো +${win} কয়েন 💰\nবর্তমান ব্যালান্স: ${newBalance}`;
  } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
    const win = bet * 2;
    economy.addBalance(userID, win);
    const newBalance = economy.getBalance(userID);
    result += `😎 প্রায় জিতেছিলে! তুমি পেয়েছো +${win} কয়েন 💰\nবর্তমান ব্যালান্স: ${newBalance}`;
  } else {
    economy.subtractBalance(userID, bet);
    const newBalance = economy.getBalance(userID);
    result += `💔 হারলে! ${bet} কয়েন কাটা হলো 😢\nবর্তমান ব্যালান্স: ${newBalance}`;
  }

  return api.sendMessage(result, event.threadID, event.messageID);
};
