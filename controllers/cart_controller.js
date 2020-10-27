const db =require('../models');
const fs = require('fs'); 
const Item = db.Item;


const cart_controller = {
  checkItems: async (req, res) => {
    const clientItems = JSON.parse(req.body['cartList']);
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
        return item;
      }
      if ( clientItems[i].item_quantity <= 0 ) {
        item.item_quantity = 1;
        return item;
      }
      if( clientItems[i].item_quantity > item.item_quantity) {
        return item;
      }
      item.item_quantity = clientItems[i].item_quantity;
      return item;
    })
    res.json(JSON.stringify(filterServerItems))
  }
};


module.exports = cart_controller;