// Este JS esta recortado del archivo index.hjs original del 24/08/2017
// var clientTOKEN = process.env.API_AI_CIENT_TOKEN_TADV; //revisar el uso de éste acceso a variables env

var tadvisorToken = "aba2ecdbb9e744ba8b37ec6cf6a175d9", originalToken = "dce399808780466db898fad9bfae71fe";
var productionToken="d8263496b81c4d82bc1b557574106e0f", floruristToken="1dfd6eb17bb240db9ec60813c5d0095a";
var accessToken = tadvisorToken,
baseUrl = "https://api.api.ai/v1/",
version="20170810",
$speechInput,
$recBtn,
recognition,
messageRecording = "Recording...",
messageCouldntHear = "I couldn't hear you, could you say that again?",
messageInternalError = "Oh no, there has been an internal server error",
messageSorry = "I'm sorry, I don't have the answer to that yet.";
var tiempoSend, timeout = null, tiempoStop=null, buttonIds=[], sliderId=[], imgBtnIds=[], imgBtnIdsSend=[], imgBtnTemp; //imgBtnList=[];//arrayList=[]
var str="", datos, bubble_id=0;
var srcAddresses=JSON.parse('{"reaction":{"hopeful":{"src":"/images/reaction/hopeful.png"},"worried":{"src":"/images/reaction/worried.png"},"relaxed":{"src":"/images/reaction/relaxed.png"},"terrified":{"src":"/images/reaction/terrified.png"}},"risk_aversion":{"very conservative":{"src":"/images/risk_aversion/veryconservative.png"},"conservative":{"src":"/images/risk_aversion/conservative.png"},"balanced":{"src":"/images/risk_aversion/moderate.png"},"dynamic":{"src":"/images/risk_aversion/dynamic.png"},"aggresive":{"src":"/images/risk_aversion/aggresive.png"}},"risk_profile":{"Gear2":{"src":"/images/risk_profile/Gear2.png"}},"asset_list":{"assetList":{"src":"/images/asset_list/assetList.PNG"}}}');
// var firstTypedLetter = 'Y';
var uname, psw;
var baseUrl_H="http://towersoa.wmptech.com/SOA/tower4customers/";
var baseUrl_P="https://mytadvisor.com/SOA/tower4customers/";
var domain="TADVISOR";
var language=null;
var userId=null; //
var userCode=null;
var userPass=null;
var tokenString=null;
var views=null;
var clientId=null;
var token=null;
var email=null;
navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;
$(document).ready(function() {   //////////////////////////////////// JS PRINCIPAL ////////////////////////////////////
    $speechInput = $("#speech");
    $recBtn = $("#rec");
    $recBtn1 = $("#rec1");
        //////////////////////// START CustomEvent JAVASCRIPT /////////////////////////////////
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
    //   alert("Someone changed the value of x.a to " + val);
      $("#bubbleId").text(x.bubble_id);
    });
    //////////////////////// END CustomEvent JAVASCRIPT /////////////////////////////////

    $speechInput.keyup(function(event) { //I change keyup for keypress//
        if (tiempoSend !== null) {
            clearTimeout(tiempoSend);
        }
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        if ($speechInput.val()==''){
        }
        else{
            $('#statusMessages').text("Typing...");
            timeout = setTimeout(function () {if($speechInput.val() != ''){$('#statusMessages').text("Waiting input or Enter...");}}, 3000);
        }
        if (event.which == 13) {
            event.preventDefault();
            if($speechInput.val() != ''){
                send();
                // login(userCode,userPass,domain,language);
                // clientHandler(userCode,domain,language,token,views,clientId);
                tiempoSend=setTimeout(function(){$('#statusMessages').text("Next input...");},2000);
            }
        }
    });
    $recBtn.on("click", function(event) { // SPEECH
        clearTimeout(tiempoStop);
        if (hasGetUserMedia()) { // revisar si existe hasGetUserMEdia
            // console.log("getusermedia ok");
            navigator.mediaDevices.getUserMedia({ audio: true }).then(function() {
                switchRecognition();
                // console.log("mic ok");
            }).catch(function(err) { console.log(err.name + ": " + err.message);
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
        if($(".debug_btn").hasClass("is-active") && !$(".debug_content").is(event.target)){
            $(".debug_btn").next().toggleClass("is-active"); //algo.next() mira a los hermanos de algo. El siguiente tag
            $(".debug_btn").toggleClass("is-active");
            $(".debug").toggleClass("is-active");
        }
    });
    window.onresize=function(){
        $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 1000);
    };
    // $(".debug_btn").click(function(event){
    //     event.stopPropagation();
    // });
    // $("#bubbleId").text(bubble_id);
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// function printInput() {          //////////////////////////////////// PRINT FUNCTIONS ////////////////////////////////////
/////////////////////////
//     if($speechInput.val() != ''){
//         $('#testing').text($speechInput.val());
//     }
//     else{
//         if($speechInput.val() == ''){$('#testing').text("Estoy vacio");}
//         else{$('#testing').text("Aqui otra vez");}
//     }
// }
function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}


function printLink(dato, dato2) {
        $('#testing').text('');
        $('#testing').append(dato);
        // $('#frame').append(dato2);
}

function startRecognition() {    //////////////////////////////////// SPEECH RECOGNITION ////////////////////////////////////
    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
        // console.log("no voice recognition");
    } else {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onstart = function(event) {
            // console.log("rec on");
            respond(messageRecording);
            $recBtn.addClass("is-actived");
            // $recBtn1.text("recording");
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
        recognition.lang = "en-GB";
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
        // console.log("existing recognition");
        stopRecognition();

    } else {
        // console.log("new-start recognition");
        startRecognition();

    }
}

function setInput(text) {
    $speechInput.val(text);
    send();
}

function updateRec() {
    $recBtn1.text(recognition ? "Listening" : "Rec");
    tiempoStop = setTimeout(function () {if($recBtn1.text() == "Rec"){$recBtn1.text("Speak");}}, 4000);
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
            datos=data.result.fulfillment.messages;
            prepareResponse(data);
        },
        error: function() {
            respond(messageInternalError);
        }
    });
    $('#statusMessages').text("Message Send!");
    datestr=getFormattedDate();
    chatHistoryDiv.append(
        "<div class='chat-message bubble-right'>"+
            "<div class='fila'>"+
                "<div class=''>"+
                    "<img class='avatar' src='https://www.mytadvisor.com/SOA20/Profiles/defaultuser_SMALL.png' alt=''>"+
                "</div>"+
                "<div class='chat-message-content'>" +
                    "<h4>"+text+"</h4>"+
                "</div>"+
                "<div class='col' height='32px' width='32px'>"+

                    "<div class='fila'>"+
                      "<h5 class='timestamp_right'>"+datestr+"</h5>"+
                    "</div>"+
                "</div>"+
            "</div>"+
        "</div>"
    );
    bubble_id++;
    x.bubble_id++;
    $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 1000); //autoscroll to the end of content
    $speechInput.val("");
}

function prepareResponse(val) {  //////////////////////////////////// RESPUESTA ////////////////////////////////////
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
            // console.log(spokenResponse[i].payload.img.data);
            // console.log(spokenResponse[i].payload.img.data["imgsrc"]);
            printImgAndText(spokenResponse[i].payload.img.name, spokenResponse[i].payload.img.data, spokenResponse[i].payload.img.data["text"],spokenResponse[i].payload.img.data["link"]); //envio el nombre y los datos del payload

        }
        else if (spokenResponse[i].type==4 && spokenResponse[i].payload.login) { //type 4 is a custompayload
            // console.log(spokenResponse[i].payload.img.data);
            // console.log(spokenResponse[i].payload.img.data["imgsrc"]);
            printLogin(spokenResponse[i].payload.login.username, spokenResponse[i].payload.login.password); //envio el nombre y los datos del payload

        }
        $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 400); //[0].scrollHeight ==== .scrollTop
    }
    spokenRespond(messagesPrint);
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

function respond(val) { // function to print a text into chat message and to speech the text outloud
    var chatHistoryDiv = $("#chatHistory");
    if (val == "") {
        val = messageSorry;
    }
    datestr=getFormattedDate(); //respond's time
    chatHistoryDiv.append( // add bubble to bot side
        "<div class='chat-message bubble-left'>"+
            "<div class='fila'>"+
                "<div class='chat-message-content'>" +
                    "<h4>"+val+"</h4>"+
                "</div>"+
                "<div class='col' height='32px' width='32px'>"+
                    "<div class=''>"+
                        "<img class='avatar' src='/images/avatartadvisor0.png' alt=''>"+
                    "</div>"+
                    "<div class='fila'>"+
                      "<h5 class='timestamp_right'>"+datestr+"</h5>"+
                    "</div>"+
                "</div>"+
            "</div>"+
        "</div>"
    );
    bubble_id++;
    x.bubble_id++;
    if (val !== messageRecording) {
        var msg = new SpeechSynthesisUtterance();
        msg.voiceURI = "native";
        msg.pitch = 1.1;
        msg.rate = 1.1;
        msg.text = val.replace(/&nbsp/g,"").replace(/<br \/>/g,"").replace(/<br>/g,"").replace(/<i>/g,"").replace(/<\/i>/g,"").replace(/\n/g,""); //quitar el espacio en blanco del speech
        // msg.text = val.replace(/<br \/>/g,"").replace(/<br>/g,""); //quitar el salto de linea del speech
        // msg.text = val.replace(/<i>/g,"").replace(/<\/i>/g,""); //quitar el italic del speech
        // msg.text = val.replace(/\n/g,"");
        msg.lang = "en-GB";
        // console.log(msg.text);
        window.speechSynthesis.speak(msg);
    }
    $speechInput.focus();
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
    /*alert(str);*/
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
        data: JSON.stringify({'event': {'name': eventName, data:{'valor': valor}}, lang: "en", sessionId: "yaydevdiner"}),
        success: function(data) {
            prepareResponse(data);
            // console.log(eventName);
            // console.log(valor);
        },
        error: function() {
            respond(messageInternalError);
        }
    });
    $('#statusMessages').text("Type the topic you are interested in");
    $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 1000);
}

function printButton(arrayList){
    var printButton_i="";
    var chatHistoryDiv = $("#chatHistory");
    buttonIds[i]=[];
    for(i=0;i<arrayList.length;i++){
        buttonIds[i]=createIdFromText(arrayList[i]);
        printButton_i+=
            "<div class='quickReplyButton'style='display:inline-table;'>"+
                "<button id='"+buttonIds[i]+"' name='listButton"+i+"' onclick=\"quickReplyF('"+arrayList[i]+"',"+'buttonIds'+")\" style='display: inline-block;'>"+
                arrayList[i]+
                "</button>"+
            "</div>";
    }
    // console.log(printButton_i);
    datestr=getFormattedDate();
    chatHistoryDiv.append(
            "<div class='chat-message bubble-left'>"+
                "<div class='fila'>"+
                    "<div class='chat-message-content'style='text-align:center;'>" +
                    printButton_i+
                    "</div>"+
                "</div>"+
                "<div class='fila'>"+
                    "<h5 class='timestamp_right'>"+datestr+"</h5>"+
                "</div>"+
            "</div>");
    bubble_id++;
    x.bubble_id++;
    $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 1000);
}


function quickReplyF(stringItem,buttonIds){
    $speechInput.val(stringItem);
    disableButtons(buttonIds);
    send();
}

function disableButtons(buttonIdsToDisable){
    for(i=0;i<buttonIdsToDisable.length;i++){
        // console.log(buttonIdsToDisable[i]);
        document.getElementById(buttonIdsToDisable[i]).disabled = true;
    }
}

function createIdFromText(idText){
    return idText.toLowerCase().replace(/ /g,"");
}

function printSliderSelector(sliderName){
    var chatHistoryDiv = $("#chatHistory");
    var sliderId=createIdFromText(sliderName);
    datestr=getFormattedDate();
    var sliderButton ="<div id='slidecontainer'>"+
            "<input type='range' min='0' max='100000' step='5000' value='10000' class='slider' id='"+sliderId+"'>"+
        "</div>";

    // var sendSlice;

    chatHistoryDiv.append(
            "<div class='chat-message bubble-left'>"+
                "<div class='fila'>"+
                    "<div class='chat-message-content''>" +
                        sliderButton+
                        "<div class='' id='' style='text-align: center;'>"+
                            "<button id='"+sliderId+"SliderBtnSend' type=\"button\" onclick=sendSlice('"+sliderId+"') style='width:100px'>"+
                            "</button>"+
                        "</div>"+
                    "</div>"+
                    "<div class='fila'>"+
                        "<h5 class='timestamp_right'>"+datestr+"</h5>"+
                    "</div>"+
                "</div>"+
            "</div>");
    bubble_id++;
    x.bubble_id++;
    var slider = document.getElementById(sliderId);
    // var output = document.getElementById("testing");
    var output = document.getElementById(sliderId+"SliderBtnSend");
    // var output = $("#"+sliderId+"btnSend");
    // slider.defaultValue;
    output.innerHTML = slider.value;
    $speechInput.val(slider.value);
    // output.value = slider.value;
    // sendSlice="<div><button type='button'>Send "+output.innerHTML+"</button></div>";
    slider.oninput = function() {
        output.innerHTML = this.value.toLocaleString(undefined, {maximumFractionDigits:2}); //toLocaleString to conver to money format
        $speechInput.val(this.value.toLocaleString(undefined, {maximumFractionDigits:2}));
    }
    $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 1000);
    // return sliderId+"btnSend";
}
function sendSlice(sliderId){
    var sliderIdbtnSend=sliderId+"SliderBtnSend";
    disableButtons([sliderIdbtnSend]);
    disableButtons([sliderId]);
    send();
 }

function printImgButton(imgBtnName, imgBtnList){
    var chatHistoryDiv = $("#chatHistory");
    // var imgButtonsName=createIdFromText(imgBtnName); //formateo el nombre: sin espacios, sin mayusculas
    var imgSrc;
    var imgButton_i="";
    datestr=getFormattedDate();
    for(i=0;i<imgBtnList.length;i++){
        imgBtnIds[i]=createIdFromText(imgBtnList[i]);
        imgBtnIdsSend[i]=imgBtnIds[i]+"ImgBtnSend";
        imgSrc=getImgSrc(imgBtnName, imgBtnList[i]);//busco la URL de la imagen de acuerdo al nombre. funcion para obtener los recursos src de la imagen
        imgBtnTemp=imgBtnList[i];
        imgButton_i+="<div class='imgButtonContainer'>"+
            "<input type='image' src='"+imgSrc+"' class='imgBtn' id='"+imgBtnIds[i]+"'>"+
            "<div class='' id='' style='display:inline-table; padding-left:10px; vertical-align:middle;'>"+
                "<button id='"+imgBtnIds[i]+"ImgBtnSend' type=\"button\" onclick=sendImgBtn("+i+",'"+imgBtnName+"',"+'imgBtnIds'+","+'imgBtnIdsSend'+") style='width:100px'>"+
                imgBtnList[i]+
                "</button>"+
            "</div>"+
        "</div>";
    }
    chatHistoryDiv.append(
            "<div class='chat-message bubble-left'>"+
                "<div class='fila'>"+
                    "<div class='chat-message-content''>" +
                        imgButton_i+
                    "</div>"+
                    "<div class='fila'>"+
                        "<h5 class='timestamp_right'>"+datestr+"</h5>"+
                    "</div>"+
                "</div>"+
            "</div>"
    );
    bubble_id++;
    x.bubble_id++;
    $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 1000);
}

function getImgSrc(refName, imgName){
    // var srcAddresses={"'"+imgName+"'":"'/images/"+refName+"/"+imgName+".png'"};
    var srcAddress,ref;
    // var srcAddresses={"reaction":{"hopeful":"/images/reaction/hopeful.png","worried":"/images/reaction/worried.png","relaxed":"/images/reaction/relaxed.png","terrified":"/images/reaction/terrified.png"}};
    srcAddress=srcAddresses[refName][imgName].src;
    return srcAddress;
}

function sendImgBtn(imgBtnIndex, imgBtnName, imgBtnIds, imgBtnIdsSend){
    for(i=0;i<datos.length;i++)
        if(datos[i].type==4 && datos[i].payload.imgButton){
                $speechInput.val(datos[i].payload.imgButton.data[imgBtnIndex]);
        }
    disableButtons(imgBtnIdsSend);
    disableButtons(imgBtnIds);
    send();
}

function prepare_event(eventName,data){
    switch(eventName){
        case "wait_time":
            wait_time(data.timer);
            break;
    }
}

function wait_time(timer){
    timeout = setTimeout(function () {if($speechInput.val() == ''){send_event("wait_time","GEAR Hill:Balanced");}}, timer);
    // $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, timer);
    // send_event("wait_time");
    // console.log(timer);
}

function printImgAndText(name, data, text, link){
    var chatHistoryDiv = $("#chatHistory");
    var imgSrc;
    var imgButton_i="";
    var itemName;
    // console.log(data["imgsrc"]);
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
        // itemName=createIdFromText(name+"link");
        itemName="Ver detalle";
        imgButton_i+="<div class='linkContainer'>"+
                        "<a href = "+link+" target =\"frame\">"+itemName+"</a>"
                        text+
                        "</h1>"+
                    "</div>";
    }
    datestr=getFormattedDate();
    chatHistoryDiv.append(
            "<div class='chat-message bubble-left' style='width: 90%; text-align:center'>"+
                "<div class='chat-message-content' style= 'clear: right;'>" +
                    imgButton_i+
                    "<h5 class='timestamp_right'>"+datestr+"</h5>"+
                    "</div>"+
            "</div>");
    bubble_id++;
    x.bubble_id++;
    $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 1000);
}
function printLogin(username,password) {
    var chatHistoryDiv = $("#chatHistory");
    datestr=getFormattedDate();
    chatHistoryDiv.append(
    "<div class='chat-message bubble-left' style='width: 90%; text-align:center'>"+
        "<div class='chat-message-content' style= 'clear: right;'>" +
            "<div class='loginForm'>"+
                // "<form action="">"+
                "<label><b>Username</b></label>"+
                "<input id='uname' type='text' placeholder='Enter Username' name='uname' required>"+
                "<label><b>Password</b></label>"+
                "<input type='password' placeholder='Enter Password' name='psw' required>"+
                "<button type='submit' onclick=send_login()>Login</button>"+
                "<label><input type='checkbox' checked='checked'> Remember me</label>"+
            // "</form>"+
            "</div>"+
            "<div class='' style=''>"+
              "<button type='button' class='cancelbtn'>Cancel</button>"+
              "<span class='psw'>Forgot <a href='#'>password?</a></span>"+
            "</div>"+
            "<h5 class='timestamp_right'>"+datestr+"</h5>"+
        "</div>"+
    "</div>");
            console.log(uname);
    $("#chatHistory").animate({ scrollTop: $("#chatHistory")[0].scrollHeight}, 1000);

}
function send_login(){
    uname=$("input[name='uname']").val();
    psw=$("input[name='psw']").val();
    domain="TADVISOR";
    language= navigator.language || navigator.userLanguage;
    login(uname,psw,domain,language);
}
