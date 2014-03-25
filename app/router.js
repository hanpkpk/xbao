var passport = require('passport');
var passwordHash = require('password-hash');
var LocalStrategy = require('passport-local').Strategy;

var controller = require('./controllers/controller');
var userController = require('./controllers/user-controller');
var storeController = require('./controllers/store-controller');
var itemController = require('./controllers/item-controller');

module.exports = function(app) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // do login with passport
    passport.use(new LocalStrategy({
        usernameField: 'account',
    }, function(account, password, done) {
        controller.doLogin(account, function(err, user) {
            if (err === 500) {
                return done(null, false, {
                    message: '1'
                });
            }
            if (err === 404 || !passwordHash.verify(password, user.password)) {
                // Incorrect email.
                return done(null, false, {
                    message: '2'
                });
            }
            return done(null, user, {
                message: null
            });
        });
    }));

    function autoLogin(req, res, next) {
        if (!req.isAuthenticated() && req.cookies['xbao-user']) {
            var account = req.cookies['xbao-user'].account;
            controller.doLogin(account, function(err, user) {
                if (err) {
                    console.log(err);
                    return next();
                }
                req.login(user, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.locals.isAuthenticated = true;
                        res.locals.credential = req.user;
                    }
                    next();
                });
            });
        } else {
            res.locals.isAuthenticated = req.isAuthenticated() || false;
            res.locals.credential = req.user || {};
            next();
        }
    }

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', {
            failureRedirect: '/',
            failureFlash: true,
            badRequestMessage: '3'
        }, function(err, user, info) {
            var isRemember = req.body.is_remember || false;
            if (isRemember && !info.message) {
                res.cookie('xbao-user', {
                    account: user.account
                }, {
                    httpOnly: false,
                    maxAge: 9000000
                });
            }
            if (!info.message) {
                res.send({
                    code: 200
                });
            } else if (info.message == '2') {
                res.send({
                    code: 404
                });
            } else {
                res.send({
                    code: 500
                });
            }
        })(req, res, next);
    });

    app.get('/', autoLogin, controller.index);
    app.get('/logout', userController.logout);

    app.get('/user/:id', autoLogin, controller.ensureAuthenticated, userController.userInfoIndex);
    app.get('/user/:id/info', autoLogin, controller.ensureAuthenticated, userController.userInfo);
    app.get('/user/:id/password', autoLogin, controller.ensureAuthenticated, userController.userPassword);
    app.post('/user/:id/checkpassword', controller.ensureAuthenticated, userController.checkPassword);
    app.post('/user/:id/password', controller.ensureAuthenticated, userController.modifyPassword);
    app.post('/user/store', controller.ensureAuthenticated, userController.getStore);
    app.get('/user/:id/orderlist', autoLogin, controller.ensureAuthenticated, userController.orderListPage);
    app.post('/order/create', controller.ensureAuthenticated, userController.createOrder);
    app.post('/order/operate', controller.ensureAuthenticated, userController.operateOrder);
    app.delete('/order/delete', controller.ensureAuthenticated, userController.deleteOrder);
    app.get('/order/:id', autoLogin, controller.ensureAuthenticated, userController.orderInfoPage);
    app.post('/order/get', controller.ensureAuthenticated, userController.getOrders);

    app.get('/register', userController.registerPage);
    app.post('/register', userController.register);
    app.post('/register/checkaccount', userController.checkAccount);
    app.post('/register/checkname', userController.checkName);

    app.post('/upload', controller.uploadFile);
    app.post('/item/img/temp', controller.uploadItemImgTemp);
    app.delete('/item/img/temp', controller.deleteItemImgTemp);
    app.post('/item/img/desc/temp', controller.uploadItemDescImgTemp);

    app.get('/store/open', autoLogin, controller.ensureAuthenticated, storeController.openStorePage);
    app.post('/user/:id/store/open', storeController.openStore);
    app.get('/store/:id', autoLogin, storeController.storePage);
    app.post('/store/navigation', storeController.navigation);
    app.post('/store/item/getnew', storeController.getNewItem);

    app.get('/store/:storeId/item/release', autoLogin, controller.ensureAuthenticated, itemController.releasePage);
    app.post('/item/release/getbelong', itemController.getItemBelong);
    app.post('/item/release/getname', itemController.getItemName);
    app.post('/item/release', itemController.releaseItem);
    app.get('/item/buy', autoLogin, controller.ensureAuthenticated, itemController.buyPage);
    app.post('/item/buy', itemController.buyItem);
    app.post('/item/add', itemController.addItemToCart);
    app.get('/items', autoLogin, itemController.itemListPage);
    app.get('/item/:id', autoLogin, itemController.itemPage);
    app.get('/item/:id/edit', autoLogin, controller.ensureAuthenticated, itemController.itemEditPage);

    app.post('/cart/get', autoLogin, itemController.getCart);
    app.get('/cart/buy', autoLogin, controller.ensureAuthenticated, itemController.cartBuyPage);
    app.get('/cart/:userId', autoLogin, controller.ensureAuthenticated, itemController.cartPage);
    app.post('/cart/buy', autoLogin, itemController.cartBuy);
    app.delete('/cart/delete', autoLogin, itemController.deleteCart);
};