var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req,res){
    console.log("print body", req.body);
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
            user: 'j1it0driver@gmail.com', // Your email id
            pass: 'Judaor82$go' // Your password
        }
    });
    var mailOptions = {
        from: '"'+req.body.Name+'" <'+req.body.email+'>', // sender address
        to: 'jdortiz@techrules.com', // list of receivers
        subject: req.body.subject+" from user: " +req.body.Name, // Subject line
        text: req.body.body //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };
    console.log("mailOptions", mailOptions);
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log("error",error);
            res.json({'yo': 'error'});
        }else{
            console.log('Message sent: ' + info.response);
            res.json({'yo': info.response});
        };
    });
});

module.exports = router;
