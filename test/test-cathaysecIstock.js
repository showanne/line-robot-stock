import axios from 'axios'

// 要先取得 https://istockapp.cathaysec.com.tw/Marketing/Souvenir/Service.aspx/SouvenirSearch 的 d{} 後，將一長串資料解碼 decoded ，再用 filtter ? 去搜尋使用者輸入的股票代號，去給予 股東會資訊

const StockList = async () => {
  try {
    // axios.post('', {para: ''})
    const data = await axios.post(
      'https://istockapp.cathaysec.com.tw/Marketing/Souvenir/Service.aspx/SouvenirDetail',
      { para: 'MTEwMnzluLjmnIN8MjAyMS8wNi8yNQ==' }
    )
    console.log(data.data)
  } catch (error) {
    console.log(error)
  }
}

StockList()

// const StockList = axios.post(
//   'https://istockapp.cathaysec.com.tw/Marketing/Souvenir/Service.aspx/SouvenirDetail',
//   { para: 'MTIwMXzluLjmnIN8MjAyMS8wNi8yMw==' }
// )
// console.log(StockList())
//    StockList is not a function

const base64 = Buffer.from('MjcyN3zluLjmnIN8MjAyMS8wNi8yOQ==', 'base64')
const decoded = base64.toString('utf-8')
console.log(decoded) // 2727|常會|2021/06/29

// https://webap.cathaysec.com.tw/TreasuryStock/kchart/lastclose/0056.png?t=1623984243943
// 0056 股票代號
// t= 時間 new Date().getTime()
// $("#stockImg").attr("src", "https://webap.cathaysec.com.tw/TreasuryStock/kchart/lastclose/" + result.股票代號 + ".png" + "?t=" + new Date().getTime());
