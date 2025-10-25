const axios = require("axios");

module.exports.config = {
  name: "adduser",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Add user to the group using Facebook link or UID",
  commandCategory: "group",
  usages: "[fb link or uid]",
  cooldowns: 5,
};

async function getUID(link) {
  try {
    // Extract ID if numeric
    if (/^\d+$/.test(link)) return link;

    // Extract username from link
    const match = link.match(/(?:facebook\.com\/|fb\.com\/)([^/?]+)/);
    if (!match) return null;

    const username = match[1];
    const res = await axios.get(`https://api.samirxpikachu.repl.co/info?username=${username}`);
    if (res.data.id) return res.data.id;
    return null;
  } catch {
    return null;
  }
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const out = (msg) => api.sendMessage(msg, threadID, messageID);

  if (!args[0])
    return out("📌 ব্যবহার: adduser [fb link বা uid]\n\nউদাহরণ: adduser https://facebook.com/100048786044500");

  const input = args[0];
  const id = await getUID(input);

  if (!id) return out("❌ এই লিংক বা আইডি থেকে ইউজার খুঁজে পাওয়া যায়নি!");

  const info = await api.getThreadInfo(threadID);
  const participantIDs = info.participantIDs.map((e) => parseInt(e));
  const admins = info.adminIDs.map((e) => parseInt(e.id));
  const botID = parseInt(api.getCurrentUserID());

  // Already in group
  if (participantIDs.includes(parseInt(id))) {
    return out("⚠️ এই ইউজার ইতিমধ্যেই গ্রুপে আছে!");
  }

  try {
    await api.addUserToGroup(parseInt(id), threadID);

    if (info.approvalMode && !admins.includes(botID)) {
      return out("✅ ইউজারকে 'approval list'-এ যোগ করা হয়েছে (গ্রুপে অ্যাড করতে admin অনুমতি লাগবে)।");
    } else {
      return out("🎉 সফলভাবে ইউজারকে গ্রুপে যোগ করা হয়েছে!");
    }
  } catch (err) {
    return out("❌ অ্যাড করা সম্ভব হয়নি। হতে পারে ইউজারের প্রাইভেসি সেটিং বন্ধ আছে।");
  }
};