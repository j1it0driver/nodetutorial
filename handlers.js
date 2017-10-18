var baseUrl="https://mytadvisor.com/SOA/tower4customers/";
function login(userCode,userPass,domain,language) {
    // userCode="juann@techrules.com";
    // userPass="Sebastian1.";
    // domain="TADVISOR";
    language="es-ES";
    console.log(userCode);
    console.log(userPass);
    console.log(domain);
    console.log(language);
    // console.log(PRUEBA);
    // session_cookies=document.cookie;             //////////////////////////////////// SEND ////////////////////////////////////
    $.ajax({
        type: "POST",
        url: baseUrl + "Login.ashx?userCode="+userCode+"&userPass="+userPass+"&domain="+domain+"&language="+language, //&callback=parseResponse
            //url: baseUrl_H + "MyTAdvisorLoginInvestorHandler.ashx",
        // dataType: "JSON",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        // headers: {
        //     "Authorization": "Bearer " + accessToken
        //},
        // data: JSON.stringify({query: text, lang: "en", sessionId: "yaydevdiner"}),
        success: function(data) {
        // userId=data1.RSLT.UserId;
        // userCode=data1.RSLT.UserCode;
        // tokenString=data1.RSLT.TokenString;
        if ($("#checkbox"+printIndex)[0].checked && data.RSLT.ERROR.CODE=='Error_NoError'){
            createCookie("user",userCode)
            createCookie("userId",data.RSLT.UserId);
            createCookie("userCode",data.RSLT.UserCode);
            createCookie("tokenString",data.RSLT.TokenString);
            // respond("Succesful Login");
            changeMessage("Succesful Login",printIndex);
            console.log("Succesful Login");
            clientHandler();
        }else {
            changeMessage("Error Login",printIndex);
            // respond("Error on Login");
        }
        // session_cookies=("UserCode="+userCode+"; UserId="+userId+"; token="+tokenString);
        // console.log(session_cookies);
            // prepareResponse_h(data);
        },
        error: function() {
            respond(messageInternalError);
        }
    });
}
function clientHandler() {
    if(checkCookie("userCode") && checkCookie("tokenString")){
        userCode=readCookie("userCode");
        domain="TADVISOR";
        language="es-ES";
        token=readCookie("tokenString");
        views="ClientGeneralData";
        clientId=-1;
        console.log("cookies read");
    }

    // console.log(process.env.PRUEBA);
    //userCode="j1it0driver@gmail.com", userPass="judaor82";
    $.ajax({
        type: "POST",
        url: baseUrl + 'GetMyTAdvisorClientHandlerV2.ashx?userCode='+userCode+'&domain='+domain+'&language='+language+'&token='+token+'&views='+views+'&clientId='+clientId, //&callback=parseResponse
        // url: baseUrl_P + 'ClientHandler.ashx?userCode='+userCode+'&domain='+domain+'&language='+language+'&token='+token+'&views='+views+'&clientId='+clientId, //&callback=parseResponse
        // dataType: "JSON",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(data) {
        // email=data.RSLT.Client.PersonalInformation.Email;
            showPersonalInfo(data);
        //     var clientCode=data.RSLT.DATA.Client.PersonalInformation.ClientCode;
        // console.log(email);

        },
        error: function() {
            respond(messageInternalError);
        }
    });
}

function showPersonalInfo(data){
    var email=data.RSLT.DATA.Client.PersonalInformation.Email;
    var name=data.RSLT.DATA.Client.PersonalInformation.Name+" "+data.RSLT.DATA.Client.PersonalInformation.Surname;
    var risk_profile=data.RSLT.DATA.Client.LastTest.ProfileName;
    var test_date=data.RSLT.DATA.Client.LastTest.DateTest;
    var questions=data.RSLT.DATA.Client.LastTest.Questions;
    var answers=data.RSLT.DATA.Client.LastTest.Answers;
    var portfolios=data.RSLT.DATA.Portfolios.Portfolios;
    appendHtml("left");
    addMessage("Email:   <i>"+email+"</i>");
    addMessage("Name:   <i>"+name+"</i>");
    addMessage("Last Profile:   <i>"+risk_profile+"</i>");
    addMessage("  Last test date:   <i>"+test_date+"</i>");
    for (i=0;i<questions.length;i++){
        addMessage("  - Question: <i>"+questions[i]+"</i>"+" -> answer: <i>"+answers[i]+"</i>");
    }
        addMessage("You have a total of <i>"+portfolios.length+"</i>"+" porfolios.");
    for(j=0;j<portfolios.length;j++){
        addMessage("  - Porfolio "+(j+1)+":   <i>"+portfolios[j].Name+"</i>");
    }

}


var GetMyTAdvisorScreenerProductTypesHandler = function(){
    console.log("Enter action");

    if(checkCookie("userCode") && checkCookie("tokenString")){
        userCode=readCookie("userCode");
        domain="TADVISOR";
        language="es-ES";
        token=readCookie("tokenString");
        console.log("cookies read");
    }else{
        userCode='oyet6qi08k0axpiVx0tDBA==';
        domain="TADVISOR";
        language="es-ES";
        token='whatever';
        console.log("new values for token");
    }
    $.ajax({
        type: "POST",
        url: baseUrl + 'GetMyTAdvisorScreenerProductTypesHandler.ashx?userCode='+userCode+'&domain='+domain+'&language='+language+'&token='+token, //&callback=parseResponse
        // url: baseUrl_P + 'ClientHandler.ashx?userCode='+userCode+'&domain='+domain+'&language='+language+'&token='+token+'&views='+views+'&clientId='+clientId, //&callback=parseResponse
        // dataType: "JSON",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(data) {
        // email=data.RSLT.Client.PersonalInformation.Email;
            // showPersonalInfo(data);
            var assetTypes_Ids= data.RSLT.DATA;
            console.log("Asset Types",assetTypes_Ids);
            // prepareResponse_h(data);
        },
        error: function() {
            respond(messageInternalError);
        }
    });

}
module.exports = {
    GetMyTAdvisorScreenerProductTypesHandler
}
