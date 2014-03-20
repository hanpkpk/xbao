var passwordHash = require('password-hash');
var _str = require('underscore.string');

var xbao = require('../models/entity-manager');
var mapper = require('../mapper/mapper-object');
var seque = require('../models/sequelize-entity');
var Product = xbao.product;
var User = xbao.user;
var Category = xbao.category;
var UserModel = require('../models/user-model');
var StoreModel = require('../models/store-model');
var ItemModel = require('../models/item-model');

module.exports = {
    openStorePage: function(req, res, next) {
        var userId = req.user.id;
        UserModel.findUserById(userId, function(err, user) {
            if (user) {
                Category.findAll().success(function(categoryList) {
                    if (categoryList) {
                        res.render('store-open', {
                            user: user,
                            categoryList: categoryList
                        });
                    }
                }).error(function(err) {
                    console.log(err);
                });
            } else {
                console.log(err);
            }
        });
    },
    openStore: function(req, res, next) {
        var storeName = _str.trim(req.body.name);
        var storeClassify = req.body.classify;
        var storeDesc = req.body.desc;
        var storeAddress = _str.trim(req.body.address);
        var userId = req.params.id;
        var storeObj = {
            name: storeName,
            description: storeDesc,
            address: storeAddress,
            ownerId: userId,
            categoryId: storeClassify
        };
        UserModel.findUserById(userId, function(err, user) {
            if (user && user.isSeller == true) {
                res.json({
                    code: 403
                });
            }
        });
        StoreModel.createStore(storeObj, function(err, store) {
            if (store) {
                UserModel.updateUserById({
                    isSeller: true
                }, userId, function(err) {
                    if (!err) {
                        res.json({
                            code: 200,
                            storeId: store.id
                        });
                    } else {
                        res.json({
                            code: 500
                        });
                    }
                });
            } else {
                res.json({
                    code: 500
                });
            }
        });
    },
    storePage: function(req, res, next) {
        var storeId = req.params.id;
        StoreModel.findStoreById(storeId, function(err, store) {
            if (store) {
                seque.getBelong(store.categoryId, function(err, belong) {
                    if (!err) {
                        res.render('store', {
                            store: store,
                            belongList: belong
                        });
                    }
                });
            } else {
                res.render('store');
            }
        });
    },
    navigation: function(req, res, next) {
        var belong = req.body.belong;
        StoreModel.findNameByBelong(belong, function(err, item) {
            if (item) {
                var nameArr = [];
                for (var i = 0; i < item.length; i++) {
                    var itemObj = mapper.productObjectMapper(item[i]);
                    nameArr.push(itemObj.name);
                }
                res.json({
                    code: 200,
                    name: nameArr,
                    belong: belong
                });
            } else {
                res.json({
                    code: 500
                });
            }
        });
    },
    getNewItem: function(req, res, next) {
        var storeId = req.body.storeId;
        var ord = req.query.orderby || null;
        var option = {
            storeId: storeId
        };
        var order = ['created_at desc', 'salesVolume desc'];

        var orderBy;
        var limit;
        if (ord) {
            orderBy = order[ord];
            limit = 4;
        } else {
            orderBy = null;
            limit = 16;
        }
        ItemModel.findItems(option, orderBy, limit, null, function(err, items) {
            if (items) {
                var itemArr = [];
                for (var i = 0; i < items.length; i++) {
                    itemArr.push(mapper.itemObjectMapper(items[i]));
                }
                res.json({
                    code: 200,
                    itemList: itemArr
                });
            } else {
                res.json({
                    code: 500
                });
            }
        });
    }
};