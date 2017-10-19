
var express = require('express');
var cookie = require('cookie');
var cookiesm= require('./cookies.js');
var api = require('./routes/api');
var handlers = require('./handlers.js');

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
    } else {
        var action = body.result.action;
        var parameters = body.result.parameters;
        var assetsSearched;
        console.log('Action is: '+action);
        switch(action){
            case 'my_action':
                console.log("myaction");
                var json = apiaiResponseFormat(speech='This is an action test.', displayText='This is an action test.');
                res.json(json);
                break;

            case 'get_assetType_Ids':
                console.log("Cookies GetMyTAdvisorScreenerProductTypesHandler: ");
                handlers.GetMyTAdvisorScreenerProductTypesHandler();
                console.log("exiting fullfilment");
                break;
            case 'search_Asset':
                console.log("SearchAssetHandler ");
                assetsSearched = handlers.SearchAssetHandler("telefonica", function(){
                    console.log("assets encontrados");
                });

                res.json(assetsSearched);

                break;
        }
    }
}
 module.exports = {
     fulfillment
 }
