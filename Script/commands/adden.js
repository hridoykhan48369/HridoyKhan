const fs = require("fs-extra");
const axios = require("axios");
const Canvas = require("canvas");

module.exports.config = {
  name: "adden",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Write text on white brother image",
  commandCategory: "Edit-IMG",
  usages: "[text1] | [text2]",
  cooldowns: 10
};

// Word wrap helper
module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    const words = text.split(" ");
    const lines = [];
    let line = "";

    while (words.length > 0) {
      let testLine = line + words[0] + " ";
      if (ctx.measureText(testLine).width > maxWidth) {
        lines.push(line.trim());
        line = "";
      } else {
        line = testLine;
        words.shift();
      }
    }
    lines.push(line.trim());
    resolve(lines);
  });
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args[0])
    return api.sendMessage(
      "📌 ব্যবহারঃ adden [text1] | [text2]\nউদাহরণ:\nadden আমার নাম | হৃদয় হোসেন",
      threadID,
      messageID
    );

  const text = args.join(" ")
    .replace(/\s+/g, " ")
    .replace(/(\s+\|)/g, "|")
    .replace(/\|\s+/g, "|")
    .split("|");

  const text1 = text[0] || "Empty";
  const text2 = text[1] || "Empty";

  const imgPath = __dirname + "/cache/adden.png";
  const fontPath = __dirname + "/cache/SVN-Arial.ttf";

  try {
    // Load background image
    const bg = await axios.get("https://i.imgur.com/2ggq8wM.png", { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(bg.data, "utf-8"));

    // Load font if not exists
    if (!fs.existsSync(fontPath)) {
      const fontFile = await axios.get("https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download", { responseType: "arraybuffer" });
      fs.writeFileSync(fontPath, Buffer.from(fontFile.data, "utf-8"));
    }

    Canvas.registerFont(fontPath, { family: "SVN-Arial" });

    const baseImage = await Canvas.loadImage(imgPath);
    const canvas = Canvas.createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.font = "30px SVN-Arial";
    ctx.fillStyle = "#000077";
    ctx.textAlign = "center";

    const line1 = await this.wrapText(ctx, text1, 464);
    const line2 = await this.wrapText(ctx, text2, 464);

    ctx.fillText(line1.join("\n"), 170, 129);
    ctx.fillText(line2.join("\n"), 170, 440);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(imgPath, imageBuffer);

    return api.sendMessage(
      { body: "✅ তোমার ইমেজ তৈরি হয়ে গেছে!", attachment: fs.createReadStream(imgPath) },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );
  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ কোনো সমস্যা হয়েছে, আবার চেষ্টা করো!", threadID, messageID);
  }
};