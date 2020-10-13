const db =require('../models');
const Prize = db.Prize;

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

  faq: (req, res) => {
    res.render('faq');
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
    const probaOfPrizes = prizes.map(prize => {
      if(prize.probability === 0) {
        return prize.probability = 1;
      } else {
        return prize.probability
      }
    });
    const itemNum = drawLottery(probaOfPrizes);

    res.render('lottery', { prize: prizes[itemNum - 1]});
  }
};


module.exports = index_controller;