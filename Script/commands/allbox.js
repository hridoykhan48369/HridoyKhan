const moment = require("moment-timezone");

module.exports.config = {
  name: "allbox",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐁𝐎𝐓 💫 (Rebuilt by Sahu)",
  description: "সকল গ্রুপের লিস্ট দেখো এবং Ban/Unban/Delete/Out করো",
  commandCategory: "Admin",
  usages: "[page/all]",
  cooldowns: 5
};

// 🧩 Handle reply (Ban / Unban / Delete / Out)
module.exports.handleReply = async function ({ api, event, Threads, handleReply }) {
  const { threadID, messageID, senderID, body } = event;
  if (parseInt(senderID) !== parseInt(handleReply.author)) return;
  const action = body.split(" ")[0].toLowerCase();
  const index = parseInt(body.split(" ")[1]) - 1;
  const idgr = handleReply.groupid[index];
  const groupName = handleReply.groupName[index];
  const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss");

  if (!idgr) return api.sendMessage("⚠️ সঠিক নাম্বার দাও!", threadID, messageID);

  const data = (await Threads.getData(idgr)).data || {};

  switch (action) {
    case "ban":
      data.banned = 1;
      data.dateAdded = time;
      await Threads.setData(idgr, { data });
      global.data.threadBanned.set(idgr, { dateAdded: time });
      api.sendMessage(`🚫 গ্রুপটি ব্যান করা হয়েছে!\n\n🔷 নাম: ${groupName}\n🆔 ID: ${idgr}\n⏰ সময়: ${time}`, threadID);
      break;

    case "unban":
    case "ub":
      data.banned = 0;
      data.dateAdded = null;
      await Threads.setData(idgr, { data });
      global.data.threadBanned.delete(idgr);
      api.sendMessage(`✅ গ্রুপ আনব্যান করা হয়েছে!\n\n🔷 নাম: ${groupName}\n🆔 ID: ${idgr}`, threadID);
      break;

    case "del":
      await Threads.delData(idgr);
      api.sendMessage(`🗑️ ${groupName}\n🆔 ${idgr}\nডাটাবেস থেকে মুছে ফেলা হয়েছে ✅`, threadID);
      break;

    case "out":
      api.sendMessage(`🚪 ${groupName}\nথেকে বটকে রিমুভ করা হয়েছে!`, idgr, () => {
        api.removeUserFromGroup(api.getCurrentUserID(), idgr);
      });
      break;

    default:
      api.sendMessage("⚠️ শুধু ban / unban / del / out ব্যবহার করো।", threadID, messageID);
      break;
  }
};

// 🧠 Main command
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const page = parseInt(args[0]) || 1;
  const limit = 20;

  let threads;
  try {
    threads = await api.getThreadList(200, null, ["INBOX"]);
  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ থ্রেড লিস্ট আনতে সমস্যা হয়েছে।", threadID);
  }

  const groupThreads = threads.filter(t => t.isGroup);
  const totalPages = Math.ceil(groupThreads.length / limit);

  if (args[0] === "all") {
    const list = groupThreads.map((g, i) =>
      `${i + 1}. ${g.name}\n🔰 ID: ${g.threadID}\n💌 মেসেজ: ${g.messageCount}`
    );
    return api.sendMessage(`📋 মোট গ্রুপ: ${groupThreads.length}\n\n${list.join("\n\n")}`, threadID);
  }

  const start = (page - 1) * limit;
  const end = page * limit;
  const threadSlice = groupThreads.slice(start, end);

  let msg = `╔════════════════════╗\n║ 📜 গ্রুপ লিস্ট (পৃষ্ঠা ${page}/${totalPages})\n╠════════════════════╣\n`;
  const groupid = [], groupName = [];

  threadSlice.forEach((t, i) => {
    msg += `🔹 ${start + i + 1}. ${t.name}\n🆔 ${t.threadID}\n💌 মেসেজ: ${t.messageCount}\n\n`;
    groupid.push(t.threadID);
    groupName.push(t.name);
  });

  msg += "╚════════════════════╝\n\n💠 রিপ্লাই করে লেখো:\nban/unban/del/out <নাম্বার>";

  api.sendMessage(msg, threadID, (err, info) => {
    global.client.handleReply.push({
      name: module.exports.config.name,
      messageID: info.messageID,
      author: event.senderID,
      groupid,
      groupName,
      type: "reply"
    });
  });
};