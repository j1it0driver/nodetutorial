var baseUrl_H="http://towersoa.wmptech.com/SOA/tower4customers/";
var domain="TADVISOR";
function sendH() {                //////////////////////////////////// SEND ////////////////////////////////////
    var text = $speechInput.val();
    var chatHistoryDiv = $("#chatHistory");
    $.ajax({
        type: "GET",
        url: baseUrl_H + "Login.ashx?userCode=juann@techrules.com&userPass=Sebastian1.&domain=TADVISOR&language=es-ES",
            //url: baseUrl_H + "MyTAdvisorLoginInvestorHandler.ashx",
        contentType: "application/json",//; charset=utf-8",
        dataType: "json",
        // headers: {
        //     "Authorization": "Bearer " + accessToken
        //},
        // data: JSON.stringify({query: text, lang: "en", sessionId: "yaydevdiner"}),
        success: function(data) {
        console.log(data);
            // prepareResponse_h(data);
        },
        error: function() {
            respond(messageInternalError);
        }
    });
}
function prepareResponse_h(val) {  //////////////////////////////////// RESPUESTA ////////////////////////////////////
    var location_c, dataObj, messagesPrint = "", messagePrint2 = "";
    var spokenResponse = val.result.fulfillment.messages;
    var debugJSON = JSON.stringify(val, undefined, 2); //convert JSON to string
    debugRespond(debugJSON); //function to print string in debug window response from API
    for (i=0;i< spokenResponse.length; i++){
        if(spokenResponse[i].type==0){ //type 0 is a SPEECH
            messagePrint2= spokenResponse[i].speech;
            dataObj = eval('\"'+ jsonEscape(messagePrint2) +'\"');
            messagesPrint+=  "> "+ dataObj + "<br />";
            respond(dataObj);
            // $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 1000);
        }
        else if (spokenResponse[i].type==4 && spokenResponse[i].payload.items) { //type 4 is a custompayload
            // arrayList=spokenResponse[i].payload.items;
            // printButton(arrayList);
            printButton(spokenResponse[i].payload.items);
        }
        else if (spokenResponse[i].type==4 && spokenResponse[i].payload.slide) { //type 4 is a custompayload
            printSliderSelector(spokenResponse[i].payload.slide.name);
        }
        else if (spokenResponse[i].type==4 && spokenResponse[i].payload.imgButton) { //type 4 is a custompayload
            printImgButton(spokenResponse[i].payload.imgButton.name,spokenResponse[i].payload.imgButton.data); //envio el nombre y los datos del payload
        }
        else if (spokenResponse[i].type==4 && spokenResponse[i].payload.sendEvent) { //type 4 is a custompayload
            prepare_event(spokenResponse[i].payload.sendEvent.name, spokenResponse[i].payload.sendEvent.data ); //envio el nombre y los datos del payload
        }
        else if (spokenResponse[i].type==4 && spokenResponse[i].payload.img) { //type 4 is a custompayload
            console.log(spokenResponse[i].payload.img.data);
            console.log(spokenResponse[i].payload.img.data["imgsrc"]);
            printImgAndText(spokenResponse[i].payload.img.name, spokenResponse[i].payload.img.data, spokenResponse[i].payload.img.data["text"],spokenResponse[i].payload.img.data["link"]); //envio el nombre y los datos del payload

        }
        $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 400); //[0].scrollHeight ==== .scrollTop
    }
    spokenRespond(messagesPrint);
}
