var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req,res){
    console.log("print body", req.body);

    // Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
        }
        console.log('Credentials obtained, sending message...');
        var transporter = nodemailer.createTransport({
            host: account.smtp.host, // hostname
            port: account.smtp.port, // port for secure SMTP
            secure: account.smtp.secure, // TLS requires secureConnection to be false
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
        var reference=generateReference();
        var mailOptions = {
            // from: '"'+req.body.Name+'" <'+req.body.email+'>', // sender address
            from: req.body.email,
            to: 'jdortiz@techrules.com', // list of receivers
            subject: req.body.subject+" User: " +req.body.name+ ". Reference #: "+reference, // Subject line
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
                res.json({"reference": reference});
                console.log('Message sent: ' + info.response);
                // res.json({'yo': info.response});
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            };
        });
    });
    function generateReference(){
        return 123456;

    }
});

module.exports = router;
