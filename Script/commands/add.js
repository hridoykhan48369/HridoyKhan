const axios = require('axios');

module.exports.config = {
  name: "add",
  version: "1.1.0",
  hasPermission: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Reply করে পাঠানো ভিডিও/ছবি ডাটাবেসে সংরক্ষণ করো",
  commandCategory: "Media",
  usages: "[video name] (reply a video or image)",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  try {
    // ========================
    // Validation Checks
    // ========================
    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return api.sendMessage("⚠️ দয়া করে কোনো ভিডিও বা ছবি reply করে এই কমান্ড দাও!", event.threadID, event.messageID);
    }

    const attachment = event.messageReply.attachments[0];
    if (attachment.type !== "video" && attachment.type !== "photo") {
      return api.sendMessage("❌ শুধু ভিডিও বা ছবি reply করতে হবে!", event.threadID, event.messageID);
    }

    const videoName = args.join(" ").trim();
    if (!videoName) {
      return api.sendMessage("📌 দয়া করে ভিডিওর জন্য একটা নাম লিখো!\n\nউদাহরণ:\nadd আমার প্রিয় ভিডিও", event.threadID, event.messageID);
    }

    // ========================
    // Step 1: Get upload API
    // ========================
    const apiList = await axios.get("https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json");
    const imgurApi = apiList.data.imgur;
    const mainApi = apiList.data.api;

    // ========================
    // Step 2: Upload to Imgur
    // ========================
    const imageUrl = attachment.url;
    const uploadResponse = await axios.get(`${imgurApi}/imgur?link=${encodeURIComponent(imageUrl)}`);
    const uploadedUrl = uploadResponse.data.uploaded.image;

    // ========================
    // Step 3: Save to database via API
    // ========================
    const saveResponse = await axios.get(`${mainApi}/video/random?name=${encodeURIComponent(videoName)}&url=${encodeURIComponent(uploadedUrl)}`);
    const { name, url } = saveResponse.data;

    // ========================
    // Step 4: Confirmation Message
    // ========================
    api.sendMessage(
`✅ ভিডিও সফলভাবে সংরক্ষিত হয়েছে!

📁 নাম: ${name}
🔗 লিংক: ${url}
🧩 আপলোডার: ${event.senderID}

ধন্যবাদ ─꯭─⃝‌‌𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞 ব্যবহার করার জন্য 💫`,
      event.threadID,
      event.messageID
    );

  } catch (err) {
    console.error(err);
    api.sendMessage(`❌ কোনো সমস্যা হয়েছে!\nত্রুটি: ${err.message}`, event.threadID, event.messageID);
  }
};