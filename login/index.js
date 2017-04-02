var dbOperations = require('./dbAccess');
var crypto = require('crypto');

module.exports = function(app) {
	app.get('/login', function(request, response) {		
		response.render('login.html', {
			username: '',
			password: '',
			error: null
		});
	});

	app.post('/login', function(request, response) {
		var passwordHash = crypto.createHash('md5').update(request.body.password).digest("hex");
		dbOperations.getUserDetails(request.body.username, passwordHash)
			.then( function (user) {				
				if(user === null) {
					return response.render('login.html', {
						username: '',
						password: '',
						error: 'Username does not exist.'
					});

				}
				if(user.PASSWORD === passwordHash) {
					console.log(user);
					if(user.ROLE === 'coordinator') {						
						response.redirect('/manageForms');
					} else {
						response.redirect('/students');
					}
				} else {
					response.render('login.html', {
						username: request.body.username,
						password: '',
						error: 'Username and Password do not match. Please try again.'
					});
				}
			}).catch(function (error) {
				console.log(error);
			});
	});	
}