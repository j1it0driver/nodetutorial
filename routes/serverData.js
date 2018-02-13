var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req,res){
    //console.log("ServerData.js print body from client myServerData on server", req.body,typeof(req.body));
global.serverData=req.body;

// var uSession = {
//     Name: uName,
//     Surname: uSurname,
//     ClientCode: uClientCode,
//     Code: uCode,
//     Language: uLanguage,
//     Country: uCountry,
//     Id: uId,
//     Type: uType,
//     Email: uEmail,
//     LoginName: uLoginName,
//     Password: uPassword,
//     BirthDate: uBirthDate,
//     LastLoginDate: uLastLoginDate
// };
    res.json({'updated': 'yes'});

});

module.exports = router;