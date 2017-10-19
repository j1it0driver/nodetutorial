module.exports = {

    // setCookie: function (cname, cvalue, exdays) {
    //     var d = new Date();
    //     d.setTime(d.getTime() + (exdays*24*60*60*1000));
    //     var expires = "expires="+ d.toUTCString();
    //     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    // },
    // getCookie: function (cname) {
    //     var name = cname + "=";
    //     var decodedCookie = decodeURIComponent(document.cookie);
    //     var ca = decodedCookie.split(';');
    //     for(var i = 0; i <ca.length; i++) {
    //         var c = ca[i];
    //         while (c.charAt(0) == ' ') {
    //             c = c.substring(1);
    //         }
    //         if (c.indexOf(name) == 0) {
    //             return c.substring(name.length, c.length);
    //         }
    //     }
    //     return "";
    // },
    // checkCookie: function (name) {
    //     var name = getCookie("name");
    //     if (name != "") {
    //         return true;
    //         // alert("Welcome again " + username);
    //     } else {
    //         // username = prompt("Please enter your name:", "");
    //         return false;
    //         // if (username != "" && username != null) {
    //         //     setCookie("username", username, 365);
    //         // }
    //     }
    // },

    guid: function () {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    },

    // createCookie: function (name,value,days) {
    // 	if (days) {
    // 		var date = new Date();
    // 		date.setTime(date.getTime()+(days*24*60*60*1000));
    // 		var expires = "; expires="+date.toGMTString();
    // 	}
    // 	else var expires = "";
    // 	document.cookie = name+"="+value+expires+"; path=/"; //usar escape() para hacer que el texto no contenga caracteres no validos
    // },
    //
    // readCookie: function (name) {
    // 	var nameEQ = name + "=";
    // 	var ca = document.cookie.split(';');
    // 	for(var i=0;i < ca.length;i++) {
    // 		var c = ca[i];
    // 		while (c.charAt(0)==' ') c = c.substring(1,c.length);
    // 		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    // 	}
    // 	return null;
    // },
    //
    // eraseCookie: function (name) {
    // 	createCookie(name,"",-1);
    // }
    readCookieServer: function(name){
        if(cookies_s[name]){
            return cookies_s[name];
        }
        return null;
    },
    checkCookieServer: function(name){
        if (cookies_s[name]){
            return true;
        }
        else{return false;}
    }
}
