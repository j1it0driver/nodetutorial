
  'use strict';

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
var domain="TADVISOR";
var language=null, userId=null, userCode=null, userPass=null, tokenString=null, views=null, clientId=null, token=null, email=null;
var chat_bubbleId=[];
var voices=speechSynthesis.getVoices();
var chatHistoryDiv = $("#chatHistory");
var toAppend;
var x, i, j, k;
var visits;
var sessionID=null;
// INTRO option: responses from user
var username="New User", investedBefore, saveTopic, goal, profileQuestions={}, createPortfolio={};
var sonido= false;
var iOS=iOS();
var _iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/);
var toDisable=[];
sendGetData(serverEvent);// to get user data from iframe host.
navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

$(document).ready(function() {
    window.speechSynthesis.cancel();
    console.log("Browser/OS:", bowser.name, bowser.osname);
    console.log("iOS", iOS);
    console.log("iOS device", _iOSDevice);

    //visits();
    //username();
    send_event('custom_event', username); // evento que acciona el primer intent de intro
    sessionID=readCookie("sessionID");

    $('[data-toggle="tooltip"]').tooltip();

    x = {
      bubble_idInternal: bubble_id,
      bubble_idListener: function(val) {},

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

    $("#sound").change(function ()
      {

       sonido=!sonido;
       console.log("Sonido: ",sonido);
       if(!sonido)
       window.speechSynthesis.cancel();
    });

    $("#"+printIndex+"InputAmountId").click(function(event) {
      if (event.keyCode == 13) {
            event.preventDefault();
        }
    });

    $("#"+printIndex+"InputAmountId").keyup(function(){
        var n = parseInt(this.val().replace(/\D/g,''),10);
        $(this).val(n.toLocaleString());
    });


});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////// SPEECH RECOGNITION ////////////////////////////////////
function startRecognition() {
    var final_transcript;
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;  
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
            console.log("error of recognition"+ event.error);
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
function updateRec() {
    $recBtn1.text(recognition ? "Listening" : "Rec");
    tiempoStop = setTimeout(function () {if($recBtn1.text() == "Rec"){$recBtn1.text("Speak");}}, 4000);
}
function setInput(text) {// for Speech Recognition: startRecgnition Function
    $speechInput.val(text);
    send_query();
}
function prepareResponse(val) {  //////////////////////////////////// RESPUESTA ////////////////////////////////////
    // Esta función toma la respuesta de DialogFlow y la prepara para mostrarla en pantalla al usuario.
    /*{
        "id": "3622be70-cb49-4796-a4fa-71f16f7b5600",
        "lang": "en",
        "result": {
            "action": "pickFruit",
            "actionIncomplete": false,
            "contexts": [
            "shop"
            ],
            "fulfillment": {
            "messages": [
                {
                "platform": "google",
                "textToSpeech": "Okay how many apples?",
                "type": "simple_response"
                },
                {
                "platform": "google",
                "textToSpeech": "Okay. How many apples?",
                "type": "simple_response"
                },
                {
                "speech": "Okay how many apples?",
                "type": 0
                }
            ],
            "speech": "Okay how many apples?"
            },
            "metadata": {
            "intentId": "21478be9-bea6-449b-bcca-c5f009c0a5a1",
            "intentName": "add-to-list",
            "webhookForSlotFillingUsed": "false",
            "webhookUsed": "false"
            },
            "parameters": {
            "fruit": [
                "apples"
            ]
            },
            "resolvedQuery": "I need apples",
            "score": 1,
            "source": "agent"
        },
        "sessionId": "12345",
        "status": {
            "code": 200,
            "errorType": "success"
        },
        "timestamp": "2017-09-19T21:16:44.832Z"
    }*/ 
    console.log("prepare response",val);
    updateUserData(myServerDataJS);
    var location_c, dataObj=null, messagesPrint = "", messagePrint2 = "", dataObjLinks;
    var spokenResponse = val.result.fulfillment.messages;
    /*"messages": [
        {
          "speech": "Text response",
          "type": 0
        }
    ] */
    var webhookData = val.result.fulfillment.data;//?????? viene de la respuesta del webhook wk.js cuando se usa apiaiResponseFormat para que pueda cumplir con el formato que recibe DialogFlow
    var webhookAction = val.result.action;
    var webhookParameters = val.result.parameters;
    var debugJSON = JSON.stringify(val, undefined, 2); //convert JSON to string
    /*debugRespond(debugJSON); //function to print string in debug window response from API */
    for (i=0;i< spokenResponse.length; i++){ //por cada uno de los mensajes: es decir cada uno de los Text Response (no los textos alternativos) de los intent en la consola DF
        var payload=spokenResponse[i].payload; //se carga el json que trae el intent de DialogFlow y se busca el payload.
        /*"messages": [
            {
                "payload": custom JSON,
                "type": 4
            }
        ]*/
        if(spokenResponse[i].type==0){ //type 0 is a SPEECH type 4 is a CUSTOM PAYLOAD (types for web platform, for others platforms integrations there are more types.)
            messagePrint2= spokenResponse[i].speech;
            dataObj = eval('\"'+ jsonEscape(messagePrint2) +'\"');
            for (j=0;j< spokenResponse.length; j++){ //add links on displayed text
                if(spokenResponse[j].type==4 && spokenResponse[j].payload.links){
                    dataObjLinks=putLinks(spokenResponse[j].payload.links,dataObj);
                }
            }
            respond(dataObj,dataObjLinks);
        }
        if(webhookData){ // do something with data returned by webhook  , but action are called directly from DialogFlow with webhook referenced to /webhook/action
            console.log("webhook data",webhookData);
            if(webhookAction=="search_Asset"){
                printAssets(webhookData,webhookParameters);
            }
            else if(webhookAction=="add_Asset"){
                printButton(webhookData.items);
            }
            else if(webhookAction=="send_Email"){
                printSendEmail();
            }
            else if(webhookAction=="show_portfolio"){
                console.log("print show portfolio", webhookData);
                printPortfolio(webhookData);
            }
            else if(webhookAction=="user_Evaluation"){
                console.log('userEvaluation fuction',webhookParameters);
                evaluateUser(webhookParameters);
            }
        }
        else if (spokenResponse[i].type==4) { //type 4 is a custompayload
            if(payload.items){
                printButton(payload.items);
            }
            if (payload.slide) { //type 4 is a custompayload
                printSliderSelector(payload.slide.name);
            }
            if (payload.imgButton) { //type 4 is a custompayload
                printImgButton(payload.imgButton.name,payload.imgButton.data); //envio el nombre y los datos del payload
            }
            if (payload.sendEvent) { //type 4 is a custompayload
                prepare_event(payload.sendEvent.name, payload.sendEvent.data); //evento enviado hacia el cliente (ej:un timer), envio el nombre y los datos del payload
                /* {
                    "sendEvent": {
                        "name": "just_wait",
                        "data": {
                            "timer": 1000
                        }
                    }
                } */
            }
            if (payload.img) { //type 4 is a custompayload
                printImgAndText(payload.img.name, payload.img.data, payload.img.data["text"],payload.img.data["link"]); //envio el nombre y los datos del payload
            }
            if (payload.login) { //type 4 is a custompayload
                appendHtml("left");
                printLogin('login', payload.login.username, payload.login.password); //envio el nombre y los datos del payload
            }
            /* if (payload.lists) { //type 4 is a custompayload    ej: assets??? en existing_portfolio_intention3
                display_lists(); //envio el nombre y los datos del payload
            } */
            if(payload.dataVar){
                if (payload.dataVar.username){
                    username=payload.dataVar.username;
                    createCookie("username",username,365);
                }
                if (payload.dataVar.investedBefore){
                    investedBefore=payload.dataVar.investedBefore;
                    createCookie("investedBefore",investedBefore,365);
                }
                if (payload.dataVar.saveTopic){
                    saveTopic=payload.dataVar.saveTopic;
                    createCookie("saveTopic",saveTopic,365);
                }
                if (payload.dataVar.goal){
                    goal=payload.dataVar.goal;
                    createCookie("goal",goal,365);
                }
                if (payload.dataVar.profileQuestions){
                    profileQuestions=Object.assign(profileQuestions,payload.dataVar.profileQuestions);
                    console.log('profileQuestions',profileQuestions);
                }
                if (payload.dataVar.createPortfolio){

                    createPortfolio=Object.assign(createPortfolio,payload.dataVar.createPortfolio);
                    console.log('Create Portfolio vars',createPortfolio);
                }
            }
        }
        $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 400); //[0].scrollHeight ==== .scrollTop
    }
    //spokenRespond(messagesPrint);


    /* if(val.result.metadata.intentName == "location"){
        location_c = val.result.parameters["geo-country"]; //por el dash "-" no se usa . punto
        news_country="https://news.google.com/news/search/section/q/"+location_c+"/"+location_c+"?hl=es-419&ned=es_co";
        link_country="<a href = "+news_country+" target =\"right_side\">News from "+location_c+"</a>";
        prueba="https://www.w3schools.com";
        frame_country="<iframe name=\"right_side\" src =\"\" width=\"300\" height=\"100\">mmmhhh</iframe>";
        printLink(link_country,frame_country);
    } */
}

/* function printLink(dato, dato2) { //for print link of location: prepareResponse
    $('#testing').text('');
    $('#testing').append(dato);
} */

function respond(val, valLinks) { // function to print text into chat message and to speech the text outloud
    var toAppend, sentences=null, sentence=null, sentencesArray;
    if (valLinks==null){
        valLinks=val;
    }
    if (valLinks == "") {
        valLinks = messageSorry;
    }
    sentences=val;
    sentences=sentences.replace(/&nbsp/g,"").replace(/<br \/>/g,"").replace(/<br>/g,"").replace(/<i>/g,"").replace(/<\/i>/g,"").replace(/\n/g,"").replace(/<b>/g,"").replace(/<\/b>/g,"").replace(/<p>/g,"").replace(/<\/p>/g,""); //quitar el espacio en blanco del speech .replace(/H.*S/, 'HS');
    sentencesArray=sentences.split(".");
    var synth= window.speechSynthesis;
    for (var k in sentencesArray){
         sentence=sentencesArray[k];
        if (sonido && val !== messageRecording) {
            var msg = new SpeechSynthesisUtterance(sentence);
            console.log("Speech Synth Msg", msg);
            var voices = synth.getVoices();
            console.log("voices", voices);
            msg.voice = voices[0];
            msg.voiceURI = "native";
            msg.volume = 0.2;
            msg.pitch = 1.1;
            msg.rate = 1.15;
            msg.text = sentence;
            msg.lang = "en-GB";
            synth.speak(msg);
            msg.onerror = function(event) {
                console.log(event);
                console.log('An error has occurred with the speech synthesis: ' + event.error);
            }
            if(iOS){
                console.log("I'm iOS");

            }
        }
    }
    if ('speechSynthesis' in window) {
    }
    if ('SpeechRecognition' in window) {
      // Speech recognition support. Talk to your apps!
    }
    toAppend="<h6 class='mb-0 d-block'>"+valLinks+"</h6>";
    appendHtml("left",toAppend);
    $speechInput.blur();
}

function send_event(eventName,valor){
    var r = new XMLHttpRequest();
    
    r.open("POST", "/api/event", true);
    r.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    r.onreadystatechange = function () {
      if (r.readyState != 4 || r.status != 200) return;
      var temporal=JSON.parse(r.responseText);
      datos=temporal.result.fulfillment.messages;
      prepareResponse(temporal);
    };
    r.send(JSON.stringify({event: {name: eventName, data:{valor: valor}}}));
    $('#statusMessages').text("Choose a topic...");
    $speechInput.val("");
    $speechInput.blur();
}

function send_query(other){
    var text = $speechInput.val();
    var otherData=null;
    if(other){
        otherData=other;
    }
    var toAppend;
    if($speechInput.val() != ''){
        window.speechSynthesis.cancel();

        var s = new XMLHttpRequest();
        s.open("POST", "/api", true);
        console.log("send_query 1", typeof(JSON.stringify(text)));
        s.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        s.onreadystatechange = function () {
            console.log("send_query 2",s.readyState,s.status, s.statusText, s.responseText);
            if (s.readyState != 4 || s.status != 200){
            //   respond(messageInternalError,null);
              return;
            }
            var temporal=JSON.parse(s.responseText);
            console.log("CCmain temporal",temporal);

            prepareResponse(temporal);
        };
        s.send(JSON.stringify({text}));
        $('#statusMessages').text("Message Send!");
        disableBubbles();
        toAppend= "<h6 class='mb-0 d-block'>"+text+"</h6>";
        appendHtml("right",toAppend);
        $speechInput.val("");
        $speechInput.blur();
    }
}

function sendEmail(formNameId, formEmailId, formSubjectId, formBodyId, formSendButtonId){
    toDisable=[formNameId, formEmailId, formSubjectId, formBodyId, formSendButtonId]
    console.log("sendEmail function client");
    var r = new XMLHttpRequest();
    r.open("POST", "/sayHello", true);
    r.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    r.onreadystatechange = function () {
      if (r.readyState != 4 || r.status != 200) return;
        var temporal=JSON.parse(r.responseText);
        console.log("response SendEmail ACtion",temporal);
        alert("Reference Number: " + temporal.reference);

        $("</br><h6 class='mb-0 d-block'>Reference Number: "+temporal.reference+"</h6></br>").appendTo('#chatBubbleDiv'+printIndex);
        disableButtons(formSendButtonId, toDisable);
        send_event('custom_event', username);
    };
    var mailOptions = {
        'name': document.getElementById(formNameId).value, // sender address
        'email': document.getElementById(formEmailId).value, // list of receivers
        'subject': document.getElementById(formSubjectId).value, // Subject line
        'body': document.getElementById(formBodyId).value //, // plaintext body
    };
    console.log("mailOptions",mailOptions);
    r.send(JSON.stringify(mailOptions));
    $('#statusMessages').text("Sending message");
    $speechInput.val("");
    $speechInput.blur();
}

function send_login(){

    if(checkCookie("user")){
        uname=$("input[name='uname']").val();
    }else{
        uname=$("input[name='uname']").val();
    }

    psw=$("input[name='psw']").val();
    domain="TADVISOR";
    language= navigator.language || navigator.userLanguage;
    login(uname,psw,domain,language,function(){
        reload_menu();
    }); //handlers.js
}

function updateUserData(myServerData){ // send info from tadvisor-server to NodeJS Server
    var r = new XMLHttpRequest();
    r.open("POST", "/serverData", true);
    r.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;
        var temporal=JSON.parse(r.responseText);
        console.log("CCmain response updateUserData",temporal);
    };
    console.log("CCmain ServerData",myServerData);
    r.send(JSON.stringify(myServerData));
}

function evaluateUser(questionsResponses){
    // var r = new XMLHttpRequest();
    // r.open("POST", "/sayHello", true);
    // r.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // r.onreadystatechange = function () {
    //   if (r.readyState != 4 || r.status != 200) return;
    //     var temporal=JSON.parse(r.responseText);
    //     console.log("response SendEmail ACtion",temporal);
    //     alert("Reference Number: " + temporal.reference);

    //     $("</br><h6 class='mb-0 d-block'>Reference Number: "+temporal.reference+"</h6></br>").appendTo('#chatBubbleDiv'+printIndex);
    //     // toAppend= "<h6 class='mb-0 d-block'>Reference Number: "+temporal.reference+"</h6>";
    //     // printIndex++;
    //     // appendHtml("Left",toAppend);
    //     disableButtons(formSendButtonId, toDisable);
    //     send_event('custom_event', username);

    //     //   datos=temporal.result.fulfillment.messages;
    //     //   prepareResponse(temporal);
    // };
    // var mailOptions = {
    //     'name': document.getElementById(formNameId).value, // sender address
    //     'email': document.getElementById(formEmailId).value, // list of receivers
    //     'subject': document.getElementById(formSubjectId).value, // Subject line
    //     'body': document.getElementById(formBodyId).value //, // plaintext body
    //     // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    // };
    // console.log("mailOptions",mailOptions);
    // r.send(JSON.stringify(mailOptions));
}



//////////////////////////////////////////////////
//////////////////////////////////////////////////


/* function debugRespond(val) {
    $("#response").text(val);
} */

/* function spokenRespond (val){
    if (val == "") {
        val = messageSorry;
    }
    $("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(val);
    $("#spokenResponseTitle").addClass("is-actived").find(".responseLabel").html("API Response");
} */

///////// quickReply //////////

function printButton(arrayList){ //Imprime los botones de quickReply, con sus funciones y crea sus Ids
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

function quickReplyF(stringItem,buttonId,buttonIds){ // funciones de los quickReply buttons
    $speechInput.val(stringItem);
    disableButtons(buttonId,buttonIds);
    send_query();
}

/////// slideSelector ////////

function printSliderSelector(sliderName){ // Imprimir el slider
    var sliderId = printIndex+createIdFromText(sliderName);
    $("<div class='d-block text-center' id='chatBubbleDivDiv"+printIndex+"'></div>").appendTo('#chatBubbleDiv'+printIndex);
    $("<div class='slidecontainer px-2'><input type='range' min='0' max='100000' step='5000' value='30000' class='slider w-100' id='"+sliderId+"'></div>").appendTo('#chatBubbleDivDiv'+printIndex);
    $("<button class='sliderButton btn btn-outline-primary btn-sm m-1' id='"+sliderId+"SliderBtnSend' type=\"button\" style='width:100px'></button>").appendTo('#chatBubbleDivDiv'+printIndex);
    $('#'+sliderId+'SliderBtnSend').attr('onClick', "sendSlice('"+sliderId+"')");
    var slider = $("#"+sliderId)[0];// DOM obj
    var output = $("#"+sliderId+"SliderBtnSend");//jQuery obj
    output.html(addCommas(slider.value));
    $speechInput.val(slider.value);
    slider.oninput = function() {
        output.html(addCommas(this.value));
        $speechInput.val(this.value);
    }
}

function sendSlice(sliderId){  // funcion para el slider
    var sliderIdbtnSend=sliderId+"SliderBtnSend";
    disableButtons([sliderIdbtnSend],[sliderIdbtnSend]);
    disableButtons([sliderId],[sliderId]);
    send_query();
 }

 /////////// Images /////////////

function printImgButton(imgBtnName, imgBtnList){ // Imprimir imagen + boton 
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

function getImgSrc(refName, imgName){ // busca en un archivo de rutas srcAddresses la ruta de una imagen {key: img name, value: source address}
    var srcAddress,ref;
    srcAddress=srcAddresses[refName][imgName].src;
    return srcAddress;
}

function sendImgBtn(imgBtnItem, imgBtnName, imgBtnIds, imgBtnIdsSend){ //funciones de los botones + imagen
    $speechInput.val(imgBtnItem);
    disableButtons(imgBtnName+"ImgBtnSend", imgBtnIdsSend);
    disableButtons(imgBtnName, imgBtnIds);
    send_query();
}


function printImgAndText(name, data, text, link){ //Imprimir imagen + texto + link
    var imgSrc;
    var imgButton_i="";
    var itemName;
    $("<div class='img-text-l' &ui-state='dialogink'style= 'clear: right; text-align:center;width: 90%;' id='chatBubbleDivDiv"+printIndex+"'></div>").appendTo('#chatBubbleDiv'+printIndex);
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

function printLogin(type, username,password) { // Imprimir formulario para login
    if(type=='login'){
        $("<div class='loginForm'><label><b>Username</b></label><input id='uname"+printIndex+"' type='text' placeholder='Enter Username' name='uname' required><label><b>Password</b></label><input type='password' id='password"+printIndex+"' placeholder='Enter Password' name='psw' required><label><input id='checkbox"+printIndex+"' type='checkbox' checked='checked'> Remember me</label></div>").appendTo('#chatBubbleDiv'+printIndex);
        $("<div class='' style=''><button id='loginBtn"+printIndex+"' class='formBtn' type='submit' onclick=send_login() >Login</button>&nbsp;&nbsp;<button id='cancelLoginBtn"+printIndex+"' onclick=reload_menu() class='formBtn' type='button' class='cancelbtn'>Cancel</button></br><span class='psw'>Forgot <a  href='https://www.mytadvisor.com/password-recovery/' target='_blank' >password?</a></span></div></br>").appendTo('#chatBubbleDiv'+printIndex);
        if(checkCookie("user")){
            $("input[name='uname']").val(readCookie("user"));
        }

        toDisable=["uname"+printIndex ,"password"+printIndex,"loginBtn"+printIndex,"cancelLoginBtn"+printIndex];
    }
}

function disableBubbles(){ /// desactiva las nubes de los mensajes del chat
    for(i=0;i<chat_bubbleId.length;i++){
        $(chat_bubbleId[i]).css("opacity","0.4");
    }
}

function disableButtons(buttonIdSelected,buttonIdsToDisable, callback){ // desactiva lo botones de las bubes del chat
    for(var i in buttonIdsToDisable){
        document.getElementById(buttonIdsToDisable[i]).disabled = true;
    }
    document.getElementById(buttonIdSelected).classList.add("responseBtn");
    document.getElementById(buttonIdSelected).disabled = true;
    if(callback) {
        callback();
    }
}

function createIdFromText(idText){// idText viene en Formato de texto tal y como se debe imprimir (con espacios y mayusculas): "But_ton, to print" -> "buttontoprint"
    return idText.toLowerCase().replace(/_/g,"").replace(/ /g,"").replace(/,/g,"");
}
function appendHtml(bubbleSide, toAppend){//append bubble con contenido o sin contenido
    datestr=getFormattedDate();
    if(!toAppend){
        chatHistoryDiv.append(
            "<div class='chat-message-"+bubbleSide+" float-"+bubbleSide+" bubble-"+bubbleSide+" my-1' id='chatBubble"+bubble_id+"'>"+
                "<div class='media col-12 pr-4'>"+
                    "<div class='media-body my-3' id='chatBubbleDiv"+bubble_id+"'>"+
                        "<h6 class='timestamp-right float-right mb-0 d-block'><small>"+datestr+"</small></h6>"+
                    "</div>"+
                "</div>"+
            "</div>"
        );
    }
    else {
        chatHistoryDiv.append(
            "<div class='chat-message-"+bubbleSide+" float-"+bubbleSide+" bubble-"+bubbleSide+" my-1' id='chatBubble"+bubble_id+"'>"+
                "<div class='media col-12 pr-4'>"+
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
function putLinks(arrayLinks, val){ //para convertir en links ciertas palabras dentro del texto que se muestra en el chat
    for (var i in arrayLinks)
        val=val.replace(i,arrayLinks[i])
    return val
}
function display_lists(){ // Imprimir listas?????? puede ser para imprimir por ejemplo los assets
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

function addMessage(message, bubble){ //adiciona un mensaje (bubbleMessage) a un bubble especifico o al último
    if(!bubble){
        $("<div id='bubbleMessage"+printIndex+"'><strong>"+message+"</strong></div>").appendTo('#chatBubbleDiv'+printIndex);
    }
    else {
        $("<div id='bubbleMessage"+bubble+"'><strong>"+message+"</strong></div>").appendTo('#chatBubbleDiv'+bubble);
    }
}

function changeMessage(messageToAdd, messageId){ // cambia un mensaje especifico (bubbleMessage) creado con addMessage
    if($("#bubbleMessage"+messageId).length){
        $("#bubbleMessage"+messageId).text(messageToAdd).css('font-weight', 'bold').css('font-style', 'italic');
    }
    else{
        addMessage(messageToAdd);
    }
}
function printAssets(data,parameters){ //data: es una lista de activos y su info, y parameters son el nombre y la moneda del portafolio
    radiosId=[];
    var radioBtnSendId=""+printIndex+"RadioBtnSendId";
    $("</br><form class='radios"+printIndex+"' id='chatBubbleDivDiv"+printIndex+"'></form>").appendTo('#chatBubbleDiv'+printIndex);
    for(i=0;i<data.length;i++){
        radiosId[i]=('radio'+i+printIndex);
        $("<div id='radio"+i+printIndex+"'class='radio'><label><input type='radio' name='optradio' value='"+data[i].Name+"'><span>&nbsp;&nbsp;&nbsp;<strong>"+data[i].Name+"</strong></span></br><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>Last Price:&nbsp;&nbsp;&nbsp;</i>"+data[i].LastPrice+"</span>&nbsp;&nbsp;<span>"+data[i].Currency+"</span></br><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>ISIN:&nbsp;&nbsp;&nbsp;</i>"+data[i].Isin+"</span></br><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>Market:&nbsp;&nbsp;&nbsp;</i>"+data[i].MarketName+"</span></br><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>Date:&nbsp;&nbsp;&nbsp;</i>"+data[i].LastPriceDate+"</span></label></div>").appendTo('#chatBubbleDivDiv'+printIndex);
    }
    $("</br><label for='"+printIndex+"InputAmountId'>Amount to invest: (in "+parameters.portfolio_currency+")</label><div class='hide-inputbtns p-2 row'><div class='col-8 input-group input-group-sm'><span class='input-group-addon' id='sizing-addon2'>"+parameters.portfolio_currency+"</span><input class='form-control' number-to-fixed='2' id='"+printIndex+"InputAmountId' name='"+printIndex+"InputAmountId' type='number' min='0.00' max='1000000.00' placeholder='Enter amount'></div></div></br>").appendTo('#chatBubbleDivDiv'+printIndex);
    $("</br><button class='btn btn-outline-primary btn-sm m-1' id='"+printIndex+"RadioBtnSendId' type=\"submit\" style='width:100px' disabled>Add Asset</button>").appendTo('#chatBubbleDivDiv'+printIndex);
    $("<button class='btn btn-outline-primary btn-sm m-1' id='"+printIndex+"RadioBtnRepeatId' type=\"button\" style='width:100px'>Try again</button></br>").appendTo('#chatBubbleDivDiv'+printIndex);
    addMessage("If the asset is not listed, please be more specific");
    $('#'+printIndex+'RadioBtnSendId').attr("onClick", "sendAsset('"+radioBtnSendId+"',"+'radiosId'+")");
    $('#'+printIndex+'RadioBtnRepeatId').on("click", function(){
        if(radiosId.length>0){
            $speechInput.val("");
            disableButtons(radioBtnSendId,radiosId);
            send_event("searchAgain",null);
        }
        $('#'+printIndex+'RadioBtnRepeatId')[0].disabled=true;
    });
    $("#chatBubbleDivDiv"+printIndex+" input").on('change', function() {
        $speechInput.val($('input[name=optradio]:checked', "#chatBubbleDivDiv"+printIndex).val());
    });
    $("#"+printIndex+"InputAmountId").keyup(function(){
         if($speechInput.val()!=""){
             $('#'+printIndex+'RadioBtnSendId')[0].disabled = false;
         }
    });
    if(radiosId.length==0){
        send_event("searchAgain", null);
        return;
    }
}

function sendAsset(radioId,radiosId){ //funcion de los botones de enviar asset con monto.
    var amount = document.getElementById(""+printIndex+"InputAmountId").value;
    if($speechInput.val() != ''){
        $speechInput.val($speechInput.val()+" - "+$("#"+printIndex+"InputAmountId").val());
    }
    console.log("amount from input",amount);
    disableButtons(radioId,radiosId);
    send_query();
}

function printPortfolio(data){ //Imprime los assets del portafolio PENDIENTE
    var key;
    $("</br><span>You have created a new portfolio: <b>"+data.portfolioName+"</b></span><br><span>You added "+data.addedAssets.length+" assets</span><br>").appendTo('#chatBubbleDiv'+printIndex);
    for(key in data.addedAssets){
        $("</br><span>Asset: <b>"+data.addedAssets[key].asset+" -> </b></span><span><i>"+data.portfolioCurrency+" "+data.addedAssets[key].amount+"</i></span><br>").appendTo('#chatBubbleDiv'+printIndex);
    }
    $("</br><a  href='https://www.mytadvisor.com/' target='_blank' >Link to portfolio</a>").appendTo('#chatBubbleDiv'+printIndex);
    reload_menu();
    myClientDataJS.push({
                        show_portfolio:{
                            rslt:{
                                AssetCodes: Object.values(data.addedAssets), 
                                PortfolioName: data.portfolioName,
                                Currency: data.portfolioCurrency
                            },
                            function: "actToPortolioNew"
                        }
                    });
    console.log("main.js myClientData en show_portfolio", myClientDataJS);
}

function printSendEmail (){ //imprime formulario para enviar correo
    $("</br><form method='POST' onsubmit=sendEmail('sendemailname"+printIndex+"','sendemailemail"+printIndex+"','sendemailsubject"+printIndex+"','sendemailbody"+printIndex+"','sendemailbutton"+printIndex+"') enctype='text/plain' class='email' id='form"+printIndex+"' target='hiddenFrame'><label for='name'>Name:</label><input type='text' name='Name' id='sendemailname"+printIndex+"' placeholder='Enter name' required><br><label for='email'>Email:</label><input type='email' name='email' id='sendemailemail"+printIndex+"' placeholder='Enter Email' required><br><label for='subject'>Subject:</label><input type='text' name='subject' id='sendemailsubject"+printIndex+"' placeholder='Subject' ><br><label for='text'>Message:</label><textarea name='body' id='sendemailbody"+printIndex+"' placeholder='Write your message... ex: Add ISIN xxxxxxxxxxxxx to catalog' rows='5' cols='30' required></textarea><br><input type='submit' id='sendemailbutton"+printIndex+"' value='Send Email'></form>").appendTo('#chatBubbleDiv'+printIndex);
}

function hideUpper(){
    if (($("#chatHistory").get(0).scrollHeight > $("#chatHistory").height()) && ($("#chatUpper").css("display")!="none")) {
        $("#chatHistory").css("max-height","+=42px");
        $("#chatUpper").css("height","0").css("display","none");
    }
}
function jsonEscape(stringJSON)  { // convierte los saltos de linea \n a saltos en HTML <br />
    return stringJSON.replace(/\n/g,'<br />');//.replace(/\r/g, "\\r").replace(/\t/g, "\\t");
}
function reloadChat(){ //recarga el chat enviando custom_event a la api, la cual llama al primer INTENT.
    document.getElementById("chatHistory").innerHTML="";
    send_event('custom_event', username);
}
function reload_menu(){ // revisar si se usa PENDIENTE
    var le=toDisable.length;
    if(le!=0){disableButtons(toDisable[le-1], toDisable);}
    //prepare_event('custom_event2', username));
    send_event('custom_event2', username);
    toDisable=[];
}

/* OTRAS FUNCIONES */

function addCommas(nStr){ //adicionar comas de miles a un numero.
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
/* function calcVH() { // calcula las unidades VH
    $('body').innerHeight( $(this).innerHeight() );
} */
function getFormattedDate() { // le da formato a la fecha y la retorna
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
function hasGetUserMedia() { //comprueba si se pueden usar los medios camara y microfono
    return !!(navigator.getUserMedia|| navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
function iOS() { // funcion para determinar si esta usando un device con iOS
    var iDevices = [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ];
    if (!!navigator.platform) {
      while (iDevices.length) {
        if (navigator.platform === iDevices.pop()){ return true; }
      }
    }
    return false;
}
/* function toggleFullScreen() { //Función de test para pasar a FullScreen
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
  } */

function username(){ //Actualiza la variable username con el valor en la info que viene de postMessage (cross-paltform iframe) o el valor de la cookie
    if(!checkCookie("username")){
        username=myServerDataJS.Name;
    }else{
        username=readCookie("username");
        //return;
    }
    createCookie("username", username, 1);
}
/* function visits(){ //Cuantifica el numero de visitas PENDIENTE: resetear el contador con cambio de usuario
    if(!checkCookie("visits")){
        console.log("primera visita");
        visits=0;
        createCookie("visits", 1, 1);
        console.log(readCookie("visits"));
    }else{
        visits=Number(readCookie("visits"));
        visits += 1;
        console.log("Visits var: ",visits);
        createCookie("visits", visits, 1);
        console.log("Visits cookie: ", readCookie("visits"));
    }
} */
function wait_time(timer){ //Contador de tiempo que envia evento para activar un INTENT.
    timeout2 = setTimeout(function () {if($speechInput.val() == ''){send_event("wait_time","GEAR Hill:Balanced");}}, timer);
}
function just_wait(timer, callback){ // solo espera un tiempo para continuar
    timeout2 = setTimeout(function () {
}, timer);
    if(callback) {
        callback();
    }
}
function prepare_event(eventName,data){// solo para timers. De acuerdo a lo que se solicite desde la API.
            /* {   //enviado desde la API, quiere esperar 1000ms  ej: risk_profile_intention6
                    "sendEvent": {
                        "name": "just_wait",
                        "data": {
                            "timer": 1000
                        }
                    }
                } 
                    "sendEvent": { //ej: risk_profile_intention5
                        "name": "wait_time",
                        "data": {
                             "timer": 100
                        }
                    } 
                */
    switch(eventName){
        case "wait_time":
            wait_time(data.timer);// sens event to call intent. data.timer captura el tiempo que se trae de la API en el payload
            break;
        case "just_wait":
            just_wait(data.timer);
            break;
        case "custom_event2":
            just_wait(data.timer,reload_menu);
            break;
    }
}

