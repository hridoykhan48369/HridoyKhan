/**
 * leave.js
 * Goodbye Message System (Updated by Hridoy Hossen)
 * Bot: 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞
 */

module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.1.0",
  credits: "Hridoy Hossen",
  description: "Send farewell message when someone leaves the group",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function({ api, event, Users, Threads }) {
  const fs = require("fs");
  const path = require("path");
  const { threadID } = event;

  // Ignore if bot itself leaves
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  // Thread & user info
  const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) 
    || await Users.getNameUser(event.logMessageData.leftParticipantFbId);

  // Message type
  const type = (event.author == event.logMessageData.leftParticipantFbId)
    ? "😡 সাহস তো কম না! গ্রুপের এডমিনের পারমিশন ছাড়া তুই লিভ নিস 🤬\n\n✦─────꯭─⃝‌‌𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞────✦"
    : "😠 তোমার এই গ্রুপে থাকার যোগ্যতা শেষ! লাথি মেরে বের করে দেওয়া হলো 😹\n\n✦─────꯭─⃝‌‌𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞────✦";

  // Path for GIF/Photo
  const leaveFolder = path.join(__dirname, "cache", "leaveGif");
  const gifPath = path.join(leaveFolder, "leave1.gif");

  if (!fs.existsSync(leaveFolder)) fs.mkdirSync(leaveFolder, { recursive: true });

  // Default message template
  let msg = (typeof data.customLeave === "undefined")
    ? "ইস! {name}...\n{type}"
    : data.customLeave;

  msg = msg.replace(/\{name}/g, name).replace(/\{type}/g, type);

  // Send message with or without attachment
  const messageForm = fs.existsSync(gifPath)
    ? { body: msg, attachment: fs.createReadStream(gifPath) }
    : { body: msg };

  return api.sendMessage(messageForm, threadID);
};
