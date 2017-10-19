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
    wk.fulfillment(req, res);//, function(){
    //     console.log('Response from webhook');
    console.log(res);
    //});


});
router.post('/search_assets', function(req, res) { //api.ai for nodejs

    var data=req.body.val; //texto a buscar
    console.log(data)
    var userCode, domain, language, token, numMaxResults, assetGroupsId, iAdvisor,term; //assetList;
    // if (cookiesm.checkCookieServer("userCode") && cookiesm.checkCookieServer("tokenString")){
    //     userCode=cookiesm.readCookieServer("userCode");
    //     domain="TADVISOR";
    //     language="es-ES";
    //     token=cookiesm.readCookieServer("tokenString");
    //     term="telefonica";
    //     numMaxResults = 5;
    //     assetGroupsId='';
    //     iAdvisor= 1;
    // }
    // else{
        userCode='oyet6qi08k0axpiVx0tDBA==';
        domain="TADVISOR";
        language="es-ES";
        token='whatever';
        term=data;
        numMaxResults = 5;
        assetGroupsId='';
        iAdvisor= 1;
    // }
    var options = {
        hostname: 'mytadvisor.com',
        port: 443,
        path: '/SOA/tower4customers/SearchAssetHandler.ashx?userCode='+userCode+'&domain='+domain+'&language='+language+'&token='+token+'&term='+term+'&numMaxResults='+numMaxResults+'&assetGroupsId='+assetGroupsId+'&iAdvisor='+iAdvisor,
        method: 'POST'
    };
    var call = https.request(options, (response) => {
        response.on('data', (chunk) => {
            global.assetList= JSON.parse(chunk.toString()).RSLT.DATA;

        });
        response.on('end', ()=> {
            console.log("asset List",assetList);
            // res.sendStatus(200);
            // var json = apiaiResponseFormat(speech='Searching Assets.', displayText='Searching Assets.');
            res.json(assetList);
        });
    });
    call.on('error', (e) => {
        console.error("error",e);
    });
    call.end();


});
module.exports = router;
