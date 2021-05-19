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
    console.log(arrSymbolId.includes(event.message.text))
    try {
      if (event.message.type === 'text') {
        if (event.message.text.includes('news')) {
          const responseSearch = await axios.get(`https://api.cnyes.com/media/api/v1/search?q=${encodeURI(event.message.text.substr(0, 4))}`)

          const newsArr = responseSearch.data.items.data

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
                url: `${newsArr[2].coverSrc.xl.src}`,
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
                    text: `${newsArr[2].title}`,
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
                            text: `${newsArr[2].keyword.join('、')}`,
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
            altText: `${event.message.text} Stock News`,
            contents: {
              type: 'carousel',
              contents: flex
            }
          }

          fs.writeFileSync('stock-news.json', JSON.stringify(message, null, 2))
          event.reply(message)
        }

        // if (event.message.text.includes('live')) {}

        if (arrSymbolId.includes(event.message.text)) {
          const flex = [
            {
              type: 'bubble',
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'image',
                    url: 'https://www.frevvo.com/blog/wp-content/uploads/2020/01/Frevvo-Improve-Finance-hero.png',
                    size: 'full',
                    aspectMode: 'cover',
                    aspectRatio: '15:19',
                    gravity: 'top'
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
                                text: 'stock market live',
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
                          label: 'stock market live',
                          data: `${event.message.text}`
                        }
                      },
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
    console.log(event.postback.data)
    console.log(arrSymbolId.includes(event.postback.data))
    try {
      if (arrSymbolId.includes(event.postback.data)) {
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
                  text: `${event.postback.data}`,
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
                    data: `${event.postback.data}`
                  }
                },
                {
                  type: 'button',
                  style: 'link',
                  height: 'sm',
                  action: {
                    type: 'message',
                    label: 'stock news',
                    text: `${event.postback.data}`
                  }
                },
                {
                  type: 'button',
                  style: 'link',
                  height: 'sm',
                  action: {
                    type: 'uri',
                    label: 'stock history',
                    uri: `https://www.google.com/finance/quote/${encodeURI(event.postback.data)}:TPE?window=MAX`
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
          altText: `${event.postback.data} Stock News`,
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
