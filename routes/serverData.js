var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req,res){
    console.log("print body from client myServerData on server", req.body);
    
    res.json({'updated': 'yes'});

        
        // var mailOptions = {
            
        //     from: req.body.email,
        //     to: 'jdortiz@techrules.com', // list of receivers
        //     subject: req.body.subject+" User: " +req.body.name+ ". Reference #: "+reference, // Subject line
        //     text: req.body.body //, // plaintext body
            
        // };

});

module.exports = router;