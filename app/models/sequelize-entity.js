var Sequelize = require('sequelize');
var _str = require('underscore.string');
var fs = require('fs');
var path = require('path');

// var xbao = require('../models/entity-manager');
// var mapper = require('../mapper/mapper-object');
// var Product = xbao.product;
// var User = xbao.user;
// var UserModel = require('../models/user-model');
// var uuid = require('uuid');


var sequelize = new Sequelize('xbao', 'root', '1234', {
    define: {
        freezeTableName: true,
        underscored: true,
        timestaps: false
    }
});

module.exports = {
    getBelong: function(categoryId, callback) {
        sequelize.query('SELECT distinct belong FROM xbao.product where categoryId = ' + categoryId).success(function(data) {
            callback(null, data);
        }).error(function(err) {
            callback(null);
        });
    },
    getBelongCategoryId: function(callback) {
        sequelize.query('SELECT distinct belong,categoryId FROM xbao.product').success(function(data) {
            callback(null, data);
        }).error(function(err) {
            callback(null);
        });
    }
};