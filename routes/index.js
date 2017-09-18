var express = require('express');
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/', function(req,res){
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
