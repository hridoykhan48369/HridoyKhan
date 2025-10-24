/**
 * adminUpdate (upgraded)
 * - Improved error handling & data-safety
 * - Keeps original behaviour, only more robust
 * Credit: Hridoy Hossen
 */

module.exports.config = {
  name: "adminUpdate",
  eventType: [
    "log:thread-admins",
    "log:thread-name",
    "log:user-nickname",
    "log:thread-icon",
    "log:thread-call",
    "log:thread-color"
  ],
  version: "1.0.2",
  credits: "Hridoy Hossen",
  description: "Update team information quickly",
  envConfig: {
    sendNoti: true,
    autoUnsend: false,
    timeToUnsend: 5 // seconds, default if autoUnsend enabled
  }
};

module.exports.run = async function ({ event, api, Threads, Users }) {
  const fs = require("fs");
  const path = require("path");
  const iconPath = path.join(__dirname, "emoji.json");

  try {
    // ensure emoji.json exists and is a valid object
    if (!fs.existsSync(iconPath)) fs.writeFileSync(iconPath, JSON.stringify({}), "utf8");
    else {
      try {
        const raw = fs.readFileSync(iconPath, "utf8") || "{}";
        JSON.parse(raw);
      } catch (e) {
        // if corrupted, reset safely
        fs.writeFileSync(iconPath, JSON.stringify({}), "utf8");
      }
    }
  } catch (err) {
    console.error("adminUpdate: Failed to ensure emoji.json:", err);
  }

  const { threadID, logMessageType, logMessageData, logMessageBody, author } = event;
  const { setData, getData } = Threads;

  // fetch thread cached data safely
  const thread = global.data && global.data.threadData && global.data.threadData.get(threadID) ? global.data.threadData.get(threadID) : {};
  if (typeof thread["adminUpdate"] !== "undefined" && thread["adminUpdate"] === false) return;

  // small helper to send notification consistently and optionally unsend it
  const sendNoti = async (message) => {
    if (!global.configModule || !global.configModule[module.exports.config.name]) return;
    const cfg = global.configModule[module.exports.config.name];
    if (!cfg.sendNoti) return;
    try {
      // api.sendMessage may accept callback or return promise depending on framework; wrap in Promise
      const info = await new Promise((resolve, reject) => {
        api.sendMessage(message, threadID, (err, info) => {
          if (err) return reject(err);
          resolve(info);
        });
      });

      if (cfg.autoUnsend) {
        const delay = (typeof cfg.timeToUnsend === "number" ? cfg.timeToUnsend : 5) * 1000;
        setTimeout(async () => {
          try {
            await new Promise((res) => api.unsendMessage(info.messageID, res));
          } catch (_) { /* ignore unsend errors */ }
        }, delay);
      }
    } catch (e) {
      // don't crash the handler on notification failure
      console.error("adminUpdate: sendNoti error:", e && e.message ? e.message : e);
    }
  };

  try {
    // get thread data from DB / memory
    const threadDataObj = await getData(threadID);
    // ensure shape
    const dataThread = (threadDataObj && threadDataObj.threadInfo) ? threadDataObj.threadInfo : {};
    if (!dataThread.adminIDs) dataThread.adminIDs = [];
    if (!dataThread.nicknames) dataThread.nicknames = {};
    // icon/color/name fields may be undefined - that's fine

    switch (logMessageType) {
      case "log:thread-admins": {
        const evt = logMessageData && logMessageData.ADMIN_EVENT;
        const target = logMessageData && logMessageData.TARGET_ID;
        if (!target) break;

        if (evt === "add_admin") {
          // avoid duplicates
          if (!dataThread.adminIDs.some(item => item && item.id == target)) {
            dataThread.adminIDs.push({ id: target });
          }
          await sendNoti(
            `»» NOTICE «« Update user ${target} — Admin Power Activated! 🧙‍♂️🔮\nঅফিশিয়ালি এখন তুই VIP 😎🎩`
          );
        } else if (evt === "remove_admin") {
          dataThread.adminIDs = dataThread.adminIDs.filter(item => item && item.id != target);
          await sendNoti(
            `»» NOTICE «« Update user ${target} — আচরণ খারাপের কারণে এডমিন করা হয়েছে রিমুভ। 😅`
          );
        }
        break;
      }

      case "log:thread-icon": {
        try {
          const preIconRaw = fs.readFileSync(iconPath, "utf8") || "{}";
          const preIcon = JSON.parse(preIconRaw);
          const newIcon = (logMessageData && logMessageData.thread_icon) ? logMessageData.thread_icon : dataThread.threadIcon || "👍";
          const prev = preIcon[threadID] || "unknown";

          dataThread.threadIcon = newIcon;

          await sendNoti(`» [ GROUP UPDATE ]\n» Original icon: ${prev}`);

          // update cache persistently
          preIcon[threadID] = newIcon;
          try { fs.writeFileSync(iconPath, JSON.stringify(preIcon, null, 2), "utf8"); } catch (e) { /* ignore */ }
        } catch (e) {
          console.error("adminUpdate: icon handling failed:", e);
        }
        break;
      }

      case "log:thread-call": {
        try {
          if (logMessageData && logMessageData.event === "group_call_started") {
            const name = await Users.getNameUser(logMessageData.caller_id);
            await sendNoti(`[ GROUP UPDATE ]\n❯ ${name} STARTED A ${(logMessageData.video) ? 'VIDEO ' : ''}CALL.`);
          } else if (logMessageData && logMessageData.event === "group_call_ended") {
            const callDuration = logMessageData.call_duration || 0;
            const hours = Math.floor(callDuration / 3600);
            const minutes = Math.floor((callDuration - (hours * 3600)) / 60);
            const seconds = callDuration - (hours * 3600) - (minutes * 60);
            const timeFormat = `${hours}:${minutes}:${seconds}`;
            await sendNoti(`[ GROUP UPDATE ]\n❯ ${(logMessageData.video) ? 'Video' : ''} call has ended.\n❯ Call duration: ${timeFormat}`);
          } else if (logMessageData && logMessageData.joining_user) {
            const name = await Users.getNameUser(logMessageData.joining_user);
            await sendNoti(`❯ [ GROUP UPDATE ]\n❯ ${name} Joined the ${(logMessageData.group_call_type == '1') ? 'Video' : ''} call.`);
          }
        } catch (e) {
          console.error("adminUpdate: call handling error:", e);
        }
        break;
      }

      case "log:thread-color": {
        try {
          dataThread.threadColor = (event.logMessageData && event.logMessageData.thread_color) ? event.logMessageData.thread_color : dataThread.threadColor || "🌤";
          const body = (typeof logMessageBody === "string") ? logMessageBody.replace("Theme", "color") : "Theme changed";
          await sendNoti(`» [ GROUP UPDATE ]\n» ${body}`);
        } catch (e) {
          console.error("adminUpdate: color handling error:", e);
        }
        break;
      }

      case "log:user-nickname": {
        try {
          const pid = logMessageData && logMessageData.participant_id;
          const nick = logMessageData && logMessageData.nickname;
          if (pid) dataThread.nicknames[pid] = nick;

          // nickname module restrictions
          if (typeof global.configModule["nickname"] != "undefined") {
            const nickCfg = global.configModule["nickname"];
            if (!nickCfg.allowChange.includes(threadID) &&
              !dataThread.adminIDs.some(item => item.id == event.author) ||
              event.author == api.getCurrentUserID()
            ) {
              // do nothing: not allowed to announce
              break;
            }
          }

          await sendNoti(`»» NOTICE «« Update user nicknames ${pid} to: ${(nick && nick.length === 0) ? "original name" : nick}`);
        } catch (e) {
          console.error("adminUpdate: nickname handling error:", e);
        }
        break;
      }

      case "log:thread-name": {
        try {
          dataThread.threadName = (logMessageData && logMessageData.name) ? logMessageData.name : dataThread.threadName || "No name";
          await sendNoti(`»» NOTICE «« Update the group name to ${dataThread.threadName}`);
        } catch (e) {
          console.error("adminUpdate: thread name handling error:", e);
        }
        break;
      }

      default:
        // unknown event type - ignore
        break;
    }

    // persist updated threadInfo back to DB
    try {
      await setData(threadID, { threadInfo: dataThread });
    } catch (e) {
      console.error("adminUpdate: Failed to setData threadInfo:", e);
    }

  } catch (err) {
    console.error("adminUpdate: Unexpected error:", err);
  }
};
