var async = require('async');
var entityManager = require('./entity-manager');
var mapper = require('../mapper/mapper-object');

var Cart = entityManager.cart;

module.exports = {
    createCart: function(obj, callback) {
        Cart.create(obj).success(function() {
            callback();
        }).error(function(err) {
            callback(err);
        });
    },
    findCart: function(where, callback) {
        Cart.find({
            where: where
        }).success(function(cart) {
            callback(null, cart);
        }).error(function(err) {
            callback(err);
        });
    },
    findCarts: function(where, include, callback) {
        var option = {};
        if (where) {
            option.where = where;
        }
        if (include) {
            option.include = include;
        }
        Cart.findAll(option).success(function(carts) {
            if (carts.length) {
                callback(null, carts);
            } else {
                callback(null);
            }
        }).error(function(err) {
            callback(err);
        });
    },
    deleteCarts:function(where,callback) {
        Cart.destroy(where).success(function() {
            console.log('OK');
            callback();
        }).error(function(err) {
            console.log('error');
            callback(err);
        });
    }
};