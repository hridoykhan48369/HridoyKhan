module.exports.config = {
  name: "antijoin",
  version: "1.1.0",
  hasPermssion: 1,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐁𝐎𝐓 💫 (Modified from CYBER TEAM)",
  description: "Enable or disable anti-join (auto remove new members)",
  commandCategory: "System",
  usages: "antijoin on/off",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, Threads }) {
  try {
    const threadID = event.threadID;
    const info = await api.getThreadInfo(threadID);

    // Bot admin check
    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) {
      return api.sendMessage(
        "⚠️ | I need to be an admin in this group to toggle Anti-Join settings!",
        threadID,
        event.messageID
      );
    }

    const threadData = (await Threads.getData(threadID)).data || {};
    if (typeof threadData.antiJoin === "undefined" || threadData.antiJoin === false) {
      threadData.antiJoin = true;
    } else {
      threadData.antiJoin = false;
    }

    await Threads.setData(threadID, { data: threadData });
    global.data.threadData.set(parseInt(threadID), threadData);

    return api.sendMessage(
      `🛡️ | Anti-Join system is now ${(threadData.antiJoin ? "✅ ON" : "❌ OFF")}\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `📌 When ON → New members joining the group will be automatically removed.`,
      threadID,
      event.messageID
    );

  } catch (error) {
    console.error(error);
    return api.sendMessage(
      "❌ | An error occurred while toggling Anti-Join mode.",
      event.threadID,
      event.messageID
    );
  }
};