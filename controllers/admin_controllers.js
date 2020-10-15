const db =require('../models');
const fs = require('fs'); 

const User = db.User;
const Prize = db.Prize;

const admin_controller = {
  admin: async (req, res) => {
    const { userId } = req.session;

    let prizes = await Prize.findAll();

    if (!prizes.length) {
      prizes = [];
    } 

    res.render('admin', { prizes:prizes,userId:userId });
  },

  login: (req, res) => {
    const { userId } = req.session;
    if (userId) {
      return res.redirect('/admin');
    }
    res.render('login');
  },

  handleLogin: async (req, res, next) => {
    const {username, password} = req.body;

    if (!username || !password) {
      req.flash('errorMessage', '帳號密碼不得為空');
      return next();
    }

    const admin = await User.findAll({
      where: {
        username:username
      }
    });
    if (!admin.length) {
      req.flash('errorMessage', '查無此使用者');
      return next();
    }
    if (admin[0].password !== password) {
      req.flash('errorMessage', '密碼錯誤');
      return next();
    }

    req.session.userId = admin[0].id;
    req.session.username = admin[0].username;
    res.redirect('/admin');
  },

  handleLogout: (req, res) => {
    req.session.userId = null;
    req.session.username = null;
    res.redirect('/admin')
  },

  items: async (req, res) => {
    const { userId } = req.session;
    if (!userId) {
      return res.redirect('/admin');
    }
    let prizes = await Prize.findAll();
    if(!prizes) {
      prizes = [];
    }
    
    res.render('items', { prizes:prizes });
  },
  handleUpdate: async (req, res,next) => {
    const { userId } = req.session;
    if (!userId) {
      return res.redirect('/admin');
    }
    const { item_id, item_name , item_desc, item_proba } = req.fields;
    if(item_proba < 0) {
      req.flash('errorMessage', '不得輸入負數');
      return next()
    }
    const { item_image } = req.files

    const prizes = await Prize.findAll();
    const proba = prizes.map((prize) => {
      if (prize.id != item_id) {
        return prize.probability
      }
      return 0
      
    })
    const sum = proba.reduce((acc, cur) => {
      return acc + cur
    })

    if ((sum + parseInt(item_proba)) > 100 ) {
      req.flash('errorMessage', '機率的總合不得大於100');
      return next()
    }
    if (!item_image.size) {
      await Prize.update({
        name:item_name,
        description:item_desc,
        probability:item_proba
      }, {
        where: {
          id: item_id
        }
      })
     return res.redirect('/items')
    }

    if (item_image.type.match(/image/)) {
      let oldpath = item_image.path;
      let newpath = `./statics/images/${item_image.name}`;
      fs.copyFile(oldpath, newpath, (err) => {
        if(err) throw err;
        console.log("uploaded")
        fs.unlink(oldpath, (err) => {
          if (err) throw err;
          console.log('the old file has been deleted');
        })
      })
    } else {
      req.flash('errorMessage', '只能上傳圖片檔');
      return next()
    }

    await Prize.update({
      name:item_name,
      image:item_image.name,
      description:item_desc,
      probability:item_proba
    }, {
      where: {
        id: item_id
      }
    })

    res.redirect('/items')
  },

  handleDeleteItem: async (req, res, next) => {
    const { userId } = req.session;
    if (!userId) {
      return res.redirect('/admin');
    }
    const { item_id } = req.params;

    await Prize.destroy({
      where: {
        id:item_id
      }
    })

    return next();
  },

  handleCreatePrize: async (req, res, next) => {
    const { userId } = req.session;
    if (!userId) {
      return res.redirect('/admin');
    }
    const { item_name , item_desc } = req.fields;
    const { item_image } = req.files

    if (!item_image.size) {
      await Prize.create({
        name:item_name,
        description:item_desc,
        probability:0
      })
     return res.redirect('/items')
    }

    if (item_image.type.match(/image/)) {
      let oldpath = item_image.path;
      let newpath = `./statics/images/${item_image.name}`;
      fs.copyFile(oldpath, newpath, (err) => {
        if(err) throw err;
        console.log("uploaded")
        fs.unlink(oldpath, (err) => {
          if (err) throw err;
          console.log('the old file has been deleted');
        })
      })
    } else {
      req.flash('errorMessage', '只能上傳圖片檔');
      return next()
    }

    await Prize.create({
      name:item_name,
      image:item_image.name,
      description:item_desc,
      probability:0
    })

    res.redirect('/items')
  },

  handleReset: async (req, res) => {
    const { userId } = req.session;
    if (!userId) {
      return res.redirect('/admin');
    }
    const prizes = await Prize.findAll();

    prizes.forEach(async (prize) => {
      await Prize.update({
        probability:0
      }, {
        where: {
          id: prize.id
        }
      })
    })

    res.redirect('/items')
   
  },
};


module.exports = admin_controller;