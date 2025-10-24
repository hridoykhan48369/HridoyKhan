/**
 * god.js (Upgraded Version)
 * Logs bot activity and notifies admin.
 * Bot: 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞
 * Credit: Hridoy Hossen
 */

module.exports.config = {
  name: "god",
  eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
  version: "1.1.0",
  credits: "Hridoy Hossen",
  description: "Record and report bot activity notifications to admin",
  envConfig: {
    enable: true
  }
};

module.exports.run = async function ({ api, event, Threads }) {
  const logger = require("../../utils/log");
  const config = global.configModule[this.config.name] || {};
  if (!config.enable) return;

  let task = "";
  const { threadID, author, logMessageType, logMessageData } = event;

  switch (logMessageType) {
    case "log:thread-name": {
      const oldName = (await Threads.getData(threadID)).name || "Unknown";
      const newName = logMessageData.name || "Unknown";
      task = `🌀 Group name changed:\n• From: “${oldName}”\n• To: “${newName}”`;
      await Threads.setData(threadID, { name: newName });
      break;
    }

    case "log:subscribe": {
      if (logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        task = "🤖 The bot was added to a new group!";
      }
      break;
    }

    case "log:unsubscribe": {
      if (logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
        task = "⚠️ The bot was removed (kicked) from a group!";
      }
      break;
    }

    default:
      break;
  }

  if (!task) return;

  const formReport =
`=== ⚙️ 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞 Activity Log ===

📌 Thread ID: ${threadID}
👤 Action by: ${author}
🪶 Action: ${task}
🕒 Time: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })}

━━━━━━━━━━━━━━━━━━━`;

  // এখানে তোমার নিজস্ব অ্যাডমিন UID বসাও 👇
  const god = "100048786044500"; // Hridoy Hossen’s admin ID

  try {
    await api.sendMessage(formReport, god);
  } catch (error) {
    logger(formReport, "[ Logging Event ]");
  }
};
