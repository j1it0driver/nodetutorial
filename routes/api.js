var http = require ('http');
var https = require ('https');
var express = require('express');
var apiai = require('apiai');
var comm = require('../comm.js');
var cookie = require('cookie');

//console.log("api.js");
// var accessToken = process.env.APIAI_TOKEN_TADVISOR_TEST;
// var app = apiai(accessToken);
var app = apiai("aba2ecdbb9e744ba8b37ec6cf6a175d9");
var router = express.Router();

/* GET ex:"users" listing. */
router.post('/', function(req, res) { //api.ai for nodejs
    cookies_s = cookie.parse(req.headers.cookie || '');
    var sessionID= cookies_s.sessionID;
    console.log("SSapi api.js sessionId",cookies_s.sessionID);
    //var data = req.body.val;
    var data = req.body;
    console.log("SSapi api.js data from /api ",req.body);

    /////
    // if(data.event){     
    //     console.log("comm.js data.event",data.event);
    //     var request = app.eventRequest(data.event, {
    //         sessionId: sessionID
    //     });
    //     // console.log("comm.js data.event",data.event);
    //      //console.log("comm.js request",request);
    // } else{
    //     console.log("es un text requests y el data es:", data);
    //     var request = app.textRequest(data, {
    //         sessionId : sessionID
    //     });
    //     //console.log("requests y es:", request);
    // }
    // console.log("requests y es:", request);
    // request.on('response', function(response) {
    //     // response = [
    //     // { name: "contextName" }
    //     // ]
    //     console.log(response);
    //     res.send('200');
    // });

    // request.on('error', function(error) {
    //     console.log("errorrrrr",error);
    //     res.send('200');
    // });
    // res.send('200');
    // request.end();

//////7
    comm.process_req(data, sessionID).then(function(datos){ //https://www.pluralsight.com/guides/front-end-javascript/introduction-to-asynchronous-javascript
        console.log("SSapi api.js datos from SDK", datos);
        res.send(datos);
    });
    // console.log('cookies from api: ', cookies_s);
});
router.post('/event', function(req,res) {
    console.log("SSapi api.js api/event");
    cookies_s = cookie.parse(req.headers.cookie || '');
    var sessionID= cookies_s.sessionID;
    var data = req.body;
    console.log("SSapi api.js data from api/event",data);


    comm.process_req(data, sessionID).then(function(datos){ //https://www.pluralsight.com/guides/front-end-javascript/introduction-to-asynchronous-javascript
        res.send(datos);
    });
    // console.log('cookies from api/event: ', cookies_s);
});



// module.exports.cookies_s = cookies_s;
module.exports = router; 
//module.exports.router = router; 
