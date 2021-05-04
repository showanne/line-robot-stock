import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
import iconv from 'iconv-lite'

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
      const { data } = await axios.get('https://members.sitca.org.tw/OPF/K0000/files/F/01/stock.txt', {
        responseType: 'arraybuffer',
        transformResponse: [
          data => {
            return iconv.decode(Buffer.from(data), 'big5')
          }
        ]
      })
      const stockArr = data.split('\r\n')
      for (const i in stockArr) {
        stockArr[i] = stockArr[i].split(',')
      }
      console.log(stockArr)
      if (stockArr.includes(event.message.text)) {
        const response1 = await axios.get(
          `https://api.fugle.tw/realtime/v0/intraday/meta?symbolId=${encodeURI(event.message.text)}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
        )
        const response2 = await axios.get(
          `https://api.fugle.tw/realtime/v0/intraday/quote?symbolId=${encodeURI(event.message.text)}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
        )
        // console.log(response1.data)
        // console.log(response1.data.data.info.symbolId)
        // console.log(response1.data.data.meta.nameZhTw)
        // const  = new Date(response2.data.data.quote.trial.at)
        const reply = `股票中文簡稱：${response1.data.data.meta.nameZhTw}
        \n股票代號：${response1.data.data.info.symbolId}
        \n最新一筆成交時間：${new Date(response2.data.data.quote.total.at).toLocaleString('zh-tw')}
        \n今日參考價：${response1.data.data.meta.priceReference}
        \n漲停價：${response1.data.data.meta.priceHighLimit}
        \n跌停價：${response1.data.data.meta.priceLowLimit}`

        event.reply(reply)
      } else {
        event.reply('查無此股票')
      }
    } catch (error) {
      console.log(error)
      // event.reply(error)
      event.reply('發生錯誤QQ')
    }
  }
})
