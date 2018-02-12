
var express = require('express');
var cookie = require('cookie');
var cookiesm= require('./cookies.js');
var api = require('./routes/api');
//var handlers = require('./handlers.js');
var https = require('https');
var baseUrl="https://mytadvisor.com/SOA/tower4customers/";



function apiaiResponseFormat(speech,displayText,data, contextOut){
    console.log("SSwkresponse format");
    return{
        "speech": speech,
        "display": displayText,
        "data": data,
        "source": "Tadvisor Server",
        "contextOut": contextOut
    };
    // or: to trigger an event but the previous json is omitted(speech, display, etc)
    // {
    //     "followupEvent": {
    //        "name": "<EVENT_NAME>",
    //        "data": {
    //           "<PARAMETER_NAME>":"<PARAMETER_VALUE>"
    //        }
    //     }
    //  }
}

var  fulfillment = function(req, res){ //Raphael Meudec API.AI Facebook Messenger
    var body = req.body;
    console.log("SSwk body wh request",body);
    var speech, displayText, data=[],  contextOut=[];
    // var cookies=req.cookies;
    // console.log(cookies);
    if (!body | !body.result.action){
        console.log('SSwk missing action in: '+body.result.metadata.intentName+' intent');
    }
    else {
        var action = body.result.action;
        if (body.result.parameters){
            var param = body.result.parameters;
            console.log("SSwk parameters: ", param);
        }
        console.log('SSwk Action is: '+action);
        switch(action){
            case 'user_Evaluation':
                console.log('SSwk print user data',username);
                console.log("SSwk user_Evaluation from wk", param);
                var json = apiaiResponseFormat(speech='This is an userEvaluation test.', displayText='This is an userEvaluation test.');
                res.json(json);//response to be print on chat.
                break;

            case 'my_action':
                console.log("SSwk myaction");
                var json = apiaiResponseFormat(speech='This is an action test.', displayText='This is an action test.');
                res.json(json);
                break;

            case 'add_Asset':
                console.log("SSwk add asset to portfolio");
                if(param.assetToAdd){
                    var amount=0, array;
                    console.log("SSwk inside if");
                    var assetToAdd = param.assetToAdd;
                    if(assetToAdd.match(" - ")){
                        array=assetToAdd.split(' - ');
                        assetToAdd=array[0];
                        amount=array[1];
                        console.log("SSwk array", array)

                    }
                    console.log("SSwk assettoadd y amount",assetToAdd,amount);
                    assetsToAdd.push({"asset" : assetToAdd, "amount": amount});
                    console.log("SSwk AddAsset_Portfolio", assetToAdd);
                    console.log("SSwk Assets to add", assetsToAdd);
                    // displayText=speech= "Asset with ISIN: "+assetToAdd.slice(-1).pop()+ " was added to your portfolio. Do you want to add more assets?";
                    displayText=speech= "You investment of <i>"+portfolio_currency+" "+amount+"</i> on asset: <b>"+assetToAdd+"</b>, was added to your portfolio. Do you want to add more assets?";
                    data= {"items": ["Add more", "Finish"]};
                    contextOut=[{"name":"asset_to_add","lifespan":"1", "parameters":{"assetSearched":"'"+ assetsToAdd+"'"}},
                    {"name":"create_portfolio","lifespan":"1", "parameters":{"assetSearched":"'"+ assetsToAdd+"'"}},
                    {"name":"existing_portfolio","lifespan":"1", "parameters":{"assetSearched":"'"+assetsToAdd+"'"}},
                    {"name":"existingportfoliointention2-followup","lifespan":"2", "parameters":{"assetSearched":"'"+ assetsToAdd+"'"}},
                    {"name":"existing_portfolio_intention2-followup","lifespan":"2", "parameters":{"assetSearched":"'"+ assetsToAdd+"'"}}];
                    console.log("SSwk add_asset data",data);
                    var json = apiaiResponseFormat(speech, displayText, data, contextOut);
                    res.json(json);
                }
                break;

            case "send_Email":
                console.log('SSwk send email from server');
                displayText=speech="Sending Email";
                data={"nada":"vacio"};
                var json=apiaiResponseFormat(speech, displayText,data,null);
                res.json(json);
                break;

       

            case 'search_Asset':
                console.log("SSwk SearchAssetHandler");
                if(param.portfolio_currency && param.portfolio_name){
                    global.portfolio_name=param.portfolio_name;
                    global.portfolio_currency=param.portfolio_currency;
                }

                console.log("SSwk name of portfolio", portfolio_name);
                console.log("SSwk currency for portfolio", portfolio_currency);
                var assetSearched=param.assetSearched.toLowerCase();
                assetsSearched.push(assetSearched);

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
                    console.log("SSwk asset searched2", assetSearched);
                    userCode='oyet6qi08k0axpiVx0tDBA==';
                    //userCode=serverData.Code;
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
                    console.error("SSwk error searching assets",e);
                });
                call.end();
                // handlers.SearchAssetHandler("telefonica", function(){
                //         console.log("assets encontrados", assetList);
                //     });
                break;

            case "show_portfolio":
                console.log("SSwk Showing portfolio");
                displayText=speech="SUMMARY";
                data={"portfolioName": portfolio_name, "portfolioCurrency": portfolio_currency, "addedAssets": assetsToAdd, "searchedAssets": assetsSearched};
                // data={"portfolioName": portfolio_name, "portfolioCurrency": portfolio_currency, "addedAssets": assetsSearched};
                json=apiaiResponseFormat(speech, displayText,data);
                res.json(json, function(){
                    assetsToAdd=[];
                    assetsSearched=[];
                    portfolio_name=portfolio_currency=null;
                });

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
