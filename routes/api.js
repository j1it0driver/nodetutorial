var http = require ('http');
var https = require ('https');
var express = require('express');
var apiai = require('apiai');
var comm = require('../comm.js')

// var accessToken = process.env.APIAI_TOKEN_TADVISOR_TEST;
// var app = apiai(accessToken);
var app = apiai("aba2ecdbb9e744ba8b37ec6cf6a175d9");

var router = express.Router();


/* GET users listing. */
router.post('/', function(req, res) { //api.ai for nodejs
    var data = req.body.val;
    comm.process_req(data).then(function(datos){ //https://www.pluralsight.com/guides/front-end-javascript/introduction-to-asynchronous-javascript
        console.log(datos);
        res.send(datos);
    });
    // console.log(datos);
    // res.send(datos);


//     var request = app.textRequest(data, {
//         sessionId: 'yaydevdiner2'
//     });
//
//     request.on('response', function(response) {
//         console.log(response);
//         res.json(response);
//     });
//
//     request.on('error', function(error) {
//         console.log(error);
//     });
//
//     request.end();
});

module.exports = router;
