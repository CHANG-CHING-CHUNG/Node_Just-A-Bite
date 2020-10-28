const db =require('../models');
const ecpay_payment = require('ecpay_payment_node_js');
const Item = db.Item;
const Customer = db.Customer;
const Order = db.Order;
const OrderItem = db.Order_item;
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}


function ecpay(orderNum, items, order,baseURL) {
  let itemNames = items.map((item,i) => {
    if (i > 0) {
      return `#${item.item_name} x ${item.item_quantity} $${item.item_price}`;
    }
    return `${item.item_name} x ${item.item_quantity} $${item.item_price}`;
  }).join('')
  const totalAmount = order.total;
  const currentTime = new Date().Format("yyyy/MM/dd hh:mm:ss");
  let base_param = {
    MerchantTradeNo: orderNum,
    MerchantTradeDate: currentTime,
    TotalAmount: totalAmount,
    TradeDesc: '測試交易描述',
    ItemName: itemNames,
    ReturnURL: baseURL,
    EncryptType:'1',
    ClientBackURL: 'http://just-a-bite.mentor4th-john.tw',
  };

  let create = new ecpay_payment();
  let html = create.payment_client.aio_check_out_all(parameters = base_param);
  return html;

}


async function validateItemQuantity(itemsObj) {
  itemsObj.forEach(item => {
    item.item_quantity = parseInt(item.item_quantity);
    item.item_price = parseInt(item.item_price);
    item.id = parseInt(item.id);
  })
  let isValid = true;
  const clientItems = itemsObj;
    const serverItems = [];
    for(let i = 0; i < clientItems.length; i++) {
      const dbItem = await Item.findAll({
        where: {
          id:clientItems[i].id
        }
      })
      if( dbItem.length ) {
        serverItems.push(dbItem[0])
      } 
    }

    const filterServerItems = serverItems.map((item, i) => {
      if( item.item_quantity === 0) {
        isValid = false;
        return item;
      }
      if ( clientItems[i].item_quantity <= 0 ) {
        item.item_quantity = 1;
        return item;
      }
      if( clientItems[i].item_quantity > item.item_quantity) {
        isValid = false;
        return item;
      }
      item.item_quantity = clientItems[i].item_quantity;
      return item;
    })

    return {
      filterServerItems,
      valid:isValid
    }
} 

async function orderTransaction(orderItemsArr) {
  const clientItems = orderItemsArr;
  const serverItems = [];
  for(let i = 0; i < clientItems.length; i++) {
    const dbItem = await Item.findAll({
      where: {
        id:clientItems[i].id
      }
    })
    if( dbItem.length ) {
      serverItems.push(dbItem[0])
    } 
  }
  let newServerItems = [];
  serverItems.forEach((item, i) => {
    item.item_quantity = item.item_quantity - clientItems[i].item_quantity;
    newServerItems.push(item);
  })

  let result
  try {
    result = await db.sequelize.transaction(async (t) => {
      const resultItems = [];
      for(let i = 0; i < newServerItems.length; i++) {
        const item = await Item.update(
          {
            item_quantity:newServerItems[i].item_quantity
          },
          {
          where: {
            id:newServerItems[i].id
          }
        })
        resultItems.push(item);
      }

      return resultItems;
    });
  
  } catch (error) {
    console.log(error);
  }

  let isValid = false;

  result.forEach(item => {
    if (item[0] !== 0) {
      isValid = true;
    }
  })

  return isValid;
}

async function createOrderIndatabase( customerId, buyerInfo, orderItems) {
  const currentDate = new Date();
  const orderNumber = String(currentDate.getFullYear()) + String(currentDate.getMonth()+1) + String(currentDate.getDate()) + String(currentDate.getHours()) + String(currentDate.getMinutes()) + String(currentDate.getSeconds());

  const order = await Order.create({
    CustomerId:customerId,
    order_number: orderNumber + String(customerId),
    subtotal:buyerInfo.subtotal,
    total:buyerInfo.total,
    shipping_address:buyerInfo.buyerAddress,
    phone: buyerInfo.buyerPhone
  })
  const orderItemRecords = [];
  for( let i = 0; i < orderItems.length; i++) {
    const orderItemRecord = await OrderItem.create({
      OrderId: order.id,
      ItemId: orderItems[i].id,
      quantity: orderItems[i].item_quantity,
    })
    orderItemRecords.push(orderItemRecord);
  }

  return order;
}


const checkout_controller = {
  createOrder: async (req, res) => {
    const { customerId } = req.session;
    if (!customerId) {
      return res.send('Not valid');
    }
    const { items, buyerInfo} = req.body;
    const results = await validateItemQuantity(items)
    if (!results.valid) {
      return res.send(results);
    }
    const isTransationOk = await orderTransaction(results.filterServerItems);
    if( isTransationOk ) {
      const newOrder = await createOrderIndatabase(customerId, buyerInfo, items)
      const html = await ecpay(newOrder.order_number, items, newOrder, 'http://just-a-bite.mentor4th-john.tw/checkPayment');
      return res.send({results, html})
    }
  },

  checkPayment: async (req, res) => {
    console.log(req.body);
  }
};


module.exports = checkout_controller;