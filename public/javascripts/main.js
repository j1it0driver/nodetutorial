// (function(){
  'use strict';
//version R-Prod from L-Master2
// var clientTOKEN = process.env.API_AI_CIENT_TOKEN_TADV; //revisar el uso de éste acceso a variables env
var tadvisorToken = "aba2ecdbb9e744ba8b37ec6cf6a175d9", originalToken = "dce399808780466db898fad9bfae71fe";
var productionToken="d8263496b81c4d82bc1b557574106e0f", flouristToken="1dfd6eb17bb240db9ec60813c5d0095a", accessToken = tadvisorToken;
var baseUrl = "https://api.api.ai/v1/", version="20170810";
var $speechInput= $("#speech"), $recBtn= $("#rec"), $recBtn1= $("#rec1"), $statusMessages= $('#statusMessages'), $debugBtn= $(".debug_btn");
var recognition,
messageRecording = "Recording...",
messageCouldntHear = "I couldn't hear you, could you say that again?",
messageInternalError = "Oh no, there has been an internal server error",
messageSorry = "I'm sorry, I don't have the answer to that yet.";
var tiempoSend, timeout = null, timeout2=null, tiempoStop=null, buttonIds=[], sliderId=[], imgBtnIds=[], imgBtnIdsSend=[], radiosId=[],imgBtnTemp; //imgBtnList=[];//arrayList=[]
var str="", datos, bubble_id=0, printIndex=bubble_id-1;
var datestr;
var srcAddresses=JSON.parse('{"reaction":{"hopeful":{"src":"/images/reaction/hopeful.png"},"worried":{"src":"/images/reaction/worried.png"},"relaxed":{"src":"/images/reaction/relaxed.png"},"terrified":{"src":"/images/reaction/terrified.png"}},"risk_aversion":{"very conservative":{"src":"/images/risk_aversion/veryconservative.png"},"conservative":{"src":"/images/risk_aversion/conservative.png"},"balanced":{"src":"/images/risk_aversion/moderate.png"},"dynamic":{"src":"/images/risk_aversion/dynamic.png"},"aggresive":{"src":"/images/risk_aversion/aggresive.png"}},"risk_profile":{"Gear2":{"src":"/images/risk_profile/Gear2.png"}},"asset_list":{"assetList":{"src":"/images/asset_list/assetList.PNG"}}}');
var uname, psw;
var baseUrl_H="https://towersoa.wmptech.com/SOA/tower4customers/";
var baseUrl_P="https://mytadvisor.com/SOA/tower4customers/";
var domain="TADVISOR";
var language=null, userId=null, userCode=null, userPass=null, tokenString=null, views=null, clientId=null, token=null, email=null;
var chat_bubbleId=[];
var voices=speechSynthesis.getVoices();
var chatHistoryDiv = $("#chatHistory");
var toAppend;
var x, i, j, k;
var visits;
var sessionID=null;
var username;
navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;
// window.onload = maxWindow;

// $(function() {
// (function($) {
//     var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
//
//     $.fn.attrchange = function(callback) {
//         if (MutationObserver) {
//             var options = {
//                 subtree: false,
//                 attributes: true
//             };
//
//             var observer = new MutationObserver(function(mutations) {
//                 mutations.forEach(function(e) {
//                     callback.call(e.target, e.attributeName);
//                 });
//             });
//
//             return this.each(function() {
//                 observer.observe(this, options);
//             });
//
//         }
//     }
// })(jQuery);
// $("#popupPanel-screen").attrchange(function(attrName) {
//
//     if(attrName=='class'){
//             alert('class changed');
//     }else if(attrName=='id'){
//             alert('id changed');
//     }else{
//         //OTHER ATTR
//     }
//
// });
// });
// document.addEventListener("DOMContentLoaded", function(){ //faster doesn t work on IE9-
  // Handler when the DOM is fully loaded vs  $(document).ready(function() {

// $(document).ready(function() {
    visits();
    username();
    sessionID=readCookie("sessionID");
    // eraseCookie("sessionID");
    //eraseCookie("visits");
    $('[data-toggle="tooltip"]').tooltip();
    // $("[data-toggle=tooltip]").tooltip();
    // send_event('custom_event','Guest');
    // $("#popupPanel-screen").bind('DOMSubtreeModified', function(e) {
    //     alert('class changed');
    // });
    x = {
      bubble_idInternal: bubble_id,
      bubble_idListener: function(val) {},//     }

      set bubble_id(val) {
        this.bubble_idInternal = val;
        this.bubble_idListener(val);
      },
      get bubble_id() {
        return this.bubble_idInternal;
      },
      registerListener: function(listener) {
        this.bubble_idListener = listener;
      }
    }
    x.registerListener(function(val) {
      $("#bubbleId").text(x.bubble_id);

    });
    $speechInput.keyup(function(event) {
        if (tiempoSend !== null) {
            clearTimeout(tiempoSend);
        }
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        if ($speechInput.val()==''){
        }
        else{
            $statusMessages.text("Typing...");
            timeout = setTimeout(function () {if($speechInput.val() != ''){$statusMessages.text("Waiting input or Enter...");}}, 3000);
        }
        if (event.which == 13) {
            event.preventDefault();
            if($speechInput.val() != ''){
                send_query();
                tiempoSend=setTimeout(function(){$statusMessages.text("Next input...");},2000);
            }
        }//     }

    });
    $speechInput.focus(function(event){
        $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 200);
    });
    $recBtn.on("click", function(event) { // SPEECH
        clearTimeout(tiempoStop);sessionID
        if (hasGetUserMedia()) { // revisar si existe hasGetUserMEdia
            console.log("getusermedia ok");
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            navigator.getUserMedia({ audio: true },function(e) {
                console.log("audioTrue ok");
                switchRecognition();
            },function(err) { console.log(err.name + ": " + err.message);
                                    alert("Microphone is disabled/blocked in your device/browser. Please give permissions to use voice recognition.")}); // always check for errors at the end.;
        } else {
          alert('getUserMedia() is not supported in your browser');
        }
    });
    $(".debug_btn").on("click", function() { //function to manage DEBUG behavior
        $(this).next().toggleClass("is-active"); //algo//     }.next() mira a los hermanos de algo. El siguiente tag
        $(this).toggleClass("is-active");
        $(".debug").toggleClass("is-active");
        return false;
    });
    $("#chat-button").bind("click",function(){
        if(bubble_id==0){
            send_event('custom_event', username);
        }
        $(this).hide();
    });
    $( "#popupPanel" ).bind({
       popupafterclose: function(event, ui) {$("#chat-button").show();  }
    });
    $("#close").on("click", function(){
        $( "#popupPanel" ).popup( "close" );
    });
// });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function visits(){
    if(!checkCookie("visits")){
        console.log("primera visita");
        visits=0;
        createCookie("visits", 1, 1);
        console.log(readCookie("visits"));
    }else{
        visits=Number(readCookie("visits"));
        visits += 1;
        console.log(visits);
        createCookie("visits", visits, 1);
        console.log(readCookie("visits"));
    }
}
function username(){
    if(!checkCookie("username")){
        username="New Guest";
    }else{
        username=readCookie("username");
    }
    createCookie("username", username, 1);
}

function hasGetUserMedia() {
  return !!(navigator.getUserMedia|| navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

function calcVH() {
    $('body').innerHeight( $(this).innerHeight() );
}

function printLink(dato, dato2) {
        $('#testing').text('');
        $('#testing').append(dato);
}

function startRecognition() {
    var final_transcript;
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    console.log("StartRecFunc ok");   //////////////////////////////////// SPEECH RECOGNITION ////////////////////////////////////
    if (!('webkitSpeechRecognition' in window)) {
        console.log("no webkit");
        // upgrade();
        console.log("upgrade");
    } else {
        recognition = new SpeechRecognition();
        console.log("new recog ");
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.onstart = function(event) {
            respond(messageRecording,null);
            $recBtn.addClass("is-actived");
            updateRec();
        };
        recognition.onresult = function(event) {
            var text = "";
            for (var i = event.resultIndex; i < event.results.length; ++i) {
               if (event.results[i].isFinal) {
                 final_transcript += event.results[i][0].transcript;
               } else {
                 text += event.results[i][0].transcript;
               }
             }
            console.log("rec.onresult ");
            recognition.onend = null;
            setInput(text);
            setInput(final_transcript);
            stopRecognition();
        };
        recognition.onerror = function(event){
            console.log("error "+ event.error);
            respond(event.error,null);
        };
        recognition.onend = function() {
            console.log("rec.onend ");
            respond(messageCouldntHear,null);

            if(recognition){
                recognition.lang = "en-GB";
                recognition.start();// to restart recognition for mobile problem
            }
            stopRecognition();
        };
        recognition.lang = "en-US";
        recognition.start();
    }
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    $recBtn.removeClass("is-actived");
    updateRec();
}

function switchRecognition() {
    if (recognition) {
        stopRecognition();
    } else {
        console.log("startRecFunc ");
        startRecognition();
    }
}

function setInput(text) {
    $speechInput.val(text);
    send_query();
}

function updateRec() {
    $recBtn1.text(recognition ? "Listening" : "Rec");
    tiempoStop = setTimeout(function () {if($recBtn1.text() == "Rec"){$recBtn1.text("Speak");}}, 4000);
}

function prepareResponse(val) {  //////////////////////////////////// RESPUESTA ////////////////////////////////////
    // console.log("prepare response",val);
    var location_c, dataObj=null, messagesPrint = "", messagePrint2 = "", dataObjLinks;
    var spokenResponse = val.result.fulfillment.messages;
    var webhookData = val.result.fulfillment.data;
    var webhookAction = val.result.action;
    // if (val.result.action!="" && val.result.fulfillment.data!=""){ //evaluates if there is an action from apiai (webhook)
    //     var webhookData = val.result.fulfillment.data; //Extract data sended from webhook
    //     var webhookAction = val.result.action;
    // }

    var debugJSON = JSON.stringify(val, undefined, 2); //convert JSON to string
    debugRespond(debugJSON); //function to print string in debug window response from API
    for (i=0;i< spokenResponse.length; i++){
        if(spokenResponse[i].type==0){ //type 0 is a SPEECH
            messagePrint2= spokenResponse[i].speech;
            // messagePrint2= spokenResponse[i];
            dataObj = eval('\"'+ jsonEscape(messagePrint2) +'\"');
            // messagesPrint+=  "> "+ dataObj + "<br />";
            for (j=0;j< spokenResponse.length; j++){ //add links on displayed text
                if(spokenResponse[j].type==4 && spokenResponse[j].payload.links){
                    dataObjLinks=putLinks(spokenResponse[j].payload.links,dataObj);
                }
            }
            // respond(messagePrint2);
            respond(dataObj,dataObjLinks);
        }
        if(webhookData){ // do something with webhook data

            if(webhookAction=="search_Asset"){
                printAssets(webhookData);
            }
        }
        else if (spokenResponse[i].type==4 && spokenResponse[i].payload.items) { //type 4 is a custompayload
            printButton(spokenResponse[i].payload.items);
            if (spokenResponse[i].payload.username){
                username=spokenResponse[i].payload.username;
                createCookie("username",username,365);
            }
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
            printImgAndText(spokenResponse[i].payload.img.name, spokenResponse[i].payload.img.data, spokenResponse[i].payload.img.data["text"],spokenResponse[i].payload.img.data["link"]); //envio el nombre y los datos del payload
        }
        else if (spokenResponse[i].type==4 && spokenResponse[i].payload.login) { //type 4 is a custompayload
            appendHtml("left");
            printLogin('login', spokenResponse[i].payload.login.username, spokenResponse[i].payload.login.password); //envio el nombre y los datos del payload
        }
        else if (spokenResponse[i].type==4 && spokenResponse[i].payload.create) { //type 4 is a custompayload
            appendHtml("left");
            printLogin('create', spokenResponse[i].payload.create.username, spokenResponse[i].payload.create.password); //envio el nombre y los datos del payload
        }
        else if (spokenResponse[i].type==4 && spokenResponse[i].payload.forgot) { //type 4 is a custompayload
            appendHtml("left");
            printLogin('forgot', spokenResponse[i].payload.forgot.username, null); //envio el nombre y los datos del payload
        }
        else if (spokenResponse[i].type==4 && spokenResponse[i].payload.lists) { //type 4 is a custompayload
            display_lists(); //envio el nombre y los datos del payload
        }
        $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 400); //[0].scrollHeight ==== .scrollTop
    }
    spokenRespond(messagesPrint);
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

function respond(val, valLinks) { // function to print a text into chat message and to speech the text outloud
    // valor=val.speech;

    var toAppend, sentences=null, sentence=null, sentencesArray;
    if (valLinks==null){
        valLinks=val;
    }
    if (valLinks == "") {
        valLinks = messageSorry;
    }
    // sentences=val.split(".");
    sentences=val;
    sentences=sentences.replace(/&nbsp/g,"").replace(/<br \/>/g,"").replace(/<br>/g,"").replace(/<i>/g,"").replace(/<\/i>/g,"").replace(/\n/g,"").replace(/<b>/g,"").replace(/<\/b>/g,"");//.replace(/&quot;/,"\'"); //quitar el espacio en blanco del speech .replace(/H.*S/, 'HS');
    sentencesArray=sentences.split(".");
    for (var k in sentencesArray){
         sentence=sentencesArray[k];
        if (val !== messageRecording) {
            var msg = new SpeechSynthesisUtterance(sentence);
            msg.voiceURI = "native";
            msg.pitch = 1.1;
            msg.rate = 1.1;
            msg.text = sentence;
            msg.lang = "en-GB";
            window.speechSynthesis.speak(msg);
        }
    }
    // dataObj = eval('\"'+ jsonEscape(valor) +'\"');
    // valor=putLinks(val.payload.links,valor);
    toAppend="<h6 class='mb-0 d-block'>"+valLinks+"</h6>";
    appendHtml("left",toAppend);
    $speechInput.blur();
    // $speechInput.focus();

// setTimeout(function() { //function to avoid speak stops after 15-seg's bug.
//   speechSynthesis.pause();
//   speechSynthesis.resume();
// }, 10000);
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
    var str = /*date.getFullYear() + "/" + month + "/" + day + " " +*/  hour + ":" + min; /*+ ":" + sec;*/
    chat_bubbleId[bubble_id]="#chatBubble"+bubble_id;
    return str;
}

function jsonEscape(stringJSON)  {
    return stringJSON.replace(/\n/g,'<br />');//.replace(/\r/g, "\\r").replace(/\t/g, "\\t");
}

function send_event(eventName,valor){
    var r = new XMLHttpRequest();
    r.open("POST", "/api/event", true);
    r.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    r.onreadystatechange = function () {
      if (r.readyState != 4 || r.status != 200) return;
      var temporal=JSON.parse(r.responseText);
    //   console.log(temporal);
    //   alert("Success: " + temporal);
      datos=temporal.result.fulfillment.messages;
      prepareResponse(temporal);
    };
    r.send(JSON.stringify({'event': {'name': eventName, data:{'valor': valor}}}));

    $('#statusMessages').text("Type the topic you are interested in");
    $speechInput.val("");
    $speechInput.blur();
}

// function printButton(arrayList){
//     var printButton_i="";
//     var toAppend;
//     buttonIds[i]=null;
//     for(var i in arrayList){
//     // for(i=0;i<arrayList.length;i++){
//         buttonIds[i]=createIdFromText(var data = req.body.val;arrayList[i]);
//         printButton_i+=
//                 "<button class='listButton btn btn-outline-primary btn-sm m-1' id='"+buttonIds[i]+"' name='listButton"+i+"' onclick=\"quickReplyF('"+arrayList[i]+"','"+buttonIds[i]+"',"+'buttonIds'+")\" style='display: inline-block;'>"+
//                     arrayList[i]+
//                 "</button>";
//         // $("#"+buttonIds[i]).onclick= quickReplyF(arrayList[i], buttonIds[i], buttonIds);
//     }
//     toAppend="<div class='quick-reply-button d-block text-center'>"+
//                 printButton_i+
//             "</div>";
//     appendHtml(toAppend,"left");
// }
function printButton(arrayList){
    // appendHtml("left");
    // var printButton_i="";
    // var toAppend="";
    // var printIndex= bubble_id-1;
    buttonIds=[];
    $("<div class='quick-reply-button d-var data = req.body.val;block text-center mt-1' id='chatBubbleDivDiv"+printIndex+"'></div>").appendTo('#chatBubbleDiv'+printIndex);
    for(var i in arrayList){
        buttonIds[i] = printIndex+createIdFromText(arrayList[i]);
        $("<button class='listButton btn btn-outline-primary btn-sm mr-1 mt-1' id='"+buttonIds[i]+"' name='listButton"+i+"' style='display: inline-block;'>"+arrayList[i]+"</button>").appendTo('#chatBubbleDivDiv'+printIndex);
    }
    for(var k in arrayList){
    $("#"+buttonIds[k]).attr('onClick', "quickReplyF('"+arrayList[k]+"','"+buttonIds[k]+"',"+'buttonIds'+")");
    }
}

function quickReplyF(stringItem,buttonId,buttonIds){
    $speechInput.val(stringItem);
    disableButtons(buttonId,buttonIds);
    send_query();
}

function disableButtons(buttonIdSelected,buttonIdsToDisable){
    for(var i in buttonIdsToDisable){
        console.log(buttonIdsToDisable[i]);
        document.getElementById(buttonIdsToDisable[i]).disabled = true;
    }
    document.getElementById(buttonIdSelected).classList.add("responseBtn");
    // $('#'+buttonIdSelected).addClass("responseBtn");
    document.getElementById(buttonIdSelected).disabled = true;
}

function createIdFromText(idText){// idText viene en Formato de texto tal y como se debe imprimir (con espacios y mayusculas)
    return idText.toLowerCase().replace(/_/g,"").replace(/ /g,"").replace(/,/g,"");
}

function printSliderSelector(sliderName){
    // var printIndex = bubble_id-1;
    var sliderId = printIndex+createIdFromText(sliderName);
    $("<div class='d-block text-center' id='chatBubbleDivDiv"+printIndex+"'></div>").appendTo('#chatBubbleDiv'+printIndex);
    $("<div class='slidecontainer px-2'><input type='range' min='0' max='100000' step='5000' value='10000' class='slider w-100' id='"+sliderId+"'></div>").appendTo('#chatBubbleDivDiv'+printIndex);
    $("<button class='sliderButton btn btn-outline-primary btn-sm m-1' id='"+sliderId+"SliderBtnSend' type=\"button\" style='width:100px'></button>").appendTo('#chatBubbleDivDiv'+printIndex);
    $('#'+sliderId+'SliderBtnSend').attr('onClick', "sendSlice('"+sliderId+"')");
    var slider = $("#"+sliderId)[0];// DOM obj
    var output = $("#"+sliderId+"SliderBtnSend");//jQuery obj
    output.html(slider.value);
    $speechInput.val(slider.value);
    slider.oninput = function() {
        output.html(this.value.toLocaleString(undefined, {maximumFractionDigits:2})); //toLocaleString to conver to money format
        $speechInput.val(this.value.toLocaleString(undefined, {maximumFractionDigits:2}));
    }
}

function sendSlice(sliderId){
    var sliderIdbtnSend=sliderId+"SliderBtnSend";
    disableButtons([sliderIdbtnSend],[sliderIdbtnSend]);
    disableButtons([sliderId],[sliderId]);
    send_query();
 }

function printImgButton(imgBtnName, imgBtnList){
    // var printIndex = bubble_id-1;
    var imgSrc;
    var imgButton_i="";
    $("<div class='d-block text-center' id='chatBubbleDivDiv"+printIndex+"'></div>").appendTo('#chatBubbleDiv'+printIndex);
    for (var i in imgBtnList){
        imgBtnIds[i]=createIdFromText(imgBtnList[i])+printIndex;
        imgBtnIdsSend[i]=imgBtnIds[i]+"ImgBtnSend";
        imgSrc=getImgSrc(imgBtnName, imgBtnList[i]);//busco la URL de la imagen de acuerdo al nombre. funcion para obtener los recursos src de la imagen
        imgBtnTemp=imgBtnList[i];
        $("<div class='img-button-container d-inline-block card text-center mw-50'><img class='rounded-circle card-img-top mw-50' src='"+imgSrc+"' alt='"+imgBtnList[i]+"' id='"+imgBtnIds[i]+"' style='max-width:7.2rem;'><div class='card-body p-2'><button class='listButton btn btn-outline-primary btn-sm m-0' id='"+imgBtnIds[i]+"ImgBtnSend' type=\"button\" style=''>"+imgBtnList[i]+"</button></div></div>").appendTo('#chatBubbleDivDiv'+printIndex);
    }
    for(var k in imgBtnList){
        $("#"+imgBtnIds[k]+"ImgBtnSend").attr('onClick', "sendImgBtn(\'"+imgBtnList[k]+"\',\'"+imgBtnIds[k]+"\',"+'imgBtnIds'+","+'imgBtnIdsSend'+")");
    }
}

function getImgSrc(refName, imgName){
    var srcAddress,ref;
    srcAddress=srcAddresses[refName][imgName].src;
    return srcAddress;
}

function sendImgBtn(imgBtnItem, dialogm, imgBtnName, imgBtnIds, imgBtnIdsSend){
    $speechInput.val(imgBtnItem);
    disableButtons(imgBtnName+"ImgBtnSend", imgBtnIdsSend);
    disableButtons(imgBtnName, imgBtnIds);
    send_query();
}

function prepare_event(eventName,data){
    switch(eventName){
        case "wait_time":
            wait_time(data.timer);
            break;
    }
}

function wait_time(timer){
    timeout2 = setTimeout(function () {if($speechInput.val() == ''){send_event("wait_time","GEAR Hill:Balanced");}}, timer);
}

function printImgAndText(name, data, text, link){
    // var printIndex = bubble_id-1;
    var imgSrc;
    var imgButton_i="";
    var itemName;
    $("<div class='img-text-l' &ui-state='dialogink'style= 'clear: right; text-align:center;width: 90%;' id='chatBubbleDivDiv'"+printIndex+"'></div>").appendTo('#chatBubbleDiv'+printIndex);
    if(data["imgsrc"]){
        itemName=createIdFromText(name+data["imgsrc"]);
        imgSrc=getImgSrc(name, data["imgsrc"]);
        $("<div class='imgContainer'><input type='image' src='"+imgSrc+"' class='img mw-50' id='"+itemName+"'></div>").appendTo('#chatBubbleDivDiv'+printIndex);
    }
    if(text){
        itemName=createIdFromText(name+"text");
        $("<div class='textContainer'><h2 class='textPrinted' id='"+itemName+"'>"+text+"</h2></div>").appendTo('#chatBubbleDivDiv'+printIndex);
    }
    if(link){
        itemName="Ver detalle";
        $("<div class='linkContainer'><a href = "+link+" target =\"frame\">"+itemName+"</a></div>").appendTo('#chatBubbleDivDiv'+printIndex);
    }
    // searchAssets("prueba");
}

function printLogin(type, username,password) {
    // var printIndex = bubble_id-1;
    if(type=='login'){
        $("<div class='loginForm'><label><b>Username</b></label><input id='uname' type='text' placeholder='Enter Username' name='uname' required><label><b>Password</b></label><input type='password' placeholder='Enter Password' name='psw' required><label><input id='checkbox"+printIndex+"' type='checkbox' checked='checked'> Remember me</label></div>").appendTo('#chatBubbleDiv'+printIndex);
        $("<div class='' style=''><button class='formBtn' type='submit' onclick=send_login()>Login</button>&nbsp;&nbsp;<button class='formBtn' type='button' class='cancelbtn'>Cancel</button></br><span class='psw'>Forgot <a  href='https://www.mytadvisor.com/password-recovery/' target='_blank' >password?</a></span></div></br>").appendTo('#chatBubbleDiv'+printIndex);
        if(checkCookie("user")){
            $("input[name='uname']").val(readCookie("user"));
        }
        // clientHandler();
        // var toAppend;
        // toAppend="<div class='loginForm'>"+
        //     // "<form action="">"+
        //     "<label><b>Username</b></label>"+
        //     "<input id='uname' type='text' placeholder='Enter Username' name='uname' required>"+
        //     "<label><b>Password</b></label>"+
        //     "<input type='password' placeholder='Enter Password' name='psw' required>"+
        //     "<button class='formBtn' type='submit' onclick=send_login()>Login</button>"+
        //     "<label><input type='checkbox' checked='checked'> Remember me</label>"+
        // // "</form>"+
        // "</div>"+
        // "<div class='' style=''>"+
        //   "<button class='formBtn' type='button' class='cancelbtn'>Cancel</button>"+
        //   "<span class='psw'>Forgot <a href='#'>password?</a></span>"+
        // "</div>";
        // appendHtml("left",toAppend);
    }
}
// function printLogin(type, username,password) {
//     var toAppend;
//     toAppend="<div class='loginForm'>"+
//         // "<form action="">"+
//         "<label><b>Username</b></label>"+
//         "<input id='uname' type='text' placeholder='Enter Username' name='uname' required>"+
//         "<label><b>Password</b></label>"+
//         "<input type='password' placeholder='Enter Password' name='psw' required>"+
//         "<button class='formBtn' type='submit' onclick=send_login()>Login</button>"+
//         "<label><input type='checkbox' checked='checked'> Remember me</label>"+
//     // "</form>"+
//     "</div>"+
//     "<div class='' style=''>"+
//       "<button class='formBtn' type='button' class='cancelbtn'>Cancel</button>"+
//       "<span class='psw'>Forgot <a href='#'>password?</a></span>"+
//     "</div>";
//     appendHtml("left",toAppend);
// }

function send_login(){
    if(checkCookie("user")){
        uname=$("input[name='uname']").val();
    }else{
        uname=$("input[name='uname']").val();
    }

    psw=$("input[name='psw']").val();
    domain="TADVISOR";
    language= navigator.language || navigator.userLanguage;
    login(uname,psw,domain,language);
}

function disableBubbles(){
    for(i=0;i<chat_bubbleId.length;i++){
        $(chat_bubbleId[i]).css("opacity","0.4");
    }
}

function toggleFullScreen() {
  var doc = window.document;
  var docEl = doc.documentElement; // documentElement= body? -> no, is different
  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
}

function appendHtml(bubbleSide, toAppend){
    datestr=getFormattedDate();
    if(!toAppend){
        chatHistoryDiv.append(
            "<div class='chat-message float-"+bubbleSide+" bubble-"+bubbleSide+" my-1 rounded' id='chatBubble"+bubble_id+"'>"+
                "<div class='media col-12 pr-4'>"+
                    // "<img class='d-flex align-self-center mr-5 rounded-circle' src='/images/avatartadvisor0.png' alt='Generic placeholder image' height='50'>"+
                    "<div class='media-body my-3' id='chatBubbleDiv"+bubble_id+"'>"+
                        "<h6 class='timestamp-right float-right mb-0 d-block'><small>"+datestr+"</small></h6>"+
                    "</div>"+
                "</div>"+
            "</div>"
        );
    }
    else {
        chatHistoryDiv.append(
            "<div class='chat-message float-"+bubbleSide+" bubble-"+bubbleSide+" my-1 rounded' id='chatBubble"+bubble_id+"'>"+
                "<div class='media col-12 pr-4'>"+
                    // "<img class='d-flex align-self-center mr-5 rounded-circle' src='/images/avatartadvisor0.png' alt='Generic placeholder image' height='50'>"+
                    "<div class='media-body my-3' id='chatBubbleDiv"+bubble_id+"'>"+
                        toAppend+
                        "<h6 class='timestamp-right float-right mb-0 d-block'><small>"+datestr+"</small></h6>"+
                    "</div>"+
                "</div>"+
            "</div>"
        );
    }
    bubble_id++;
    printIndex++;
    x.bubble_id++;
    $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 200); //autoscroll to the end of content
    hideUpper();
}

function hideUpper(){
    if (($("#chatHistory").get(0).scrollHeight > $("#chatHistory").height()) && ($("#chatUpper").css("display")!="none")) {
        $("#chatHistory").css("max-height","+=42px");
        $("#chatUpper").css("height","0").css("display","none");
    }
}
function putLinks(arrayLinks, val){
    for (var i in arrayLinks)
        val=val.replace(i,arrayLinks[i])
    return val
}
function send_query(){
    var text = $speechInput.val();
    var toAppend;
    if($speechInput.val() != ''){
        window.speechSynthesis.cancel();

        var s = new XMLHttpRequest();
        s.open("POST", "/api", true);
        s.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        s.onreadystatechange = function () {
          if (s.readyState != 4 || s.status != 200){
            //   respond(messageInternalError,null);
              return;
          }
          var data=JSON.parse(s.responseText);
          console.log(data);
        //   alert("Success: " + temporal);
          datos=data.result.fulfillment.messages;
          prepareResponse(data);
        };
        s.send(JSON.stringify({"val": text}));
        // $.ajax({
        //     type: "POST",
        //     // url: baseUrl + "query?v=20170810",
        //     url: "/api",
        //     contentType: "application/json; charset=utf-8",
        //     dataType: "json",
        //     headers: {
        //     //     "Authorization": "Bearer " + accessToken
        //     },
        //     data: JSON.stringify({"val": text}),
        //     success: function(data) {
        //         datos=data.result.fulfillment.messages;
        //         prepareResponse(data);
        //     },
        //     error: function() {
        //         respond(messageInternalError,null);
        //     }
        // });
        $('#statusMessages').text("Message Send!");
        disableBubbles();
        toAppend= "<h6 class='mb-0 d-block'>"+text+"</h6>";
        appendHtml("right",toAppend);
        $speechInput.val("");
        $speechInput.blur();
    }
}
function display_lists(){

    // var printIndex = bubble_id-1;
    var imgSrc;
    var imgButton_i="";
    var itemName;
    $("<div data-role='tabs' id='tabs'><div data-role='navbar'><ul><li><a href='#one' data-ajax='false'>one</a></li><li><a href='#two' data-ajax='false'>two</a></li><li><a href='ajax-content-ignore.html' data-ajax='false'>three</a></li></ul></div><div id='one' class='ui-body-d ui-content'><h1>First tab contents</h1></div><div id='two'><ul data-role='listview' data-inset='true'><li><a href='#'>Acura</a></li><li><a href='#'>Audi</a></li><li><a href='#'>BMW</a></li><li><a href='#'>Cadillac</a></li><li><a href='#'>Ferrari</a></li></ul></div></div>").appendTo('#chatBubbleDiv'+printIndex);
    if(data["imgsrc"]){
        itemName=createIdFromText(name+data["imgsrc"]);
        imgSrc=getImgSrc(name, data["imgsrc"]);
        $("<div class='imgContainer'><input type='image' src='"+imgSrc+"' class='img mw-50' id='"+itemName+"'></div>").appendTo('#chatBubbleDivDiv'+printIndex);
    }
    if(text){
        itemName=createIdFromText(name+"text");
        $("<div class='textContainer'><h2 class='textPrinted' id='"+itemName+"'>"+text+"</h2></div>").appendTo('#chatBubbleDivDiv'+printIndex);
    }
    if(link){
        itemName="Ver detalle";
        $("<div class='linkContainer'><a href = "+link+" target =\"frame\">"+itemName+"</a></div>").appendTo('#chatBubbleDivDiv'+printIndex);
    }

}
function addMessage(message, bubble){
    if(!bubble){
        $("<div id='bubbleMessage"+printIndex+"'><strong>"+message+"</strong></div>").appendTo('#chatBubbleDiv'+printIndex);
    }
    else {
        $("<div id='bubbleMessage"+bubble+"'><strong>"+message+"</strong></div>").appendTo('#chatBubbleDiv'+bubble);
    }
}
function changeMessage(messageToAdd, messageId){
    if($("#bubbleMessage"+messageId).length){
        $("#bubbleMessage"+messageId).text(messageToAdd).css('font-weight', 'bold').css('font-style', 'italic');
    }
    else{
        addMessage(messageToAdd);
    }
}

// function searchAssets(assetText){
//     assetText="HolaJD";
//     $.ajax({
//         type: "POST",
//         // url: baseUrl + "query?v=20170810",
//         url: "/webhook/searchAssets",
//         contentType: "application/json; charset=utf-8",
//         dataType: "json",
//         headers: {
//         //     "Authorization": "Bearer " + accessToken
//         },
//         data: JSON.stringify({"val": assetText}),
//         success: function(data) {
//             console.log(data);
//             // datos=data.result.fulfillment.messages;
//             prepareResponse(data);
//         },
//         error: function() {
//             respond(messageInternalError,null);
//         }
//     });
// }
// function apiaiResponseFormat(){
//     return{
//         "speech": speech,
//         "display": displayText,
//         "source": "myServer"
//     }
// }
function printAssets(data){

    radiosId=[];
    var radioBtnSendId=""+printIndex+"RadioBtnSendId";
    $("</br><form class='radios"+printIndex+"' id='chatBubbleDivDiv"+printIndex+"'></form>").appendTo('#chatBubbleDiv'+printIndex);
    for(i=0;i<data.length;i++){
        radiosId[i]=('radio'+i+printIndex);
        $("<div id='radio"+i+""+printIndex+"'class='radio'><label><input type='radio' name='optradio' value='"+data[i].Isin+"'><span>&nbsp;&nbsp;&nbsp;<strong>"+data[i].Name+"</strong></span></br><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>Last Price:&nbsp;&nbsp;&nbsp;</i>"+data[i].LastPrice+"</span>&nbsp;&nbsp;<span>"+data[i].Currency+"</span></br><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>ISIN:&nbsp;&nbsp;&nbsp;</i>"+data[i].Isin+"</span></label></div>").appendTo('#chatBubbleDivDiv'+printIndex);
        console.log(radiosId[i]);
    }
    // radiosId=radiosId.split(',');
    console.log("radiosId", radiosId);
    addMessage("If the asset is not listed, please be more specific");

    $("<button class='btn btn-outline-primary btn-sm m-1' id='"+printIndex+"RadioBtnSendId' type=\"button\" style='width:100px' disabled>Send Asset</button>").appendTo('#chatBubbleDivDiv'+printIndex);

    $('#'+printIndex+'RadioBtnSendId').attr("onClick", "sendAsset('"+radioBtnSendId+"',"+'radiosId'+")");

    $("#chatBubbleDivDiv"+printIndex+" input").on('change', function() {
        $speechInput.val($('input[name=optradio]:checked', "#chatBubbleDivDiv"+printIndex).val());
        $('#'+printIndex+'RadioBtnSendId')[0].disabled = false;
    });
    if(radiosId.length==0){
        console.log("send event to search again");
        send_event("searchAgain", null);
        return;
    }
}
function sendAsset(radioId,radiosId){
    console.log("sendAsset Function", radiosId);
    console.log(typeof radiosId);
    disableButtons(radioId,radiosId);
    send_query();
}
