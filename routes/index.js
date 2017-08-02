var express = require('express');
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/', function(req,res){
  res.render('index');
});


module.exports = router;  //JDO este archivo retorna el archivo router creado arr
