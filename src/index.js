import express from 'express'
import fetch from 'node-fetch'

const app = express()
const port = 3000
app.use(express.json());

let cookie = null

const GIFT_CONFIG = [
  {
    skuCode: 'GIFT_200901',
    itemId: 31347161,
    fromAmount: 32,
    toAmount: 60
  },
  {
    skuCode: '3000832ORBIT_1',
    itemId: 30172473,
    fromAmount: 60,
    toAmount: 100
  },
  {
    skuCode: '3000831EYE',
    itemId: 30172468,
    fromAmount: 100,
    toAmount: 300
  },
]

function addGift(orderId, giftId) {
  if (!cookie) return

    fetch("https://www.mangoerp.com/erp/order/item/ajax?_xid=68d7799983c8eaa0d77c9e87", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,de-DE;q=0.6,de;q=0.5",
    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-type": "json",
    "x-requested-with": "xhr",
    cookie,
    "Referer": "https://www.mangoerp.com/erp/"
  },
  "body": `json=%7B%22id%22%3A${orderId}%2C%22goodsSkuId%22%3A${giftId}%2C%22productCount%22%3A1%2C%22productUnitPrice%22%3A0%2C%22logisticsAmount%22%3A0%7D`,
  "method": "POST"
}).then(res => res.text()).then(res => console.log(res));
}

function getOrders() {
  if (!cookie) return Promise.resolve([])

  return fetch("https://www.mangoerp.com/erp/order/data/search.json?_xid=68d77a5883c8eaa0d77c9e8d", {
  headers: {
    "accept": "application/json, text/plain, *",
    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,de-DE;q=0.6,de;q=0.5",
    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-type": "json",
    "x-requested-with": "xhr",
    cookie,
    "Referer": "https://www.mangoerp.com/erp/"
  },
  "body": "phase=order&pageSize=500&page=1&fuzzyOrderId=&fuzzySkuCode=&fuzzyGoodsCode=&fuzzyLogisticsNo=&fuzzyPackageId=&orderId=%5B%5D&traceId=%5B%5D&packageId=%5B%5D&sysAgentOrderId=%5B%5D&productIds=%5B%5D&productCode=%5B%5D&channelId=%5B%5D&agentId=%5B%5D&warehouseIds=%5B%5D&sku=%5B%5D&goodsCodes=%5B%5D&logisticsServiceName=%5B%5D&orderStatus=%5B%5D&buyer=%5B%5D&wishReceiverCountry=%5B%5D&buyerLoginId=%5B%5D&platform=%5B%5D&shops=%5B%5D&country=%5B%5D&labelId=%5B%5D&noLabel=&isPrinted=&type=&status=normal&payAmount=%5B%5D&packageCreateTime=%5B%5D&shipmentTime=%5B%5D&gmtVirtualSend=%5B%5D&payTime=%5B%5D&printTime=%5B%5D&datetime=%5B%5D&orderCreateTime=%5B%5D&ozontimetime=%5B%5D&timetimetime=%5B%5D&itemCount=&electric=&isReissue=&hasIssue=&isRefunded=&isSplit=&isShopeeFmtnBind=&hasStock=&purchaseStatus=&hasProxyPackage=&stockStatus=&submitChinapostStatus=&domesticTrackingNo=%5B%5D&hasPrintMemo=&isLocalRemark=%5B%5D&hasLocalMemo=&sort=&outOfStock=&platformWarehouse=&pairSku=&hasTracking=&purchaseOrderNos=%5B%5D",
  "method": "POST"
  })
  .then(async (res) => {
    try {
      const json = await res.json()
      return json.data.list
    } catch (e) {
      return null
    }
  })
}

app.get('/', (req, res) => {
  getOrders()
  .then(orders => {
    if (orders == null) {
      res.send("Something went wrong")
    } else {
  res.send(`
  <!doctype html>
  <head>
    <style>
    .order { margin-bottom: 20px; }
    .red, .green {
      display: inline-block;
      padding: 8px;
    }
    .red { background-color: lightpink; }
    .green { background-color: lightgreen; }
    </style>
    <script>
      let running = false
      function addGifts() {
        if (running) return
        document.getElementById('go').disabled = true
        running = true
        fetch('/add-gifts', { method: 'POST' }).then(() => {
          location.reload()
        })
      }

      function saveCookie() {
        const value = document.getElementById('cookie').value
        if (!value.trim()) return

        fetch('/save-cookie', {
         method: 'POST',
         headers: {
           'content-type': 'application/json'
         },
         body: JSON.stringify({ cookie: value })
       })
      }
    </script>

  <body>
  <h2>Cookie</h2>
  <textarea cols="20" rows="5" id="cookie"></textarea>
  <button onclick="saveCookie()">Save</button>

  ${cookie ?
  GIFT_CONFIG.map(config =>
  `
  <h2>${config.skuCode}</h2>
  ${orders.filter(order => order.payAmount >= config.fromAmount && order.payAmount < config.toAmount).map(order => `
  <div class="order">
  <div>Buyer name: ${order.buyerName}</div>
  <div>Amount: ${order.payAmount}</div>
  ${order.orderItemList.some(item => item.skuCode === config.skuCode) ? '<div class="green">Processed</div>' : '<div class="red">Not Processed</div>'}
  </div>
  `).join('')}
  `
  ).join('') +

  '<button id="go" onclick="addGifts()">GO</button>'
   : '<h3>No cookie, please save one first</h3>'}`)
    }}
  )
})

app.post('/add-gifts', (req, res) => {
  getOrders().then(orders => {
    orders.forEach(order => {
      GIFT_CONFIG.forEach(config => {
      if (order.payAmount >= config.fromAmount && order.payAmount < config.toAmount && !order.orderItemList.some(item => item.skuCode === config.skuCode))
        addGift(order.id, config.itemId)
      })
    })
    res.send('')
  })
})

app.post('/save-cookie', (req, res) => {
  cookie = req.body.cookie
  setTimeout(() => {
    cookie = null
  }, 60 * 60 * 1000)
  res.send('')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
