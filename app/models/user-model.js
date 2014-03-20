var async = require('async');
var entityManager = require('./entity-manager');
var mapper = require('../mapper/mapper-object');

var User = entityManager.user;
var Store = entityManager.store;

var USER_NOT_EXISTED = 'The user is not existed';

module.exports = {
    createUser: function(userObject, callback) {
        User.create(userObject).success(function(entity) {
            callback(null, entity);
        }).error(function(err) {
            callback(err);
        });
    },

    findUserById: function(id, callback) {
        User.find({
            where: {
                id: id
            }
        }).success(function(entity) {
            if (entity) {
                callback(null, entity);
            } else {
                callback(null);
            }
        }).error(function(err) {
            callback(err);
        });
    },

    findUserByAccount: function(account, callback) {
        User.find({
            where: {
                account: account
            }
        }).success(function(entity) {
            if (entity) {
                callback(null, entity);
            } else {
                callback(null, false);
            }
        }).error(function(err) {
            callback(err, false);
        });
    },

    findUserByName: function(name, callback) {
        User.find({
            where: {
                name: name
            }
        }).success(function(entity) {
            if (entity) {
                callback(null, entity);
            } else {
                callback(null, false);
            }
        }).error(function(err) {
            callback(err, false);
        });
    },

    updateUserById: function(newObj, id, callback) {
        User.update(newObj, {
            id: id
        }).success(function() {
            callback(null);
        }).error(function(err) {
            callback(err);
        });
    }
};