var express = require('express');
var cookie = require('cookie');
var cookiesm= require('../cookies.js');
var router = express.Router();
// var cookies_s;

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/', function(req,res){
  // console.log("aqui va el tema de las cookies");
  // console.log("Cookies :  ", req.cookies);
  // var cookies_s = cookie.parse(req.headers.cookie || '');
  // console.log(cookies_s.visits);
  // console.log(cookiesm.guid());
  // cookies_s = cookie.parse(req.headers.cookie || '');
  res.cookie("sessionID",cookiesm.guid(),{expire : new Date() + 9999});
  global.cookies_s = cookie.parse(req.headers.cookie || '');
  global.assetsToAdd=[];
  console.log(assetsToAdd);
  res.render('index');
});
/////// EXAMPLE FOR ROUTING
// var express = require("express");
// var http = require("http");
// var app = express();
//
// app.all("*", function(request, response, next) {
//   response.writeHead(200, { "Content-Type": "text/plain" });
//   next();
// });
//
// app.get("/", function(request, response) {
//   response.end("Welcome to the homepage!");
// });
//
// app.get("/about", function(request, response) {
//   response.end("Welcome to the about page!");
// });
//
// app.get("*", function(request, response) {
//   response.end("404!");
// });
//
// http.createServer(app).listen(1337);

/////// EXAMPLE FOR ROUTING

module.exports = router;  //JDO este archivo retorna el archivo router creado arr
