var passwordHash = require('password-hash');
var _str = require('underscore.string');
var async = require('async');

var xbao = require('../models/entity-manager');
var mapper = require('../mapper/mapper-object');
var Product = xbao.product;
var User = xbao.user;
var Order = xbao.orders;
var Item = xbao.goods;
var Store = xbao.store;
var UserModel = require('../models/user-model');
var StoreModel = require('../models/store-model');
var OrderModel = require('../models/order-model');
var ItemModel = require('../models/item-model');

/** order状态:
 ** -1:交易取消
 ** 0:待付款
 ** 1:交易成功
 ** 2:待发货
 ** 3:待收货
 ** 4:待评价
 **/

module.exports = {
    registerPage: function(req, res, next) {
        res.render('register');
    },
    register: function(req, res, next) {
        var account = _str.trim(req.body.account || '');
        var password = _str.trim(req.body.password || '');
        var displayName = _str.trim(req.body.nickname || '');
        var address = _str.trim(req.body.address || '');
        password = passwordHash.generate(password);
        var userObj = {
            account: account,
            password: password,
            name: displayName,
            address: address
        };
        UserModel.createUser(userObj, function(err, userEntity) {
            if (err) {
                console.log(err);
                res.json({
                    code: err.code
                });
            } else {
                res.json({
                    code: 200
                });
            }
        });
    },
    logout: function(req, res, next) {
        res.clearCookie('xbao-user');
        req.logout();
        res.redirect('/');
    },

    userInfoIndex: function(req, res, next) {
        var userId = req.params.id;
        if (userId != req.user.id) {
            res.redirect('/');
        } else {
            UserModel.findUserById(userId, function(err, user) {
                if (user) {
                    StoreModel.findStoreByOwnerId(user.id, function(err, store) {
                        if (store) {
                            res.render('myinfo-index', {
                                user: user,
                                store: store
                            });
                        } else {
                            res.render('myinfo-index', {
                                user: user,
                                store: null
                            });
                        }
                    });
                } else {
                    console.log(err);
                    res.send(err);
                }
            });
        }
    },

    userInfo: function(req, res, next) {
        var userId = req.params.id;
        if (userId != req.user.id) {
            res.redirect('/');
        }
        UserModel.findUserById(userId, function(err, user) {
            if (err) {
                console.log(err);
            }
            if (user) {
                res.render('myinfo-detail', {
                    user: user
                });
            }
        });
    },

    userPassword: function(req, res, next) {
        var userId = req.params.id;
        if (userId != req.user.id) {
            res.redirect('/');
        }
        UserModel.findUserById(userId, function(err, user) {
            if (err) {
                console.log(err);
            }
            if (user) {
                res.render('myinfo-password', {
                    user: user
                });
            }
        });
    },

    modifyPassword: function(req, res, next) {
        var userId = req.params.id;
        var newPassword = _str.trim(req.body.password || '');
        if (newPassword) {
            var password = passwordHash.generate(newPassword);
            var newUserObj = {
                password: password
            };
            UserModel.updateUserById(newUserObj, userId, function(err) {
                if (!err) {
                    res.clearCookie('xbao-user');
                    req.logout();
                    res.json({
                        code: 200
                    });
                } else {
                    res.json({
                        code: 500
                    });
                }
            });
        }
    },

    getStore: function(req, res, next) {
        var userId = req.body.userId;
        StoreModel.findStoreByOwnerId(userId, function(err, store) {
            if (store) {
                res.json({
                    code: 200,
                    store: store
                });
            } else {
                res.json({
                    code: 500
                });
            }
        });
    },

    checkAccount: function(req, res, next) {
        var account = _str.trim(req.body.account);
        UserModel.findUserByAccount(account, function(err, isExisted) {
            if (err) {
                console.log(err);
            }
            if (isExisted) {
                res.send(false);
            } else {
                res.send(true);
            }
        });
    },
    checkName: function(req, res, next) {
        var name = _str.trim(req.body.name);
        UserModel.findUserByName(name, function(err, isExisted) {
            if (err) {
                console.log(err);
            }
            if (isExisted) {
                res.send(false);
            } else {
                res.send(true);
            }
        });
    },

    checkPassword: function(req, res, next) {
        var userId = req.params.id;
        var password = _str.trim(req.body.password);
        UserModel.findUserById(userId, function(err, user) {
            if (user && passwordHash.verify(password, user.password)) {
                res.send(true);
            } else {
                res.send(false);
            }
        });
    },

    createOrder: function(req, res, next) {
        var orderIdArr = req.body.orderId;
        var many = req.query.many || false;

        if (many) {
            for (var i = 0; i < orderIdArr.length; i++) {
                var newObj = {
                    status: 2,
                }
                OrderModel.updateOrder(newObj, orderIdArr[i], function(err) {
                    if (err) {
                        console.log(err);
                        res.json(500);
                    }
                });
            }
            res.json(200);
        } else {
            var price = _str.trim(req.body.price);
            var number = _str.trim(req.body.number);
            var newObj = {
                price: price,
                status: 2,
                number: number
            };
            OrderModel.updateOrder(newObj, orderIdArr, function(err) {
                if (!err) {
                    res.json(200);
                } else {
                    res.json(500);
                }
            });
        }
    },

    orderListPage: function(req, res, next) {
        var userId = req.params.id;
        var isSeller = req.query.q || null;

        if (isSeller == 2) {
            var option = {
                ownerId: userId
            };
            var include = [{
                model: User,
                as: 'owner'
            }];
            StoreModel.findStore(option, include, function(err, store) {
                if (store) {
                    var storeObj = mapper.storeObjectMapper(store);
                    var where = {
                        storeId: storeObj.id
                    };
                    var orderBy = 'created_at DESC';
                    ItemModel.findItems(where, orderBy, null, null, function(err, items) {
                        if (items) {
                            var itemList = [];
                            for (var i = 0; i < items.length; i++) {
                                itemList.push(mapper.itemObjectMapper(items[i]));
                            }
                            res.render('order-list', {
                                user: storeObj.owner,
                                itemList: itemList,
                                store: storeObj,
                                seller: isSeller
                            });
                        } else {
                            res.render('order-list', {
                                user: storeObj.owner,
                                itemList: null,
                                store: storeObj,
                                seller: isSeller
                            });
                        }
                    });
                } else {
                    console.log(err);
                    res.send(err);
                }
            });
        } else if (isSeller == 1) {
            StoreModel.findStoreByOwnerId(userId, function(err, store) {
                if (store) {
                    var option = {
                        store_id: store.id
                    };
                    var include = [{
                        model: User,
                        as: 'buyer'
                    }, {
                        model: Item,
                        as: 'item'
                    }];
                    var orderBy = 'created_at DESC';
                    OrderModel.findOrders(option, include, null, orderBy, function(err, orders) {
                        UserModel.findUserById(userId, function(err, user) {
                            if (orders) {
                                var orderList = [];
                                for (var i = 0; i < orders.length; i++) {
                                    var orderObj = mapper.orderObjectMapper(orders[i]);
                                    orderObj.item = mapper.itemObjectMapper(orders[i].item);
                                    orderList.push(orderObj);
                                }
                                res.render('order-list', {
                                    orderList: orderList,
                                    user: user,
                                    buyer: orderObj.buyer,
                                    seller: isSeller
                                });
                            } else {
                                res.render('order-list', {
                                    orderList: null,
                                    user: user,
                                    seller: isSeller
                                });
                            }
                        });
                    });
                } else {
                    res.send(err);
                }
            });
        } else {
            var option = {
                buyer_id: userId
            };
            var include = [{
                model: Item,
                as: 'item'
            }];
            UserModel.findUserById(userId, function(err, user) {
                if (user) {
                    var orderBy = 'created_at DESC';
                    OrderModel.findOrders(option, include, null, orderBy, function(err, orders) {
                        if (orders) {
                            var orderList = [];
                            for (var i = 0; i < orders.length; i++) {
                                var orderObj = mapper.orderObjectMapper(orders[i]);
                                orderObj.item = mapper.itemObjectMapper(orders[i].item);
                                orderList.push(orderObj);
                            }
                            res.render('order-list', {
                                orderList: orderList,
                                user: user,
                                seller: isSeller
                            });
                        } else {
                            res.render('order-list', {
                                orderList: null,
                                user: user,
                                seller: isSeller
                            });
                        }
                    });
                } else {
                    res.send(err);
                }
            });
        }
    },
    operateOrder: function(req, res, next) {
        var orderId = req.body.orderId;
        var status = req.query.status;
        var newObj = {
            status: status
        };
        OrderModel.updateOrder(newObj, orderId, function(err) {
            if (!err) {
                if (status == 1) {
                    var option = {
                        id: orderId
                    };
                    var include = [{
                        model: Item,
                        as: 'item'
                    }];
                    OrderModel.findOrder(option, include, function(err, order) {
                        if (order) {
                            var newItem = {
                                salesVolume: order.item.salesVolume + 1
                            };
                            ItemModel.updateItem(newItem, order.item.id, function(err) {
                                if (!err) {
                                    res.json(200);
                                } else {
                                    res.json(500);
                                }
                            });
                        } else {
                            res.json(500);
                        }
                    });
                } else {
                    res.json(200);
                }
            } else {
                res.json(500);
            }
        });
    },
    deleteOrder: function(req, res, next) {
        var orderId = req.body.orderId;
        OrderModel.deleteOrder(orderId, function(err) {
            if (!err) {
                res.json(200);
            } else {
                res.json(500);
            }
        });
    },
    orderInfoPage: function(req, res, next) {
        var orderId = _str.trim(req.params.id);
        var userId = req.user.id;
        var isSeller = req.query.q || null;

        var where = {
            id: orderId
        };
        var include = [{
            model: Store,
            as: 'store'
        }, {
            model: User,
            as: 'buyer'
        }, {
            model: Item,
            as: 'item'
        }];
        UserModel.findUserById(userId, function(err, user) {
            if (user) {
                OrderModel.findOrder(where, include, function(err, order) {
                    if (order) {
                        UserModel.findUserById(order.store.ownerId, function(err, owner) {
                            res.render('order-info', {
                                order: mapper.orderObjectMapper(order),
                                user: user,
                                store: mapper.storeObjectMapper(order.store),
                                item: mapper.itemObjectMapper(order.item),
                                owner: owner,
                                seller: isSeller
                            });
                        });
                    } else {
                        res.render('order-info', {
                            order: null,
                            user: user,
                            seller: isSeller
                        });
                    }
                });
            } else {
                res.send(err);
            }
        });
    },
    getOrders: function(req, res, next) {
        var userId = req.user.id;

        var option = {
            buyer_id: userId
        };
        var include = [{
            model: Store,
            as: 'store'
        }, {
            model: Item,
            as: 'item'
        }];
        var order = 'created_at DESC';

        OrderModel.findOrders(option, include, 4, order, function(err, orders) {
            if (orders) {
                var orderArr = [];
                for (var i = 0; i < orders.length; i++) {
                    orderArr.push(mapper.orderObjectMapper(orders[i]));
                }
                res.json({
                    code: 200,
                    orderList: orderArr
                });
            } else {
                res.json(500);
            }
        });
    }
};