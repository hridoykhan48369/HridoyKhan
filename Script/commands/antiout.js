module.exports.config = {
  name: "antiout",
  version: "1.1.0",
  hasPermssion: 1,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Enable or disable Anti-Leave (auto add back users who leave)",
  commandCategory: "System",
  usages: "antiout on/off",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, Threads }) {
  try {
    const threadID = event.threadID;
    const threadData = (await Threads.getData(threadID)).data || {};

    // Toggle antiout setting
    if (typeof threadData.antiout === "undefined" || threadData.antiout === false) {
      threadData.antiout = true;
    } else {
      threadData.antiout = false;
    }

    await Threads.setData(threadID, { data: threadData });
    global.data.threadData.set(parseInt(threadID), threadData);

    const status = threadData.antiout ? "🟢 ON" : "🔴 OFF";
    const message =
      `⚙️ | Anti-Leave system has been turned ${status}\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      (threadData.antiout
        ? `✅ When ON → If someone leaves the group, I’ll automatically add them back.`
        : `❎ When OFF → Users can leave freely without being re-added.`);

    return api.sendMessage(message, threadID, event.messageID);
  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ | Error while toggling Anti-Leave mode.", event.threadID, event.messageID);
  }
};