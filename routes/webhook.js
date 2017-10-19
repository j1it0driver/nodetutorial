var http = require ('http');
var https = require ('https');
var express = require('express');
var apiai = require('apiai');
var wk = require('../wk.js');
var cookie = require('cookie');

// var accessToken = process.env.APIAI_TOKEN_TADVISOR_TEST;
// var app = apiai(accessToken);
var app = apiai("aba2ecdbb9e744ba8b37ec6cf6a175d9");
var router = express.Router();
// var cookies = global.cookies_s;
/* GET ex:"users" listing. */
router.post('/', function(req, res) { //api.ai for nodejs

    // console.log('Request to webhook: ', req.body);
    // console.log('cookies from client', cookies_s);
    wk.fulfillment(req, res, function(){
        console.log('Response from webhook');
        // res.send()
    });


});
module.exports = router;
