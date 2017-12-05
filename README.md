# Project-MAGY TTS
Magy text-to-speech engine

---

將文字轉成語音，並播放出來
使用Google Text-to-speech API，用Node.js執行

使用[zlargon/google-tts](https://github.com/zlargon/google-tts)的nodejs module

目前可在MacOS上自動播放轉換結果
可以選擇語言

---

## 設定：
```
git clone https://github.com/Project-MAGY/TTS
cd TTS
npm install
```

## 使用：
```
// 預設播放 "Hello" 使用英文(en)
node play.js 

// 播放 "Hi, My name is Eason"
node play.js Hi my name is Eason

// 播放 "Nice to meet you!"
node play.js "Nice to meet you!"

// 中文播放
node play.js -l zh-ch 你好

// 中文播放的另一種寫法
node play.js --lang zh-ch 哈囉 早安
```
