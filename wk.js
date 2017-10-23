
var express = require('express');
var cookie = require('cookie');
var cookiesm= require('./cookies.js');
var api = require('./routes/api');
var handlers = require('./handlers.js');
var https = require('https');
var baseUrl="https://mytadvisor.com/SOA/tower4customers/";


function apiaiResponseFormat(speech,displayText,data){
    console.log("response format");
    return{
        "speech": speech,
        "display": displayText,
        "data": data,
        "source": "Tadvisor Server"
    };
}

var  fulfillment = function(req, res){ //Raphael Meudec API.AI Facebook Messenger
    var body = req.body;
    var speech, displayText, data=[];
    // var cookies=req.cookies;
    // console.log(cookies);
    if (!body | !body.result.action){
        console.log('missing action in: '+body.result.metadata.intentName+' intent');
    }
    else {
        var action = body.result.action;
        var assetSearched=body.result.parameters.assetSearched.toLowerCase();
        var parameters = body.result.parameters;
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
                console.log("SearchAssetHandler");
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
            console.log("asset searched", assetSearched);
                    userCode='oyet6qi08k0axpiVx0tDBA==';
                    domain="TADVISOR";
                    language="es-ES";
                    token='whatever';
                    term=assetSearched;
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
                        console.log(assetList);
                    });
                    response.on('end', ()=> {
                        console.log("asset List",assetList);
                        // res.sendStatus(200);
                        displayText=speech="Showing "+assetList.length+" results:"
                        var json = apiaiResponseFormat(speech, displayText, assetList);
                        res.json(json);
                    });
                });
                call.on('error', (e) => {
                    console.error("error searching assets",e);
                });



                call.end();
                // handlers.SearchAssetHandler("telefonica", function(){
                //         console.log("assets encontrados", assetList);
                //     });
                break;
            case 'addAssetToPortfolio':

                if(body.result.parameters.assetToAdd)
                    global.assetToAdd.push(body.result.parameters.assetToAdd);
                    console.log(assetToAdd);
                    displayText=speech= "Asset with ISIN: "+assetToAdd.slice(-1).pop()+ " was added to your portfolio. Do you want to add more assets?";
                    data= {'items': ['Add more', 'Finish']};
                    console.log(data);
                break;
        }
    }
};
 module.exports = {
     fulfillment
 };
