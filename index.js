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

const stockPop = [
  '人氣股票',
  '0050',
  '0056',
  '00888',
  '00692',
  '2330',
  '2890',
  '2886',
  '1101',
  '2884',
  '2881',
  '1434',
  '2385',
  '1102',
  '2542',
  '2892',
  '3702',
  '2887',
  '5880',
  '2852',
  '2851',
  '6024',
  '6023'
]
// 1 ~ stockPop.length 的隨機
const stockRandom = () => {
  return Math.floor(Math.random() * stockPop.length) + 1
}

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

// async <-> await
bot.on('message', async event => {
  console.log(event)

  if (event.type === 'message') {
    // console.log(arrSymbolId.includes(event.message.text))
    try {
      if (event.message.type === 'text') {
        if (event.message.text.includes('Instructions')) {
          // console.log(arrSymbolId.length)  //120107
          console.log(stockRandom())
          console.log(stockPop[stockRandom()])

          const flex = [
            {
              type: 'bubble',
              header: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'image',
                        url: 'https://www.frevvo.com/blog/wp-content/uploads/2020/01/Frevvo-Improve-Finance-hero.png',
                        size: 'full',
                        aspectMode: 'cover',
                        aspectRatio: '150:196',
                        gravity: 'center',
                        flex: 1
                      },
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: 'Stock',
                            size: 'xs',
                            color: '#ffffff',
                            align: 'center',
                            gravity: 'center'
                          }
                        ],
                        backgroundColor: '#e55732',
                        paddingAll: '2px',
                        paddingStart: '4px',
                        paddingEnd: '4px',
                        flex: 0,
                        position: 'absolute',
                        offsetStart: '18px',
                        offsetTop: '18px',
                        cornerRadius: '100px',
                        width: '59px',
                        height: '25px'
                      },
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                              {
                                type: 'text',
                                contents: [],
                                size: 'xl',
                                wrap: true,
                                text: '歡迎來到…',
                                color: '#064d88',
                                weight: 'bold'
                              },
                              {
                                type: 'text',
                                text: '在這個聊天室您可以直接輸入股票代號，協助您快速查詢股票資訊！',
                                color: '#064d88cc',
                                size: 'sm',
                                wrap: true
                              },
                              {
                                type: 'text',
                                text: '或輸入以下關鍵字，將立刻回覆您相關資訊',
                                color: '#064d88cc',
                                size: 'sm',
                                wrap: true,
                                margin: 'md'
                              }
                            ],
                            spacing: 'sm'
                          },
                          {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                              {
                                type: 'box',
                                layout: 'vertical',
                                contents: [
                                  {
                                    type: 'text',
                                    contents: [],
                                    size: 'md',
                                    wrap: true,
                                    margin: 'none',
                                    color: '#064d88de',
                                    text: '股票代號+news',
                                    align: 'start',
                                    action: {
                                      type: 'message',
                                      label: `${stockPop[stockRandom()]}+news (e.g.)`,
                                      text: `${stockPop[stockRandom()]}+news (e.g.)`
                                    }
                                  }
                                ],
                                paddingAll: '5px',
                                justifyContent: 'center',
                                paddingStart: '31px',
                                backgroundColor: '#ffffff1A'
                              },
                              {
                                type: 'box',
                                layout: 'vertical',
                                contents: [
                                  {
                                    type: 'text',
                                    contents: [],
                                    size: 'md',
                                    wrap: true,
                                    margin: 'none',
                                    color: '#064d88de',
                                    text: '股票代號+market',
                                    align: 'start',
                                    action: {
                                      type: 'message',
                                      label: `${stockPop[stockRandom()]}+market (e.g.)`,
                                      text: `${stockPop[stockRandom()]}+market (e.g.)`
                                    }
                                  }
                                ],
                                paddingAll: '5px',
                                justifyContent: 'center',
                                paddingStart: '31px',
                                backgroundColor: '#ffffff1A',
                                margin: 'md'
                              },
                              {
                                type: 'box',
                                layout: 'vertical',
                                contents: [
                                  {
                                    type: 'text',
                                    contents: [],
                                    size: 'md',
                                    wrap: true,
                                    margin: 'none',
                                    color: '#064d88de',
                                    text: '股票代號+history',
                                    align: 'start',
                                    action: {
                                      type: 'message',
                                      label: `${stockPop[stockRandom()]}+history (e.g.)`,
                                      text: `${stockPop[stockRandom()]}+history (e.g.)`
                                    }
                                  }
                                ],
                                paddingAll: '5px',
                                justifyContent: 'center',
                                paddingStart: '31px',
                                backgroundColor: '#ffffff1A',
                                margin: 'md'
                              }
                            ],
                            paddingAll: '9px',
                            cornerRadius: '2px',
                            margin: 'sm'
                          }
                        ],
                        spacing: 'sm',
                        position: 'absolute',
                        offsetTop: '50px',
                        offsetStart: '50px',
                        backgroundColor: '#f1cf4cdd',
                        paddingAll: '30px',
                        offsetBottom: 'none',
                        cornerRadius: 'md',
                        offsetEnd: 'none'
                      }
                    ]
                  }
                ],
                paddingAll: '0px'
              }
            }
          ]

          const message = {
            type: 'flex',
            altText: '歡迎來到…',
            contents: {
              type: 'carousel',
              contents: flex
            }
          }

          fs.writeFileSync('stock-Instructions.json', JSON.stringify(message, null, 2))
          event.reply(message)
        }
        if (event.message.text.includes('news')) {
          const newsI = event.message.text.indexOf('news') - 1
          console.log(newsI)

          const responseSearch = await axios.get(`https://api.cnyes.com/media/api/v1/search?q=${encodeURI(event.message.text.substr(0, newsI))}`)

          const newsArr = responseSearch.data.items.data

          // 回復新聞
          const flex = [
            {
              type: 'bubble',
              size: 'micro',
              hero: {
                type: 'image',
                url: `${newsArr[1].coverSrc.xl.src}`,
                size: 'full',
                aspectMode: 'cover',
                aspectRatio: '320:213',
                action: {
                  type: 'uri',
                  label: 'action',
                  uri: 'http://linecorp.com/'
                }
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: `${newsArr[0].title}`,
                    weight: 'bold',
                    size: 'sm',
                    wrap: true,
                    action: {
                      type: 'uri',
                      label: 'action',
                      uri: `https://news.cnyes.com/news/id/${encodeURI(newsArr[0].newsId)}`
                    },
                    maxLines: 3
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    contents: [
                      {
                        type: 'icon',
                        size: 'xs',
                        url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
                      },
                      {
                        type: 'icon',
                        size: 'xs',
                        url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png'
                      },
                      {
                        type: 'text',
                        text: `${new Date(newsArr[0].publishAt * 1000).toLocaleString('zh-tw').substr(0, 10)}`,
                        size: 'xs',
                        color: '#8c8c8c',
                        margin: 'md',
                        flex: 0
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                          {
                            type: 'text',
                            text: `${newsArr[0].keyword.join('、')}`,
                            wrap: false,
                            style: 'italic',
                            color: '#8c8c8c',
                            size: 'xs',
                            flex: 5
                          }
                        ]
                      }
                    ]
                  }
                ],
                spacing: 'sm',
                paddingAll: '13px'
              }
            },
            {
              type: 'bubble',
              size: 'micro',
              hero: {
                type: 'image',
                url: `${newsArr[1].coverSrc.xl.src}`,
                size: 'full',
                aspectMode: 'cover',
                aspectRatio: '320:213',
                action: {
                  type: 'uri',
                  label: 'action',
                  uri: 'http://linecorp.com/'
                }
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: `${newsArr[1].title}`,
                    weight: 'bold',
                    size: 'sm',
                    wrap: true,
                    action: {
                      type: 'uri',
                      label: 'action',
                      uri: `https://news.cnyes.com/news/id/${encodeURI(newsArr[1].newsId)}`
                    },
                    maxLines: 3
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    contents: [
                      {
                        type: 'icon',
                        size: 'xs',
                        url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
                      },
                      {
                        type: 'icon',
                        size: 'xs',
                        url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png'
                      },
                      {
                        type: 'text',
                        text: `${new Date(newsArr[1].publishAt * 1000).toLocaleString('zh-tw').substr(0, 10)}`,
                        size: 'xs',
                        color: '#8c8c8c',
                        margin: 'md',
                        flex: 0
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                          {
                            type: 'text',
                            text: `${newsArr[1].keyword.join('、')}`,
                            wrap: false,
                            style: 'italic',
                            color: '#8c8c8c',
                            size: 'xs',
                            flex: 5
                          }
                        ]
                      }
                    ]
                  }
                ],
                spacing: 'sm',
                paddingAll: '13px'
              }
            },
            {
              type: 'bubble',
              size: 'micro',
              hero: {
                type: 'image',
                url: `${newsArr[1].coverSrc.xl.src}`,
                size: 'full',
                aspectMode: 'cover',
                aspectRatio: '320:213',
                action: {
                  type: 'uri',
                  label: 'action',
                  uri: 'http://linecorp.com/'
                }
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: `${newsArr[3].title}`,
                    weight: 'bold',
                    size: 'sm',
                    wrap: true,
                    action: {
                      type: 'uri',
                      label: 'action',
                      uri: `https://news.cnyes.com/news/id/${encodeURI(newsArr[2].newsId)}`
                    },
                    maxLines: 3
                  },
                  {
                    type: 'box',
                    layout: 'baseline',
                    contents: [
                      {
                        type: 'icon',
                        size: 'xs',
                        url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
                      },
                      {
                        type: 'icon',
                        size: 'xs',
                        url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png'
                      },
                      {
                        type: 'text',
                        text: `${new Date(newsArr[2].publishAt * 1000).toLocaleString('zh-tw').substr(0, 10)}`,
                        size: 'xs',
                        color: '#8c8c8c',
                        margin: 'md',
                        flex: 0
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                          {
                            type: 'text',
                            text: `${newsArr[3].keyword.join('、')}`,
                            wrap: false,
                            style: 'italic',
                            color: '#8c8c8c',
                            size: 'xs',
                            flex: 5
                          }
                        ]
                      }
                    ]
                  }
                ],
                spacing: 'sm',
                paddingAll: '13px'
              }
            }
          ]
          const message = {
            type: 'flex',
            altText: `${event.message.text.substr(0, newsI)} Stock News`,
            contents: {
              type: 'carousel',
              contents: flex
            }
          }

          fs.writeFileSync('stock-news.json', JSON.stringify(message, null, 2))
          event.reply(message)
        }

        if (event.message.text.includes('market')) {
          const marketI = event.message.text.indexOf('market') - 1
          console.log(marketI)

          const responseMeta = await axios.get(
            `https://api.fugle.tw/realtime/v0.2/intraday/meta?symbolId=${encodeURI(
              event.message.text.substr(0, marketI)
            )}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
          )
          const responseQuote = await axios.get(
            `https://api.fugle.tw/realtime/v0.2/intraday/quote?symbolId=${encodeURI(
              event.message.text.substr(0, marketI)
            )}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
          )
          // const responseDealts = await axios.get(
          //   `https://api.fugle.tw/realtime/v0.2/intraday/dealts?symbolId=${encodeURI(event.message.text.substr(0, (event.message.text.indexOf("news")-1)))}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0&limit=9`
          // )

          const responseCnyesCharting = await axios.get(
            `https://ws.api.cnyes.com/ws/api/v1/charting/history?resolution=1&symbol=TWS:${encodeURI(event.message.text.substr(0, marketI))}:STOCK&quote=1`
          )

          const responseCnyesQuoteK = await axios.get(
            `https://ws.api.cnyes.com/ws/api/v1/quote/quotes/TWS:${encodeURI(event.message.text.substr(0, marketI))}:STOCK?column=K`
          )

          const responseCnyesQuoteI = await axios.get(
            `https://ws.api.cnyes.com/ws/api/v1/quote/quotes/TWS:${encodeURI(event.message.text.substr(0, marketI))}:STOCK?column=I`
          )

          // console.log(responseCnyesQuoteK.data.data[0])
          // console.log(responseCnyesQuoteK.data.data[0]['200056'])
          // console.log(responseCnyesCharting.data.data.quote)
          // console.log(responseCnyesCharting.data.data.quote['800001'])
          // console.log(responseCnyesCharting.data.data.o[responseCnyesCharting.data.data.o.length - 1])

          const flex = [
            // 個股日成交資訊
            {
              type: 'bubble',
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  // 股票代號
                  {
                    type: 'text',
                    text: `${responseMeta.data.data.info.symbolId}`,
                    weight: 'bold',
                    size: 'xxl',
                    margin: 'none',
                    color: '#2A1E5C'
                  },
                  // 股票中文名稱
                  {
                    type: 'text',
                    text: `${responseMeta.data.data.meta.nameZhTw}`,
                    size: 'sm',
                    color: '#2A1E5Caa',
                    wrap: true,
                    margin: 'sm',
                    offsetStart: 'xs'
                  },
                  {
                    type: 'separator',
                    margin: 'xxl'
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'xxl',
                    spacing: 'sm',
                    contents: [
                      // 股價
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '股價 (跟收盤不一樣?)',
                            size: 'sm',
                            color: '#555555',
                            flex: 0
                          },
                          {
                            type: 'text',
                            text: `${responseCnyesCharting.data.data.quote['6']}`,
                            size: 'sm',
                            color: '#111111',
                            align: 'end'
                          }
                        ]
                      },
                      // 昨收
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '昨收',
                            size: 'sm',
                            color: '#555555',
                            flex: 0
                          },
                          {
                            type: 'text',
                            text: `${responseCnyesCharting.data.data.quote['21']}`,
                            size: 'sm',
                            color: '#111111',
                            align: 'end'
                          }
                        ]
                      },
                      // 開盤價 priceOpen o
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '開盤價',
                            size: 'sm',
                            color: '#555555',
                            flex: 0
                          },
                          {
                            type: 'text',
                            text: `${responseCnyesCharting.data.data.o[responseCnyesCharting.data.data.o.length - 1]}`,
                            size: 'sm',
                            color: '#111111',
                            align: 'end'
                          }
                        ]
                      },
                      // 最高價 priceHigh h
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '最高價',
                            size: 'sm',
                            color: '#555555',
                            flex: 0
                          },
                          {
                            type: 'text',
                            text: `${responseCnyesCharting.data.data.h[responseCnyesCharting.data.data.h.length - 1]}`,
                            size: 'sm',
                            color: '#111111',
                            align: 'end'
                          }
                        ]
                      },
                      // 最低價 priceLow l
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '最低價',
                            size: 'sm',
                            color: '#555555',
                            flex: 0
                          },
                          {
                            type: 'text',
                            text: `${responseCnyesCharting.data.data.l[responseCnyesCharting.data.data.l.length - 1]}`,
                            size: 'sm',
                            color: '#111111',
                            align: 'end'
                          }
                        ]
                      },
                      // 收盤價 c
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '收盤價',
                            size: 'sm',
                            color: '#555555',
                            flex: 0
                          },
                          {
                            type: 'text',
                            text: `${responseCnyesCharting.data.data.c[responseCnyesCharting.data.data.c.length - 1]}`,
                            size: 'sm',
                            color: '#111111',
                            align: 'end'
                          }
                        ]
                      },
                      // 本益比 '700001'
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '本益比',
                            size: 'sm',
                            color: '#555555',
                            flex: 0
                          },
                          {
                            type: 'text',
                            text: `${responseCnyesQuoteI.data.data[0]['700001']}`,
                            size: 'sm',
                            color: '#111111',
                            align: 'end'
                          }
                        ]
                      },
                      // 本淨比 '700006'
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '本淨比',
                            size: 'sm',
                            color: '#555555',
                            flex: 0
                          },
                          {
                            type: 'text',
                            text: `${responseCnyesQuoteI.data.data[0]['700006']}`,
                            size: 'sm',
                            color: '#111111',
                            align: 'end'
                          }
                        ]
                      },
                      // 市值 (億) '700005'
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '市值 (億)',
                            size: 'sm',
                            color: '#555555',
                            flex: 0
                          },
                          {
                            type: 'text',
                            text: `${responseCnyesQuoteI.data.data[0]['700005']}`,
                            size: 'sm',
                            color: '#111111',
                            align: 'end'
                          }
                        ]
                      },
                      // 漲跌 change '11'
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '漲跌',
                            size: 'sm',
                            color: '#555555',
                            flex: 0
                          },
                          {
                            type: 'text',
                            text: `${responseCnyesCharting.data.data.quote['11']}`,
                            size: 'sm',
                            color: '#111111',
                            align: 'end'
                          }
                        ]
                      },
                      // 漲跌幅 changePercent '56'
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '漲跌幅',
                            size: 'sm',
                            color: '#555555',
                            flex: 0
                          },
                          {
                            type: 'text',
                            text: `${responseCnyesCharting.data.data.quote['56']}%`,
                            size: 'sm',
                            color: '#111111',
                            align: 'end'
                          }
                        ]
                      },
                      // 成交張數 unit '800001'
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '總成交張數',
                            size: 'sm',
                            color: '#555555',
                            flex: 0
                          },
                          {
                            type: 'text',
                            text: `${responseCnyesCharting.data.data.quote['800001']}`,
                            size: 'sm',
                            color: '#111111',
                            align: 'end'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'separator',
                    margin: 'xl'
                  },
                  // 歷史走勢
                  {
                    type: 'box',
                    layout: 'horizontal',
                    margin: 'md',
                    contents: [
                      {
                        type: 'text',
                        text: '歷史走勢',
                        size: 'xs',
                        color: '#aaaaaa',
                        flex: 0,
                        action: {
                          type: 'uri',
                          label: 'action',
                          uri: `https://www.google.com/finance/quote/${encodeURI(event.message.text.substr(0, marketI))}:TPE?window=MAX`
                        }
                      },
                      {
                        type: 'text',
                        text: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()} ${new Date().getHours()}:${
                          new Date().getMinutes() + 1
                        }`,
                        color: '#aaaaaa',
                        size: 'xs',
                        align: 'end'
                      }
                    ]
                  }
                ]
              },
              styles: {
                footer: {
                  separator: true
                }
              }
            },
            // 五檔
            {
              type: 'bubble',
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: `${responseMeta.data.data.info.symbolId}`,
                    weight: 'bold',
                    size: 'xxl',
                    margin: 'none',
                    color: '#2A1E5C'
                  },
                  {
                    type: 'text',
                    text: `${responseMeta.data.data.meta.nameZhTw}`,
                    size: 'sm',
                    color: '#2A1E5Caa',
                    wrap: true,
                    margin: 'sm',
                    offsetStart: 'xs'
                  },
                  {
                    type: 'separator',
                    margin: 'xxl'
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'md',
                    spacing: 'sm',
                    contents: [
                      // for (let i=0;i<5;i++ ;){i}
                      // 買 bestBids 賣 bestAsks
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '買',
                            align: 'center',
                            color: '#FF5D73'
                          },
                          {
                            type: 'filler'
                          },
                          {
                            type: 'text',
                            text: '賣',
                            align: 'center',
                            color: '#06A77D'
                          }
                        ],
                        // backgroundColor: '#6CD4FFaa',
                        // paddingAll: 'sm',
                        justifyContent: 'space-between',
                        margin: 'lg'
                      },
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[0].unit}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[0].price}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'filler'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[0].price}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[0].unit}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[1].unit}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[1].price}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'filler'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[1].price}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[1].unit}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[2].unit}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[2].price}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'filler'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[2].price}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[2].unit}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[3].unit}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[3].price}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'filler'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[3].price}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[3].unit}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[4].unit}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[4].price}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'filler'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[4].price}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[4].unit}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          }
                        ]
                      },
                      // 百分比
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                              {
                                type: 'filler'
                              }
                            ],
                            width: `${responseCnyesQuoteK.data.data[0]['200056']}%`,
                            backgroundColor: '#FF5D73',
                            height: '6px'
                          }
                        ],
                        backgroundColor: '#06A77D',
                        height: '6px',
                        margin: 'sm'
                      },
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          // 內盤
                          {
                            type: 'text',
                            text: `${responseCnyesQuoteK.data.data[0]['200056']}% (${responseCnyesQuoteK.data.data[0]['200054']})`,
                            size: 'xxs',
                            gravity: 'top',
                            color: '#FF5D73',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'filler'
                          },
                          // 外盤
                          {
                            type: 'text',
                            text: `${responseCnyesQuoteK.data.data[0]['200057']}% (${responseCnyesQuoteK.data.data[0]['200055']})`,
                            size: 'xxs',
                            gravity: 'top',
                            color: '#06A77D',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'separator',
                    margin: 'md'
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    margin: 'lg',
                    contents: [
                      {
                        type: 'text',
                        text: '即時走勢',
                        size: 'xs',
                        color: '#aaaaaa',
                        flex: 0,
                        offsetStart: 'sm',
                        action: {
                          type: 'uri',
                          label: 'action',
                          uri: `https://www.google.com/finance/quote/${encodeURI(event.message.text.substr(0, marketI))}:TPE`
                        }
                      },
                      {
                        type: 'text',
                        text: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()} ${new Date().getHours()}:${
                          new Date().getMinutes() + 1
                        }`,
                        color: '#aaaaaa',
                        size: 'xs',
                        align: 'end',
                        offsetEnd: 'sm'
                      }
                    ]
                  }
                ]
              },
              styles: {
                footer: {
                  separator: true
                }
              }
            }
          ]

          const message = {
            type: 'flex',
            altText: `${event.message.text.substr(0, marketI)} Stock Market`,
            contents: {
              type: 'carousel',
              contents: flex
            }
          }

          fs.writeFileSync('stock-market.json', JSON.stringify(message, null, 2))
          event.reply(message)
        }

        if (arrSymbolId.includes(event.message.text)) {
          // 回復選單
          const flex = [
            {
              type: 'bubble',
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'image',
                    url: 'https://imgur.com/lvTvZ6Z.png',
                    size: 'full',
                    aspectMode: 'cover',
                    aspectRatio: '15:19',
                    gravity: 'top'
                  },
                  // stock market
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'filler'
                          },
                          {
                            type: 'box',
                            layout: 'baseline',
                            contents: [
                              {
                                type: 'icon',
                                url: 'https://img.icons8.com/nolan/344/stock-share.png'
                              },
                              {
                                type: 'text',
                                text: 'stock market',
                                color: '#3c3899',
                                flex: 0,
                                offsetTop: '-2px'
                              }
                            ],
                            spacing: 'sm',
                            paddingStart: 'lg'
                          },
                          {
                            type: 'filler'
                          }
                        ],
                        borderWidth: '1.5px',
                        cornerRadius: '4px',
                        spacing: 'sm',
                        borderColor: '#5e50ff',
                        backgroundColor: '#DEDAFBaa',
                        margin: 'md',
                        height: '45px',
                        action: {
                          type: 'postback',
                          label: 'stock market',
                          data: `${event.message.text} market`
                        }
                      },
                      // stock news
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'filler'
                          },
                          {
                            type: 'box',
                            layout: 'baseline',
                            contents: [
                              {
                                type: 'icon',
                                url: 'https://img.icons8.com/nolan/344/card-exchange.png'
                              },
                              {
                                type: 'text',
                                text: 'stock news',
                                color: '#3c3899',
                                flex: 0,
                                offsetTop: '-2px'
                              }
                            ],
                            spacing: 'sm',
                            paddingStart: 'lg'
                          },
                          {
                            type: 'filler'
                          }
                        ],
                        borderWidth: '1.5px',
                        cornerRadius: '4px',
                        spacing: 'sm',
                        borderColor: '#5e50ff',
                        backgroundColor: '#DEDAFBaa',
                        margin: 'md',
                        height: '45px',
                        action: {
                          type: 'postback',
                          label: 'stock news',
                          data: `${event.message.text} news`
                        }
                      },
                      // stock history
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'filler'
                          },
                          {
                            type: 'box',
                            layout: 'baseline',
                            contents: [
                              {
                                type: 'icon',
                                url: 'https://img.icons8.com/nolan/344/pay-date.png'
                              },
                              {
                                type: 'text',
                                text: 'stock history',
                                color: '#3c3899',
                                flex: 0,
                                offsetTop: '-2px'
                              }
                            ],
                            spacing: 'sm',
                            action: {
                              type: 'uri',
                              label: 'stock history',
                              uri: `https://www.google.com/finance/quote/${encodeURI(event.message.text)}:TPE?window=MAX`
                            },
                            paddingStart: 'lg'
                          },
                          {
                            type: 'filler'
                          }
                        ],
                        borderWidth: '1.5px',
                        cornerRadius: '4px',
                        spacing: 'sm',
                        borderColor: '#5e50ff',
                        backgroundColor: '#DEDAFBaa',
                        margin: 'md',
                        height: '45px'
                      },
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'filler'
                          },
                          // 使用說明
                          {
                            type: 'box',
                            layout: 'baseline',
                            contents: [
                              {
                                type: 'icon',
                                url: 'https://img.icons8.com/nolan/344/stock-share.png'
                              },
                              {
                                type: 'text',
                                text: 'Instructions',
                                color: '#3c3899',
                                flex: 0,
                                offsetTop: '-2px'
                              }
                            ],
                            spacing: 'sm',
                            paddingStart: 'lg'
                          },
                          {
                            type: 'filler'
                          }
                        ],
                        borderWidth: '1.5px',
                        cornerRadius: '4px',
                        spacing: 'sm',
                        borderColor: '#5e50ff',
                        backgroundColor: '#DEDAFBaa',
                        margin: 'md',
                        height: '45px',
                        action: {
                          type: 'postback',
                          label: 'Instructions',
                          data: 'Instructions'
                        }
                      }
                    ],
                    position: 'absolute',
                    // backgroundColor: '#2A1E5C66',
                    paddingAll: '70px',
                    paddingTop: '115px',
                    paddingEnd: '75px',
                    background: {
                      type: 'linearGradient',
                      angle: '110deg',
                      endColor: '#3c389999',
                      centerColor: '#3c389955',
                      startColor: '#3c3899aa',
                      centerPosition: '65%'
                    },
                    offsetEnd: '0px',
                    offsetBottom: '0px',
                    offsetStart: '0px',
                    offsetTop: '0px'
                  },
                  // 標題字 - 股票代號
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'text',
                        text: `${event.message.text}`,
                        color: '#dcedfb',
                        align: 'center',
                        gravity: 'center',
                        wrap: false,
                        adjustMode: 'shrink-to-fit',
                        size: 'lg'
                      }
                    ],
                    position: 'absolute',
                    cornerRadius: '15px',
                    backgroundColor: '#5e50ffbb',
                    offsetTop: '70px',
                    paddingAll: 'xs',
                    paddingStart: 'md',
                    paddingEnd: 'md',
                    offsetStart: '123px',
                    width: '119px'
                  }
                ],
                paddingAll: '0px'
              }
            }
          ]

          const message = {
            type: 'flex',
            altText: `${event.message.text} Stock Menu`,
            contents: {
              type: 'carousel',
              contents: flex
            }
          }

          fs.writeFileSync('stock-menu.json', JSON.stringify(message, null, 2))
          event.reply(message)
        }
        // else {
        //   event.reply('查無此股票')
        // }
      }
    } catch (error) {
      console.log(error)
      // event.reply(error)
      event.reply('發生錯誤 QQ')
    }
  }
})

bot.on('postback', async event => {
  console.log(event)

  if (event.type === 'postback') {
    // console.log(event.postback.data)
    // console.log(arrSymbolId.includes(event.postback.data))
    try {
      if (event.postback.data.includes('news')) {
        const newsI = event.postback.data.indexOf('news') - 1
        // console.log(newsI)

        const responseSearch = await axios.get(`https://api.cnyes.com/media/api/v1/search?q=${encodeURI(event.postback.data.substr(0, newsI))}`)

        const newsArr = responseSearch.data.items.data

        // 回復新聞
        const flex = [
          {
            type: 'bubble',
            size: 'micro',
            hero: {
              type: 'image',
              url: `${newsArr[1].coverSrc.xl.src}`,
              size: 'full',
              aspectMode: 'cover',
              aspectRatio: '320:213',
              action: {
                type: 'uri',
                label: 'action',
                uri: 'http://linecorp.com/'
              }
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: `${newsArr[0].title}`,
                  weight: 'bold',
                  size: 'sm',
                  wrap: true,
                  action: {
                    type: 'uri',
                    label: 'action',
                    uri: `https://news.cnyes.com/news/id/${encodeURI(newsArr[0].newsId)}`
                  },
                  maxLines: 3
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    {
                      type: 'icon',
                      size: 'xs',
                      url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
                    },
                    {
                      type: 'icon',
                      size: 'xs',
                      url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png'
                    },
                    {
                      type: 'text',
                      text: `${new Date(newsArr[0].publishAt * 1000).toLocaleString('zh-tw').substr(0, 10)}`,
                      size: 'xs',
                      color: '#8c8c8c',
                      margin: 'md',
                      flex: 0
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'text',
                          text: `${newsArr[0].keyword.join('、')}`,
                          wrap: false,
                          style: 'italic',
                          color: '#8c8c8c',
                          size: 'xs',
                          flex: 5
                        }
                      ]
                    }
                  ]
                }
              ],
              spacing: 'sm',
              paddingAll: '13px'
            }
          },
          {
            type: 'bubble',
            size: 'micro',
            hero: {
              type: 'image',
              url: `${newsArr[1].coverSrc.xl.src}`,
              size: 'full',
              aspectMode: 'cover',
              aspectRatio: '320:213',
              action: {
                type: 'uri',
                label: 'action',
                uri: 'http://linecorp.com/'
              }
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: `${newsArr[1].title}`,
                  weight: 'bold',
                  size: 'sm',
                  wrap: true,
                  action: {
                    type: 'uri',
                    label: 'action',
                    uri: `https://news.cnyes.com/news/id/${encodeURI(newsArr[1].newsId)}`
                  },
                  maxLines: 3
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    {
                      type: 'icon',
                      size: 'xs',
                      url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
                    },
                    {
                      type: 'icon',
                      size: 'xs',
                      url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png'
                    },
                    {
                      type: 'text',
                      text: `${new Date(newsArr[1].publishAt * 1000).toLocaleString('zh-tw').substr(0, 10)}`,
                      size: 'xs',
                      color: '#8c8c8c',
                      margin: 'md',
                      flex: 0
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'text',
                          text: `${newsArr[1].keyword.join('、')}`,
                          wrap: false,
                          style: 'italic',
                          color: '#8c8c8c',
                          size: 'xs',
                          flex: 5
                        }
                      ]
                    }
                  ]
                }
              ],
              spacing: 'sm',
              paddingAll: '13px'
            }
          },
          {
            type: 'bubble',
            size: 'micro',
            hero: {
              type: 'image',
              url: `${newsArr[1].coverSrc.xl.src}`,
              size: 'full',
              aspectMode: 'cover',
              aspectRatio: '320:213',
              action: {
                type: 'uri',
                label: 'action',
                uri: 'http://linecorp.com/'
              }
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: `${newsArr[3].title}`,
                  weight: 'bold',
                  size: 'sm',
                  wrap: true,
                  action: {
                    type: 'uri',
                    label: 'action',
                    uri: `https://news.cnyes.com/news/id/${encodeURI(newsArr[2].newsId)}`
                  },
                  maxLines: 3
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    {
                      type: 'icon',
                      size: 'xs',
                      url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
                    },
                    {
                      type: 'icon',
                      size: 'xs',
                      url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png'
                    },
                    {
                      type: 'text',
                      text: `${new Date(newsArr[2].publishAt * 1000).toLocaleString('zh-tw').substr(0, 10)}`,
                      size: 'xs',
                      color: '#8c8c8c',
                      margin: 'md',
                      flex: 0
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'text',
                          text: `${newsArr[3].keyword.join('、')}`,
                          wrap: false,
                          style: 'italic',
                          color: '#8c8c8c',
                          size: 'xs',
                          flex: 5
                        }
                      ]
                    }
                  ]
                }
              ],
              spacing: 'sm',
              paddingAll: '13px'
            }
          }
        ]
        const message = {
          type: 'flex',
          altText: `${event.postback.data.substr(0, newsI)} Stock News`,
          contents: {
            type: 'carousel',
            contents: flex
          }
        }

        fs.writeFileSync('stock-news.json', JSON.stringify(message, null, 2))
        event.reply(message)
      }

      if (event.postback.data.includes('market')) {
        const marketI = event.postback.data.indexOf('market') - 1
        // console.log(marketI)

        const responseMeta = await axios.get(
          `https://api.fugle.tw/realtime/v0.2/intraday/meta?symbolId=${encodeURI(
            event.postback.data.substr(0, marketI)
          )}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
        )
        const responseQuote = await axios.get(
          `https://api.fugle.tw/realtime/v0.2/intraday/quote?symbolId=${encodeURI(
            event.postback.data.substr(0, marketI)
          )}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
        )
        // const responseDealts = await axios.get(
        //   `https://api.fugle.tw/realtime/v0.2/intraday/dealts?symbolId=${encodeURI(event.postback.data.substr(0, (event.postback.data.indexOf("news")-1)))}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0&limit=9`
        // )

        const flex = [
          // 個股日成交資訊
          {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                // 股票代號
                {
                  type: 'text',
                  text: `${responseMeta.data.data.info.symbolId}`,
                  weight: 'bold',
                  size: 'xxl',
                  margin: 'none',
                  color: '#2A1E5C'
                },
                // 股票中文名稱
                {
                  type: 'text',
                  text: `${responseMeta.data.data.meta.nameZhTw}`,
                  size: 'sm',
                  color: '#2A1E5Caa',
                  wrap: true,
                  margin: 'sm',
                  offsetStart: 'xs'
                },
                {
                  type: 'separator',
                  margin: 'xxl'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'xxl',
                  spacing: 'sm',
                  contents: [
                    // 開盤價 priceOpen
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '開盤價',
                          size: 'sm',
                          color: '#555555',
                          flex: 0
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.priceOpen.price}`,
                          size: 'sm',
                          color: '#111111',
                          align: 'end'
                        }
                      ]
                    },
                    // 最高價 priceHigh
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '最高價',
                          size: 'sm',
                          color: '#555555',
                          flex: 0
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.priceHigh.price}`,
                          size: 'sm',
                          color: '#111111',
                          align: 'end'
                        }
                      ]
                    },
                    // 最低價 priceLow
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '最低價',
                          size: 'sm',
                          color: '#555555',
                          flex: 0
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.priceLow.price}`,
                          size: 'sm',
                          color: '#111111',
                          align: 'end'
                        }
                      ]
                    },
                    // 收盤價 chart 的最後一分鐘的 close
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '收盤價',
                          size: 'sm',
                          color: '#555555',
                          flex: 0
                        },
                        {
                          type: 'text',
                          text: '000',
                          size: 'sm',
                          color: '#111111',
                          align: 'end'
                        }
                      ]
                    },
                    // 漲跌 change
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '漲跌',
                          size: 'sm',
                          color: '#555555',
                          flex: 0
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.change}`,
                          size: 'sm',
                          color: '#111111',
                          align: 'end'
                        }
                      ]
                    },
                    // 漲跌幅 changePercent
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '漲跌幅',
                          size: 'sm',
                          color: '#555555',
                          flex: 0
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.changePercent}`,
                          size: 'sm',
                          color: '#111111',
                          align: 'end'
                        }
                      ]
                    },
                    // 總成交張數 unit
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '總成交張數',
                          size: 'sm',
                          color: '#555555',
                          flex: 0
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.total.unit}`,
                          size: 'sm',
                          color: '#111111',
                          align: 'end'
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'separator',
                  margin: 'xxl'
                },
                // 歷史走勢
                {
                  type: 'box',
                  layout: 'horizontal',
                  margin: 'md',
                  contents: [
                    {
                      type: 'text',
                      text: '歷史走勢',
                      size: 'xs',
                      color: '#aaaaaa',
                      flex: 0,
                      action: {
                        type: 'uri',
                        label: 'action',
                        uri: `https://www.google.com/finance/quote/${encodeURI(event.postback.data.substr(0, marketI))}:TPE?window=MAX`
                      }
                    },
                    {
                      type: 'text',
                      text: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()} ${new Date().getHours()}:${
                        new Date().getMinutes() + 1
                      }`,
                      color: '#aaaaaa',
                      size: 'xs',
                      align: 'end'
                    }
                  ]
                }
              ]
            },
            styles: {
              footer: {
                separator: true
              }
            }
          },
          // 五檔
          {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: `${responseMeta.data.data.info.symbolId}`,
                  weight: 'bold',
                  size: 'xxl',
                  margin: 'none',
                  color: '#2A1E5C'
                },
                {
                  type: 'text',
                  text: `${responseMeta.data.data.meta.nameZhTw}`,
                  size: 'sm',
                  color: '#2A1E5Caa',
                  wrap: true,
                  margin: 'sm',
                  offsetStart: 'xs'
                },
                {
                  type: 'separator',
                  margin: 'xxl'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'md',
                  spacing: 'sm',
                  contents: [
                    // for (let i=0;i<5;i++ ;){i}
                    // 買 bestBids 賣 bestAsks
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '買',
                          align: 'center',
                          color: '#FF5D73'
                        },
                        {
                          type: 'filler'
                        },
                        {
                          type: 'text',
                          text: '賣',
                          align: 'center',
                          color: '#06A77D'
                        }
                      ],
                      // backgroundColor: '#6CD4FFaa',
                      // paddingAll: 'sm',
                      justifyContent: 'space-between',
                      margin: 'lg'
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[0].unit}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[0].price}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'filler'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[0].price}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[0].unit}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[1].unit}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[1].price}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'filler'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[1].price}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[1].unit}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[2].unit}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[2].price}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'filler'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[2].price}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[2].unit}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[3].unit}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[3].price}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'filler'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[3].price}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[3].unit}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[4].unit}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[4].price}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'filler'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[4].price}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[4].unit}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        }
                      ]
                    },
                    // 百分比
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'filler'
                            }
                          ],
                          width: '39%',
                          backgroundColor: '#FF5D73',
                          height: '8px'
                        }
                      ],
                      backgroundColor: '#06A77D',
                      height: '8px',
                      margin: 'md'
                    }
                  ]
                },
                {
                  type: 'separator',
                  margin: 'xxl'
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  margin: 'lg',
                  contents: [
                    {
                      type: 'text',
                      text: '即時走勢',
                      size: 'xs',
                      color: '#aaaaaa',
                      flex: 0,
                      offsetStart: 'sm',
                      action: {
                        type: 'uri',
                        label: 'action',
                        uri: `https://www.google.com/finance/quote/${encodeURI(event.postback.data.substr(0, marketI))}:TPE`
                      }
                    },
                    {
                      type: 'text',
                      text: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()} ${new Date().getHours()}:${
                        new Date().getMinutes() + 1
                      }`,
                      color: '#aaaaaa',
                      size: 'xs',
                      align: 'end',
                      offsetEnd: 'sm'
                    }
                  ]
                }
              ]
            },
            styles: {
              footer: {
                separator: true
              }
            }
          }
        ]

        const message = {
          type: 'flex',
          altText: `${event.postback.data.substr(0, marketI)} Stock Market`,
          contents: {
            type: 'carousel',
            contents: flex
          }
        }

        fs.writeFileSync('stock-market.json', JSON.stringify(message, null, 2))
        event.reply(message)
      }

      if (arrSymbolId.includes(event.postback.data)) {
        // 回復選單
        const flex = [
          {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'image',
                  url: 'https://imgur.com/lvTvZ6Z.png',
                  size: 'full',
                  aspectMode: 'cover',
                  aspectRatio: '15:19',
                  gravity: 'top'
                },
                // stock market
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'filler'
                        },
                        {
                          type: 'box',
                          layout: 'baseline',
                          contents: [
                            {
                              type: 'icon',
                              url: 'https://img.icons8.com/nolan/344/stock-share.png'
                            },
                            {
                              type: 'text',
                              text: 'stock market',
                              color: '#3c3899',
                              flex: 0,
                              offsetTop: '-2px'
                            }
                          ],
                          spacing: 'sm',
                          paddingStart: 'lg'
                        },
                        {
                          type: 'filler'
                        }
                      ],
                      borderWidth: '1.5px',
                      cornerRadius: '4px',
                      spacing: 'sm',
                      borderColor: '#5e50ff',
                      backgroundColor: '#DEDAFBaa',
                      margin: 'md',
                      height: '45px',
                      action: {
                        type: 'postback',
                        label: 'stock market',
                        data: `${event.postback.data} market`
                      }
                    },
                    // stock news
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'filler'
                        },
                        {
                          type: 'box',
                          layout: 'baseline',
                          contents: [
                            {
                              type: 'icon',
                              url: 'https://img.icons8.com/nolan/344/card-exchange.png'
                            },
                            {
                              type: 'text',
                              text: 'stock news',
                              color: '#3c3899',
                              flex: 0,
                              offsetTop: '-2px'
                            }
                          ],
                          spacing: 'sm',
                          paddingStart: 'lg'
                        },
                        {
                          type: 'filler'
                        }
                      ],
                      borderWidth: '1.5px',
                      cornerRadius: '4px',
                      spacing: 'sm',
                      borderColor: '#5e50ff',
                      backgroundColor: '#DEDAFBaa',
                      margin: 'md',
                      height: '45px',
                      action: {
                        type: 'postback',
                        label: 'stock news',
                        data: `${event.postback.data} news`
                      }
                    },
                    // stock history
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'filler'
                        },
                        {
                          type: 'box',
                          layout: 'baseline',
                          contents: [
                            {
                              type: 'icon',
                              url: 'https://img.icons8.com/nolan/344/pay-date.png'
                            },
                            {
                              type: 'text',
                              text: 'stock history',
                              color: '#3c3899',
                              flex: 0,
                              offsetTop: '-2px'
                            }
                          ],
                          spacing: 'sm',
                          action: {
                            type: 'uri',
                            label: 'stock history',
                            uri: `https://www.google.com/finance/quote/${encodeURI(event.postback.data)}:TPE?window=MAX`
                          },
                          paddingStart: 'lg'
                        },
                        {
                          type: 'filler'
                        }
                      ],
                      borderWidth: '1.5px',
                      cornerRadius: '4px',
                      spacing: 'sm',
                      borderColor: '#5e50ff',
                      backgroundColor: '#DEDAFBaa',
                      margin: 'md',
                      height: '45px'
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'filler'
                        },
                        // 使用說明
                        {
                          type: 'box',
                          layout: 'baseline',
                          contents: [
                            {
                              type: 'icon',
                              url: 'https://img.icons8.com/nolan/344/stock-share.png'
                            },
                            {
                              type: 'text',
                              text: 'Instructions',
                              color: '#3c3899',
                              flex: 0,
                              offsetTop: '-2px'
                            }
                          ],
                          spacing: 'sm',
                          paddingStart: 'lg'
                        },
                        {
                          type: 'filler'
                        }
                      ],
                      borderWidth: '1.5px',
                      cornerRadius: '4px',
                      spacing: 'sm',
                      borderColor: '#5e50ff',
                      backgroundColor: '#DEDAFBaa',
                      margin: 'md',
                      height: '45px',
                      action: {
                        type: 'postback',
                        label: 'Instructions',
                        data: 'Instructions'
                      }
                    }
                  ],
                  position: 'absolute',
                  // backgroundColor: '#2A1E5C66',
                  paddingAll: '70px',
                  paddingTop: '115px',
                  paddingEnd: '75px',
                  background: {
                    type: 'linearGradient',
                    angle: '110deg',
                    endColor: '#3c389999',
                    centerColor: '#3c389955',
                    startColor: '#3c3899aa',
                    centerPosition: '65%'
                  },
                  offsetEnd: '0px',
                  offsetBottom: '0px',
                  offsetStart: '0px',
                  offsetTop: '0px'
                },
                // 標題字 - 股票代號
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: `${event.postback.data}`,
                      color: '#dcedfb',
                      align: 'center',
                      gravity: 'center',
                      wrap: false,
                      adjustMode: 'shrink-to-fit',
                      size: 'lg'
                    }
                  ],
                  position: 'absolute',
                  cornerRadius: '15px',
                  backgroundColor: '#5e50ffbb',
                  offsetTop: '70px',
                  paddingAll: 'xs',
                  paddingStart: 'md',
                  paddingEnd: 'md',
                  offsetStart: '123px',
                  width: '119px'
                }
              ],
              paddingAll: '0px'
            }
          }
        ]

        const message = {
          type: 'flex',
          altText: `${event.postback.data} Stock Menu`,
          contents: {
            type: 'carousel',
            contents: flex
          }
        }

        fs.writeFileSync('stock-menu.json', JSON.stringify(message, null, 2))
        event.reply(message)
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
