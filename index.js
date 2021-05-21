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

  if (event.type === 'message') {
    // console.log(arrSymbolId.includes(event.message.text))
    try {
      if (event.message.type === 'text') {
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
                url: `${newsArr[0].coverSrc.xl.src}`,
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
                url: `${newsArr[0].coverSrc.xl.src}`,
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
                url: `${newsArr[0].coverSrc.xl.src}`,
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

          // const responseChart = await axios.get(
          //   `https://api.fugle.tw/realtime/v0.2/intraday/chart?symbolId=${encodeURI(
          //     event.message.text.substr(0, marketI)
          //   )}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
          // )
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

          const flex = [
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
                            align: 'end',
                            color: '#FF5D73'
                          },
                          {
                            type: 'filler'
                          },
                          {
                            type: 'text',
                            text: '賣',
                            align: 'start',
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
                            align: 'center',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[0].price}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'center',
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
                            align: 'center',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[0].unit}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'center',
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
                            align: 'center',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[1].price}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'center',
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
                            align: 'center',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[1].unit}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'center',
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
                            align: 'center',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[2].price}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'center',
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
                            align: 'center',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[2].unit}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'center',
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
                            align: 'center',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[3].price}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'center',
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
                            align: 'center',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[3].unit}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'center',
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
                            align: 'center',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[4].price}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'center',
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
                            align: 'center',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[4].unit}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'center',
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
                    margin: 'md',
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
                  // 背景圖片
                  {
                    type: 'image',
                    url: 'https://i.imgur.com/HFn5hpS.png',
                    // url: 'https://www.frevvo.com/blog/wp-content/uploads/2020/01/Frevvo-Improve-Finance-hero.png',
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
                                type: 'filler'
                              },
                              {
                                type: 'icon',
                                url: 'https://img.icons8.com/nolan/344/stock-share.png'
                              },
                              {
                                type: 'text',
                                text: 'stock market',
                                color: '#2A1E5C',
                                flex: 0,
                                offsetTop: '-2px'
                              },
                              {
                                type: 'filler'
                              }
                            ],
                            spacing: 'sm'
                          },
                          {
                            type: 'filler'
                          }
                        ],
                        borderWidth: '1px',
                        cornerRadius: '4px',
                        spacing: 'sm',
                        borderColor: '#8B80F9',
                        margin: 'xxl',
                        height: '40px',
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
                                type: 'filler'
                              },
                              {
                                type: 'icon',
                                url: 'https://img.icons8.com/nolan/344/card-exchange.png'
                              },
                              {
                                type: 'text',
                                text: 'stock news',
                                color: '#2A1E5C',
                                flex: 0,
                                offsetTop: '-2px'
                              },
                              {
                                type: 'filler'
                              }
                            ],
                            spacing: 'sm'
                          },
                          {
                            type: 'filler'
                          }
                        ],
                        borderWidth: '1px',
                        cornerRadius: '4px',
                        spacing: 'sm',
                        borderColor: '#8B80F9',
                        margin: 'xxl',
                        height: '40px',
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
                                type: 'filler'
                              },
                              {
                                type: 'icon',
                                url: 'https://img.icons8.com/nolan/344/pay-date.png'
                              },
                              {
                                type: 'text',
                                text: 'stock history',
                                color: '#2A1E5C',
                                flex: 0,
                                offsetTop: '-2px'
                              },
                              {
                                type: 'filler'
                              }
                            ],
                            spacing: 'sm',
                            action: {
                              type: 'uri',
                              label: 'stock history',
                              uri: `https://www.google.com/finance/quote/${encodeURI(event.message.text)}:TPE?window=MAX`
                            }
                          },
                          {
                            type: 'filler'
                          }
                        ],
                        cornerRadius: '4px',
                        spacing: 'sm',
                        borderColor: '#8B80F9',
                        margin: 'xxl',
                        height: '40px',
                        borderWidth: '1px'
                      }
                    ],
                    position: 'absolute',
                    offsetBottom: '0px',
                    offsetStart: '0px',
                    offsetEnd: '0px',
                    backgroundColor: '#6CD4FF66',
                    paddingAll: '36px',
                    paddingTop: '19px'
                  },
                  // 右上標題字 - 股票代號
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'text',
                        text: `${event.message.text}`,
                        color: '#EAD94C',
                        align: 'center',
                        size: 'xxl',
                        offsetTop: '3px',
                        margin: 'xs',
                        gravity: 'center',
                        wrap: false,
                        adjustMode: 'shrink-to-fit',
                        style: 'italic'
                      }
                    ],
                    position: 'absolute',
                    cornerRadius: '15px',
                    offsetTop: '18px',
                    backgroundColor: '#6CD4FFdd',
                    offsetStart: '18px',
                    height: '49px',
                    width: '99px'
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
        } else {
          event.reply('查無此股票')
        }
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
        console.log(newsI)

        const responseSearch = await axios.get(`https://api.cnyes.com/media/api/v1/search?q=${encodeURI(event.postback.data.substr(0, newsI))}`)

        const newsArr = responseSearch.data.items.data

        // 回復新聞
        const flex = [
          {
            type: 'bubble',
            size: 'micro',
            hero: {
              type: 'image',
              url: `${newsArr[0].coverSrc.xl.src}`,
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
              url: `${newsArr[3].coverSrc.xl.src}`,
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
        console.log(marketI)

        const responseChart = await axios.get(
          `https://api.fugle.tw/realtime/v0.2/intraday/chart?symbolId=${encodeURI(
            event.postback.data.substr(0, marketI)
          )}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
        )
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
        // const responseDealts = await axios.get(`https://api.fugle.tw/realtime/v0.2/intraday/dealts?symbolId=${encodeURI(event.postback.data.substr(0, marketI))}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0&limit=9`)

        for (const c in responseChart.data.data.chart) {
          // console.log(c.substr(11, 5))
          // var chartMin = c.substr(11, 5)
          var chartData = responseChart.data.data.chart[c]
          // console.log(chartMin)
          // console.log(chartData)
        }

        // for (const d in responseDealts.data.data.dealts) {
        // var dealtsData = responseDealts.data.data.dealts[d]
        // console.log(dealtsData)
        // }

        const flex = {
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'Detail',
                weight: 'bold',
                color: '#1DB446',
                size: 'sm'
              },
              {
                type: 'text',
                text: `${responseMeta.data.data.info.symbolId}`,
                weight: 'bold',
                size: 'xxl',
                margin: 'md'
              },
              {
                type: 'text',
                text: `${responseMeta.data.data.meta.nameZhTw}`,
                size: 'xs',
                color: '#aaaaaa',
                wrap: true
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
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'text',
                        text: '今日參考價',
                        size: 'sm',
                        color: '#555555',
                        flex: 0
                      },
                      {
                        type: 'text',
                        text: `${responseMeta.data.data.meta.priceReference}`,
                        size: 'sm',
                        color: '#111111',
                        align: 'end'
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'text',
                        text: '漲停價',
                        size: 'sm',
                        color: '#555555',
                        flex: 0
                      },
                      {
                        type: 'text',
                        text: `${responseMeta.data.data.meta.priceHighLimit}`,
                        size: 'sm',
                        color: '#111111',
                        align: 'end'
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'text',
                        text: '跌停價',
                        size: 'sm',
                        color: '#555555',
                        flex: 0
                      },
                      {
                        type: 'text',
                        text: `${responseMeta.data.data.meta.priceLowLimit}`,
                        size: 'sm',
                        color: '#111111',
                        align: 'end'
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'text',
                        text: '今日漲跌幅',
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
                  {
                    type: 'separator',
                    margin: 'xxl'
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    margin: 'xxl',
                    contents: [
                      {
                        type: 'text',
                        text: '此分鐘',
                        size: 'sm',
                        color: '#555555'
                      },
                      {
                        type: 'text',
                        text: 'chartMin',
                        size: 'sm',
                        color: '#111111',
                        align: 'end'
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'text',
                        text: '此分鐘的開盤價',
                        size: 'sm',
                        color: '#555555'
                      },
                      {
                        type: 'text',
                        text: `${chartData.open}`,
                        size: 'sm',
                        color: '#111111',
                        align: 'end'
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'text',
                        text: '此分鐘的最高價',
                        size: 'sm',
                        color: '#555555'
                      },
                      {
                        type: 'text',
                        text: `${chartData.high}`,
                        size: 'sm',
                        color: '#111111',
                        align: 'end'
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'text',
                        text: '此分鐘的最低價',
                        size: 'sm',
                        color: '#555555'
                      },
                      {
                        type: 'text',
                        text: `${chartData.low}`,
                        size: 'sm',
                        color: '#111111',
                        align: 'end'
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'text',
                        text: '此分鐘的收盤價',
                        size: 'sm',
                        color: '#555555'
                      },
                      {
                        type: 'text',
                        text: `${chartData.close}`,
                        size: 'sm',
                        color: '#111111',
                        align: 'end'
                      }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'text',
                        text: '此分鐘的交易張數',
                        size: 'sm',
                        color: '#555555'
                      },
                      {
                        type: 'text',
                        text: `${chartData.unit}`,
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
              {
                type: 'box',
                layout: 'horizontal',
                margin: 'md',
                contents: [
                  {
                    type: 'text',
                    text: '歷史資料查詢',
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
        }

        const message = {
          type: 'flex',
          altText: `${event.postback.data.substr(0, marketI)} Stock Market`,
          contents: {
            type: 'carousel',
            contents: [flex]
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
                // 背景圖片
                {
                  type: 'image',
                  url: 'https://i.imgur.com/HFn5hpS.png',
                  // url: 'https://www.frevvo.com/blog/wp-content/uploads/2020/01/Frevvo-Improve-Finance-hero.png',
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
                              type: 'filler'
                            },
                            {
                              type: 'icon',
                              url: 'https://img.icons8.com/nolan/344/stock-share.png'
                            },
                            {
                              type: 'text',
                              text: 'stock market',
                              color: '#2A1E5C',
                              flex: 0,
                              offsetTop: '-2px'
                            },
                            {
                              type: 'filler'
                            }
                          ],
                          spacing: 'sm'
                        },
                        {
                          type: 'filler'
                        }
                      ],
                      borderWidth: '1px',
                      cornerRadius: '4px',
                      spacing: 'sm',
                      borderColor: '#8B80F9',
                      margin: 'xxl',
                      height: '40px',
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
                              type: 'filler'
                            },
                            {
                              type: 'icon',
                              url: 'https://img.icons8.com/nolan/344/card-exchange.png'
                            },
                            {
                              type: 'text',
                              text: 'stock news',
                              color: '#2A1E5C',
                              flex: 0,
                              offsetTop: '-2px'
                            },
                            {
                              type: 'filler'
                            }
                          ],
                          spacing: 'sm'
                        },
                        {
                          type: 'filler'
                        }
                      ],
                      borderWidth: '1px',
                      cornerRadius: '4px',
                      spacing: 'sm',
                      borderColor: '#8B80F9',
                      margin: 'xxl',
                      height: '40px',
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
                              type: 'filler'
                            },
                            {
                              type: 'icon',
                              url: 'https://img.icons8.com/nolan/344/pay-date.png'
                            },
                            {
                              type: 'text',
                              text: 'stock history',
                              color: '#2A1E5C',
                              flex: 0,
                              offsetTop: '-2px'
                            },
                            {
                              type: 'filler'
                            }
                          ],
                          spacing: 'sm',
                          action: {
                            type: 'uri',
                            label: 'stock history',
                            uri: `https://www.google.com/finance/quote/${encodeURI(event.postback.data)}:TPE?window=MAX`
                          }
                        },
                        {
                          type: 'filler'
                        }
                      ],
                      cornerRadius: '4px',
                      spacing: 'sm',
                      borderColor: '#8B80F9',
                      margin: 'xxl',
                      height: '40px',
                      borderWidth: '1px'
                    }
                  ],
                  position: 'absolute',
                  offsetBottom: '0px',
                  offsetStart: '0px',
                  offsetEnd: '0px',
                  backgroundColor: '#6CD4FF66',
                  paddingAll: '36px',
                  paddingTop: '19px'
                },
                // 右上標題字 - 股票代號
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: `${event.postback.data}`,
                      color: '#EAD94C',
                      align: 'center',
                      size: 'xxl',
                      offsetTop: '3px',
                      margin: 'xs',
                      gravity: 'center',
                      wrap: false,
                      adjustMode: 'shrink-to-fit',
                      style: 'italic'
                    }
                  ],
                  position: 'absolute',
                  cornerRadius: '15px',
                  offsetTop: '18px',
                  backgroundColor: '#6CD4FFdd',
                  offsetStart: '18px',
                  height: '49px',
                  width: '99px'
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

      // if (arrSymbolId.includes(event.postback.data)) {
      //   const flex = [
      //     {
      //       type: 'bubble',
      //       hero: {
      //         type: 'image',
      //         url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
      //         size: 'full',
      //         aspectMode: 'cover'
      //       },
      //       body: {
      //         type: 'box',
      //         layout: 'vertical',
      //         contents: [
      //           {
      //             type: 'text',
      //             text: `${event.postback.data}`,
      //             weight: 'bold',
      //             size: 'xl',
      //             align: 'center'
      //           }
      //         ]
      //       },
      //       footer: {
      //         type: 'box',
      //         layout: 'vertical',
      //         spacing: 'sm',
      //         contents: [
      //           {
      //             type: 'button',
      //             style: 'link',
      //             height: 'sm',
      //             action: {
      //               type: 'postback',
      //               label: 'stock market',
      //               data: `${event.postback.data}`
      //             }
      //           },
      //           {
      //             type: 'button',
      //             style: 'link',
      //             height: 'sm',
      //             action: {
      //               type: 'message',
      //               label: 'stock news',
      //               text: `${event.postback.data}`
      //             }
      //           },
      //           {
      //             type: 'button',
      //             style: 'link',
      //             height: 'sm',
      //             action: {
      //               type: 'uri',
      //               label: 'stock history',
      //               uri: `https://www.google.com/finance/quote/${encodeURI(event.postback.data)}:TPE?window=MAX`
      //             }
      //           },
      //           {
      //             type: 'spacer',
      //             size: 'sm'
      //           }
      //         ],
      //         flex: 0
      //       }
      //     }
      //   ]

      //   const message = {
      //     type: 'flex',
      //     altText: `${event.postback.data} Stock Menu`,
      //     contents: {
      //       type: 'carousel',
      //       contents: flex
      //     }
      //   }

      //   fs.writeFileSync('stock-menu.json', JSON.stringify(message, null, 2))
      //   event.reply(message)
      // } else {
      //   event.reply('查無此股票')
      // }
    } catch (error) {
      console.log(error)
      // event.reply(error)
      event.reply('發生錯誤QQ')
    }
  }
})
