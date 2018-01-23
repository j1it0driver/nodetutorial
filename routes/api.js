var http = require ('http');
var https = require ('https');
var express = require('express');
var apiai = require('apiai');
var comm = require('../comm.js');
var cookie = require('cookie');

console.log("api.js");
// var accessToken = process.env.APIAI_TOKEN_TADVISOR_TEST;
// var app = apiai(accessToken);
var app = apiai("aba2ecdbb9e744ba8b37ec6cf6a175d9");
var router = express.Router();

/* GET ex:"users" listing. */
router.post('/', function(req, res) { //api.ai for nodejs
    cookies_s = cookie.parse(req.headers.cookie || '');
    var sessionId= cookies_s.sessionID;
    console.log("api.js sessionId",cookies_s.sessionID);
    var data = req.body.val;
    console.log("api.js data",data);
    comm.process_req(data, sessionId).then(function(datos){ //https://www.pluralsight.com/guides/front-end-javascript/introduction-to-asynchronous-javascript
        console.log("api.js datos from SDK", datos);
        res.send(datos);
    });
    // console.log('cookies from api: ', cookies_s);
});
router.post('/event', function(req,res) {
    console.log("api.js api/event");
    cookies_s = cookie.parse(req.headers.cookie || '');
    var sessionId= cookies_s.sessionID;
    var data = req.body;
    console.log("api.js data from api/event",data);
    comm.process_req(data, sessionId).then(function(datos){ //https://www.pluralsight.com/guides/front-end-javascript/introduction-to-asynchronous-javascript
        res.send(datos);
    });
    // console.log('cookies from api/event: ', cookies_s);
});



// module.exports.cookies_s = cookies_s;
module.exports.router = router;
