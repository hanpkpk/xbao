var async = require('async');
var entityManager = require('./entity-manager');
var mapper = require('../mapper/mapper-object');

var Store = entityManager.store;
var Product = entityManager.product;

module.exports = {
    createStore: function(storeObject, callback) {
        Store.create(storeObject).success(function(entity) {
            callback(null, entity);
        }).error(function(err) {
            callback(err);
        });
    },
    findStoreById: function(storeId, callback) {
        Store.find({
            where: {
                id: storeId
            }
        }).success(function(store) {
            if (store) {
                callback(null, store);
            } else {
                callback(null);
            }
        }).error(function(err) {
            console.log(err);
            callback(err);
        });
    },
    findStoreByOwnerId: function(userId, callback) {
        Store.find({
            where: {
                ownerId: userId
            }
        }).success(function(store) {
            callback(null, store);
        }).error(function(err) {
            callback(err);
        });
    },
    findNameByBelong: function(belong, callback) {
        Product.findAll({
            where: {
                belong: belong
            }
        }).success(function(entity) {
            callback(null, entity);
        }).error(function(err) {
            callback(err);
        });
    },
    findStore: function(where, include, callback) {
        var option = {};
        if (where) {
            option.where = where;
        }
        if (include) {
            option.include = include;
        }
        Store.find(option).success(function(store) {
            callback(null, store);
        }).error(function(err) {
            callback(err);
        });
    }
};