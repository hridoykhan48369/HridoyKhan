/**
 * antijoin.js (Upgraded Stable Version)
 * Prevents new members from joining the group automatically.
 * Credit: Hridoy Hossen
 */

module.exports.config = {
  name: "antijoin",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "Hridoy Hossen",
  description: "Auto remove new members when Anti Join mode is enabled"
};

module.exports.run = async function ({ event, api, Threads, Users }) {
  try {
    const threadID = event.threadID;
    const data = (await Threads.getData(threadID)).data || {};

    // যদি anti join বন্ধ থাকে তাহলে return করবে
    if (data.newMember === false) return;

    // যদি বট নিজেই যোগ হয়, কিছু করবে না
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) return;

    // যদি anti join চালু থাকে
    if (data.newMember === true) {
      const memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId);

      for (let idUser of memJoin) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000)); // ছোট delay

          await api.removeUserFromGroup(idUser, threadID, async (err) => {
            if (err) {
              console.error(`❌ Failed to remove ${idUser}:`, err.message);
              data["newMember"] = false;
            } else {
              data["newMember"] = true;
              await Threads.setData(threadID, { data });
              global.data.threadData.set(threadID, data);
            }
          });
        } catch (err) {
          console.error("Error in removing user:", err);
        }
      }

      // নোটিফিকেশন পাঠানো
      return api.sendMessage(
        "🚫 Anti Join Mode Enabled!\n\n❯ নতুন সদস্যদের স্বয়ংক্রিয়ভাবে সরিয়ে দেওয়া হয়েছে।\n❯ নতুন কাউকে যুক্ত করতে হলে প্রথমে Anti Join বন্ধ করুন।",
        threadID
      );
    }
  } catch (err) {
    console.error("antijoin error:", err);
  }
};
