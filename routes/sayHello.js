var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req,res){
    console.log("print body", req.body);

    // Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        var transporter = nodemailer.createTransport({
            host: "smtp.ethereal.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
               ciphers:'SSLv3'
            },
            auth: {
                user: 'account.user',
                pass: 'account.pass'
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

        // verify connection configuration
        transporter.verify(function(error, success) {
           if (error) {
                console.log("verify error",error);
           } else {
                console.log('Server is ready to take our messages');
           }
        });

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log("error",error);
                res.json({'yo': 'error'});
            }else{
                console.log('Message sent: ' + info.response);
                res.json({'yo': info.response});
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            };
        });
    });
});

module.exports = router;
