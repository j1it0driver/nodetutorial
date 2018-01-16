// copy of api.js route

var http = require ('http');
var https = require ('https');
var express = require('express');
var processf = require('processf');
var cookies = require('cookies.js');
var router = express.Router();
console.log("api route");

/* GET users listing. */
router.post('/', function(req, respond) { //https://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files
    var baseUrl = "https://api.dialogflow.com/v1/", version="20170810";
    var accessToken="aba2ecdbb9e744ba8b37ec6cf6a175d9";
    var _http = this.secure ? https : http;
    var datos="";
    var guid=guid();
    var data= JSON.stringify({query: req.body.val, lang: "en", sessionId: "yaydevdiner"});
    var options = {
            hostname: "api.dialogflow.com",
            port: 443,
            path: "/v1/query?v=20170810",
            method: "POST",
            headers: {
                    "Authorization": "Bearer " + accessToken,
                    // "contentType": "application/json",
                    "contentType": "application/json; charset=utf-8"
                    // 'Content-Length': Buffer.byteLength("")
                },
            // },
            data: JSON.stringify({query: req.body.val, lang: "en", sessionId: "yaydevdiner2"})
        };
    var request = https.request(options, function(res){
        // console.log(request);
        res.setEncoding('utf8');
        res.on ('data', function(d){
            datos+=d;
            console.log(d);

            // datos=d;
        });
        // res.on ('end', function(d){
        //     // resolve(JSON.parse(datos));
        //     respond.json(datos);
        // });
        // process.stdout.write(d);
        // console.log(datos);

    });


    request.write("data:"+JSON.stringify({query: req.body.val, lang: "en", sessionId: "yaydevdiner"}));
    request.end();
    request.on ('end', function(){
        console.log('end');
        respond.json(datos);
    });
    request.on('error', function(e){
        console.error(e);
    });
    // request.on('end', function (result){
    //     res.send(result);
    // })


    // $.ajax({
    //     type: "POST",
    //     url: baseUrl + "query?v=20170810",
    //     contentType: "application/json; charset=utf-8",
    //     dataType: "json",
    //     headers: {
    //         "Authorization": "Bearer " + accessToken
    //     },
    //     data: JSON.stringify({query: req.body.val, lang: "en", sessionId: "yaydevdiner"}),
    //     success: function(data) {
    //         console.log(data);
    //         //  datos=data.result.fulfillment.messages;
    //          res.json(data);
    //     }
    //     // error: function() {
    //     //     respond(messageInternalError);
    //     // }
    // });
    // var data=req.body.val;
    //console.log(data);
    // var resp=processf.process_req(data);
    // res.send(data);
});

module.exports = router;
