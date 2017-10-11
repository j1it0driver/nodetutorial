module.exports = {

    process_req: function (data, sessionID) {

        return new Promise(function(resolve,reject){
            var apiai = require('apiai');
            var cookie = require('cookie');
            var cookiesm= require('./cookies.js')
            // var cookies_s = cookie.parse(req.headers.cookie || '');
            // console.log("Session ID: " + cookies_s.sessionID);
            // var accessToken = process.env.APIAI_TOKEN_TADVISOR_TEST;
            // var app = apiai(accessToken);
            var app = apiai("aba2ecdbb9e744ba8b37ec6cf6a175d9");
            var datos;

            if(data.event){
                // console.log(data);
                var request = app.eventRequest(data.event, {
                    sessionId: sessionID
                });
            } else{
                var request = app.textRequest(data, {
                    sessionId: sessionID
                });
            }
            request.on('response', function(response) {
                // console.log("La respuesta" + response);
                resolve(response);
                // console.log(datos);
            });
            request.on('error', function(error) {
                reject(error);
                console.log('Error in comm.js: '+error);
            });
            request.end();
        });



        // var apiai = require('apiai');
        // // var accessToken = process.env.APIAI_TOKEN_TADVISOR_TEST;
        // // var app = apiai(accessToken);
        // var app = apiai("aba2ecdbb9e744ba8b37ec6cf6a175d9");
        // var datos;
        // var request = app.textRequest(data, {
        //     sessionId: 'yaydevdiner2'
        // });
        //
        // request.on('response', function(response) {
        //     console.log(response);
        //     return response;
        //     console.log(datos);
        // });
        //
        // request.on('error', function(error) {
        //     console.log(error);
        // });
        //
        // request.end();
        // // return datos;
        // callback(response);
    }
}
