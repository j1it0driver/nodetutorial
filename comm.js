module.exports = {

    process_req: function (data) {

        return new Promise(function(resolve,reject){
            var apiai = require('apiai');
            // var accessToken = process.env.APIAI_TOKEN_TADVISOR_TEST;
            // var app = apiai(accessToken);
            var app = apiai("aba2ecdbb9e744ba8b37ec6cf6a175d9");
            var datos;
            var request = app.textRequest(data, {
                sessionId: 'yaydevdiner2'
            });
            request.on('response', function(response) {
                // console.log(response);
                resolve(response);
                // console.log(datos);
            });
            request.on('error', function(error) {
                reject(error);
                console.log(error);
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
