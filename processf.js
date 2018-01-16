
module.exports = {process_req: function (data) { // is called with process_req(val).success(function(data){}); or .error() https://stackoverflow.com/questions/5150571/javascript-function-that-returns-ajax-call-data
    var baseUrl = "https://api.dialogflow.com/v1/", version="20170810";
    var accessToken="aba2ecdbb9e744ba8b37ec6cf6a175d9";        //////////////////////////////////// SEND ////////////////////////////////////
    console.log("function")
;    return $.ajax({
    // $.ajax({
        type: "POST",
        url: baseUrl + "query?v=20170810",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({query: data[val], lang: "en", sessionId: "yaydevdiner"})//,
        // success: function(data) {
        //     datos=data.result.fulfillment.messages;
        //     prepareResponse(data);
        // },
        // error: function() {
        //     respond(messageInternalError);
        // }
    });
}
}


// $.ajax({
//     type: "POST",
//     url: baseUrl + "query?v=20170810",
//     contentType: "application/json; charset=utf-8",
//     dataType: "json",
//     headers: {
//         "Authorization": "Bearer " + accessToken
//     },
//     data: JSON.stringify({'event': {'name': eventName, data:{'valor': valor}}, lang: "en", sessionId: "yaydevdiner"}),
//     success: function(data) {
//         prepareResponse(data);
//     },
//     error: function() {
//         respond(messageInternalError);
//     }
// });
