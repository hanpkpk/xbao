var passwordHash = require('password-hash');
var _str = require('underscore.string');
var Sequelize = require('sequelize');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var xbao = require('../models/entity-manager');
var mapper = require('../mapper/mapper-object');
var Store = xbao.store;
var Item = xbao.goods;
var User = xbao.user;
var Product = xbao.product;
var seque = require('../models/sequelize-entity');
var UserModel = require('../models/user-model');
var StoreModel = require('../models/store-model');
var ProductModel = require('../models/product-model');
var ItemModel = require('../models/item-model');
var OrderModel = require('../models/order-model');

module.exports = {
    releasePage: function(req, res, next) {
        var storeId = req.params.storeId || '';
        StoreModel.findStoreById(storeId, function(err, store) {
            if (store) {
                seque.getBelong(store.categoryId, function(err, belong) {
                    if (!err) {
                        res.render('item-release', {
                            store: store,
                            belongList: belong
                        });
                    }
                });
            } else {
                res.redirect('/');
            }
        });
    },
    getItemBelong: function(req, res, next) {
        var userId = req.user.id || '';
        if (userId) {
            StoreModel.findStoreByOwnerId(userId, function(err, store) {
                if (store) {
                    seque.getBelong(store.categoryId, function(err, data) {
                        if (data) {
                            res.json({
                                code: 200,
                                indexList: data
                            });
                        } else {
                            res.json({
                                code: 500
                            });
                        }
                    });
                }
            });
        }
    },
    getItemName: function(req, res, next) {
        var belong = req.body.belong;
        ProductModel.getProductByBelong(belong, function(err, product) {
            if (product) {
                res.json({
                    code: 200,
                    productList: product
                });
            } else {
                res.json({
                    code: 500
                });
            }
        });
    },
    releaseItem: function(req, res, next) {
        var itemName = req.body.item_name;
        var productId = req.body.product_id;
        var itemKey = req.body.item_key;
        var itemPrice = req.body.item_price;
        var itemDesc = req.body.item_desc || null;
        var imgPath = req.body.item_img;
        var storeId = req.body.store_id;
        var storePath = path.join(__dirname, '..', '..', 'static/img/item/' + storeId);
        var newImgStaticPath = [];
        if (!fs.existsSync(storePath)) {
            fs.mkdirSync(storePath);
        }
        for (var i = 0; i < imgPath.length; i++) {
            var imgName = imgPath[i].substr(imgPath[i].lastIndexOf('/'));
            var newImgPath = path.join(__dirname, '..', '..', 'static/img/item/' + storeId + imgName);
            var oldImgPath = path.join(__dirname, '..', '..', imgPath[i]);
            newImgStaticPath.push({
                path: '/static/img/item/' + storeId + imgName
            });
            fs.renameSync(oldImgPath, newImgPath);
        }
        if (itemPrice.indexOf('.') == -1) {
            itemPrice = itemPrice + '.00';
        }
        var itemObj = {
            name: itemName,
            image: JSON.stringify(newImgStaticPath),
            price: itemPrice,
            salesVolume: 0,
            description: itemDesc,
            keyWords: itemKey,
            storeId: storeId,
            product_id: productId
        };
        ItemModel.createItem(itemObj, function(err, item) {
            if (item) {
                res.json({
                    code: 200
                });
            } else {
                console.log(err);
                fs.rmdirSync(storePath);
                res.json({
                    code: 500
                });
            }
        });
    },
    itemPage: function(req, res, next) {
        var itemId = req.params.id;
        var include = [{
            model: Store,
            as: 'store'
        }];
        ItemModel.findItemById(itemId, include, function(err, item) {
            if (item) {
                seque.getBelong(item.store.categoryId, function(err, belong) {
                    if (!err) {
                        res.render('item', {
                            item: mapper.itemObjectMapper(item),
                            store: mapper.storeObjectMapper(item.store),
                            belongList: belong
                        });
                    } else {
                        res.send('error');
                    }
                });
            } else {
                res.send('error');
            }
        });
    },
    buyPage: function(req, res, next) {
        var orderId = req.query.n;
        var option = {
            id: orderId
        };
        var include = [{
            model: Item,
            as: 'item'
        }, {
            model: User,
            as: 'buyer'
        }];
        OrderModel.findOrder(option, include, function(err, order) {
            if (order) {
                var where = {
                    id: order.item.storeId
                };
                var includeArr = [{
                    model: User,
                    as: 'owner'
                }];
                StoreModel.findStore(where, includeArr, function(err, store) {
                    if (store) {
                        res.render('buy', {
                            order: mapper.orderObjectMapper(order),
                            item: mapper.itemObjectMapper(order.item),
                            store: store,
                            user: order.buyer
                        });
                    } else {
                        res.send(err);
                    }
                });
            } else {
                res.send(err);
            }
        });
    },
    buyItem: function(req, res, next) {
        var itemNumber = req.body.number;
        var itemId = req.body.itemId;
        var storeId = req.body.storeId;
        var user = req.user || '';

        var include = [{
            model: Store,
            as: 'store'
        }];
        if (!user) {
            res.json(407);
        } else {
            ItemModel.findItemById(itemId, include, function(err, item) {
                if (item) {
                    if (user.id != item.store.ownerId) {
                        var date = new Date();
                        var orderId = moment(date).format("YYYYMMDDHHmmss") + itemId + user.id;
                        var option = {
                            id: orderId,
                            number: itemNumber,
                            item_id: itemId,
                            buyer_id: user.id,
                            price: itemNumber * item.price,
                            store_id: storeId
                        };
                        OrderModel.createOrder(option, function(err) {
                            if (!err) {
                                res.json({
                                    code: 200,
                                    orderId: orderId
                                });
                            } else {
                                res.json(500);
                            }
                        });
                    } else {
                        res.json(403);
                    }
                } else {
                    res.json(500);
                }
            });
        }
    },
    itemEditPage: function(req, res, next) {
        var itemId = req.params.id;
        var include = [{
            model: Store,
            as: 'store'
        },{
            model:Product,
            as:'product'
        }];
        ItemModel.findItemById(itemId, include, function(err, item) {
            if (item) {
                seque.getBelong(item.store.categoryId, function(err, belong) {
                    if (!err) {
                        res.render('item-release', {
                            item: mapper.itemObjectMapper(item),
                            store: mapper.storeObjectMapper(item.store),
                            belongList: belong
                        });
                    } else {
                        res.send('error');
                    }
                });
            } else {
                res.send('error');
            }
        });
    }
};