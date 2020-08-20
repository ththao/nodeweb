var express = require('express');
var router = express.Router();
var connection = require('./db');

router.use(function timeLog (req, res, next) {
  next()
});

router.get('/', (req, res) => {
	res.redirect('/user');
});
	
module.exports = router