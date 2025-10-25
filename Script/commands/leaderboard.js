// leaderboard.js
module.exports.config = {
  name: "leaderboard",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Show top richest users",
  commandCategory: "economy",
  usages: "[count]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args, Users }) {
  const econ = require("./Economy.js");
  const { threadID, messageID } = event;
  const n = Math.max(1, Math.min(20, parseInt(args[0]) || 10));
  const top = await econ.getTop(n);
  if (!top.length) return api.sendMessage("No users found.", threadID, messageID);

  // fetch names
  const lines = [];
  for (let i = 0; i < top.length; i++) {
    const row = top[i];
    let name;
    try { name = await Users.getNameUser(row.id); } catch(e) { name = row.id; }
    lines.push(`${i+1}. ${name} — ${row.balance} 💰`);
  }
  api.sendMessage("🏆 Leaderboard:\n" + lines.join("\n"), threadID, messageID);
};
