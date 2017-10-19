
var express = require('express');
var cookie = require('cookie');
var cookiesm= require('./cookies.js');
var api = require('./routes/api');
var handlers = require('./handlers.js');
var https = require('https');
var baseUrl="https://mytadvisor.com/SOA/tower4customers/";

function apiaiResponseFormat(){
    return{
        "speech": speech,
        "display": displayText,
        "source": "myServer"
    }
}

var  fulfillment = function(req, res){ //Raphael Meudec API.AI Facebook Messenger
    var body = req.body;
    // var cookies=req.cookies;
    // console.log(cookies);
    if (!body | !body.result.action){
        console.log('missing action in: '+body.result.metadata.intentName+' intent');
    }
    else {
        var action = body.result.action;
        var parameters = body.result.parameters;
        // var assetsSearched;
        console.log('Action is: '+action);
        switch(action){
            case 'my_action':
                console.log("myaction");
                var json = apiaiResponseFormat(speech='This is an action test.', displayText='This is an action test.');
                res.json(json);
                break;

            // case 'get_assetType_Ids':
            //     console.log("Cookies GetMyTAdvisorScreenerProductTypesHandler: ");
            //     handlers.GetMyTAdvisorScreenerProductTypesHandler();
            //     console.log("exiting fullfilment");
            //     break;
            case 'search_Asset':
                console.log("SearchAssetHandler ");
                var userCode, domain, language, token, numMaxResults, assetGroupsId, iAdvisor,term, assetList;
                if (cookiesm.checkCookieServer("userCode") && cookiesm.checkCookieServer("tokenString")){
                    userCode=cookiesm.readCookieServer("userCode");
                    domain="TADVISOR";
                    language="es-ES";
                    token=cookiesm.readCookieServer("tokenString");
                    term="telefonica";
                    numMaxResults = 5;
                    assetGroupsId='';
                    iAdvisor= 1;
                }
                else{
                    userCode='oyet6qi08k0axpiVx0tDBA==';
                    domain="TADVISOR";
                    language="es-ES";
                    token='whatever';
                    term="telefonica";
                    numMaxResults = 5;
                    assetGroupsId='';
                    iAdvisor= 1;
                }
                var options = {
                    hostname: 'mytadvisor.com',
                    port: 443,
                    path: '/SOA/tower4customers/SearchAssetHandler.ashx?userCode='+userCode+'&domain='+domain+'&language='+language+'&token='+token+'&term='+term+'&numMaxResults='+numMaxResults+'&assetGroupsId='+assetGroupsId+'&iAdvisor='+iAdvisor,
                    method: 'POST'
                };
                var call = https.request(options, (response) => {
                    response.on('data', (chunk) => {
                        assetList= JSON.parse(chunk.toString()).RSLT.DATA;

                    });
                    response.on('end', ()=> {
                        console.log("asset List",assetList);
                    });
                });
                call.on('error', (e) => {
                    console.error("error",e);
                });
                res.json(assetList);
                res.sendStatus(200);
                call.end();
                // handlers.SearchAssetHandler("telefonica", function(){
                //         console.log("assets encontrados", assetList);
                //     });

                // res.json(assetsSearched);
                break;
        }
    }
}
 module.exports = {
     fulfillment
 }
