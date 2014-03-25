var async = require('async');
var entityManager = require('./entity-manager');
var mapper = require('../mapper/mapper-object');

var Order = entityManager.orders;

module.exports = {
    createOrder: function(option, callback) {
        Order.create(option).success(function() {
            callback(null);
        }).error(function(err) {
            console.log(err);
            callback(err);
        });
    },
    findOrder: function(where, include, callback) {
        var option = {};
        if (where) {
            option.where = where;
        }
        if (include) {
            option.include = include;
        }
        Order.find(option).success(function(order) {
            if (order) {
                callback(null, order);
            } else {
                callback(null, null);
            }
        }).error(function(err) {
            callback(err);
        });
    },
    findOrderById: function(id, callback) {
        Order.find({
            where: {
                id: id
            }
        }).success(function(order) {
            if (order) {
                callback(null, order);
            } else {
                callback(null, null);
            }
        }).error(function(err) {
            callback(err);
        });
    },
    updateOrder: function(newObj, id, callback) {
        Order.update(newObj, {
            id: id
        }).success(function() {
            callback(null);
        }).error(function(err) {
            callback(err);
        });
    },
    findOrders: function(where, include, limit, filter, callback) {
        var option = {};
        if (where) {
            option.where = where;
        }
        if (include) {
            option.include = include;
        }
        if (filter) {
            option.order = filter;
        }
        if (limit) {
            option.limit = limit;
        }
        Order.findAll(option).success(function(orders) {
            if (orders.length) {
                callback(null, orders);
            } else {
                callback(null);
            }
        }).error(function(err) {
            callback(err);
        });
    },
    deleteOrder: function(id, callback) {
        Order.destroy({
            id: id
        }).success(function() {
            callback(null);
        }).error(function(err) {
            callback(err);
        });
    }
};