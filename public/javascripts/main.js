// Este JS esta recortado del archivo index.hjs original del 24/08/2017


// var clientTOKEN = process.env.API_AI_CIENT_TOKEN_TADV; //revisar el uso de éste acceso a variables env

var tadvisorToken = "8d84b192d8df4d85b023605ae7ac1e83", originalToken = "dce399808780466db898fad9bfae71fe";
// var accessToken = clientTOKEN.toString(),
var accessToken = tadvisorToken,
baseUrl = "https://api.api.ai/v1/",
version="20170810",
$speechInput,
$recBtn,
recognition,
mensaje,
messageRecording = "Recording...",
messageCouldntHear = "I couldn't hear you, could you say that again?",
messageInternalError = "Oh no, there has been an internal server error",
messageSorry = "I'm sorry, I don't have the answer to that yet.";
var tiempoSend, timeout = null;
    var str="";
// var firstTypedLetter = 'Y';
$(document).ready(function() {   //////////////////////////////////// JS PRINCIPAL ////////////////////////////////////
    $speechInput = $("#speech");
    $recBtn = $("#rec");
    $recBtn1 = $("#rec1");
    mensaje = $speechInput.val();
    $speechInput.keyup(function(event) { //I change keyup fot keypress//
        if (tiempoSend !== null) {
            clearTimeout(tiempoSend);
        }
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        $speechInput.val();
        if ($speechInput.val()==''){
            // $('#statusMessages').text("Waiting input...");
            // $('#statusMessages').text("\""+process.env.API_AI_CIENT_TOKEN_TADV+"\"");
            // $('#statusMessages').text("clietTOKEN");
        }
        else{
            $('#statusMessages').text("Typing...");
            $speechInput.val();
                timeout = setTimeout(function () {if($speechInput.val() != ''){$('#statusMessages').text("Waiting input or Enter...");}}, 3000);
        }
        if (event.which == 13) {
            event.preventDefault();
            if($speechInput.val() != ''){
                send();
                tiempoSend=setTimeout(function(){$('#statusMessages').text("Next input...");},2000);
            }
        }
    });
    $recBtn.on("click", function(event) {
        switchRecognition();
    });
    $(".debug__btn").on("click", function() {
        $(this).next().toggleClass("is-active");
        return false;
    });

});

function printInput() {          //////////////////////////////////// PRINT FUNCTIONS ////////////////////////////////////
    if($speechInput.val() != ''){
        $('#testing').text($speechInput.val());
    }
    else{
        if($speechInput.val() == ''){$('#testing').text("Estoy vacio");}
        else{$('#testing').text("Aqui otra vez");}
    }
}

function printLink(dato, dato2) {
        $('#testing').text('');
        $('#testing').append(dato);
        // $('#frame').append(dato2);
}

function startRecognition() {    //////////////////////////////////// SPEECH RECOGNITION ////////////////////////////////////
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = function(event) {
        respond(messageRecording);
        updateRec();
    };
    recognition.onresult = function(event) {
        recognition.onend = null;
        var text = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
        }
        setInput(text);
        stopRecognition();
    };
    recognition.onend = function() {
        respond(messageCouldntHear);
        stopRecognition();
    };
    recognition.lang = "en-US";
    recognition.start();
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    updateRec();
}

function switchRecognition() {
    if (recognition) {
        stopRecognition();
    } else {
        startRecognition();
    }
}

function setInput(text) {
    $speechInput.val(text);
    send();
}

function updateRec() {
    $recBtn1.text(recognition ? "Stop" : "Listening...");
}

function send() {                //////////////////////////////////// SEND ////////////////////////////////////
    var text = $speechInput.val();
    var chatHistoryDiv = $("#chatHistory");
    $.ajax({
        type: "POST",
        url: baseUrl + "query?v=20170810",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({query: text, lang: "en", sessionId: "yaydevdiner"}),
        success: function(data) {
            prepareResponse(data);
            // console.log("data from SEND");
            // console.log(data);
        },
        error: function() {
            respond(messageInternalError);
        }
    });
    $('#statusMessages').text("Message Send!");
    // firstTypedLetter = 'Y';
    // if (auth === memberName )
    // {
    //$('#chatHistory').append( "<div ><span class='left'>"+auth+":"+msg+"</span></div><hr>" );
    datestr=getFormattedDate();
    chatHistoryDiv.append(
        "<div class='chat-message bubble-left' >"+
        "<div class='avatar'>"+
        "<img src='https://www.mytadvisor.com/SOA20/Profiles/defaultuser_SMALL.png' alt='' width='32' height='32' style='float: left;>"+
        "</div>"+
        "<div class='chat-message-content'>" +
        "<h4 style='margin-top: 45px; margin-bottom: 0.5em; margin-left: 0.5em;'>"+text+"</h4>"+
        "<h5 class='timestamp_right' style='font-size: 10px; margin-bottom: 0; margin-top: 0.5em'>"+datestr+"</h5>"+
        //"<span class='chat-time right'>13:35</span>"+
        //"<p class='right'>Me</p>"+
        "</div> <!-- end chat-message-content -->"+
        //"<hr>"+
        "</div> <!-- end chat-message -->"
    );
    $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 1000);
    $speechInput.val("");
    ///////
}

function prepareResponse(val) {  //////////////////////////////////// RESPUESTA ////////////////////////////////////
    var location_c,
    dataObj,
    dataObj2,
    valObj,
    i=0;
    messagesPrint= "",
    messagePrint= "",
    messagePrint2="";
    var spokenResponse = val.result.fulfillment.messages;
    var debugJSON = JSON.stringify(val, undefined, 2);
    var arrayList=[];
    // console.log("val from prepareResponse");
    // console.log(val);

    // respond(spokenResponse);
    debugRespond(debugJSON);
    // console.log("debugJSON from prepareResponse");
    // console.log(debugJSON);

    for (i=0;i< spokenResponse.length; i++){
        // messagePrint = JSON.stringify(spokenResponse[i].speech, undefined, 2);
        if(spokenResponse[i].type==0){ //type 0 is a SPEECH
            messagePrint2= spokenResponse[i].speech;
            // console.log("messagePrint: " + i);
            // console.log(messagePrint);
            // console.log("messagePrint2:  " + i);
            // console.log(messagePrint2);
            dataObj = eval('\"'+ jsonEscape(messagePrint2) +'\"');
            messagesPrint+=  "> "+ dataObj + "<br />";
            // dataObj = eval('\"'+ jsonEscape(messagePrint2) +'\"');
            // messagesPrint+=  "> "+ messagePrint2 + "<br />";
            // console.log(messagesPrint);
            // dataObj2 = dataObj.replace(/&nbsp/g,"");
            // dataObj2 = JSON.stringify(dataObj,undefined,2).replace(/&nbsp/g,"");
            // spokenRespond(dataObj2);
            respond(dataObj);
            console.log(dataObj);
        }
        else if (spokenResponse[i].type==4) { //type 4 is a custompayload
            for(j=0;j<spokenResponse[i].payload.items.length;j++){
                arrayList[j]=spokenResponse[i].payload.items[j]
            }
            console.log(arrayList);
            printButton(arrayList);
        }

    }
    // $('#testing').text(messagesPrint); //imprimir en testing label
    spokenRespond(messagesPrint);
    // $('#testing').text(eval('\"'+ jsonEscape(spokenResponse[1].speech)+'\"'));

    ////// val.$1.$2 , se refiere a la respuesta JSON (valor) data.key1.key2
    if(val.result.metadata.intentName == "location"){

        location_c = val.result.parameters["geo-country"]; //por el dash "-" no se usa . punto
        news_country="https://news.google.com/news/search/section/q/"+location_c+"/"+location_c+"?hl=es-419&ned=es_co";
        link_country="<a href = "+news_country+" target =\"right_side\">News from "+location_c+"</a>";
        prueba="https://www.w3schools.com";
        frame_country="<iframe name=\"right_side\" src =\"\" width=\"300\" height=\"100\">mmmhhh</iframe>";
        printLink(link_country,frame_country);

    }
}

function debugRespond(val) {
    $("#response").text(val);
}

function respond(val) {
    var chatHistoryDiv = $("#chatHistory");
    if (val == "") {
        val = messageSorry;
    }
    datestr=getFormattedDate();
    //$('#chatHistory').append( "<div ><span class='right'>"+auth+":"+msg+"</span></div><hr>" );
    chatHistoryDiv.append(
        "<div class='chat-message bubble-right'>"+
        "<div class='avatar'>"+
        "<img src='https://www.mytadvisor.com/SOA20/Content/Images/TAdvisor/isotipo.png' alt='' width='32x' height='32px' style='float: right;'>"+
        "</div>"+
        "<div class='chat-message-content' style= 'clear: right;'>" +
        //"<span class='chat-time'>13:35</span>"+
        // "<p font-size='50%' font-style= 'italic'>"+auth+"</p>"+
        "<h4 style='margin-top: 45px; margin-bottom: 0.5em; margin-left: 0.5em;'>"+val+"</h4>"+
        "<h5 class='timestamp_right' style='font-size: 10px; margin-bottom: 0; margin-top: 0.5em'>"+datestr+"</h5>"+
        "</div> <!-- end chat-message-content -->"+
        //"<hr>"+
        "</div> <!-- end chat-message -->"
    );
    if (val !== messageRecording) {
        var msg = new SpeechSynthesisUtterance();
        msg.voiceURI = "native";
        msg.text = val.replace(/&nbsp/g,"");
        msg.lang = "en-US";
        window.speechSynthesis.speak(msg);
    }
    // $("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(val);
    // $("#spokenResponseTitle").addClass("is-actived").find(".responseLabel").html("API Response");

}

function spokenRespond (val){
    if (val == "") {
        val = messageSorry;
    }
    $("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(val);
    $("#spokenResponseTitle").addClass("is-actived").find(".responseLabel").html("API Response");
}

function getFormattedDate() {
    var date = new Date();

    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;

    /*var str = date.getFullYear() + "/" + month + "/" + day + " " +  hour + ":" + min + ":" + sec;*/
    var str = /*date.getFullYear() + "/" + month + "/" + day + " " +*/  hour + ":" + min; /*+ ":" + sec;*/
    /*alert(str);*/
    return str;
}

function jsonEscape(stringJSON)  {
    // console.log("stringJSON from jsonEscape");
    // console.log(stringJSON);
    // str=stringJSON.replace(/\n/g,'<br />');//.replace(/\r/g, "\\r").replace(/\t/g, "\\t");
    // console.log("str from jsonEscape");
    // console.log(str);
    return stringJSON.replace(/\n/g,'<br />');//.replace(/\r/g, "\\r").replace(/\t/g, "\\t");
}

function send_event() {                //////////////////////////////////// SEND ////////////////////////////////////
    $.ajax({
        type: "POST",
        url: baseUrl + "query?v=20170810",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({'event': {'name':'custom_event', data:{'name': 'Juan'}}, lang: "en", sessionId: "yaydevdiner"}),
        success: function(data) {
            prepareResponse(data);
            // console.log("data from SEND_EVENT");
            // console.log(data);
        },
        error: function() {
            respond(messageInternalError);
        }
    });
    $('#statusMessages').text("Type the topic you are interested in");
}

function printButton(arrayList){
    var printButton_i="<br />";
    var chatHistoryDiv = $("#chatHistory");
    for(i=0;i<arrayList.length;i++){
        printButton_i+="<div class='quickReplyButton' style='display:inline'>"+"<button id='"+arrayList[i]+"' name='listButton"+i+"' onclick=\"quickReplyF('"+arrayList[i]+"')\" style='margin-top: 5px; display: inline-block;'>"+arrayList[i]+"</button>"+"</div>";
    }
    console.log(printButton_i);
    chatHistoryDiv.append(
            "<div class='chat-message bubble-right'>"+
                "<div class='chat-message-content' style= 'clear: right;'>" +
                    printButton_i+
            // "<h4 style='margin-top: 45px; margin-bottom: 0.5em; margin-left: 0.5em;'>"+val+"</h4>"+
                    "<h5 class='timestamp_right' style='font-size: 10px; margin-bottom: 0; margin-top: 0.5em'>"+datestr+"</h5>"+
                    "</div> <!-- end chat-message-content -->"+
            //"<hr>"+
            "</div> <!-- end chat-message -->");
    // return printButton_i;
}
function quickReplyF(stringItem){
    $speechInput.val(stringItem);
    console.log(typeof(stringItem));
    send();
    // send($speechInput.val(stringItem));

}
