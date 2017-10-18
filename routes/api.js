var http = require ('http');
var https = require ('https');
var express = require('express');
var apiai = require('apiai');
var comm = require('../comm.js');
var cookie = require('cookie');


// var accessToken = process.env.APIAI_TOKEN_TADVISOR_TEST;
// var app = apiai(accessToken);
var app = apiai("aba2ecdbb9e744ba8b37ec6cf6a175d9");
var router = express.Router();

/* GET ex:"users" listing. */
router.post('/', function(req, res) { //api.ai for nodejs
    global.cookies_s = cookie.parse(req.headers.cookie || '');
    var sessionId= cookies_s.sessionID;
    // console.log(cookies_s.sessionID);
    var data = req.body.val;
    // console.log(data);
    comm.process_req(data, sessionId).then(function(datos){ //https://www.pluralsight.com/guides/front-end-javascript/introduction-to-asynchronous-javascript
        res.send(datos);
    });
    // console.log('cookies from api: ', cookies_s);
});
router.post('/event', function(req,res) {
    cookies_s = cookie.parse(req.headers.cookie || '');
    var sessionId= cookies_s.sessionID;
    var data = req.body;
    // console.log(data);
    comm.process_req(data, sessionId).then(function(datos){ //https://www.pluralsight.com/guides/front-end-javascript/introduction-to-asynchronous-javascript
        res.send(datos);
    });
    // console.log('cookies from api/event: ', cookies_s);
});

// module.exports.cookies_s = cookies_s;
module.exports.router = router;
