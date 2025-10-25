module.exports.config = {
  name: "arrest",
  version: "2.1.1",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Arrest a friend you mention",
  commandCategory: "tagfun",
  usages: "[mention]",
  cooldowns: 2,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dirMaterial = resolve(__dirname, 'cache', 'canvas');

  if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });

  const templatePath = resolve(dirMaterial, 'batgiam.png');
  const fallbackAvatar = resolve(dirMaterial, 'default_avatar.png');

  // Download template if missing
  if (!existsSync(templatePath)) {
    try {
      await downloadFile("https://i.imgur.com/ep1gG3r.png", templatePath);
    } catch (e) {
      console.error("Failed to download template batgiam.png:", e);
    }
  }

  // Download fallback avatar if missing
  if (!existsSync(fallbackAvatar)) {
    try {
      await downloadFile("https://i.imgur.com/u7b9H4F.png", fallbackAvatar);
    } catch (e) {
      console.error("Failed to download default_avatar.png:", e);
    }
  }
};

const circleImageBuffer = async (buffer) => {
  const jimp = global.nodemodule["jimp"];
  const image = await jimp.read(buffer);
  image.circle();
  return await image.getBufferAsync("image/png");
};

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];

  const root = path.resolve(__dirname, "cache", "canvas");
  const templatePath = path.join(root, "batgiam.png");
  const fallbackAvatar = path.join(root, "default_avatar.png");

  // ensure template exists
  if (!fs.existsSync(templatePath)) throw new Error("Template image not found.");
  if (!fs.existsSync(fallbackAvatar)) {
    // create a small blank fallback if download failed
    const blank = await jimp.create(128, 128, 0xffffffff);
    await blank.writeAsync(fallbackAvatar);
  }

  const baseImg = await jimp.read(templatePath);

  const randomID = Date.now() + "_" + Math.floor(Math.random() * 1000);
  const outPath = path.join(root, `arrest_${randomID}.png`);

  const avatarOnePath = path.join(root, `avt_${one}_${randomID}.png`);
  const avatarTwoPath = path.join(root, `avt_${two}_${randomID}.png`);

  const avatarUrlOne = `https://graph.facebook.com/${one}/picture?width=512&height=512`;
  const avatarUrlTwo = `https://graph.facebook.com/${two}/picture?width=512&height=512`;

  // download avatars (tokenless public endpoints)
  try {
    const res1 = await axios.get(avatarUrlOne, { responseType: "arraybuffer" });
    fs.writeFileSync(avatarOnePath, Buffer.from(res1.data, "binary"));
  } catch (e) {
    fs.copyFileSync(fallbackAvatar, avatarOnePath);
  }

  try {
    const res2 = await axios.get(avatarUrlTwo, { responseType: "arraybuffer" });
    fs.writeFileSync(avatarTwoPath, Buffer.from(res2.data, "binary"));
  } catch (e) {
    fs.copyFileSync(fallbackAvatar, avatarTwoPath);
  }

  // make circular buffers
  const bufOne = await fs.readFile(avatarOnePath);
  const bufTwo = await fs.readFile(avatarTwoPath);
  const circOneBuf = await circleImageBuffer(bufOne);
  const circTwoBuf = await circleImageBuffer(bufTwo);

  const circOne = await jimp.read(circOneBuf);
  const circTwo = await jimp.read(circTwoBuf);

  // resize template and avatars as required by original design
  baseImg.resize(500, 500);
  circOne.resize(100, 100);
  circTwo.resize(100, 100);

  // composite avatars onto template (positions kept from original)
  baseImg.composite(circOne, 375, 9);   // adjust positions if you want
  baseImg.composite(circTwo, 160, 92);

  const raw = await baseImg.getBufferAsync("image/png");
  fs.writeFileSync(outPath, raw);

  // cleanup temp avatars
  try { fs.unlinkSync(avatarOnePath); } catch (e) {}
  try { fs.unlinkSync(avatarTwoPath); } catch (e) {}

  return outPath;
}

module.exports.run = async function ({ event, api }) {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;

  try {
    if (!event.mentions || Object.keys(event.mentions).length === 0) {
      return api.sendMessage("এক জনকে ট্যাগ করা লাগবে 🌝\nUsage: tag someone and run the command.", threadID, messageID);
    }

    // take first mentioned (ignore bot itself if mentioned)
    const mentions = Object.keys(event.mentions).map(id => id);
    const botID = api.getCurrentUserID();
    let target = mentions.find(id => id != botID) || mentions[0];

    // get display name for message mention text (fallback to id)
    let tagName = target;
    try {
      const userInfo = await api.getUserInfo(target);
      tagName = userInfo[target] && userInfo[target].name ? userInfo[target].name : target;
    } catch (err) {
      // ignore, keep id as name
    }

    const pathImg = await makeImage({ one: senderID, two: target });

    const msgBody = `হালা মুরগী চোর — হাতে নাতে ধরছি! 😹🕵️‍♂️\n=> ${tagName}`;
    const mentionsArr = [{ tag: tagName, id: target }];

    await api.sendMessage({
      body: msgBody,
      mentions: mentionsArr,
      attachment: fs.createReadStream(pathImg)
    }, threadID, () => {
      try { fs.unlinkSync(pathImg); } catch (e) {}
    }, messageID);

  } catch (error) {
    console.error("Error in arrest command:", error);
    return api.sendMessage("দুঃখিত, ছবিটি তৈরিতে সমস্যা হয়েছে। পরে চেষ্টা করুন।", threadID, messageID);
  }
};