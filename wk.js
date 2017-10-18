var handlers = require('./handlers.js');
var express = require('express');
var cookieParser = require('cookie-parser');
function apiaiResponseFormat(){
    return{
        "speech": speech,
        "display": displayText,
        "source": "myServer"
    }
}

var  fulfillment = function(req, res){ //Raphael Meudec API.AI Facebook Messenger
    var body = req.body;
    var cookies=req.cookies;
    console.log(cookies);
    if (!body | !body.result.action){
        console.log('missing action in: '+body.result.metadata.intentName+' intent');
    } else {
        var action = body.result.action;
        var parameters = body.result.parameters;
        console.log('Action is: '+action);
        switch(action){
            case 'my_action':
                var json = apiaiResponseFormat(speech='This is an action test.', displayText='This is an action test.')
                res.json(json);

            case 'get_assetType_Ids':
                console.log("Cookies: ", cookies);
                GetMyTAdvisorScreenerProductTypesHandler();
                break;
        }

    }

}
 module.exports = {
     fulfillment
 }
