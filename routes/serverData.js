var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req,res){
    console.log("print body from client myServerData on server", req.body);

    res.json({'updated': 'yes'});

});

module.exports = router;