var http = require ('http');
var https = require ('https');
var express = require('express');
var processf = require('process');
var router = express.Router();
console.log("api route");

/* GET users listing. */
router.post('/', function(req, respond) { //https://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files
    var baseUrl = "https://api.api.ai/v1/", version="20170810";
    var accessToken="aba2ecdbb9e744ba8b37ec6cf6a175d9";
    var _http = this.secure ? https : http;
    var datos;

    var data= JSON.stringify({query: req.body.val, lang: "en", sessionId: "yaydevdiner"});
    var options = {
            hostname: "api.api.ai",
            port: 443,
            path: "/v1/query?v=20170810",
            method: "POST",

            headers: {
                    "Authorization": "Bearer " + accessToken,
                    "contentType": "application/json; charset=utf-8",
                    'Content-Length': Buffer.byteLength("")
                }
            // },
            // data:JSON.stringify({query: req.body.val, lang: "en", sessionId: "yaydevdiner"})
        };
    var request = https.request(options, function(res){
        console.log("inside request");
        var buffer=null;
        res.on ('data', function(d){
            datos+=d;
            console.log(datos);
            respond.send(datos);
            // datos=d;
        });
        // process.stdout.write(d);
        // console.log(datos);

    });


    request.write(data);
    request.on ('end', function(){
        console.log('end');
        res.send(datos);
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
