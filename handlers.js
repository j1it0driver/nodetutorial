var baseUrl="https://mytadvisor.com/SOA/tower4customers/";
var cookiesm= require('./cookies.js');
var https = require('https');

module.exports = {

    SearchAssetHandler: function(term){
        // console.log("Cookies Servidor", cookies_s);
        var userCode, domain, language, token, numMaxResults, assetGroupsId, iAdvisor;
        if (cookiesm.checkCookieServer("userCode") && cookiesm.checkCookieServer("tokenString")){
            userCode=cookiesm.readCookieServer("userCode");
            domain="TADVISOR";
            language="es-ES";
            token=cookiesm.readCookieServer("tokenString");
            numMaxResults = 5;
            assetGroupsId='';
            iAdvisor= 1;
        }
        else{
            userCode='oyet6qi08k0axpiVx0tDBA==';
            domain="TADVISOR";
            language="es-ES";
            token='whatever';
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
        var assetList;
        // console.log("after options", cookies_s);
        var req = https.request(options, (res) => {

            res.on('data', (chunk) => {
                assetList= JSON.parse(chunk.toString()).RSLT.DATA;

                // console.log("res https.request ",res);

                 // Goes to fullfilment/wk.js
            });
            res.on('end', ()=> {
                // res.send(assetList.RSLT.DATA);
                console.log("asset List",assetList);
                console.log("res https.request ",res);
            });
            // return assetList;

        });
        req.on('error', (e) => {
            console.error(e);
        });
        req.end();
        console.log(req,res);
        // return assetList.RSLT.DATA;
    },

    GetMyTAdvisorScreenerProductTypesHandler: function(){
        var userCode="userCode", domain, language, token;
        // console.log("Cookies Servidor", cookies_s);
        // console.log("Cookies Servidor 1", cookies_s["userCode"]);
        // console.log("Cookies Servidor 2", cookies_s.userCode);
        // console.log(cookiesm.checkCookieServer("userCode"));
        // console.log(cookiesm.checkCookieServer("tokenString"));
        if (cookiesm.checkCookieServer("userCode") && cookiesm.checkCookieServer("tokenString")){
            userCode=cookiesm.readCookieServer("userCode");
            domain="TADVISOR";
            language="es-ES";
            token=cookiesm.readCookieServer("tokenString");
            // console.log("cookies read");
        }
        else{
            userCode='oyet6qi08k0axpiVx0tDBA==';
            domain="TADVISOR";
            language="es-ES";
            token='whatever';
            // console.log("new values for token");
        }
        // console.log("Cookies Ok userCode", userCode);
        // console.log("Cookies Ok domain", domain);
        // console.log("Cookies Ok language", language);
        // console.log("Cookies Ok token", token);

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
                // console.log("data ready");
                // console.log('BODY:', chunk);
                // console.log(`BODY: ${chunk}`);
                var assetTypes_Ids= JSON.parse(chunk.toString());
                console.log("asset Types",assetTypes_Ids.RSLT.DATA);
                // console.log("res https.request ",res);
                // process.stdout.write(d);
            });
        });

        req.on('error', (e) => {
            console.error(e);
        });
        req.end();
    }
}
