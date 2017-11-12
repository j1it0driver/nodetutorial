
var express = require('express');
var cookie = require('cookie');
var cookiesm= require('./cookies.js');
var api = require('./routes/api');
var handlers = require('./handlers.js');
var https = require('https');
var baseUrl="https://mytadvisor.com/SOA/tower4customers/";



function apiaiResponseFormat(speech,displayText,data, contextOut){
    console.log("response format");
    return{
        "speech": speech,
        "display": displayText,
        "data": data,
        "source": "Tadvisor Server",
        "contextOut": contextOut
    };
}

var  fulfillment = function(req, res){ //Raphael Meudec API.AI Facebook Messenger
    var body = req.body;
    var speech, displayText, data=[],  contextOut=[];
    // var cookies=req.cookies;
    // console.log(cookies);
    if (!body | !body.result.action){
        console.log('missing action in: '+body.result.metadata.intentName+' intent');
    }
    else {
        var action = body.result.action;
        if (body.result.parameters){
            var param = body.result.parameters;
            console.log("parameters: ", param);
        }
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

            case 'add_Asset':
                console.log("add asset to portfolio");
                if(param.assetToAdd){
                    console.log("inside if");
                    var assetToAdd = param.assetToAdd;
                    assetsToAdd.push(assetToAdd);
                    console.log("AddAsset_Portfolio", assetToAdd);
                    console.log(assetsToAdd);
                    // displayText=speech= "Asset with ISIN: "+assetToAdd.slice(-1).pop()+ " was added to your portfolio. Do you want to add more assets?";
                    displayText=speech= "Asset with ISIN: "+assetToAdd+ " was added to your portfolio. Do you want to add more assets2?";
                    data= {"items": ["Add more", "Finish"]};
                    contextOut=[{"name":"asset_to_add","lifespan":"1", "parameters":{"assetSearched":"'"+ assetsToAdd+"'"}},
                    {"name":"create_portfolio","lifespan":"1", "parameters":{"assetSearched":"'"+ assetsToAdd+"'"}},
                    {"name":"existing_portfolio","lifespan":"1", "parameters":{"assetSearched":"'"+assetsToAdd+"'"}},
                    {"name":"existingportfoliointention2-followup","lifespan":"2", "parameters":{"assetSearched":"'"+ assetsToAdd+"'"}},
                    {"name":"existing_portfolio_intention2-followup","lifespan":"2", "parameters":{"assetSearched":"'"+ assetsToAdd+"'"}}];
                    console.log(data);
                    var json = apiaiResponseFormat(speech, displayText, data, contextOut);
                    res.json(json);
                }
                break;

            case 'send_email':
                displayText=speech='Sending Email';
                var json=apiaiResponseFormat(speech, displayText,null,null);
                res.json(json);
                break;

            case 'search_Asset':
                var assetSearched=param.assetSearched.toLowerCase();
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
                    console.log("asset searched2", assetSearched);
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
                        // console.log(assetList);
                    });
                    response.on('end', ()=> {
                        // console.log("asset List",assetList);
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



            // case 'show_Portfolio':
            //     displayText=speech='show portfolio';
            //     var json = apiaiResponseFormat(speech, displayText, null);
            //     res.json(json);
            //     break;
        }
    }
};
 module.exports = {
     fulfillment
 };
