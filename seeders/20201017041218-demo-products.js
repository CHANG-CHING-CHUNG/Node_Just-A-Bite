'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Items', [{
      item_name: '六彩雙茄起司沙拉',
      item_price: 300,
      item_quantity: 10,
      item_image:'六彩雙茄起司沙拉.png',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      item_name: '豆芽涼拌羅勒小金磚',
      item_price: 300,
      item_quantity: 10,
      item_image:'豆芽涼拌羅勒小金磚.png',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      item_name: '輕盈高麗卷湘南',
      item_price: 300,
      item_quantity: 10,
      item_image:'輕盈高麗卷湘南.png',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      item_name: '鮮嫩洋芋白丁佐莎莎',
      item_price: 300,
      item_quantity: 10,
      item_image:'鮮嫩洋芋白丁佐莎莎.png',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Items', null, {});
  }
};
