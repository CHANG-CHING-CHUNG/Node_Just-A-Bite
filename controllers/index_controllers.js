const db =require('../models');
const Prize = db.Prize;
const Item = db.Item;
const Faq = db.Faq;

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
    console.log(prizes)
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
  }
};


module.exports = index_controller;