var express = require('express');
var router = express.Router();
var connection = require('./db');

router.use(function timeLog (req, res, next) {
	console.log(Date.now());
	next();
});

router.get('/', (req, res) => {
	connection.query('SELECT * FROM users', function(err, rows, fields) {
	  	if (err) {
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
	  	} else {
	  		var users = [];
	  		// Loop check on each row
	  		for (var i = 0; i < rows.length; i++) {
	  			// Create an object to save current row's data
		  		var person = {'name': rows[i].first_name + ' ' + rows[i].last_name, 'address': rows[i].address, 'phone': rows[i].phone, 'id': rows[i].id};
		  		users.push(person);
			}
			res.render('user/index', {"users": users, title: 'User List'});
	  	}
	});
});

router.get('/profile/:id', (req, res) => {
	connection.query('SELECT * FROM users WHERE id = ' + req.params.id, function(err, rows, fields) {
	  	if (err) {
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
	  	} else {
	  		// Check if the result is found or not
	  		if (rows.length==1) {
	  			// Create the object to save the data.
	  			var user = {'name': rows[0].first_name + ' ' + rows[0].last_name, 'address': rows[0].address, 'phone': rows[0].phone, 'id': rows[0].id};
		  		res.render('user/profile', {"user": user, title: 'User Profile'});
	  		} else {
	  			// render not found page
	  			res.status(404).json({"status_code":404, "status_message": "Not found"});
	  		}
	  	}
	});
});

router.route('/create')
	.get(function (req, res) {
		res.render('user/create', {title: 'Create New User', 'first_name': '', 'last_name': ''});
	})
	.post(function (req, res) {
		response = {
			first_name:req.body.first_name,
			last_name:req.body.last_name
		};

		if (response.first_name && response.last_name) {
			res.end(JSON.stringify(response));
		} else {
			res.render('user/create', {title: 'Create New User', 'first_name': response.first_name, 'last_name': response.last_name});
		}
	});
	
module.exports = router