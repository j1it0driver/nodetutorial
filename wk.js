
var express = require('express');
var cookie = require('cookie');
var cookiesm= require('./cookies.js');
//var api = require('./routes/api');
//var handlers = require('./handlers.js');
var https = require('https');
//var baseUrl="https://mytadvisor.com/SOA/tower4customers/";



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
        var json;
        switch(action){
       /*      case 'user_Evaluation':
                console.log('SSwk print user data',username);
                console.log("SSwk user_Evaluation from wk", param);
                var json = apiaiResponseFormat(speech='This is an userEvaluation test.', displayText='This is an userEvaluation test.');
                res.json(json);//response to be print on chat.
                break; */

            case 'my_action':
                console.log("SSwk myaction");
                json = apiaiResponseFormat(speech='This is an action test.', displayText='This is an action test.');
                res.json(json);
                break;

            case 'add_Asset': //call from existing_portfolio_intention3
                console.log("SSwk add asset to portfolio");
                if(param.assetToAdd){
                    var amount=0, array;
                    console.log("SSwk inside if");
                    var assetToAdd = param.assetToAdd;
                    var productCode;
                    if(assetToAdd.match(" - ")){ //Ej: Tesla Motors -- Shs - USD2596008 TR - 60000
                        array=assetToAdd.split(' - ');
                        assetToAdd=array[0];
                        productCode=array[1].replace(/ /,'.'); //USD2596008 TR -> USD2596008.TR 
                        amount=array[2];
                        console.log("SSwk array", array);

                    }
                    console.log("SSwk assettoadd y amount",assetToAdd,amount);
                    assetsToAdd.push({"asset" : assetToAdd, "productCode": productCode, "amount": amount});
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
                    json = apiaiResponseFormat(speech, displayText, data, contextOut);
                    res.json(json);
                }
                break;

            case "send_Email":
                console.log('SSwk send email from server');
                displayText=speech="Sending Email";
                data={"nada":"vacio"};
                json=apiaiResponseFormat(speech, displayText,data,null);
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
                var array2=param.assetSearched.split(' - '); //Ej: Tesla Motors -- Shs - USD2596008.TR - 60000
                var assetSearched=array2[0].toLowerCase();
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
                        displayText=speech="Showing "+assetList.length+" results:";
                        json = apiaiResponseFormat(speech, displayText, assetList);
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

            case "show_portfolio": // called from existing portfolio intention3 - no
                
                displayText=speech="Summary2";
                data={"portfolioName": portfolio_name, "portfolioCurrency": portfolio_currency, "addedAssets": assetsToAdd, "searchedAssets": assetsSearched};
                console.log("SSwk Showing portfolio2",data);
                // data={"portfolioName": portfolio_name, "portfolioCurrency": portfolio_currency, "addedAssets": assetsSearched};
                json=apiaiResponseFormat(speech, displayText,data);
                res.json(json);
                assetsToAdd=[];
                assetsSearched=[];
                portfolio_name=portfolio_currency=null;
          /*       res.json(json, function(){
                    assetsToAdd=[];
                    assetsSearched=[];
                    portfolio_name=portfolio_currency=null;
                }); */

                break;
                
            case "user_Evaluation":
                var userResponses=param;
                var userResponsesId= {};
                switch (userResponses.frequency){
                    case 'Every 6 months':
                        userResponsesId[1]={Id: 1, Options: 1};
                    break;
                    case 'Every year':
                        userResponsesId[1]={Id: 1, Options: 2};
                    break;
                    case 'Every 2 year':
                        userResponsesId[1]={Id: 1, Options: 3};
                    break;
                    case 'Every 3 to 5 years':
                        userResponsesId[1]={Id: 1, Options: 4};
                    break;
                    case 'Every 5 years or more':
                        userResponsesId[1]={Id: 1, Options: 5};
                    break; 
                }
                switch (userResponses.amount){
                    case 'up to 20000':
                        userResponsesId[2]={Id: 2, Options: 6};
                    break;
                    case 'Between 20000 and 30000':
                        userResponsesId[2]={Id: 2, Options: 7};
                    break;
                    case 'Between 30000 and 50000':
                        userResponsesId[2]={Id: 2, Options: 8};
                    break;
                    case 'Between 50000 and 100000':
                        userResponsesId[2]={Id: 2, Options: 9};
                    break;
                    case 'More than 100000':
                        userResponsesId[2]={Id: 2, Options: 10};
                    break; 
                }
                switch (userResponses.reaction){
                    case 'terrified':
                        userResponsesId[3]={Id: 3, Options: 11};
                    break;
                    case 'worried':
                        userResponsesId[3]={Id: 3, Options: 12};
                    break;
                    case 'hopeful':
                        userResponsesId[3]={Id: 3, Options: 13};
                    break;
                    case 'relaxed':
                        userResponsesId[3]={Id: 3, Options: 14};
                    break;
                }
                switch (userResponses.risk_aversion){
                    case 'very conservative':
                        userResponsesId[4]={Id: 4, Options: 15};
                    break;
                    case 'conservative':
                        userResponsesId[4]={Id: 4, Options: 16};
                    break;
                    case 'balanced':
                        userResponsesId[4]={Id: 4, Options: 17};
                    break;
                    case 'dynamic':
                        userResponsesId[4]={Id: 4, Options: 18};
                    break;
                    case 'aggresive':
                        userResponsesId[4]={Id: 4, Options: 19};
                    break; 
                }

                
                var answersXML2, answersXML="", userCode, domain, language, token, clientCode; //assetList;
                console.log("SSwk User Evaluation userResponses", userResponsesId, userResponsesId[1].Options);
                userCode='pvqH9wZSRmbRGFhVKPtJGw==';
                domain="TADVISOR";
                language="es-ES";
                token='whatever';
                //token='2B45071690292106ED861F81C10FA9D4';
                clientCode= 'i7z9hO9MNrA4DBOJmF+Ykbo693dpPyH4mroJod3DnvUBclxOmWC2Lb4b5iragxZw';
                /* answerXML="texto deprueba"; */
                answersXML="<?xml version=\"1.0\"?>"+"\n"+
                    "<BasicQuestionnaireResult xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">"+"\n"+
                    "   <QuestionnaireId>5</QuestionnaireId>"+"\n"+
                    "   <Answers>"+"\n"+
                    "      <BasicQuestionAnswer>"+"\n"+
                    "      <QuestionId>1</QuestionId>"+"\n"+
                    "      <Options>"+"\n"+
                    "          <BasicQuestionOption>"+"\n"+
                    "          <OptionId>"+userResponsesId[1].Options+"</OptionId>"+"\n"+
                    "          <ExtendedValue />"+"\n"+
                    "          </BasicQuestionOption>"+"\n"+
                    "      </Options>"+"\n"+
                    "      </BasicQuestionAnswer>"+"\n"+
                    "      <BasicQuestionAnswer>"+"\n"+
                    "      <QuestionId>6</QuestionId>"+"\n"+
                    "      <Options>"+"\n"+
                    "          <BasicQuestionOption>"+"\n"+
                    "          <OptionId>1</OptionId>"+"\n"+
                    "          <ExtendedValue />"+"\n"+
                    "          </BasicQuestionOption>"+"\n"+
                    "      </Options>"+"\n"+
                    "      </BasicQuestionAnswer>"+"\n"+
                    "      <BasicQuestionAnswer>"+"\n"+
                    "      <QuestionId>2</QuestionId>"+"\n"+
                    "      <Options>"+"\n"+
                    "          <BasicQuestionOption>"+"\n"+
                    "          <OptionId>"+userResponsesId[2].Options+"</OptionId>"+"\n"+
                    "          <ExtendedValue />"+"\n"+
                    "          </BasicQuestionOption>"+"\n"+
                    "      </Options>"+"\n"+
                    "      </BasicQuestionAnswer>"+"\n"+
                    "      <BasicQuestionAnswer>"+"\n"+
                    "      <QuestionId>3</QuestionId>"+"\n"+
                    "      <Options>"+"\n"+
                    "          <BasicQuestionOption>"+"\n"+
                    "          <OptionId>"+userResponsesId[3].Options+"</OptionId>"+"\n"+
                    "          <ExtendedValue />"+"\n"+
                    "          </BasicQuestionOption>"+"\n"+
                    "      </Options>"+"\n"+
                    "      </BasicQuestionAnswer>"+"\n"+
                    "      <BasicQuestionAnswer>"+"\n"+
                    "      <QuestionId>4</QuestionId>"+"\n"+
                    "      <Options>"+"\n"+
                    "          <BasicQuestionOption>"+"\n"+
                    "          <OptionId>"+userResponsesId[4].Options+"</OptionId>"+"\n"+
                    "          <ExtendedValue />"+"\n"+
                    "          </BasicQuestionOption>"+"\n"+
                    "      </Options>"+"\n"+
                    "      </BasicQuestionAnswer>"+"\n"+
                    "      <BasicQuestionAnswer>"+"\n"+
                    "      <QuestionId>5</QuestionId>"+"\n"+
                    "      <Options>"+"\n"+
                    "          <BasicQuestionOption>"+"\n"+
                    "          <OptionId>18</OptionId>"+"\n"+
                    "          <ExtendedValue />"+"\n"+
                    "          </BasicQuestionOption>"+"\n"+
                    "      </Options>"+"\n"+
                    "      </BasicQuestionAnswer>"+"\n"+
                    "      <BasicQuestionAnswer>"+"\n"+
                    "      <QuestionId>7</QuestionId>"+"\n"+
                    "      <Options>"+"\n"+
                    "          <BasicQuestionOption>"+"\n"+
                    "          <OptionId>28</OptionId>"+"\n"+
                    "          <ExtendedValue />"+"\n"+
                    "          </BasicQuestionOption>"+"\n"+
                    "      </Options>"+"\n"+
                    "      </BasicQuestionAnswer>"+"\n"+
                    "   </Answers>"+"\n"+
                    "</BasicQuestionnaireResult>";
                    answersXML2=encodeURI(answersXML);

                /* answerXML="<?xml version=\"1.0\"?><BasicQuestionnaireResult xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><QuestionnaireId>5</QuestionnaireId><Answers><BasicQuestionAnswer><QuestionId>1</QuestionId><Options><BasicQuestionOption><OptionId>"+userResponsesId[1].Options+"</OptionId><ExtendedValue /></BasicQuestionOption></Options></BasicQuestionAnswer><BasicQuestionAnswer><QuestionId>6</QuestionId><Options><BasicQuestionOption><OptionId>1</OptionId><ExtendedValue /></BasicQuestionOption></Options></BasicQuestionAnswer><BasicQuestionAnswer><QuestionId>2</QuestionId><Options><BasicQuestionOption><OptionId>"+userResponsesId[2].Options+"</OptionId><ExtendedValue /></BasicQuestionOption></Options></BasicQuestionAnswer><BasicQuestionAnswer><QuestionId>3</QuestionId><Options><BasicQuestionOption><OptionId>"+userResponsesId[3].Options+"</OptionId><ExtendedValue /></BasicQuestionOption></Options></BasicQuestionAnswer><BasicQuestionAnswer><QuestionId>4</QuestionId><Options><BasicQuestionOption><OptionId>"+userResponsesId[4].Options+"</OptionId><ExtendedValue /></BasicQuestionOption></Options></BasicQuestionAnswer><BasicQuestionAnswer><QuestionId>5</QuestionId><Options><BasicQuestionOption><OptionId>18</OptionId><ExtendedValue /></BasicQuestionOption></Options></BasicQuestionAnswer><BasicQuestionAnswer><QuestionId>7</QuestionId><Options><BasicQuestionOption><OptionId>28</OptionId><ExtendedValue /></BasicQuestionOption></Options></BasicQuestionAnswer></Answers></BasicQuestionnaireResult>"; */
                console.log("SSwk user Evaluation XML", answersXML, answersXML2);
/*                 var r = new XMLHttpRequest();
                r.open("POST", url, true);
                r.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                r.onload = function(){
                    if(r.status == 200) resolve(r.responseText);
                    else {reject(Error(r.statusText));}
                }
                r.onerror = function(){
                    reject(Error("CCmain Ajax Network Error"));
                }
                r.send(jsonToSend); */
                var postData={
                    userCode: userCode,
                    domain: domain,
                    language: language,
                    token: token,
                    clientCode: clientCode,
                    answersXML: answersXML
                };

                var options = {
                    hostname: 'mytadvisor.com',
                    port: 443,
                    /* path: '/SOA/tower4customers/EvaluateInvestorProfileQuestionnaireHandler.ashx?userCode='+userCode+'&domain='+domain+'&language='+language+'&token='+token+'&clientCode='+clientCode+'&answersXML='+answersXML, */
                    path: '/SOA/tower4customers/EvaluateInvestorProfileQuestionnaireHandler.ashx',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': Buffer.byteLength(postData)
                      }
                };
                console.log("------------------------",options);
                var call = https.request(options, (response) => {
                    console.log("SSwk iserEval inside request",response);
                    response.on('data', (chunk) => {
                        console.log("SSwk userEval chunk",chunk);
                        //global.userEvalResult= JSON.parse(chunk.toString()).RSLT.DATA;
                        global.userEvalResult=JSON.parse(chunk.toString()).RSLT.DATA;
                        console.log("SSwk userEvalResult",userEvalResult);
                    });
                    response.on('end', ()=> {
                        displayText=speech="Showing results of user evaluation"
                        json = apiaiResponseFormat(speech, displayText, userEvalResult);
                        console.log("SSwk userEvalResult json",json);
                        res.json(json);
                    });
                });
                call.on('error', (e) => {
                    console.error("SSwk error user evaluation",e);
                });
                call.write(postData);
                call.end();

                /* displayText=speech="user Evaluation result";
                data={"userProfileResult": userResponsesId}; */
                console.log("SSwk Showing userEvaluation result",data);
                // data={"portfolioName": portfolio_name, "portfolioCurrency": portfolio_currency, "addedAssets": assetsSearched};
                /* json=apiaiResponseFormat(speech, displayText,data);
                res.json(json); */
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
