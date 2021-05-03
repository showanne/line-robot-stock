import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'

// 讓套件讀取 .env 檔案
dotenv.config()
// 讀取後可以用 process.env.變數 使用
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

// async <-> await
bot.on('message', async event => {
  console.log(event)
  if (event.message.type === 'text') {
    try {
      const response = await axios.get(
        `https://api.fugle.tw/realtime/v0/intraday/meta?symbolId=${encodeURI(event.message.text)}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
      )
      const data = response.data.filter(data => {
        return data.info.symbolId === event.message.text
      })

      let reply = ''
      for (const d of data) {
        reply += `
        股票中文簡稱：${d.data.meta.nameZhTw} 
        \n今日參考價：${d.data.meta.priceReference} 
        \n漲停價：${d.data.meta.priceHighLimit} 
        \n跌停價：${d.data.meta.priceLowLimit}  \n\n`
      }

      event.reply(reply)
    } catch (error) {
      console.log(error)
      event.reply('發生錯誤QQ')
    }
  }
})
