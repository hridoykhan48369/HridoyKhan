/** Don't change credits bro i will fix¯\_(ツ)_/¯ **/
module.exports.config = {
  name: "adultvideo",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Hridoy Hossen",
  description: "18+ VIDEOS",
  commandCategory: "video",
  usages: "18+ vedio",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event, args, client, Users, Threads, __GLOBAL, Currencies }) => {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  // নতুন ক্যাপশন
  var captions = ["এই নে এবার যা হেন্ডেল মেরে আয় 🙂"];
  var caption = captions[Math.floor(Math.random() * captions.length)];

  // নতুন লিংকগুলো
  var links = [
    "https://drive.google.com/uc?export=download&id=1HwwSrc1mEAoro7OWavt4y3PlhGztBHFs",
    "https://drive.google.com/uc?export=download&id=1l3UR18ui8d8k43Nb-_ErLsT3z4tjXxqA",
    "https://drive.google.com/uc?export=download&id=1TsgSPbd-O3ijNAW-If_vFA0ALoRgnxBg",
    "https://drive.google.com/uc?export=download&id=1zTm-r2Hx2VK4Ezz8lPERtfykl88rRUCe",
    "https://drive.google.com/uc?export=download&id=1E1xyi8JQ0RylJExoXUYTScW0-dRvCInR",
    "https://drive.google.com/uc?export=download&id=102W7-Aljyv8-7UklhIiQb80yiyUBUh7E",
    "https://drive.google.com/uc?export=download&id=1CVZFXW3g_FFPLKae1kFZfvO6hyxEjE0R",
    "https://drive.google.com/uc?export=download&id=1_fj6EOKG0Sebc5flQB2EvZ-mQedMw4Mz",
    "https://drive.google.com/uc?export=download&id=1Dsgrmdtcg8xrj0CYfkFDkTDhNIaDqOAj",
    "https://drive.google.com/uc?export=download&id=15J_lqRQruFJ9qptuwLKulsCY40u60wvR",
    "https://drive.google.com/uc?export=download&id=10LNoRAnBUotBGrk0WTfuYx8VKqg9Qhl_",
    "https://drive.google.com/uc?export=download&id=1drlQu_NQMqY1_xlajKL8mUM2U8EqujjZ",
    "https://drive.google.com/uc?export=download&id=1URQo6p2X8IXMTp-wO_yZmSR3PyjMdqxZ",
    "https://drive.google.com/uc?export=download&id=1aqxrgu85WM3sFbo3WKKGO_GwBxiA3Kvk",
    "https://drive.google.com/uc?export=download&id=1jfUnb_hSlHXo_a89XKMscufbyzCtsh0d",
    "https://drive.google.com/uc?export=download&id=1PX3jAxEptKp0w1_h75nLVz7vAzaLoXgo",
    "https://drive.google.com/uc?export=download&id=14IsSKFyw-ew6zGbN7vlJrwlfjGRzbc4l",
    "https://drive.google.com/uc?export=download&id=1w4YkPRLBzmxsvE8ofXVHXxot6gFmmLGO",
    "https://drive.google.com/uc?export=download&id=1nYGX-8pwevs29RCFJzSR7Jph6ubXTncJ",
    "https://drive.google.com/uc?export=download&id=1yKCZjaDuDj6TGBsaFLqpRd2MCJqy7vJ_",
    "https://drive.google.com/uc?export=download&id=1JFdWC5ShMsO34RCMsloJ_Ft4m6bBfZI4",
    "https://drive.google.com/uc?export=download&id=1dbrhuDPUcmq-uEK1vj6q1SxjV_KEqG3E",
    "https://drive.google.com/uc?export=download&id=16MGTioC2czkjENEAkEUtBD4Q8ycfDn8c"
  ];

  // ভিডিও ফাইল ডাউনলোড ও সেন্ড
  var callback = () => api.sendMessage(
    { body: `「 ${caption} 」`, attachment: fs.createReadStream(__dirname + "/cache/video.mp4") },
    event.threadID,
    () => fs.unlinkSync(__dirname + "/cache/video.mp4")
  );

  return request(encodeURI(links[Math.floor(Math.random() * links.length)]))
    .pipe(fs.createWriteStream(__dirname + "/cache/video.mp4"))
    .on("close", () => callback());
};
