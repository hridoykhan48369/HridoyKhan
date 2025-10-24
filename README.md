---------

### 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞 🌺

❖ **`A Messenger Multi Device Bot To Take Your Messenger To Another Level!`** 



Assalamualaikum Everyone!  
**Welcome to My 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍 Fork!**

![Box-shaped Image](https://i.imgur.com/0IKTM64.jpeg)

<p align="center" style="animation: glow 2s infinite alternate; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <span style="font-size: 24px; font-weight: bold;">𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞</span><br>
  <span> Develop By Hridoy Hossen</span>
</p>


_______
### <br>   ❖ DEPLOY_WORKFLOWS ❖
```
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
    # Step to check out the repository code
    - uses: actions/checkout@v2

    # Step to set up the specified Node.js version
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v2
      with:
        node-version: ${{ matrix.node-version }}

    # Step to install dependencies
    - name: Install dependencies
      run: npm install

    # Step to run the bot with the correct port
    - name: Start the bot
      env:
        PORT: 8080
      run: npm start
```

___

## 🔥 Features  

**• Auto Chat**  
Enjoy automatic and seamless conversations through natural language processing.  

**• Photo Editing**  
Edit professional quality photos using our advanced commands, no additional apps needed.  

**• Image Generation**  
Create unique images using our cutting-edge text-to-image technology.  

**• Video Downloader**  
Download HD videos from YouTube, Facebook, TikTok and other platforms.  

**• Interactive Games**  
Play 20+ fun games directly in messenger, no installation hassle!  

**• Fun Commands**  
Surprise your friends with hundreds of fun commands!  
___


## 👨‍💻 **ABOUT THE DEVELOPER**  
  
**Name:** **`Hridoy Hossen`**  
**Nice Name:** **`Kakashi`**  
**Profession:** **`STUDENT & CHATBOT DEVELOPER`**  
**Location:** **`Jashore, BANGLADESH`**  

### 📞 **CONTACT INFORMATION**  
- **WhatsApp:** **[01744954836](https://wa.me/+8801744954836)**  
- **Facebook:** **[Facebook ID](https://facebook.com/100048786044500)**  
- **Messenger:** **[Message Me](https://m.me/100048786044500)**  

### 🚀 **DEVELOPMENT APPROACH**  
- 💻 **Copy-paste techniques with customizations**  
- 🤝 **Collaborative development with friends**  
- 🤖 **AI-powered using ChatGPT and other advanced tools**  




---





## ❖ SUPPORT  
If you need any help, you can contact the admin.
Please do not disturb the admin unless you have a special need. Thank you! 

<p align="center">
  <a href="https://wa.me/+8801744954836?text=Assalamualaikum%20Admin%20Hridoy%20Hossen%20Need%20Help%20Please%20Brother%20🫶">
    <img alt="WhatsApp" src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white">
  </a>
  <a href="https://m.me/100048786044500>
    <img alt="Messenger" src="https://img.shields.io/badge/Messenger-00B2FF?style=for-the-badge&logo=messenger&logoColor=white">
  </a>
</p>

---

💖 **Thank You For Choosing 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞**  
🗓️ *Release Date:* `13/12/2024 at 02:00`  
⭐ **Please don't forget to give a star after forking! It really helps!**

---

<p align="center">
  <img src="https://img.icons8.com/emoji/48/000000/star-emoji.png" alt="Star" />
</p>

<p align="center">
  <a href="https://github.com/timeless-hridoy"><img src="https://img.icons8.com/fluency/48/000000/github.png" alt="GitHub"></a>
  <a href="https://wa.me/+8801744954836"><img src="https://img.icons8.com/color/48/000000/whatsapp.png" alt="WhatsApp"></a>
  <a href="https://facebook.com/100048786044500"><img src="https://img.icons8.com/fluency/48/000000/facebook.png" alt="Facebook"></a>

**I hope you enjoy my fork! Thank you for supporting 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞 bot community!**
