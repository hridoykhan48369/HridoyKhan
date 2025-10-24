/**
 * antiout.js (Final Version)
 * Re-adds members who leave the group automatically.
 * Credit: Hridoy Hossen
 * Bot Name: 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞
 */

module.exports.config = {
  name: "antiout",
  eventType: ["log:unsubscribe"],
  version: "1.0.2",
  credits: "Hridoy Hossen",
  description: "Automatically re-adds members who leave the group"
};

module.exports.run = async ({ event, api, Threads, Users }) => {
  try {
    const threadID = event.threadID;
    const leftID = event.logMessageData.leftParticipantFbId;

    // thread data check
    const data = (await Threads.getData(threadID)).data || {};
    if (data.antiout === false) return;

    // যদি বট নিজে না হয়
    if (leftID == api.getCurrentUserID()) return;

    const userName =
      global.data.userName.get(leftID) || (await Users.getNameUser(leftID));

    const isSelfLeave = event.author === leftID;

    if (isSelfLeave) {
      // user নিজে থেকে লিভ দিয়েছে
      api.addUserToGroup(leftID, threadID, (err) => {
        if (err) {
          return api.sendMessage(
            `❌ সরি বস, ${userName} কে আবার এড করা গেল না!\nসম্ভবত উনি আমাকে ব্লক করেছে অথবা তার প্রাইভেসি সেটিংসের কারণে এড করা যাচ্ছে না।\n\n─⟢ 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞 ⟣`,
            threadID
          );
        } else {
          return api.sendMessage(
            `😎 ${userName}, শোন!\nএই গ্রুপ হইলো গ্যাং, এখান থেকে পারমিশন ছাড়া লিভ নেওয়া যায় না!\nতুই পালাইতে গেছিলি — কিন্তু আমি আবার তোকে 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞 স্টাইলে ফিরায় আনছি 🔥\n\n─⟢ 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞 ⟣`,
            threadID
          );
        }
      });
    } else {
      // অন্য কেউ কিক দিয়েছে
      api.sendMessage(
        `⚠️ ${userName} কে গ্রুপ থেকে বের করে দেওয়া হয়েছে।\nযদি ভুলবশত হয়, তাহলে অ্যাডমিন আবার এড করে দেবে।\n\n─⟢ 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞 ⟣`,
        threadID
      );
    }
  } catch (err) {
    console.error("antiout error:", err);
  }
};
