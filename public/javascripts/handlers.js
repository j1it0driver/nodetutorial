
function login(userCode,userPass,domain,language) {
    // userCode="juann@techrules.com";
    // userPass="Sebastian1.";
    // domain="TADVISOR";
    // language="es-ES";
    console.log(userCode);
    console.log(userPass);
    console.log(domain);
    console.log(language);
    // console.log(PRUEBA);
    session_cookies=document.cookie;             //////////////////////////////////// SEND ////////////////////////////////////
    $.ajax({
        type: "POST",
        url: baseUrl_H + "Login.ashx?userCode="+userCode+"&userPass="+userPass+"&domain="+domain+"&language="+language, //&callback=parseResponse
            //url: baseUrl_H + "MyTAdvisorLoginInvestorHandler.ashx",
        // dataType: "JSON",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        // headers: {
        //     "Authorization": "Bearer " + accessToken
        //},
        // data: JSON.stringify({query: text, lang: "en", sessionId: "yaydevdiner"}),
        success: function(data1) {
        userId=data1.RSLT.UserId;
        userCode=data1.RSLT.UserCode;
        tokenString=data1.RSLT.TokenString;
        session_cookies="UserCode="+userCode+"; UserId="+userId+"; token="+tokenString;
        console.log(session_cookies);
            // prepareResponse_h(data);
        },
        error: function() {
            respond(messageInternalError);
        }
    });
}
function clientHandler(userCode,domain,language,token,views,clientId) {
    userCode="2wnABpAEXSahApzPgh4Suw==";
    domain="TADVISOR";
    language="es-ES";
    token="7727A2C3DDE8494C13A09EECEB932F20";
    views="ClientGeneralData";
    // clientId="qZX5vetGIq/gbwAPurYUUg==";
    // clientId='fCYeYJCd/ej4wN4Ma+807ST0vgfDyTrXFH53ZYLe5Z41sIZ5XeNRAEMtrCM5u73+';
    clientId="Fvnpqmh0xkGtn05BZi/6cg==";
    // clientId="-1"
    // hola="&clientId="+clientId;
    console.log(process.env.PRUEBA);
    //userCode="j1it0driver@gmail.com", userPass="judaor82";
    $.ajax({
        type: "POST",
        url: baseUrl_H + 'ClientHandler.ashx?userCode='+userCode+'&domain='+domain+'&language='+language+'&token='+token+'&views='+views+'&clientId='+clientId, //&callback=parseResponse
        // dataType: "JSON",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(data1) {
        email=data1.RSLT.ClientModuleT4C.Client.PersonalInformation.Email;
        console.log(email);
            // prepareResponse_h(data);
        },
        error: function() {
            respond(messageInternalError);
        }
    });
}