// Economy.js
const fs = global.nodemodule && global.nodemodule["fs-extra"] ? global.nodemodule["fs-extra"] : require("fs-extra");
const path = require("path");

const dbPath = path.resolve(__dirname, "cache", "economy.json");

async function ensureDB() {
  if (!fs.existsSync(path.resolve(__dirname, "cache"))) fs.mkdirSync(path.resolve(__dirname, "cache"), { recursive: true });
  if (!fs.existsSync(dbPath)) {
    const init = { users: {}, daily: {}, meta: { created: Date.now() } };
    fs.writeFileSync(dbPath, JSON.stringify(init, null, 2), "utf8");
  }
}

async function readDB() {
  await ensureDB();
  try {
    const raw = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    await ensureDB();
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
  }
}

async function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
}

// ----- exported API -----
module.exports = {
  // config for compatibility if loaded as command
  config: { name: "economy-core", credits: "system", hasPermssion: 0 },

  // get user's balance (0 if not present)
  async getBalance(userID) {
    const db = await readDB();
    return (db.users[userID] && typeof db.users[userID].balance === "number") ? db.users[userID].balance : 0;
  },

  async setBalance(userID, amount) {
    const db = await readDB();
    if (!db.users[userID]) db.users[userID] = { balance: 0 };
    db.users[userID].balance = Number(Math.floor(amount));
    await writeDB(db);
    return db.users[userID].balance;
  },

  async addMoney(userID, amount, reason = null) {
    if (isNaN(amount)) throw new Error("Amount must be number");
    const db = await readDB();
    if (!db.users[userID]) db.users[userID] = { balance: 0 };
    db.users[userID].balance = (Number(db.users[userID].balance) || 0) + Math.floor(Number(amount));
    // optional ledger
    if (!db.users[userID].ledger) db.users[userID].ledger = [];
    db.users[userID].ledger.push({ t: Date.now(), delta: Math.floor(Number(amount)), reason });
    await writeDB(db);
    return db.users[userID].balance;
  },

  async removeMoney(userID, amount, reason = null) {
    if (isNaN(amount)) throw new Error("Amount must be number");
    const db = await readDB();
    if (!db.users[userID]) db.users[userID] = { balance: 0 };
    db.users[userID].balance = (Number(db.users[userID].balance) || 0) - Math.floor(Number(amount));
    if (db.users[userID].balance < 0) db.users[userID].balance = 0;
    if (!db.users[userID].ledger) db.users[userID].ledger = [];
    db.users[userID].ledger.push({ t: Date.now(), delta: -Math.floor(Number(amount)), reason });
    await writeDB(db);
    return db.users[userID].balance;
  },

  async transfer(fromID, toID, amount) {
    amount = Math.floor(Number(amount));
    if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");
    const db = await readDB();
    if (!db.users[fromID]) db.users[fromID] = { balance: 0 };
    if (!db.users[toID]) db.users[toID] = { balance: 0 };
    if (db.users[fromID].balance < amount) throw new Error("Insufficient funds");
    db.users[fromID].balance -= amount;
    db.users[toID].balance += amount;
    db.users[fromID].ledger = db.users[fromID].ledger || [];
    db.users[toID].ledger = db.users[toID].ledger || [];
    db.users[fromID].ledger.push({ t: Date.now(), delta: -amount, reason: `transfer -> ${toID}` });
    db.users[toID].ledger.push({ t: Date.now(), delta: amount, reason: `transfer <- ${fromID}` });
    await writeDB(db);
    return { from: db.users[fromID].balance, to: db.users[toID].balance };
  },

  async resetAll(amount = 0) {
    const db = { users: {}, daily: {}, meta: { created: Date.now() } };
    await writeDB(db);
    return true;
  },

  // get top N richest users as array of { id, balance }
  async getTop(n = 10) {
    const db = await readDB();
    const arr = Object.keys(db.users).map(id => ({ id, balance: db.users[id].balance || 0 }));
    arr.sort((a, b) => b.balance - a.balance);
    return arr.slice(0, n);
  },

  // daily claims bookkeeping
  async canClaimDaily(userID, cooldownHours = 24) {
    const db = await readDB();
    const last = db.daily && db.daily[userID] ? db.daily[userID] : 0;
    const since = (Date.now() - last) / 1000 / 3600;
    return since >= cooldownHours;
  },

  async setDailyClaim(userID) {
    const db = await readDB();
    if (!db.daily) db.daily = {};
    db.daily[userID] = Date.now();
    await writeDB(db);
    return true;
  },

  // internal helpers for direct DB access, if needed
  async readRaw() { return await readDB(); },
  async writeRaw(obj) { await writeDB(obj); }
};
