'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Prizes', [{
      name: '[頭獎]東京迪士尼來回機票',
      image: 'disney.jps',
      description: '東京迪士尼五天四夜遊~',
      probability:'1',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: '[二獎]Iphone-20',
      image: 'iphone.jpg',
      description: '最新款 Iphone 手機!',
      probability:'10',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: '[三獎]溫泉泡湯券',
      image: 'hot_spring.jpg',
      description: '新竹尖石溫泉泡湯券',
      probability:'20',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: '未中獎',
      image: 'sorry.jpg',
      description: '很遺憾你未中獎，再接再厲',
      probability:'69',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Prizes', null, {});
  }
};
