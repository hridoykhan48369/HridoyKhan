module.exports.config = {
  name: "adminmention",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Auto reply when someone mentions the bot owner or admins",
  commandCategory: "System",
  usages: "@Admin",
  cooldowns: 1
};

module.exports.handleEvent = function ({ api, event }) {
  const adminIDs = [
    "61575698041722",  // Admin 1
    "100048786044500", // Hridoy Hossen
    "61576394315037",  // Another Admin
  ].map(String);

  if (!event.mentions || Object.keys(event.mentions).length === 0) return;
  if (adminIDs.includes(String(event.senderID))) return;

  const mentionedIDs = Object.keys(event.mentions).map(String);
  const mentionedAdmin = adminIDs.some(id => mentionedIDs.includes(id));
  if (!mentionedAdmin) return;

  const replies = [
    "ডাকাডাকি করিস না, বস এখন ব্যস্ত আছে 😒",
    "বস এক আবালকে মেনশন দিতে দেখলাম, মাথা খারাপ নাকি? 😑",
    "মেনশন না দিয়া একটা girlfriend খুজে দে 🙄",
    "বস এখন আমার সাথে মিটিং-এ আছে, পরে আস 😌",
    "বসকে মেনশন মানে বিপদ ডেকে আনছোস 😩",
    "তোর মেনশন দেখে বস এখন হেলিকপ্টারে উঠতেছে 🚁",
    "বস তো এখন প্রেম ক্লাসে ব্যস্ত 📚",
    "তোরে দেখে মনে হচ্ছে attention seeker 😹",
    "বস এখন চা খাচ্ছে ☕, মেনশন দিস না 😤",
    "তুই মেনশন দিস, বস এখন প্রোফাইলে ঢুকতেছে 👀",
    "বস এখন রেগে আগুন 🔥, ইনবক্স খুলে তোকে ব্লক দিবে!",
    "এই! বসরে মেনশন করা সহজ না, লাইসেন্স লাগে 😎",
    "বস এখন VIP মিটিংয়ে আছে 🛋️",
    "তুই বসরে মেনশন দিছস মানে সাহসী রে 🫡",
    "Shahadat বসরে মেনশন দিয়া নিজেই বিপদে পড়ছোস 🚨",
    "বস ভাবতেছে — এই আবালটা আবার কে? 😶",
    "তোর মেনশন দেখে সার্ভার গরম হইয়া গেছে 🥵",
    "বস তো এখন চার্জে আছে 🔋",
    "বস এখন ইনবক্সে ব্যস্ত আছে 😗",
    "তুই কি জানিস বসকে মেনশন করা মানে রিস্ক নেওয়া? ⚠️",
    "বস তোরে reply দিবে কিন্তু আগে গোসল করে আয় 🧼",
    "বস এখন ঘুমাচ্ছে 😴, ওঠার পরে তোরে গালি দিবে 😂",
    "তুই বসরে মেনশন দিছস, এখন তোর কপালে বিপদ 😼",
    "বস এখন crush এর সাথে কথা বলতেছে 😏",
    "তুই বসরে মেনশন দিছস, বসের BP এখন বাড়ছে 😤",
    "বস এখন offline আছে, তোর কপালে কান্দা আছে 😭",
    "তুই বসরে মেনশন দিছস, আর আমি দোয়া করতেছি তুই বাঁচিস 🫥",
    "বস এখন চুপচাপ তোর প্রোফাইল দেখতেছে 🔍",
    "তুই মেনশন দিলি, বস হাসছে চুপিচুপি 😌",
    "বস বলছে — 'এইটা কে রে আবার?' 😑",
    "তুই বসরে প্রেম প্রপোজ করছোস নাকি? 😏❤️",
    "তোরে দেখে বস এখন Facepalm দিলো 🤦",
    "বসের টাইম এখন কই! পরে নক দে 😎",
    "বস এখন প্রেমের কবিতা লিখতেছে 📝",
    "বস বলছে — 'এইটারে remove করে দে কেউ!' 😈",
    "মেনশন না দিয়া বস বল, বস 😘",
    "বস বলছে — 'আমি ব্যস্ত, পাগলটারে সামলাও কেউ' 😪",
    "বস এখন চা-বিরতিতে আছে 🍵",
    "তুই মেনশন দিছস, আমি এখন বসরে জানাইলাম 😹",
    "তুই বসরে ডাকছিস, বস বলছে 'একটা slap দে' 🤜",
    "তুই জানস বসকে ডাকলে পুরো গ্রুপ vibrate করে? 📳",
    "বস এখন coding mood এ আছে 👨‍💻",
    "তোরে দেখে মনে হইতেছে বসের fan number one 🥇",
    "তুই মেনশন দিছস, এখন তোর কপালে drama আছে 🎭",
    "বস তো এখন আমাকে upgrade দিতেছে 🤖",
    "Shahadat বস এখন সার্ভারে ঘুমায়, ডিস্টার্ব করিস না 😴",
    "বস এখন মিষ্টি মুখে হাসতেছে, danger incoming 😈",
    "তুই বসরে মেনশন দিলি, এখন তোর নাম blacklist এ 🧾",
    "বস এখন চিন্তা করতেছে, এইটা কে রে 😶‍🌫️"
  ];

  const randomReply = replies[Math.floor(Math.random() * replies.length)];
  api.sendMessage(randomReply, event.threadID, event.messageID);
};

module.exports.run = async function () {};
