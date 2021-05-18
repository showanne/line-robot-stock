import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
import fs from 'fs'
import iconv from 'iconv-lite'

// 讓套件讀取 .env 檔案
dotenv.config()
// 讀取後可以用 process.env.變數 使用
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const arrSymbolId = []
const getlist = async () => {
  try {
    const { data } = await axios.get('https://members.sitca.org.tw/OPF/K0000/files/F/01/stock.txt', {
      responseType: 'arraybuffer',
      transformResponse: [
        data => {
          // 將檔案編碼改big5
          return iconv.decode(Buffer.from(data), 'big5')
        }
      ]
    })
    // 文字轉成陣列 .split(分割文字)
    const arr = data.split('\r\n')
    for (const i in arr) {
      arr[i] = arr[i].split(',')
      arrSymbolId.push(arr[i][0])
    }
    // console.log(arrSymbolId)
  } catch (error) {
    console.log(error)
  }
}
getlist()

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

// async <-> await
bot.on('message', async event => {
  console.log(event)

  if (event.message.type === 'text') {
    console.log(arrSymbolId.includes(event.message.text))

    try {
      if (arrSymbolId.includes(event.message.text)) {
        const flex = [
          {
            type: 'bubble',
            hero: {
              type: 'image',
              url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
              size: 'full',
              aspectMode: 'cover'
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: `${event.message.text}`,
                  weight: 'bold',
                  size: 'xl',
                  align: 'center'
                }
              ]
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                {
                  type: 'button',
                  style: 'link',
                  height: 'sm',
                  action: {
                    type: 'postback',
                    label: 'stock live',
                    data: 'stock live'
                  }
                },
                {
                  type: 'button',
                  style: 'link',
                  height: 'sm',
                  action: {
                    type: 'message',
                    label: 'stock news',
                    text: `${event.message.text} news`
                  }
                },
                {
                  type: 'button',
                  style: 'link',
                  height: 'sm',
                  action: {
                    type: 'uri',
                    label: 'stock history',
                    uri: `https://www.google.com/finance/quote/${encodeURI(event.message.text)}:TPE?window=MAX`
                  }
                },
                {
                  type: 'spacer',
                  size: 'sm'
                }
              ],
              flex: 0
            }
          }
        ]

        const message = {
          type: 'flex',
          altText: `${event.message.text} Stock News`,
          contents: {
            type: 'carousel',
            contents: flex
          }
        }

        fs.writeFileSync('stock-menu.json', JSON.stringify(message, null, 2))
        event.reply(message)
      } else {
        event.reply('無')
      }
    } catch (error) {
      console.log(error)
      // event.reply(error)
      event.reply('發生錯誤QQ')
    }
  }
})
