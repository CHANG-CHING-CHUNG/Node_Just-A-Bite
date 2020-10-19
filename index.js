const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const formidableMiddleware = require('express-formidable');
const session = require('express-session');
const flash = require('connect-flash');
const port = process.env.PORT || 3000;

const index_controller = require('./controllers/index_controllers');
const admin_controller = require('./controllers/admin_controllers');



app.set('view engine', 'ejs');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(flash());
app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  res.locals.username = req.session.username;
  res.locals.errorMessage = req.flash('errorMessage');
  next();
});
app.use('/css', express.static(__dirname + '/statics/css'));
app.use('/images', express.static(__dirname + '/statics/images'));
app.use('/imgs', express.static(__dirname + '/statics/imgs'));
app.use('/item_images', express.static(__dirname + '/statics/item_images'));
app.use('/soldout', express.static(__dirname + '/statics/soldout'));
app.use('/js', express.static(__dirname + '/statics/js'));

app.use('/handleUpdate',formidableMiddleware());
app.use('/handleCreatePrize',formidableMiddleware());
app.use('/handleUpdateProduct',formidableMiddleware());
app.use('/handleCreateProduct',formidableMiddleware());



function redirectBack(req, res) {
  res.redirect('back');
}

app.get('/', index_controller.index);
app.get('/faq', index_controller.faq);
app.get('/game', index_controller.game);
app.get('/lottery', index_controller.lottery);
app.get('/menu',index_controller.menu);

app.get('/admin', admin_controller.admin);
app.get('/login', admin_controller.login);
app.get('/logout', admin_controller.handleLogout);
app.post('/handleLogin',admin_controller.handleLogin ,redirectBack);

app.get('/items', admin_controller.items);
app.post('/handleUpdate',admin_controller.handleUpdate ,redirectBack);
app.get('/handleDeleteItem/:item_id',admin_controller.handleDeleteItem ,redirectBack);
app.get('/handleReset',admin_controller.handleReset ,redirectBack);
app.post('/handleCreatePrize',admin_controller.handleCreatePrize, redirectBack);

app.get('/product', admin_controller.product);
app.post('/handleUpdateProduct', admin_controller.handleUpdateProduct, redirectBack);
app.get('/handleDeleteProduct/:product_id', admin_controller.handleDeleteProduct, redirectBack);
app.post('/handleCreateProduct', admin_controller.handleCreateProduct,redirectBack);

app.get('/admin_faq', admin_controller.adminFaq);
app.post('/handleUpdateFaq',admin_controller.handleUpdateFaq,redirectBack);
app.get('/handleDeleteFaq/:faq_id', admin_controller.handleDeleteFaq,redirectBack);
app.post('/handleCreateFaq/', admin_controller.handleCreateFaq,redirectBack);




app.listen(port, () => {
  console.log(`Server is running...at${port}`);
});