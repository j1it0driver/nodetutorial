var http = require ('http');
var https = require ('https');
var express = require('express');
var comm = require('../comm.js');
var cookie = require('cookie');
var router = express.Router();

/* GET ex:"users" listing. */
router.post('/', function(req, res) { 
    console.log("                ");
    console.log("*********************************");
    cookies_s = cookie.parse(req.headers.cookie || '');
    var sessionID= cookies_s.sessionID;
    console.log("SSapi api.js sessionId",cookies_s.sessionID);
    var data = req.body;
    console.log("SSapi api.js data from /api ",req.body);

    comm.process_req(data, sessionID).then(function(datos){ //https://www.pluralsight.com/guides/front-end-javascript/introduction-to-asynchronous-javascript
        console.log("SSapi api.js datos from SDK", datos);
        res.send(datos);
    });
});
router.post('/event', function(req,res) {
    console.log("                ");
    console.log("*********************************");
    console.log("SSapi api.js api/event");
    cookies_s = cookie.parse(req.headers.cookie || '');
    var sessionID= cookies_s.sessionID;
    var data = req.body;
    console.log("SSapi api.js data from api/event",data);


    comm.process_req(data, sessionID).then(function(datos){ //https://www.pluralsight.com/guides/front-end-javascript/introduction-to-asynchronous-javascript
        res.send(datos);
    });
});

module.exports.router = router; 
