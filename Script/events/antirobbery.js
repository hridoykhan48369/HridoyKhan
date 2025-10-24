/**
 * guard.js (Final Version)
 * Prevent unauthorized admin changes in group.
 * Credit: Hridoy Hossen
 * Bot Name: 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞
 */

module.exports.config = {
  name: "guard",
  eventType: ["log:thread-admins"],
  version: "1.1.0",
  credits: "Hridoy Hossen",
  description: "Prevents unauthorized admin add/remove actions",
};

module.exports.run = async function ({ event, api, Threads }) {
  try {
    const { logMessageType, logMessageData, author, threadID } = event;
    const data = (await Threads.getData(threadID)).data || {};
    const botID = api.getCurrentUserID();

    if (data.guard === false) return;

    if (logMessageType === "log:thread-admins") {
      const targetID = logMessageData.TARGET_ID;

      // Skip if bot itself or already safe
      if (author === botID || targetID === botID) return;

      // Handle add/remove admin events
      if (logMessageData.ADMIN_EVENT === "add_admin") {
        try {
          await api.changeAdminStatus(threadID, author, false);
          await api.changeAdminStatus(threadID, targetID, false);

          return api.sendMessage(
            `⚔️ [GUARD MODE ACTIVE]\n\n❯ Unauthorized admin addition detected.\n❯ ${author} tried to add ${targetID} as admin.\n\nAction reverted successfully ✅\n\n─⟢ 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞 ⟣`,
            threadID
          );
        } catch (err) {
          return api.sendMessage(
            `⚠️ ${author} — তুই আবার এডমিন বানাতে গেছিস! 😏\n\nকিন্তু আমি তো আছি, বস ❤️ **𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞** তোমার দুষ্টুমি ধরেছে 🔥`,
            threadID
          );
        }
      }

      if (logMessageData.ADMIN_EVENT === "remove_admin") {
        try {
          await api.changeAdminStatus(threadID, author, false);
          await api.changeAdminStatus(threadID, targetID, true);

          return api.sendMessage(
            `🛡️ [GUARD MODE]\n\n❯ Unauthorized admin removal detected.\n❯ ${author} tried to remove ${targetID}.\n\nReverted the change successfully 🔁\n\n─⟢ 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞 ⟣`,
            threadID
          );
        } catch (err) {
          return api.sendMessage(
            `😒 ${author}, তুমি বসের এডমিন সরাতে চাও? অসম্ভব!\n\n⚡ System Protected by 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞 💀`,
            threadID
          );
        }
      }
    }
  } catch (err) {
    console.error("guard error:", err);
  }
};
