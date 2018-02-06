// this is the app created for express!

// require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var mongoose = require ('mongoose');
var dotenv = require('dotenv').config();
// require('dotenv').load();
var index = require('./routes/index'); //JDO Cuando requiero este archivo (index.js), estoy realmente llamando al funcion routes que esta dentro de index.js
var api = require('./routes/api');
var users = require('./routes/users');
var webhook = require('./routes/webhook');
var mailing = require('./routes/sayHello');
var serverData = require('./routes/serverData');


//console.log('The value of PORT is:', process.env);
var app = express(); // JDO la aplicacion arranca aca cuando ejecutamos express.

// view engine setup
// _dirname es el nombre de la aplicacion, root folder. Path.join con / como un path en una URI.
app.set('views', path.join(__dirname, 'views')); // set the views folder as the views to the application
app.set('view engine', 'hjs'); //using "hjs" as the engine. An option is use "Pug", a templating language (html without brackets)



// APP.USE == middleware FUNCTIONS
// //middleware function takes req and makes a response, then call next() that is the next middleware on the stack!
// function myFunMiddleware(request, response, next) {
//    // Do stuff with the request and response.
//    // When we're all done, call next() to defer to the next middleware.
//    next();
// }
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev')); //middleware from "morgan" to logging
app.use(bodyParser.json()); //middleware from bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); //middleware from cokkie-parser
app.use(lessMiddleware(path.join(__dirname, 'public'))); //middleware from less-middleware
app.use(express.static(path.join(__dirname, 'public'))); //middleware from express (to asign a public directorie for easy access:static to resources)

app.use('/', index); // path and function to execute (routes)
app.use('/api', api.router);
app.use('/users', users);
app.use('/webhook', webhook);
app.use('/sayHello', mailing);
app.use('/serverData', serverDatas);
console.log("SSok app.js");
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error'); //"error" is the view to render "res"
});

module.exports = app;
