module.exports.config = {
 name: "art",
 version: "2.0.0",
 hasPermssion: 0,
 credits: "Hridoy Hossen",
 description: "Apply different AI art styles (anime, cartoon, sketch, oil, cyberpunk)",
 commandCategory: "editing",
 usages: "reply to an image + style name (anime/cartoon/sketch/oil/cyberpunk)",
 cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
 const axios = require('axios');
 const fs = require('fs-extra');
 const FormData = require('form-data');
 const path = __dirname + `/cache/artify.jpg`;

 const { messageReply, threadID, messageID } = event;

 if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
   return api.sendMessage("❌ অনুগ্রহ করে একটি ছবির রিপ্লাই দিন।", threadID, messageID);
 }

 const url = messageReply.attachments[0].url;
 const style = args[0]?.toLowerCase() || "anime";
 const validStyles = ["anime", "cartoon", "sketch", "oil", "cyberpunk"];

 if (!validStyles.includes(style)) {
   return api.sendMessage(
     `⚠️ অবৈধ স্টাইল! ব্যবহার করুন: ${validStyles.join(", ")}`,
     threadID,
     messageID
   );
 }

 try {
   // ডাউনলোড করে লোকাল সেভ
   const response = await axios.get(url, { responseType: "arraybuffer" });
   fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));

   // ফর্ম ডেটা তৈরি করে API তে পাঠানো
   const form = new FormData();
   form.append("image", fs.createReadStream(path));

   const apiRes = await axios.post(
     `https://art-api-97wn.onrender.com/artify?style=${style}`,
     form,
     { headers: form.getHeaders(), responseType: "arraybuffer" }
   );

   // রেসপন্স সেভ করে পাঠানো
   fs.writeFileSync(path, apiRes.data);

   api.sendMessage({
     body: `✅ সফলভাবে "${style}" আর্ট স্টাইলে রূপান্তর করা হয়েছে!`,
     attachment: fs.createReadStream(path)
   }, threadID, () => fs.unlinkSync(path), messageID);

 } catch (err) {
   console.error(err);
   api.sendMessage("❌ কিছু ভুল হয়েছে। আবার চেষ্টা করুন।", threadID, messageID);
 }
};