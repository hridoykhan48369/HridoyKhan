const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "onlyadmin",
  version: "2.0.0",
  hasPermssion: 1,
  credits: "Hridoy Hossen",
  description: "Enable or disable admin-only mode in group",
  commandCategory: "Admin",
  usages: "[on/off]",
  cooldowns: 5
};

const dataPath = path.join(__dirname, "cache", "data.json");

// 🔧 ফাইল তৈরি
module.exports.onLoad = function () {
  if (!fs.existsSync(path.dirname(dataPath))) fs.mkdirSync(path.dirname(dataPath));
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({ adminbox: {} }, null, 2));
  }
};

// 🧠 কমান্ড চালু
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const threadInfo = await api.getThreadInfo(threadID);
  const adminIDs = threadInfo.adminIDs.map(a => a.id);

  // ✅ চেক করো user admin কি না
  if (!adminIDs.includes(senderID))
    return api.sendMessage("❌ শুধুমাত্র গ্রুপ অ্যাডমিনরাই এই কমান্ড ব্যবহার করতে পারবেন।", threadID, messageID);

  const data = JSON.parse(fs.readFileSync(dataPath));
  const current = data.adminbox[threadID] || false;

  // 🔄 টগল মোড
  if (current === true) {
    data.adminbox[threadID] = false;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return api.sendMessage("✅ Admin-only মোড বন্ধ করা হয়েছে — এখন সবাই বট ব্যবহার করতে পারবে।", threadID, messageID);
  } else {
    data.adminbox[threadID] = true;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return api.sendMessage("🔒 Admin-only মোড চালু করা হয়েছে — এখন শুধু অ্যাডমিনরাই বট ব্যবহার করতে পারবে।", threadID, messageID);
  }
};