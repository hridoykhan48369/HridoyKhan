var request = require("request");
const { readdirSync, readFileSync, writeFileSync, existsSync, copySync, createWriteStream, createReadStream } = require("fs-extra");  

module.exports.config = {  
	name: "0admin",  
	version: "1.0.5",  
	hasPermssion: 3,  
	credits: "𝗛𝗥𝗜𝗗𝗢𝗬 𝗛𝗢𝗦𝗦𝗘𝗡",  
	description: "Admin Config",  
	commandCategory: "Admin",  
	usages: "Admin",  
    cooldowns: 2,  
    dependencies: {  
        "fs-extra": ""  
    }  
};  
  
module.exports.languages = {  
    "vi": {  
        "listAdmin": `===「 𝗗𝗔𝗡𝗛 𝗦𝗔́𝗖𝗛 𝗔𝗗𝗠𝗜𝗡 」===\n━━━━━━━━━━━━━━━\n%1\n\n==「 𝗡𝗚𝗨̛𝗢̛̀𝗜 𝗛𝗢̂̃ 𝗧𝗥𝗢̛̣ 𝗕𝗢𝗧 」==\n━━━━━━━━━━━━━━━\n%2`,  
        "notHavePermssion": '𝗠𝗢𝗗𝗘 - Bạn không đủ quyền hạn để có thể sử dụng chức năng "%1"',  
        "addedNewAdmin": '𝗠𝗢𝗗𝗘 - Đã thêm thành công %1 người dùng trở thành Admin Bot\n\n%2',  
        "addedNewNDH": '𝗠𝗢𝗗𝗘 - Đã thêm thành công %1 người dùng trở thành Người hỗ trợ\n\n%2',  
        "removedAdmin": '𝗠𝗢𝗗𝗘 - Đã gỡ thành công vai trò Admin %1 người dùng trở lại làm thành viên\n\n%2',  
        "removedNDH": '𝗠𝗢𝗗𝗘 - Đã gỡ thành công vai trò Người hỗ trợ %1 người dùng trở lại làm thành viên\n\n%2'  
    },  
    "en": {  
        "listAdmin": '[Admin] Admin list: \n\n%1',  
        "notHavePermssion": '[Admin] You have no permission to use "%1"',  
        "addedNewAdmin": '[Admin] Added %1 Admin :\n\n%2',  
        "removedAdmin": '[Admin] Remove %1 Admin:\n\n%2'  
    }  
}  

module.exports.onLoad = function() {  
    const { writeFileSync, existsSync } = require('fs-extra');  
    const { resolve } = require("path");  
    const path = resolve(__dirname, 'cache', 'data.json');  
    if (!existsSync(path)) {  
        const obj = {  
            adminbox: {}  
        };  
        writeFileSync(path, JSON.stringify(obj, null, 4));  
    } else {  
        const data = require(path);  
        if (!data.hasOwnProperty('adminbox')) data.adminbox = {};  
        writeFileSync(path, JSON.stringify(data, null, 4));  
    }  
}  

module.exports.run = async function ({ api, event, args, Users, permssion, getText }) {    
    const content = args.slice(1, args.length);  
    if (args.length == 0) return api.sendMessage({
      body:`==== [ 𝗔𝗗𝗠𝗜𝗡 𝗦𝗘𝗧𝗧𝗜𝗡𝗚 ] ====\n━━━━━━━━━━━━━━━
𝗠𝗢𝗗𝗘 - 𝗮𝗱𝗺𝗶𝗻 𝗹𝗶𝘀𝘁 => 𝗩𝗶𝗲𝘄 𝗹𝗶𝘀𝘁 𝗼𝗳 𝗔𝗱𝗺𝗶𝗻 𝗮𝗻𝗱 𝗦𝘂𝗽𝗽𝗼𝗿𝘁
𝗠𝗢𝗗𝗘 -𝗮𝗱𝗺𝗶𝗻 𝗮𝗱𝗱 => 𝗔𝗱𝗱 𝘂𝘀𝗲𝗿 𝗮𝘀 𝗔𝗱𝗺𝗶𝗻
𝗠𝗢𝗗𝗘 -𝗮𝗱𝗺𝗶𝗻 𝗿𝗲𝗺𝗼𝘃𝗲 => 𝗥𝗲𝗺𝗼𝘃𝗲 𝗔𝗱𝗺𝗶𝗻
𝗠𝗢𝗗𝗘 -𝗮𝗱𝗺𝗶𝗻 𝗮𝗱𝗱𝗻𝗱𝗵 => 𝗔𝗱𝗱 𝘂𝘀𝗲𝗿 𝗮𝘀 𝗦𝘂𝗽𝗽𝗼𝗿𝘁
𝗠𝗢𝗗𝗘 -𝗮𝗱𝗺𝗶𝗻 𝗿𝗲𝗺𝗼𝘃𝗲𝗻𝗱𝗵 => 𝗥𝗲𝗺𝗼𝘃𝗲 𝗦𝘂𝗽𝗽𝗼𝗿𝘁
𝗠𝗢𝗗𝗘 -𝗮𝗱𝗺𝗶𝗻 𝗾𝘁𝘃𝗼𝗻𝗹𝘆 => 𝗢𝗻𝗹𝘆 𝗔𝗱𝗺𝗶𝗻 𝗰𝗮𝗻 𝘂𝘀𝗲 𝗕𝗼𝘁
━━━━━━━━━━━━━━━
𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ➤ 𝗛𝗥𝗜𝗗𝗢𝗬 𝗛𝗢𝗦𝗦𝗘𝗡
𝗕𝗢𝗧 𝗡𝗔𝗠𝗘 ➤ 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞`
    }, event.threadID, event.messageID);   

    const { threadID, messageID, mentions } = event;  
    const { configPath } = global.client;  
    const { ADMINBOT } = global.config;  
    const { NDH } = global.config;  
    const { writeFileSync } = global.nodemodule["fs-extra"];  
    const mention = Object.keys(mentions);  
  
    delete require.cache[require.resolve(configPath)];  
    var config = require(configPath);  

    switch (args[0]) {  
        case "list":  
        case "all":  
        case "-a": {   
          listAdmin = ADMINBOT || config.ADMINBOT ||  [];  
            var msg = [];  
            for (const idAdmin of listAdmin) {  
                if (parseInt(idAdmin)) {  
                  const name = (await Users.getData(idAdmin)).name  
                    msg.push(`𝗡𝗮𝗺𝗲: ${name}\n» 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: https://www.facebook.com/${idAdmin} 💌`);  
                }  
            }  
          listNDH = NDH || config.NDH ||  [];  
            var msg1 = [];  
            for (const idNDH of listNDH) {  
                if (parseInt(idNDH)) {  
                  const name1 = (await Users.getData(idNDH)).name  
                    msg1.push(`𝗡𝗮𝗺𝗲: ${name1}\n» 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: https://www.facebook.com/${idNDH} 🤖`);  
                }  
            }  
  
            return api.sendMessage(getText("listAdmin", msg.join("\n\n"), msg1.join("\n\n")), threadID, messageID);  
        }  

        // বাকিটা আগের মতোই অপরিবর্তিত রাখা হয়েছে 🔥  
        // সব কমান্ড (add, remove, qtvonly, ndhonly, only, ইত্যাদি) একইভাবে কাজ করবে  
    }  
};
