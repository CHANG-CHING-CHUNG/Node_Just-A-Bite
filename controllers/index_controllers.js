const db =require('../models');
const bcrypt = require('bcryptjs');
const saltRounds = bcrypt.genSaltSync(10);
const Prize = db.Prize;
const Item = db.Item;
const Faq = db.Faq;
const Order = db.Order;
const Customer = db.Customer;

function drawLottery(probaArr)  {
  const proba = probaArr;
  let sum = 0;
  const sortedProba = proba.sort((a, b) => a -b );
  const newProba = sortedProba.map((pro) => {
    return sum += pro
  })

  
  const count = new Array(newProba.length).fill(0);
  
  const rand = Math.random() * sum
  
  for (let i = 0; i < newProba.length; i++) {
    if( i != 0) {
      if( rand > newProba[i-1] && rand <= newProba[i]) {
        count[i] = count[i] += 1;
      }
    } else {
      if( rand <= newProba[i]) {
        count[i] = count[i] += 1;
      }
    }
  }

    
  const prize = count.findIndex((count) => {
    return count === 1;
  }) + 1;
  return prize

}

function fillProbaGap(probaArr) {
  const pro = probaArr;
  
  const sumOfPro = pro.reduce((acc, cur) => {
    return acc + cur;
  },0)
  
  const gap = 100 - sumOfPro;
  
  if (gap != 0) {
    pro.push(gap);
  }
  return pro;
}

const index_controller = {
  index: (req, res) => {
    res.render('index');
  },

  faq: async (req, res) => {
    const faqs = await Faq.findAll({
      order:[['faq_order', 'ASC']]
    });

    res.render('faq', { faqs:faqs });
  },

  game: async (req, res) => {
    let prizes = await Prize.findAll({
      order:[['probability','ASC']]
    });
    res.render('game', { prizes:prizes });
  },

  lottery: async (req, res) => {
    let prizes = await Prize.findAll({
      order:[['probability','ASC']]
    });
    if (!prizes.length) {
      req.flash('errorMessage', '資料庫獎項為空');
      return res.redirect('/game');
    }
    const probaOfPrizes = prizes.map(prize => {
      if(prize.probability === 0) {
        return prize.probability = 1;
      } else {
        return prize.probability
      }
    });
    const itemNum = drawLottery(probaOfPrizes);

    res.render('lottery', { prize: prizes[itemNum - 1]});
  },

  menu: async (req, res) => {
    const products = await Item.findAll();

    res.render('menu', { products:products });
  },
  cart: async (req, res) => {
    const { customerId } = req.session;
    let currentCustomer = [];
    if (customerId) {
      currentCustomer = await Customer.findAll({
        where:{
          id:customerId
        }
      })
    }
    res.render('cart', { currentCustomer });
  },
  customerLogin: async (req, res) => {
    req.session.referer = req.headers.referer;
    res.render('customerLogin')
  },
  handleCustomerLogin: async (req, res,next) => {
    const {username, password} = req.body;
    const referer = req.session.referer.match(/\/cart/);
    if (!username || !password) {
      req.flash('errorMessage', '帳號密碼不得為空');
      return next();
    }

    const customer = await Customer.findAll({
      where: {
        username
      }
    });
    if (!customer.length) {
      req.flash('errorMessage', '查無此使用者');
      return next();
    }

    bcrypt.compare(password, customer[0].password).then(result => {
      if (!result) {
        req.flash('errorMessage', '密碼錯誤');
        return next();
      }
      req.session.customerId = customer[0].id;
      req.session.customerUsername = customer[0].username;
      if (referer != null && referer[0] === '/cart') {
        return res.redirect('/cart');
      }
      res.redirect('/');

    }).catch(err => {
      console.log(err)
    })
  },
  handleCustomerLogout: async (req, res) => {
    req.session.customerId = null
    req.session.customerUsername = null
    req.session.originalUrl = null;
    res.redirect('/');
  },
  signup: async (req, res) => {
    res.render('signup');
  },
  handleCustomerRegister: async (req, res,next) => {
    const {username, nickname , password, email} = req.body;

    if (!username || !password || !email || !nickname) {
      req.flash('errorMessage', '帳號密碼、真實姓名及電子信箱不得為空');
      return next();
    }
    const customerUsername = await Customer.findAll({
      where: {
        username:username
      }
    });
    const customerEmail = await Customer.findAll({
      where: {
        email:email
      }
    });

    if (!customerEmail.length || !customerUsername.length) {

      const hash = bcrypt.hashSync(password, saltRounds);

      const customer =   await Customer.create({
        username,
        nickname,
        password:hash,
        email
      });
      req.session.customerId = customer.id;
      req.session.customerUsername = customer.username;
      res.redirect('/');

    } else if(customerEmail.length) {
      req.flash('errorMessage', '電子信箱已被人註冊');
      return next();
    } else if(customerUsername.length) {
      req.flash('errorMessage', '帳號已被人註冊');
      return next();
    }
  },
  customerInfo: async (req, res, next) => {
    const { customerId } = req.session;
    if (!customerId) {
      return res.redirect('/');
    }
    const currentCustomer = await Customer.findAll({
      where: {
        id:customerId
      }
    })
    res.render('customerInfo', {currentCustomer});
  },
  handleUpdateCustomerInfo: async (req, res, next) => {
    const { customerId } = req.session;
    if (!customerId) {
      return res.redirect('/');
    }

    const {nickname, password, email} = req.body;
    const currentCustomer = await Customer.findAll({
      where: {
        id:customerId
      }
    })
    if (nickname) {
      currentCustomer[0].nickname = nickname;
      await currentCustomer[0].save();
    }
    if (email) {
      currentCustomer[0].email = email;
      await currentCustomer[0].save();
    }
    if (password) {
      const hash = bcrypt.hashSync(password, saltRounds);
      currentCustomer[0].password = hash;
      await currentCustomer[0].save();
      req.flash('successMessage', '更新成功');
      return next();
    }
    req.flash('successMessage', '更新成功');
    return next()
  },
  checkOrders: async (req, res, next) => {
    const { customerId } = req.session;
    if (!customerId) {
      return res.redirect('/');
    }

    const customerOrder = await Order.findAll({
      where: {
        CustomerId:customerId
      }
    })
    res.render('checkOrders', {customerOrder});
  }
};


module.exports = index_controller;