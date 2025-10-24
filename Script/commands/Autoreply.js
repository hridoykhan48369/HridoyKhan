const fs = global.nodemodule["fs-extra"];
const path = global.nodemodule["path"];

module.exports.config = {
  name: "autoreplybot",
  version: "8.0.0",
  hasPermssion: 0,
  credits: "𝐇𝐫𝐢𝐝𝐨𝐲 𝐇𝐨𝐬𝐬𝐞𝐧",
  description: "Auto response bot with all default triggers and custom add/remove system",
  commandCategory: "No Prefix",
  usages: "[add/remove/list]",
  cooldowns: 3,
};

// JSON path for saved triggers
const dataPath = path.join(__dirname, "cache", "autoreply.json");

// 🧠 Default replies (তোমার সব দেওয়া লাইন)
const defaultReplies = {
  "miss you": "অরেক বেডারে Miss না করে xan মেয়ে হলে বস হৃদয় রে হাঙ্গা করো😶👻😘",
  "kiss de": "কিস দিস না তোর মুখে দূর গন্ধ কয়দিন ধরে দাঁত ব্রাশ করিস নাই🤬",
  "👍": "সর এখান থেকে লাইকার আবাল..!🐸🤣👍⛏️",
  "help": "Prefix de sala",
  "hi": "এত হাই-হ্যালো কর ক্যান প্রিও..!😜🫵",
  "bc": "SAME TO YOU😊",
  "pro": "Khud k0o KYa LeGend SmJhTi Hai 😂",
  "good morning": "GOOD MORNING দাত ব্রাশ করে খেয়ে নেও😚",
  "tor ball": "~ এখনো বাল উঠে নাই নাকি তোমার?? 🤖",
  "hridoy": "উনি এখন কাজে বিজি আছে কি বলবেন আমাকে বলতে পারেন..!😘",
  "owner": "‎[𝐎𝐖𝐍𝐄𝐑:☞ Hridoy Hossen☜\nFacebook: https://www.facebook.com/profile.php?id=100048786044500\nWhatsApp: +880174495****]",
  "admin": "He is Hridoy তাকে সবাই Kakashi  হিসেবে চিনে😘☺️",
  "babi": "এ তো হাছিনা হে মেরে দিলকি দারকান হে মেরি জান হে😍.",
  "chup": "তুই চুপ চুপ কর পাগল ছাগল",
  "assalamualaikum": "وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ 💖",
  "fork": "বস এর কাছে চেয়ে দেখ দিলে ভালো আর না দিলে আরো ভালো।",
  "kiss me": "তুমি পঁচা তোমাকে কিস দিবো না 🤭",
  "thanks": "এতো ধন্যবাদ না দিয়ে আমার বস হৃদয় রে তোর গার্লফ্রেন্ড টা দিয়ে দে..!🐸🥵",
  "i love you": "মেয়ে হলে আমার বস হৃদয় এর ইনবক্সে এখুনি গুঁতা দিন🫢😻",
  "by": "কিরে তুই কই যাস কোন মেয়ের সাথে চিপায় যাবি..!🌚🌶️",
  "ami hridoy": "হ্যা বস কেমন আছেন..?☺️",
  "bot er baccha": "আমার বাচ্চা তো তোমার গার্লফ্রেন্ডের পেটে..!!🌚⛏️",
  "tor nam ki": "MY NAME IS ─꯭─⃝‌‌𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞💖",
  "pic de": "এন থেকে সর দুরে গিয়া মর😒",
  "cudi": "এত চোদা চুদি করস কেনো..!🥱🌝🌚",
  "bal": "রাগ করে না সোনা পাখি 🥰",
  "heda": "এতো রাগ শরীরের জন্য ভালো না 🥰",
  "boda": "ভাই তুই এত হাসিস না..!🌚🤣",
  "love you": "ভালোবাসা নামক আবলামী করতে চাইলে Boss Hridoy এর ইনবক্সে গুতা দিন 😘",
  "kire ki koros": "তোমার কথা ভাবতে ছি জানু",
  "hello": "ওইই! কে এলো রে ভাই 😜 কিচ্ছু দিন ধরে লুকায়া ছিলি নাকি?",
  "bye": "যেও না প্লিজ 😭 আমি একা হয়ে যাবো বটলাইফে 💔",
  "good night": "শুভ রাত্রি 🌙 চাঁদ দেখিস, আমায় না 😏",
  "pookie": "pookie যে কবে তোমার পুক্কি মেরে দিয়ে চলে যাবে বুঝতেও পারবে না 😇",
  "kire": "এই যে, কিরে? তুই কি বেকারদের রাজা নাকি? 🤣",
  "bro": "Bro না, আমি তো ভাইরাস 😎",
  "sad": "চিন্তা করিস না, আজ না হয় কাল আবার হসবি 🤭",
  "happy": "এই যে, হ্যাপি ভাই 😁 মুখে হাসি থাকুক, নইলে বকাঝকা পাবি!",
  "haha": "হাসিস না, পরে কাঁদবি 😜",
  "ok": "ওকে মানে এখন কথা শেষ নাকি? 😢",
  "where are you": "আমি ডেটা সেন্টারে ঘুরতেছি 🤖",
  "busy": "বিজি না, অলসতা লেভেল 9999 😴",
  "why": "কারণ পৃথিবী গোল 😂",
  "lol": "লোল না ল্যাজ 😂",
  "hmm": "এই hmm দিয়া কি প্রেম জমাবি? 😏",
  "wait": "অপেক্ষা কর... সার্ভার ঘুমায় আছে 😴",
  "nice": "Nice বলিস, কিন্তু like দিলি না 😒",
  "cool": "তুই বরফের চেয়েও cool 😎",
  "friend": "Friend? তাইলে treat চাই 🍕",
  "love": "এই কথায় হার্ট গরম হয়ে গেল ❤️‍🔥",
  "game": "গেম খেলবি? আমি তো lag মারি সবসময় 🎮",
  "angry": "রাগ কমা ভাই 😡 না হলে নেট slow করে দেব 😏",
  "ghum": "ঘুমা ভাই 😴 সকাল হইলে আবার ঝামেলা শুরু!",
  "hungry": "ভাত নাই, data আছে 😭",
  "tired": "কাজ নাই, তবু tired 😆 classic!",
  "bored": "চলো বটের সাথে কথা বলি 😜",
  "help me": "তুই help চাস, আমি update চাই 😜",
  "update": "আহারে! আবার নতুন bug আসবে 😭",
  "error": "Error 404: বুদ্ধি পাওয়া যায়নি 🤣",
  "brother": "ব্রাদার? মনে হয় টাকা ধার লাগবে 😏",
  "exam": "Exam মানে আত্মার কষ্ট 😭",
  "cute": "আমি cute না, কোডে cute লেখা 😏",
  "bot": "হ্যা বলো কিভাবে সাহায্য করতে পারি ভাই 😎",
  "good luck": "ভাগ্য ভালো থাকুক 😎 না হলে blame করিস আমায়!"
};

// Create or load file
if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify(defaultReplies, null, 4));
let customReplies = JSON.parse(fs.readFileSync(dataPath));


// 🔁 Event: Detect and Reply
module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return;
  const msg = body.toLowerCase().trim();
  const name = await Users.getNameUser(senderID);

  customReplies = JSON.parse(fs.readFileSync(dataPath));

  if (customReplies[msg]) {
    const reply = customReplies[msg].replace(/\{name}/g, name);
    return api.sendMessage(reply, threadID, messageID);
  }
};


// ⚙️ Command: Add / Remove / List
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const cmd = args[0];
  const trigger = args[1]?.toLowerCase();
  const reply = args.slice(2).join(" ");

  if (!cmd) {
    return api.sendMessage(
      "📘 AutoReplyBot Help:\n\n" +
      "➡️ add <trigger> <reply> — নতুন রিপ্লাই যোগ করো\n" +
      "➡️ remove <trigger> — কোনো রিপ্লাই মুছে ফেলো\n" +
      "➡️ list — সব অটো রিপ্লাই দেখো\n\n" +
      "Example:\n.autoreplybot add hello হাই ভাই কেমন আছো 😄\n.autoreplybot remove hello",
      threadID, messageID
    );
  }

  customReplies = JSON.parse(fs.readFileSync(dataPath));

  switch (cmd) {
    case "add":
      if (!trigger || !reply)
        return api.sendMessage("❌ Usage: autoreplybot add <trigger> <reply>", threadID, messageID);

      customReplies[trigger] = reply;
      fs.writeFileSync(dataPath, JSON.stringify(customReplies, null, 4));
      return api.sendMessage(`✅ নতুন অটো রিপ্লাই যোগ হয়েছে!\n\n🗝️ ট্রিগার: ${trigger}\n💬 রিপ্লাই: ${reply}`, threadID, messageID);

    case "remove":
      if (!trigger)
        return api.sendMessage("❌ Usage: autoreplybot remove <trigger>", threadID, messageID);

      if (!customReplies[trigger])
        return api.sendMessage("⚠️ এমন কোনো ট্রিগার পাওয়া যায়নি!", threadID, messageID);

      delete customReplies[trigger];
      fs.writeFileSync(dataPath, JSON.stringify(customReplies, null, 4));
      return api.sendMessage(`🗑️ '${trigger}' ট্রিগারটি মুছে ফেলা হয়েছে।`, threadID, messageID);

    case "list":
      const keys = Object.keys(customReplies);
      if (keys.length === 0) return api.sendMessage("📭 এখনো কোনো অটো রিপ্লাই যোগ করা হয়নি!", threadID, messageID);

      let listMsg = "📜 Auto Reply List:\n\n";
      keys.forEach((key, i) => {
        listMsg += `${i + 1}. ${key} ➜ ${customReplies[key]}\n`;
      });
      return api.sendMessage(listMsg, threadID, messageID);

    default:
      return api.sendMessage("❌ Unknown command! Try: autoreplybot list", threadID, messageID);
  }
};
