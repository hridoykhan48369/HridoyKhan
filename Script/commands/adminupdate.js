module.exports.config = {
  name: "adminupdate",
  version: "1.1.0",
  credits: "Hridoy Hossen (Improved by Islamick Cyber Chat)",
  hasPermission: 2,
  description: "Toggle group information update notifications",
  usages: "",
  commandCategory: "Admin",
  cooldowns: 0
};

module.exports.languages = {
  "vi": {
    "on": "Bật",
    "off": "Tắt",
    "successText": "thành công gửi tin nhắn cập nhật thông tin nhóm!"
  },
  "en": {
    "on": "✅ Turned ON",
    "off": "❌ Turned OFF",
    "successText": "group info update notifications."
  },
  "bn": {
    "on": "✅ চালু করা হয়েছে",
    "off": "❌ বন্ধ করা হয়েছে",
    "successText": "গ্রুপ ইনফো আপডেট নোটিফিকেশন!"
  }
};

module.exports.run = async ({ api, event, Threads, getText }) => {
  let data = (await Threads.getData(event.threadID)).data || {};

  // toggle the mode
  if (typeof data["adminUpdate"] == "undefined" || data["adminUpdate"] == false)
    data["adminUpdate"] = true;
  else
    data["adminUpdate"] = false;

  await Threads.setData(event.threadID, { data });
  global.data.threadData.set(parseInt(event.threadID), data);

  // auto language detect (if not set, fallback to English)
  const lang = global.config.language || "en";
  const text = getText(lang === "bn" ? "bn" : lang);

  return api.sendMessage(
    `${(data["adminUpdate"] == false) ? getText("off") : getText("on")} ${getText("successText")}`,
    event.threadID
  );
};