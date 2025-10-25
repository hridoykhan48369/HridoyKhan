const economy = require("./Economy.js");

module.exports.config = {
  name: "bet",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Bet with a user — win or lose coins!",
  commandCategory: "games",
  usages: "bet <amount> @mention",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID, mentions } = event;

  // Bet amount check
  const amount = parseInt(args[0]);
  if (!amount || isNaN(amount) || amount <= 0)
    return api.sendMessage("⚠️ দয়া করে সঠিক বেট পরিমাণ দিন (যেমন: bet 500 @friend)", threadID, messageID);

  // Check mentioned user
  if (!mentions || Object.keys(mentions).length === 0)
    return api.sendMessage("⚠️ দয়া করে যাকে বেট করতে চান তাকে mention করুন!", threadID, messageID);

  const targetID = Object.keys(mentions)[0];
  const targetName = Object.values(mentions)[0].replace("@", "");

  if (targetID === senderID)
    return api.sendMessage("❌ নিজেকে বেট করা যাবে না!", threadID, messageID);

  const userBalance = economy.getBalance(senderID);
  const targetBalance = economy.getBalance(targetID);

  if (userBalance < amount)
    return api.sendMessage("❌ আপনার কাছে পর্যাপ্ত কয়েন নেই!", threadID, messageID);

  if (targetBalance < amount)
    return api.sendMessage(`❌ ${targetName} এর কাছে পর্যাপ্ত কয়েন নেই!`, threadID, messageID);

  // র‍্যান্ডম জয়ী নির্ধারণ
  const winner = Math.random() < 0.5 ? senderID : targetID;
  const loser = winner === senderID ? targetID : senderID;

  // জয়ী পাবে মোট ২গুণ কয়েন
  economy.addBalance(winner, amount);
  economy.subtractBalance(loser, amount);

  const winnerName = winner === senderID ? "তুমি" : targetName;
  const loserName = loser === senderID ? "তুমি" : targetName;

  const msg = `🎲 বেট সম্পন্ন!\n\n💰 বেটের পরিমাণ: ${amount}\n🏆 জয়ী: ${winnerName}\n💔 পরাজিত: ${loserName}\n\n📊 ব্যালান্স আপডেট হয়েছে!`;

  return api.sendMessage(msg, threadID, messageID);
};
