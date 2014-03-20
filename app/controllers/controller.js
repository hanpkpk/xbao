var Sequelize = require('sequelize');
var passwordHash = require('password-hash');
var _str = require('underscore.string');
var fs = require('fs');
var path = require('path');

var xbao = require('../models/entity-manager');
var mapper = require('../mapper/mapper-object');
var Product = xbao.product;
var User = xbao.user;
var UserModel = require('../models/user-model');
var seque = require('../models/sequelize-entity');
var uuid = require('uuid');

module.exports = {
    generateUid: function() {
        return uuid.v4().replace(/-/g, '');
    },
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            res.locals.isAuthenticated = true;
            res.locals.credential = req.user;
            return next();
        } else {
            res.redirect('/');
        }
    },
    index: function(req, res, next) {
        var productListArray = [];
        Product.findAll().success(function(productList) {
            for (var i = 0; i < productList.length; i++) {
                product = mapper.productObjectMapper(productList[i]);
                productListArray.push(product);
            }
            seque.getBelongCategoryId(function(err, data) {
                if (data) {
                    res.render('index', {
                        productList: productListArray,
                        indexList: data
                    });
                } else {
                    res.send(err);
                }
            });
        }).error(function(err) {
            console.log(err);
        });
    },
    uploadFile: function(req, res, next) {
        var file = req.files.myfile;
        var userId = req.user.id;
        var ext = file.name.substr(-4);
        fs.readFile(file.path, function(err, fileObj) {
            if (err) throw err;
            var newFilePath = path.join(__dirname, '..', '..', 'static/img/upload/') + userId + ext;
            var staticPath = '/static/img/upload/' + userId + ext;
            fs.writeFile(newFilePath, fileObj, function(err) {
                if (err) throw err;
                var newUserObj = {
                    headImg: staticPath
                };
                UserModel.updateUserById(newUserObj, userId, function(err) {
                    if (!err) {
                        UserModel.findUserById(userId, function(err, user) {
                            if (!err && user) {
                                res.send(200, staticPath);
                            } else {
                                res.send(500);
                            }
                        });
                    } else {
                        res.send(500);
                    }
                });
                fs.unlink(file.path, function(err) {
                    if (err) throw err;
                });
            });
        });
    },
    uploadItemImgTemp: function(req, res, next) {
        var file = req.files.imgTmp;
        var ext = file.name.substr(-4);
        var tempName = uuid.v4().replace(/-/g, '') + ext;
        fs.readFile(file.path, function(err, fileObj) {
            if (err) throw err;
            var newFilePath = path.join(__dirname, '..', '..', 'static/img/item/temp/') + tempName;
            var staticPath = '/static/img/item/temp/' + tempName;
            fs.exists(path.join(__dirname, '..', '..', 'static/img/item/temp'), function(exists) {
                if (exists) {
                    fs.writeFile(newFilePath, fileObj, function(err) {
                        if (err) {
                            console.log(err);
                            res.send(500);
                        } else {
                            res.send(200, staticPath);
                        }
                    });
                    fs.unlink(file.path, function(err) {
                        if (err) throw err;
                    });
                } else {
                    fs.mkdir(path.join(__dirname, '..', '..', 'static/img/item/temp'), function(err) {
                        if (err) {
                            console.log(err);
                            res.send(500);
                        } else {
                            fs.writeFile(newFilePath, fileObj, function(err) {
                                if (err) {
                                    console.log(err);
                                    res.send(500);
                                } else {
                                    res.send(200, staticPath);
                                }
                            });
                            fs.unlink(file.path, function(err) {
                                if (err) throw err;
                            });
                        }
                    });
                }
            });
        });
    },

    deleteItemImgTemp: function(req, res, next) {
        var imgPath = req.body.imgPath;
        fs.unlink(path.join(__dirname, '..', '..', imgPath), function(err) {
            if (err) {
                console.log(err);
                res.json({
                    code: 500
                });
            } else {
                res.json({
                    code: 200
                });
            }
        });
    },
    uploadItemDescImgTemp: function(req, res, next) {
        var file = req.files.imgdesc;
        var ext = file.name.substr(-4);
        var tempName = uuid.v4().replace(/-/g, '') + ext;
        fs.readFile(file.path, function(err, fileObj) {
            if (err) throw err;
            var newFilePath = path.join(__dirname, '..', '..', 'static/img/item/temp/') + tempName;
            var staticPath = '/static/img/item/temp/' + tempName;
            fs.exists(path.join(__dirname, '..', '..', 'static/img/item/temp'), function(exists) {
                if (exists) {
                    fs.writeFile(newFilePath, fileObj, function(err) {
                        if (err) {
                            console.log(err);
                            res.send(500);
                        } else {
                            res.json({
                                'url': staticPath,
                                'title': '',
                                'original': file.name,
                                'state': 'SUCCESS'
                            });
                        }
                    });
                    fs.unlink(file.path, function(err) {
                        if (err) throw err;
                    });
                } else {
                    fs.mkdir(path.join(__dirname, '..', '..', 'static/img/item/temp'), function(err) {
                        if (err) {
                            console.log(err);
                            res.send(500);
                        } else {
                            fs.writeFile(newFilePath, fileObj, function(err) {
                                if (err) {
                                    console.log(err);
                                    res.send(500);
                                } else {
                                    res.json({
                                        'url': staticPath,
                                        'title': '',
                                        'original': file.name,
                                        'state': 'SUCCESS'
                                    });
                                }
                            });
                            fs.unlink(file.path, function(err) {
                                if (err) throw err;
                            });
                        }
                    });
                }
            });
        });
    },

    doLogin: function(account, callback) {
        UserModel.findUserByAccount(_str.trim(account), function(err, user) {
            if (err) {
                callback(500);
            } else {
                if (user) {
                    callback(null, user);
                } else {
                    callback(404);
                }
            }
        });
    },
};