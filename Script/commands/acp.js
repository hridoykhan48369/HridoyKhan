module.exports.config = {
  name: "acp",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Automatically manage friend requests from your bot account",
  commandCategory: "Facebook Control",
  usages: "uid",
  cooldowns: 0
};

module.exports.handleReply = async ({ handleReply, event, api }) => {
  const { author, listRequest } = handleReply;
  if (author != event.senderID) return;
  const args = event.body.trim().split(" ");
  
  const form = {
    av: api.getCurrentUserID(),
    fb_api_caller_class: "RelayModern",
    variables: {
      input: {
        source: "friends_tab",
        actor_id: api.getCurrentUserID(),
        client_mutation_id: Math.round(Math.random() * 19).toString()
      },
      scale: 3,
      refresh_num: 0
    }
  };
  
  const success = [];
  const failed = [];
  
  if (args[0] === "add") {
    form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
    form.doc_id = "3147613905362928";
  } else if (args[0] === "del") {
    form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
    form.doc_id = "4108254489275063";
  } else {
    return api.sendMessage("⚠️ দয়া করে ব্যবহার করুন: <add | del> <ক্রমিক নম্বর | all>", event.threadID, event.messageID);
  }

  let targetIDs = args.slice(1);
  if (args[1] === "all") {
    targetIDs = [];
    for (let i = 1; i <= listRequest.length; i++) targetIDs.push(i);
  }
  
  const newTargetIDs = [];
  const promiseFriends = [];
  
  for (const stt of targetIDs) {
    const u = listRequest[parseInt(stt) - 1];
    if (!u) {
      failed.push(`ক্রমিক ${stt} পাওয়া যায়নি`);
      continue;
    }
    form.variables.input.friend_requester_id = u.node.id;
    form.variables = JSON.stringify(form.variables);
    newTargetIDs.push(u);
    promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));
    form.variables = JSON.parse(form.variables);
  }
  
  for (let i = 0; i < newTargetIDs.length; i++) {
    try {
      const friendRequest = await promiseFriends[i];
      if (JSON.parse(friendRequest).errors)
        failed.push(newTargetIDs[i].node.name);
      else success.push(newTargetIDs[i].node.name);
    } catch (e) {
      failed.push(newTargetIDs[i].node.name);
    }
  }
  
  return api.sendMessage(
    `✅ সফলভাবে ${args[0] === 'add' ? 'গ্রহণ' : 'মুছে ফেলা'} হয়েছে ${success.length} জনের রিকোয়েস্ট:\n${success.join("\n")}` +
    (failed.length > 0 ? `\n❌ ব্যর্থ হয়েছে ${failed.length} জনের:\n${failed.join("\n")}` : ""),
    event.threadID,
    event.messageID
  );
};


module.exports.run = async ({ event, api }) => {
  const moment = require("moment-timezone");
  const form = {
    av: api.getCurrentUserID(),
    fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
    fb_api_caller_class: "RelayModern",
    doc_id: "4499164963466303",
    variables: JSON.stringify({ input: { scale: 3 } })
  };

  const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form))
    .data.viewer.friending_possibilities.edges;

  if (!listRequest || listRequest.length === 0) {
    return api.sendMessage("🔕 কোনো Friend Request পাওয়া যায়নি!", event.threadID, event.messageID);
  }

  let msg = "📋 𝐅𝐑𝐈𝐄𝐍𝐃 𝐑𝐄𝐐𝐔𝐄𝐒𝐓 𝐋𝐈𝐒𝐓:\n";
  let i = 0;

  for (const user of listRequest) {
    i++;
    msg += `\n${i}. 👤 নাম: ${user.node.name}`
         + `\n🆔 ID: ${user.node.id}`
         + `\n🌐 প্রোফাইল: ${user.node.url.replace("www.facebook", "fb")}`
         + `\n⏰ সময়: ${moment(user.time * 1009).tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss")}\n`;
  }

  api.sendMessage(
    `${msg}\n\n✳️ রিপ্লাই দিন: <add | del> <ক্রমিক নম্বর | all> — যেমন: add all / del 2`,
    event.threadID,
    (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        listRequest,
        author: event.senderID
      });
    },
    event.messageID
  );
};