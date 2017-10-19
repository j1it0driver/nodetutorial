var baseUrl="https://mytadvisor.com/SOA/tower4customers/";
var cookiesm= require('./cookies.js');
var https = require('https');
// function login(userCode,userPass,domain,language) {
//
//     language="es-ES";
//     console.log(userCode);
//     console.log(userPass);
//     console.log(domain);
//     console.log(language);
//           //////////////////////////////////// SEND ////////////////////////////////////
//     $.ajax({
//         type: "POST",
//         url: baseUrl + "Login.ashx?userCode="+userCode+"&userPass="+userPass+"&domain="+domain+"&language="+language, //&callback=parseResponse
//
//         contentType: "application/x-www-form-urlencoded; charset=utf-8",
//
//         success: function(data) {
//         if ($("#checkbox"+printIndex)[0].checked && data.RSLT.ERROR.CODE=='Error_NoError'){
//             createCookie("user",userCode)
//             createCookie("userId",data.RSLT.UserId);
//             createCookie("userCode",data.RSLT.UserCode);
//             createCookie("tokenString",data.RSLT.TokenString);
//             // respond("Succesful Login");
//             changeMessage("Succesful Login",printIndex);
//             console.log("Succesful Login");
//             clientHandler();
//         }else {
//             changeMessage("Error Login",printIndex);
//
//         }
//
//         },
//         error: function() {
//             respond(messageInternalError);
//         }
//     });
// }
// function clientHandler() {
//     if(checkCookie("userCode") && checkCookie("tokenString")){
//         userCode=readCookie("userCode");
//         domain="TADVISOR";
//         language="es-ES";
//         token=readCookie("tokenString");
//         views="ClientGeneralData";
//         clientId=-1;
//         console.log("cookies read");
//     }
//
//     $.ajax({
//         type: "POST",
//         url: baseUrl + 'GetMyTAdvisorClientHandlerV2.ashx?userCode='+userCode+'&domain='+domain+'&language='+language+'&token='+token+'&views='+views+'&clientId='+clientId, //&callback=parseResponse
//
//         contentType: "application/x-www-form-urlencoded; charset=utf-8",
//         success: function(data) {
//
//             showPersonalInfo(data);
//
//
//         },
//         error: function() {
//             respond(messageInternalError);
//         }
//     });
// }
//
// function showPersonalInfo(data){
//     var email=data.RSLT.DATA.Client.PersonalInformation.Email;
//     var name=data.RSLT.DATA.Client.PersonalInformation.Name+" "+data.RSLT.DATA.Client.PersonalInformation.Surname;
//     var risk_profile=data.RSLT.DATA.Client.LastTest.ProfileName;
//     var test_date=data.RSLT.DATA.Client.LastTest.DateTest;
//     var questions=data.RSLT.DATA.Client.LastTest.Questions;
//     var answers=data.RSLT.DATA.Client.LastTest.Answers;
//     var portfolios=data.RSLT.DATA.Portfolios.Portfolios;
//     appendHtml("left");
//     addMessage("Email:   <i>"+email+"</i>");
//     addMessage("Name:   <i>"+name+"</i>");
//     addMessage("Last Profile:   <i>"+risk_profile+"</i>");
//     addMessage("  Last test date:   <i>"+test_date+"</i>");
//     for (i=0;i<questions.length;i++){
//         addMessage("  - Question: <i>"+questions[i]+"</i>"+" -> answer: <i>"+answers[i]+"</i>");
//     }
//         addMessage("You have a total of <i>"+portfolios.length+"</i>"+" porfolios.");
//     for(j=0;j<portfolios.length;j++){
//         addMessage("  - Porfolio "+(j+1)+":   <i>"+portfolios[j].Name+"</i>");
//     }
//
// }


var GetMyTAdvisorScreenerProductTypesHandler = function(){
    console.log("Enter action");
    var userCode, domain, language, token;
    console.log("Cookies Servidor", cookies_s);
    if (cookiesm.checkCookieServer("userCode") && cookiesm.checkCookieServer("tokenString")){
        userCode=cookiesm.readCookieServer("userCode");
        domain="TADVISOR";
        language="es-ES";
        token=cookiesm.readCookieServer("tokenString");
        console.log("cookies read");
    }
    else{
        userCode='oyet6qi08k0axpiVx0tDBA==';
        domain="TADVISOR";
        language="es-ES";
        token='whatever';
        console.log("new values for token");
    }
    console.log("Cookies Ok from action");


    var options = {
        hostname: 'mytadvisor.com',
        port: 443,
        path: '/SOA/tower4customers/GetMyTAdvisorScreenerProductTypesHandler.ashx?userCode='+userCode+'&domain='+domain+'&language='+language+'&token='+token,
        method: 'POST'
    };

    var req = https.request(options, (res) => {
        // console.log('statusCode:', res.statusCode);
        // console.log('headers:', res.headers);
        // console.log(res);

        res.on('data', (chunk) => {
            console.log("data ready");
            console.log(`BODY: ${chunk}`);
            var assetTypes_Ids= JSON.parse(chunk.toString());
            // console.log("Asset Types",assetTypes_Ids);
            console.log(assetTypes_Ids.RSLT.DATA);
            // process.stdout.write(d);
        });
    });

    req.on('error', (e) => {
        console.error(e);
        respond(messageInternalError);
    });
    req.end();

}
module.exports = {
    GetMyTAdvisorScreenerProductTypesHandler
}
