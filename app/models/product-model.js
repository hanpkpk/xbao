var async = require('async');
var entityManager = require('./entity-manager');
var mapper = require('../mapper/mapper-object');

var Product = entityManager.product;

module.exports = {
    getProductByBelong: function(belong, callback) {
        Product.findAll({
            where: {
                belong: belong
            }
        }).success(function(product) {
            callback(null, product);
        }).error(function(err) {
            callback(err);
        });
    }
};