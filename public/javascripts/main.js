//version R-Prod from L-Master2
// var clientTOKEN = process.env.API_AI_CIENT_TOKEN_TADV; //revisar el uso de éste acceso a variables env
var tadvisorToken = "aba2ecdbb9e744ba8b37ec6cf6a175d9", originalToken = "dce399808780466db898fad9bfae71fe";
var productionToken="d8263496b81c4d82bc1b557574106e0f", flouristToken="1dfd6eb17bb240db9ec60813c5d0095a", accessToken = tadvisorToken;
var baseUrl = "https://api.api.ai/v1/", version="20170810";
var $speechInput, $recBtn, $recBtn1, $statusMessages, $debugBtn;
var recognition,
messageRecording = "Recording...",
messageCouldntHear = "I couldn't hear you, could you say that again?",
messageInternalError = "Oh no, there has been an internal server error",
messageSorry = "I'm sorry, I don't have the answer to that yet.";
var tiempoSend, timeout = null, timeou2=null, tiempoStop=null, buttonIds=[], sliderId=[], imgBtnIds=[], imgBtnIdsSend=[], imgBtnTemp; //imgBtnList=[];//arrayList=[]
var str="", datos, bubble_id=0;
var datestr;
var srcAddresses=JSON.parse('{"reaction":{"hopeful":{"src":"/images/reaction/hopeful.png"},"worried":{"src":"/images/reaction/worried.png"},"relaxed":{"src":"/images/reaction/relaxed.png"},"terrified":{"src":"/images/reaction/terrified.png"}},"risk_aversion":{"very conservative":{"src":"/images/risk_aversion/veryconservative.png"},"conservative":{"src":"/images/risk_aversion/conservative.png"},"balanced":{"src":"/images/risk_aversion/moderate.png"},"dynamic":{"src":"/images/risk_aversion/dynamic.png"},"aggresive":{"src":"/images/risk_aversion/aggresive.png"}},"risk_profile":{"Gear2":{"src":"/images/risk_profile/Gear2.png"}},"asset_list":{"assetList":{"src":"/images/asset_list/assetList.PNG"}}}');
var uname, psw;
var baseUrl_H="http://towersoa.wmptech.com/SOA/tower4customers/";
var baseUrl_P="https://mytadvisor.com/SOA/tower4customers/";
var domain="TADVISOR";
var language=null, userId=null, userCode=null, userPass=null, tokenString=null, views=null, clientId=null, token=null, email=null;
var chat_bubbleId=[];
var voices=speechSynthesis.getVoices();
var chatHistoryDiv = $("#chatHistory");
var toAppend;
navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;
// window.onload = maxWindow;
$(document).ready(function() {
    $speechInput = $("#speech");
    $recBtn = $("#rec");
    $recBtn1 = $("#rec1");
    $statusMessages = $('#statusMessages');
    $debugBtn = $(".debug_btn");
    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
    });
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
        }
    });
    $speechInput.focus(function(event){
        $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 200);
    });
    $recBtn.on("click", function(event) { // SPEECH
        clearTimeout(tiempoStop);
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
        $(this).next().toggleClass("is-active"); //algo.next() mira a los hermanos de algo. El siguiente tag
        $(this).toggleClass("is-active");
        $(".debug").toggleClass("is-active");
        return false;
    });
    $(document).click(function(event) { //function to manage DEBUG behavior
        if($debugBtn.hasClass("is-active") && !$(".debug_content").is(event.target)){
            $debugBtn.next().toggleClass("is-active"); //algo.next() mira a los hermanos de algo. El siguiente tag
            $debugBtn.toggleClass("is-active");
            $(".debug").toggleClass("is-active");
        }
    });

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

function send() {           //////////////////////////////////// SEND ////////////////////////////////////
    var text = $speechInput.val();
    var toAppend;
    if($speechInput.val() != ''){
        $.ajax({
            type: "POST",
            url: baseUrl + "query?v=20170810",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            data: JSON.stringify({query: text, lang: "en", sessionId: "yaydevdiner2"}),
            success: function(data) {
                console.log(data);
                datos=data.result.fulfillment.messages;
                prepareResponse(data);
            },
            error: function() {
                respond(messageInternalError,null);
            }
        });
        $('#statusMessages').text("Message Send!");
        disableBubbles();
        toAppend= "<h6 class='mb-0 d-block'>"+text+"</h6>";
        appendHtml(toAppend,"right");
        $speechInput.val("");
        $speechInput.blur();
    }
}

function prepareResponse(val) {  //////////////////////////////////// RESPUESTA ////////////////////////////////////
    var location_c, dataObj=null, messagesPrint = "", messagePrint2 = "", dataObjLinks;
    var spokenResponse = val.result.fulfillment.messages;
    var debugJSON = JSON.stringify(val, undefined, 2); //convert JSON to string
    debugRespond(debugJSON); //function to print string in debug window response from API
    for (i=0;i< spokenResponse.length; i++){
        if(spokenResponse[i].type==0){ //type 0 is a SPEECH
            messagePrint2= spokenResponse[i].speech;
            // messagePrint2= spokenResponse[i];
            dataObj = eval('\"'+ jsonEscape(messagePrint2) +'\"');
            // messagesPrint+=  "> "+ dataObj + "<br />";
            for (j=0;j< spokenResponse.length; j++){
                if(spokenResponse[j].type==4 && spokenResponse[j].payload.links){
                    dataObjLinks=putLinks(spokenResponse[j].payload.links,dataObj);
                }
            }
            // respond(messagePrint2);
            respond(dataObj,dataObjLinks);
        }
        if (spokenResponse[i].type==4 && spokenResponse[i].payload.items) { //type 4 is a custompayload
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
            printImgAndText(spokenResponse[i].payload.img.name, spokenResponse[i].payload.img.data, spokenResponse[i].payload.img.data["text"],spokenResponse[i].payload.img.data["link"]); //envio el nombre y los datos del payload
        }
        else if (spokenResponse[i].type==4 && spokenResponse[i].payload.login) { //type 4 is a custompayload
            printLogin(spokenResponse[i].payload.login.username, spokenResponse[i].payload.login.password); //envio el nombre y los datos del payload
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
    appendHtml(toAppend,"left");
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

function send_event(eventName,valor) {                //////////////////////////////////// SEND EVENT////////////////////////////////////
    $.ajax({
        type: "POST",
        url: baseUrl + "query?v=20170810",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({'event': {'name': eventName, data:{'valor': valor}}, lang: "en", sessionId: "yaydevdiner2"}),
        success: function(data) {
            prepareResponse(data);
        },
        error: function() {
            respond(messageInternalError,null);
        }
    });
    $('#statusMessages').text("Type the topic you are interested in");
    $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 1000);
}

function printButton(arrayList){
    var printButton_i="";
    var toAppend;
    buttonIds[i]=null;
    for(var i in arrayList){
    // for(i=0;i<arrayList.length;i++){
        buttonIds[i]=createIdFromText(arrayList[i]);
        printButton_i+=
                "<button class='listButton btn btn-outline-primary btn-sm m-1' id='"+buttonIds[i]+"' name='listButton"+i+"' onclick=\"quickReplyF('"+arrayList[i]+"','"+buttonIds[i]+"',"+'buttonIds'+")\" style='display: inline-block;'>"+
                    arrayList[i]+
                "</button>";
    }
    toAppend="<div class='quick-reply-button d-block text-center'>"+
        printButton_i+
        "</div>";
    appendHtml(toAppend,"left");
}

function quickReplyF(stringItem,buttonId,buttonIds){
    $speechInput.val(stringItem);
    disableButtons(buttonId,buttonIds);
    send_query();
}

function disableButtons(buttonIdSelected,buttonIdsToDisable){
    for(i=0;i<buttonIdsToDisable.length;i++){
        document.getElementById(buttonIdsToDisable[i]).disabled = true;
    }
    $('#'+buttonIdSelected).addClass("responseBtn");
}

function createIdFromText(idText){// idText viene en Formato de texto tal y como se debe imprimir (con espacios y mayusculas)
    return idText.toLowerCase().replace(/_/g,"").replace(/ /g,"");
}

function printSliderSelector(sliderName){
    var toAppend;
    var sliderId=createIdFromText(sliderName);
    var sliderButton ="<div id='slidecontainer px-2'>"+
                "<input type='range' min='0' max='100000' step='5000' value='10000' class='slider w-100' id='"+sliderId+"'>"+
            "</div>";
    toAppend=
            "<div class='d-block text-center'>"+
                sliderButton+
                "<button class='sliderButton btn btn-outline-primary btn-sm m-1' id='"+sliderId+"SliderBtnSend' type=\"button\" onclick=sendSlice('"+sliderId+"') style='width:100px'>"+
                "</button>"+
            "</div>";
    appendHtml(toAppend,"left");
    var slider = document.getElementById(sliderId);
    var output = document.getElementById(sliderId+"SliderBtnSend");
    output.innerHTML = slider.value;
    $speechInput.val(slider.value);
    slider.oninput = function() {
        output.innerHTML = this.value.toLocaleString(undefined, {maximumFractionDigits:2}); //toLocaleString to conver to money format
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
    var toAppend;
    var imgSrc;
    var imgButton_i="";
    datestr=getFormattedDate();
    for(i=0;i<imgBtnList.length;i++){
        imgBtnIds[i]=createIdFromText(imgBtnList[i]);
        imgBtnIdsSend[i]=imgBtnIds[i]+"ImgBtnSend";
        imgSrc=getImgSrc(imgBtnName, imgBtnList[i]);//busco la URL de la imagen de acuerdo al nombre. funcion para obtener los recursos src de la imagen
        imgBtnTemp=imgBtnList[i];
        imgButton_i+="<div class='img-button-container d-inline-block card text-center mw-50'>"+
                        "<img class='rounded-circle card-img-top mw-50' src='"+imgSrc+"' alt='"+imgBtnList[i]+"' id='"+imgBtnIds[i]+"' style='max-width:7.2rem;'>"+
                        "<div class='card-body p-2'>"+
                            // "<input type='image' src='"+imgSrc+"' class='imgBtn' id='"+imgBtnIds[i]+"'>"+

                                "<button class='listButton btn btn-outline-primary btn-sm m-0' id='"+imgBtnIds[i]+"ImgBtnSend' type=\"button\" onclick=\"sendImgBtn(\'"+imgBtnList[i]+"\',\'"+imgBtnIds[i]+"\',"+'imgBtnIds'+","+'imgBtnIdsSend'+")\" style=''>"+
                                    imgBtnList[i]+
                                "</button>"+
                        "</div>"+
                    "</div>";
    }
    toAppend="<div class='d-block text-center'>"+
                imgButton_i+
             "</div>"
    appendHtml(toAppend,"left");
}

function getImgSrc(refName, imgName){
    var srcAddress,ref;
    srcAddress=srcAddresses[refName][imgName].src;
    return srcAddress;
}

function sendImgBtn(imgBtnItem, imgBtnName, imgBtnIds, imgBtnIdsSend){
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
    var toAppend;
    var imgSrc;
    var imgButton_i="";
    var itemName;
    if(data["imgsrc"]){
        itemName=createIdFromText(name+data["imgsrc"]);
        imgSrc=getImgSrc(name, data["imgsrc"]);
        imgButton_i+="<div class='imgContainer'>"+
                        "<input type='image' src='"+imgSrc+"' class='img' width='95%' id='"+itemName+"'>"+
                    "</div>";
    }
    if(text){
        itemName=createIdFromText(name+"text");
        imgButton_i+="<div class='textContainer'>"+
                        "<h2 class='textPrinted' id='"+itemName+"'>"+
                        text+
                        "</h2>"+
                    "</div>";
    }
    if(link){
        itemName="Ver detalle";
        imgButton_i+="<div class='linkContainer'>"+
                        "<a href = "+link+" target =\"frame\">"+itemName+"</a>"
                        text+
                        "</h1>"+
                    "</div>";
    }
    toAppend="<div class='img-text-link'style= 'clear: right; text-align:center;width: 90%;'>"+
        imgButton_i+
        "</div>";
    appendHtml(toAppend,"left");
}

function printLogin(username,password) {
    var toAppend;
    toAppend="<div class='loginForm'>"+
        // "<form action="">"+
        "<label><b>Username</b></label>"+
        "<input id='uname' type='text' placeholder='Enter Username' name='uname' required>"+
        "<label><b>Password</b></label>"+
        "<input type='password' placeholder='Enter Password' name='psw' required>"+
        "<button class='formBtn' type='submit' onclick=send_login()>Login</button>"+
        "<label><input type='checkbox' checked='checked'> Remember me</label>"+
    // "</form>"+
    "</div>"+
    "<div class='' style=''>"+
      "<button class='formBtn' type='button' class='cancelbtn'>Cancel</button>"+
      "<span class='psw'>Forgot <a href='#'>password?</a></span>"+
    "</div>";
    appendHtml(toAppend,"left");
}

function send_login(){
    uname=$("input[name='uname']").val();
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

function appendHtml(toAppend, bubbleSide){
    datestr=getFormattedDate();
    chatHistoryDiv.append(
        "<div class='chat-message float-"+bubbleSide+" bubble-"+bubbleSide+" my-1 rounded' id='chatBubble"+bubble_id+"'>"+
            "<div class='media col-12 pr-4'>"+
                // "<img class='d-flex align-self-center mr-5 rounded-circle' src='/images/avatartadvisor0.png' alt='Generic placeholder image' height='50'>"+
                "<div class='media-body my-3'>"+
                    toAppend+
                    "<h6 class='timestamp-right float-right mb-0 d-block'><small>"+datestr+"</small></h6>"+
                "</div>"+
            "</div>"+
        "</div>"
    );
    bubble_id++;
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
        $.ajax({
            type: "POST",
            // url: baseUrl + "query?v=20170810",
            url: "/api",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
            //     "Authorization": "Bearer " + accessToken
            },
            data: JSON.stringify({"val": text}),
            success: function(data) {
                datos=data.result.fulfillment.messages;
                prepareResponse(data);
            },
            error: function() {
                respond(messageInternalError,null);
            }
        });
        $('#statusMessages').text("Message Send!");
        disableBubbles();
        toAppend= "<h6 class='mb-0 d-block'>"+text+"</h6>";
        appendHtml(toAppend,"right");
        $speechInput.val("");
        $speechInput.blur();
    }
}
