var path = require('path');
var express = require('express');
var less = require('less-middleware');
var flash = require('connect-flash');
var passport = require('passport');

module.exports = function(app, express) {
    app.set('views', path.join(__dirname, 'jade'));
    app.set('view engine', 'jade');
    app.locals.nodeEnv = process.env.NODE_ENV || 'development';
    app.use(express.favicon());
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.errorHandler());
    app.use(express.cookieParser());
    app.use(express.session({
        key: 'xbao_session',
        secret: 'xbao'
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);

    if ('development' === app.get('env')) {
        app.use(less({
            dest: path.join(__dirname, '../static', 'css'),
            src: path.join(__dirname, 'less'),
            prefix: '/static/css'
        }));
        app.use(express.logger('dev'));
        app.locals.pretty = true;
        app.use('/static', express.static(path.join(__dirname, '..', 'static')));
        app.use('/assest', express.static(path.join(__dirname, '..', 'assest')));
    }

    if ('production' === app.get('env')) {
        app.use('/static', express.static(path.join(__dirname, '..', 'static')));
        app.use('/assest', express.static(path.join(__dirname, '..', 'assest')));
    }
};