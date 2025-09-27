import express from 'express'
import fetch from 'node-fetch'

const app = express()
const port = 3000

let cookie = 'SLBBAK=597bc5323584f3ba9bb92c1fdd57409d; JSESSIONID=A9DFCAEFC3A17C88C83D713F8A759678; ERPSESSIONID=5d5dbf30-52c2-4da8-a27c-144de77495dc; uname=Mindcoco; puname=Mindcoco; sign=48b982c96cb082858580a62e88ea5901; isNewWms=true; puname2=Mindcoco; sign2=48b982c96cb082858580a62e88ea5901; _ati=3450320791274; chooseToken=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6Ik1pbmRjb2NvIiwiZXhwIjoxNzU5MDM4MDYwLCJ1c2VySWQiOjczMTgzNX0.1TbBH298ZjlU2ijS-73D2YW0cMXa472hp_sRU6HXAow'

function addGift(orderId, giftId) {
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
  .then(res => res.json())
  .then(json => json.data.list)
}

app.get('/', (req, res) => {
  getOrders()
  .then(orders => res.send(`
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
    </script>

  <body>
  <h2>901 orders</h2>
  ${orders.filter(order => order.payAmount > 29.99 && order.payAmount <= 50).map(order => `
  <div class="order">
  <div>Buyer name: ${order.buyerName}</div>
  <div>Amount: ${order.payAmount}</div>
  ${order.orderItemList.some(item => item.skuCode === 'GIFT_200901') ? '<div class="green">Processed</div>' : '<div class="red">Not Processed</div>'}
  </div>
  `).join('')}

  <h2>902 orders</h2>
  ${orders.filter(order => order.payAmount > 50 && order.payAmount <= 80).map(order => `
  <div class="order">
  <div>Buyer name: ${order.buyerName}</div>
  <div>Amount: ${order.payAmount}</div>
  ${order.orderItemList.some(item => item.skuCode === 'GIFT_200902') ? '<div class="green">Processed</div>' : '<div class="red">Not Processed</div>'}
  </div>
  `).join('')}

  <h2>EYE</h2>
  ${orders.filter(order => order.payAmount > 129.99 && order.payAmount <= 300).map(order => `
  <div class="order">
  <div>Buyer name: ${order.buyerName}</div>
  <div>Amount: ${order.payAmount}</div>
  ${order.orderItemList.some(item => item.skuCode === '3000831EYE') ? '<div class="green">Processed</div>' : '<div class="red">Not Processed</div>'}
  </div>
  `).join('')}

  <button id="go" onclick="addGifts()">GO</button>
  `))
})

app.post('/add-gift', (req, res) => {
  getOrders().then(orders => orders.forEach(order => {
    if (order.payAmount > 29.99 && order.payAmount <= 50 && !order.orderItemList.some(item => item.skuCode === 'GIFT_200901'))
      addGift(order.id, 31347161)
    if (order.payAmount > 50 && order.payAmount <= 80 && !order.orderItemList.some(item => item.skuCode === 'GIFT_200902'))
      addGift(order.id, 31347162)
    if (order.payAmount > 129.99 && order.payAmount <= 300 && !order.orderItemList.some(item => item.skuCode === '3000831EYE'))
      addGift(order.id, 30172468)
  }))
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
