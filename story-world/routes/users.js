var express = require('express');
var router = express.Router();

/* GET */
router.get('/', function(req, res) {
	res.render('index');
});

/* GET login */
router.get('/login', function(req, res, next) {
	var message = "";
	res.render('login', {message: message});
});

/* GET register */
router.get('/register', function(req, res, next) {
	res.render('register');
});




module.exports = router;

















