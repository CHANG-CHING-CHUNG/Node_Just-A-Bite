'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Faqs', [{
      faq_title: '如何辦理退貨 ? ',
      faq_content: '請您於鑑賞期七日內利用【退貨服務】直接辦理退貨，退貨運費將由lativ為您負擔。（若退貨後商品未達免運標準，則原始訂單將加計公告運費）。 ',
      faq_order: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      faq_title: '目前提供哪些付款方式？  ',
      faq_content: `目前提供付款方式有五種：
      1.『超商取貨付款』，提供取貨付款的超商通路包括：7-11、全家、萊爾富、OK
      2.『信用卡』付款宅配到府（僅限台灣地區發行之VISA、Master Card、JCB信用卡） 3. 宅配貨到付款（限台灣本島）
      4. LINEPay（可用LINE Point折抵）
      5. Apple Pay（僅限使用iPhone手機）
      ※目前配合的宅配公司為：黑貓宅急便 `,
      faq_order: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      faq_title: '線上刷卡如何操作呢？',
      faq_content: '線上刷卡的使用方式也超簡單，只要您確認您當次的購物清單與金額都無誤，就可立即到匯款上傳系統，登入個人帳號密碼後，點選"線上刷卡方式"，確認收件住址後，再進行刷卡確認程序即可～ ',
      faq_order: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      faq_title: '什麼情況無法辦理退貨？',
      faq_content: `1. 超過7天退貨期限。
      2. 基於安全和衛生考量，貼身用品如內衣褲，襪子類等商品，若拆除安心縫線，恕不接受退貨。
      3. 商品已有使用痕跡、味道或人為造成髒污、沾染粉妝等，恕不接受退貨。
      4. 商品已剪標、已下水洗滌、修改尺寸、其他加工，商品或配件丟失或損毀。
      5. 活動贈品未退回。
      貼心叮嚀：如因個人因素退貨次數過多，lativ將視情況決定是否暫停出貨，煩請見諒。 `,
      faq_order: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      faq_title: '請問運費如何計算？ ',
      faq_content: `以下結帳方式之免運費標準，請依網站不定期公告之行銷活動為依據（唯訂單金額恕無法合併計算）。
      1. 7-11、全家、萊爾富、OK超商取貨付款訂單，單筆購物滿1000元，即享有免運費優惠。
      純商品金額購物未滿1000元(999元以下)，單筆訂單將酌收50元物流費。
      2. 宅配訂單(付款方式：信用卡、貨到付款、LINE Pay及 Apple Pay)，單筆訂單將酌收60元物流費。 `,
      faq_order: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      faq_title: '訂購商品後需幾天的時間才可以收到商品呢？ ',
      faq_content: `常態的出貨時間為：今天下單，明天取貨。
      但請務必注意：週日及例假日不出貨，超過每日截止時間的訂單要多等一天。 `,
      faq_order: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      faq_title: '台灣外島地區可以寄送嗎？ ',
      faq_content: `您可以選擇『超商取貨付款』或『信用卡/LINE Pay/Apple Pay付款』；若您採信用卡方式付款，將以郵局海運配送，預計3-7日內配達，而送達時間會因天氣狀況、船隻班次而有變動的可能性。 `,
      faq_order: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      faq_title: '門市訂單可否修改取貨時間？  ',
      faq_content: '因超商取貨服務時限為超商訂定作業規範，無法依個人需求彈性更動，請您見諒！ ',
      faq_order: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      faq_title: '如何更改訂購內容、送貨地址或取消訂單？  ',
      faq_content: `修改訂單：
      訂單送出後即無法修改訂單內容，如需修改，您可由「會員登入」登入帳號，取消訂單後再重新下單。
      取消訂單：
      訂單尚未進入包裝作業前您可由「會員登入」登入帳號，自行取消訂單， 由「會員登入」登入帳號 ＞＞ 進入「訂單查詢/問答/退貨查詢」狀態點選「取消訂單」，該筆訂單即完成取消訂單。
      
      ※ 訂單取消後即無法復原。
      ※ 若訂單商品已進入包裝作業，請恕無法為您取消訂單。
      ※ 提醒您，若您取消訂單後重新訂購，商品庫存請依當時頁面為主！`,
      faq_order: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      faq_title: '門市訂單可否修改配送門市？  ',
      faq_content: `因超商門市取貨購物流程，須連結到超商訂單系統中，並非單獨於本公司系統中完成，若您完成超商門市選取後，若非因門市自身暫停服務問題，將無法再變更門市，請您見諒！ 您可由「會員登入」登入查詢，如訂單尚未進入包裝作業前，您可自行取消訂單，再重新下單選擇正確的取件門市即可。 `,
      faq_order: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      faq_title: '商品鑑賞期內辦理退貨，沒有發票該怎麼辦? ',
      faq_content: `自2018/8/17起，lativ將以電子折讓單方式代為核銷，待退款完成後，您可自行至訂單中下載「電子折讓單」。 `,
      faq_order: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      faq_title: '使用電子發票，會有人通知我中獎嗎？電子發票如何兌領獎？  ',
      faq_content: `「二聯式電子發票」每逢單月26日將由財政部自動對獎（已索取紙本／已捐贈／已作廢發票除外），並於單月28日產生中獎清冊供營業人下載索取。 `,
      faq_order: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Faqs', null, {});
  }
};
