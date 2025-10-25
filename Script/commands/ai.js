const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    version: "1.0.0",
    credit: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    description: "Chat with Gemini AI (text & image supported)",
    commandCategory: "ai",
    usages: "ai [your question] | reply to an image",
    cooldowns: 5,
    hasPermssion: 0
  },

  run: async function ({ api, event, args }) {
    const prompt = args.join(" ");
    const text_only_url = "https://gemini-api-v1.onrender.com/google/text_only";
    const text_and_image_url = "https://gemini-api-v1.onrender.com/google/text_and_image";

    // If no prompt
    if (!prompt && !event.messageReply) {
      return api.sendMessage(
        "Assalamu Alaikum 🌸\nPlease ask something for Gemini AI to answer!",
        event.threadID,
        event.messageID
      );
    }

    try {
      // If user replied to an image
      if (event.type === "message_reply" && event.messageReply.attachments[0]?.type === "photo") {
        const imageUrl = event.messageReply.attachments[0].url;
        const res = await axios.post(text_and_image_url, {
          modelType: "mini-pro-3r",
          prompt: prompt || "Describe this image in detail.",
          imageParts: [imageUrl]
        });

        return api.sendMessage(
          res.data.result || "No response from AI.",
          event.threadID,
          event.messageID
        );
      }

      // Text only query
      else {
        const res = await axios.post(text_only_url, {
          modelType: "minipro-3r",
          prompt
        });

        return api.sendMessage(
          res.data.result || "AI didn’t respond properly.",
          event.threadID,
          event.messageID
        );
      }
    } catch (error) {
      console.error("AI Error:", error.message);
      return api.sendMessage("⚠️ Error: Gemini AI request failed!", event.threadID, event.messageID);
    }
  }
};