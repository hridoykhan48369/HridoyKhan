/**
 * antibd.js (Upgraded Stable Version)
 * Prevent users from changing the bot's nickname.
 * Credit: Hridoy Hossen
 */

module.exports.config = {  
  name: "antibd",  
  eventType: ["log:user-nickname"],  
  version: "1.0.1",  
  credits: "Hridoy Hossen",  
  description: "Protects bot nickname from being changed by others"  
};  

module.exports.run = async function({ api, event, Users, Threads }) {  
  try {
    const { logMessageData, threadID, author } = event;  
    const botID = api.getCurrentUserID();  
    const { BOTNAME, ADMINBOT } = global.config;  

    // fallback if BOTNAME not set
    const defaultName = BOTNAME || "Hridoy Bot";

    // try to get nickname from Threads
    let botThreadData = await Threads.getData(threadID, botID);
    let nickname = botThreadData && botThreadData.nickname ? botThreadData.nickname : defaultName;

    // only act if bot nickname changed by non-admin
    if (
      logMessageData &&
      logMessageData.participant_id === botID &&
      author !== botID &&
      !(ADMINBOT && ADMINBOT.includes(author)) &&
      logMessageData.nickname !== nickname
    ) {
      // reset nickname
      await api.changeNickname(nickname, threadID, botID);

      // get user info safely
      let info;
      try {
        info = await Users.getData(author);
      } catch {
        info = { name: "Unknown User" };
      }

      const msg = `${info.name} 😹 — পাগল ছাগল! তুই নিকনেম চেঞ্জ করতে পারবি না!\n💬 শুধু আমার বস ❤️ হৃদয় ❤️ চেঞ্জ করতে পারবে 🖐`;

      await api.sendMessage({ body: msg }, threadID);
    }
  } catch (err) {
    console.error("antibd error:", err);
  }
};
