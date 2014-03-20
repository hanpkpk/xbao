var async = require('async');
var entityManager = require('./entity-manager');
var mapper = require('../mapper/mapper-object');

var Item = entityManager.goods;

module.exports = {
    createItem: function(itemObj, callback) {
        Item.create(itemObj).success(function(entity) {
            callback(null, entity);
        }).error(function(err) {
            callback(err);
        });
    },
    findItems: function(where, orderBy, limit, include, callback) {
        var option = {};
        if (where) {
            option.where = where;
        }
        if (orderBy) {
            option.order = orderBy;
        }
        if (limit) {
            option.limit = limit;
        }
        if (include) {
            option.include = include;
        }
        Item.findAll(option).success(function(items) {
            if (items.length) {
                callback(null, items);
            } else {
                callback(null);
            }
        }).error(function(err) {
            callback(err);
        });
    },
    findItemById: function(itemId, include, callback) {
        var option = {};
        if (include) {
            option.include = include;
        }
        option.where = {
            id: itemId
        };
        Item.find(option).success(function(item) {
            if (item) {
                callback(null, item);
            } else {
                callback(null);
            }
        }).error(function(err) {
            callback(err);
        });
    },
    updateItem: function(newObj, id, callback) {
        Item.update(newObj, {
            id: id
        }).success(function() {
            callback();
        }).error(function(err) {
            callback(err);
        });
    }
};