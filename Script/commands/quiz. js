const economy = require("./Economy.js");

module.exports.config = {
  name: "quiz",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Answer quiz questions to earn or lose coins",
  commandCategory: "games",
  usages: "",
  cooldowns: 5
};

// কুইজ প্রশ্ন তালিকা
const questions = [
  { question: "বাংলাদেশের রাজধানী কোথায়?", options: ["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা"], correct: 1 },
  { question: "বিশ্বের দীর্ঘতম নদী কোনটি?", options: ["আমাজন", "নাইল", "গঙ্গা", "ইয়াংসি"], correct: 2 },
  { question: "সূর্যের সবচেয়ে নিকটতম গ্রহ কোনটি?", options: ["বুধ", "শুক্র", "পৃথিবী", "মঙ্গল"], correct: 1 },
  { question: "মানুষের শরীরে কয়টি হাড় আছে?", options: ["২০৬", "৩০৬", "২০০", "১৯৬"], correct: 1 },
  { question: "বাংলাদেশের জাতীয় ফুল কোনটি?", options: ["শাপলা", "গোলাপ", "গন্ধরাজ", "টগর"], correct: 1 }
];

module.exports.run = async ({ api, event }) => {
  const userID = event.senderID;
  const q = questions[Math.floor(Math.random() * questions.length)];

  let questionText = `🧠 কুইজ টাইম!\n\n${q.question}\n`;
  q.options.forEach((opt, i) => {
    questionText += `${i + 1}. ${opt}\n`;
  });
  questionText += `\nউত্তর দিতে রিপ্লাই দিন (যেমন: 1 বা 2)।`;

  return api.sendMessage(questionText, event.threadID, (err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      userID: userID,
      correct: q.correct
    });
  });
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
  const userID = event.senderID;
  if (userID !== handleReply.userID) return;

  const ans = parseInt(event.body.trim());
  if (isNaN(ans)) return api.sendMessage("⚠️ শুধু 1, 2, 3, বা 4 দিন!", event.threadID, event.messageID);

  if (ans === handleReply.correct) {
    economy.addBalance(userID, 100);
    const total = economy.getBalance(userID);
    return api.sendMessage(
      `✅ সঠিক উত্তর!\nআপনি পেয়েছেন +100 কয়েন 💰\nবর্তমান ব্যালান্স: ${total.toLocaleString()} কয়েন`,
      event.threadID
    );
  } else {
    economy.subtractBalance(userID, 50);
    const total = economy.getBalance(userID);
    return api.sendMessage(
      `❌ ভুল উত্তর!\nআপনার -50 কয়েন কাটা হয়েছে 😢\nবর্তমান ব্যালান্স: ${total.toLocaleString()} কয়েন`,
      event.threadID
    );
  }
};
