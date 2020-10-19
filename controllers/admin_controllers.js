const db =require('../models');
const fs = require('fs'); 

const User = db.User;
const Prize = db.Prize;
const Item = db.Item;
const Faq = db.Faq;

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
    if (!item_id || !item_name || !item_desc || !item_proba) {
      req.flash('errorMessage', '獎項名、描述及機率不得為空');
      return next()
    }
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
    let { item_id } = req.params;
    item_id = parseInt(item_id);

    if(item_id) {
      await Prize.destroy({
        where: {
          id:item_id
        }
      })
    } else {
      req.flash('errorMessage', '刪除失敗');
      return next()
    }

    return next();
  },

  handleCreatePrize: async (req, res, next) => {
    const { userId } = req.session;
    if (!userId) {
      return res.redirect('/admin');
    }
    const { item_name , item_desc } = req.fields;
    if (!item_name || !item_desc) {
      req.flash('errorMessage', '獎項名及描述不得為空');
      return next()
    }
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
  product: async (req, res) => {
    const { userId } = req.session;
    if (!userId) {
      return res.redirect('/admin');
    }
    const products = await Item.findAll({
      order: [["item_price", "ASC"]]
    });

    res.render('product', { products:products });
  },

  handleUpdateProduct: async (req, res,next) => {
    const { userId } = req.session;
    if (!userId) {
      return res.redirect('/admin');
    }

    const { product_id, product_name, product_price, product_quantity} = req.fields;
    if (!product_name || !product_price || !product_quantity) {
      req.flash('errorMessage', '品名、價格及數量不得為空');
      return next()
    }
    const { product_image } = req.files;

    if (!product_image.size) {
      await Item.update({
        item_name:product_name,
        item_price:product_price,
        item_quantity:product_quantity
      }, {
        where: {
          id: product_id
        }
      })
     return res.redirect('/product')
    }

    if (product_image.type.match(/image/)) {
      let oldpath = product_image.path;
      let newpath = `./statics/item_images/${product_image.name}`;
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

    await Item.update({
      item_name:product_name,
      item_price:product_price,
      item_quantity:product_quantity,
      item_image:product_image.name
    }, {
      where: {
        id: product_id
      }
    })
    res.redirect('/product')
  },
  handleDeleteProduct: async (req, res, next) => {
    const { userId } = req.session;
    if (!userId) {
      return res.redirect('/admin');
    }
    let { product_id } = req.params;
    product_id = parseInt(product_id);
    if(product_id) {
      Item.destroy({
        where:{
          id:product_id
        }
      })
    } else {
      req.flash('errorMessage', '刪除失敗');
      return next()
    }

    return next();
  },

  handleCreateProduct: async (req, res, next) => {
    const { userId } = req.session;
    if (!userId) {
      return res.redirect('/admin');
    }
    const { product_name, product_price, product_quantity} = req.fields;
    if (!product_name || !product_price || !product_quantity) {
      req.flash('errorMessage', '品名、價格及數量不得為空');
      return next()
    }
    const { product_image } = req.files;

    if (!product_image.size) {
      await Item.create({
        item_name:product_name,
        item_price:product_price,
        item_quantity:product_quantity
      })
     return next()
    }

    if (product_image.type.match(/image/)) {
      let oldpath = product_image.path;
      let newpath = `./statics/item_images/${product_image.name}`;
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

    await Item.create({
      item_name:product_name,
      item_price:product_price,
      item_quantity:product_quantity,
      item_image:product_image.name
    })
    return next()
  },

  adminFaq: async (req, res) => {
    const { userId } = req.session;
    if (!userId) {
      return res.redirect('/admin');
    }
    const faqs = await Faq.findAll({
      order: [['faq_order', 'ASC']]
    });
    
    res.render('admin_faq', { faqs:faqs });
  },

  handleUpdateFaq: async (req, res, next) => {
    const { userId } = req.session;
    if (!userId) {
      return res.redirect('/admin');
    }
    const { faq_id, faq_title, faq_content, faq_order } = req.body;

    if (!faq_title || !faq_content || !faq_order) {
      req.flash('errorMessage', '標題、內容及順序不得為空');
      return next()
    }

    Faq.update({
      faq_title:faq_title,
      faq_content:faq_content,
      faq_order:faq_order
    },{
      where: {
        id:faq_id
      }
    })

    return next()
  },

  handleDeleteFaq: async (req, res, next) => {
    const { userId } = req.session;
    if (!userId) {
      return res.redirect('/admin');
    }
    let { faq_id } = req.params;
    faq_id = parseInt(faq_id);
    if(faq_id) {
      Faq.destroy({
        where:{
          id:faq_id
        }
      });
    } else {
      req.flash('errorMessage', '刪除失敗');
      return next()
    }
    return next();
  },
  handleCreateFaq: async (req, res, next) => {
    const { userId } = req.session;
    if (!userId) {
      return res.redirect('/admin');
    }
    const { faq_title, faq_content, faq_order } = req.body;
    if (!faq_title || !faq_content || !faq_order) {
      req.flash('errorMessage', '標題、內容及順序不得為空');
      return next()
    }
    Faq.create({
      faq_title:faq_title,
      faq_content:faq_content,
      faq_order:parseInt(faq_order)
    })

    return next()
  }
};


module.exports = admin_controller;