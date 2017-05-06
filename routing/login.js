var login = require('../login');
var crypto = require('crypto');

module.exports = function (app) {
	app.get('/index', function(request, response) {		
		response.render('login.html', {
			username: '',
			password: '',
			error: null
		});
	});

	app.post('/login', function(request, response) {
		var passwordHash = crypto.createHash('md5').update(request.body.password).digest("hex");
		login.login(request)
			.then(function (user) {
				if(user === null) {
					return response.render('login.html', {
						username: '',
						password: '',
						error: 'Username does not exist.'
					});

				}
				if(user.PASSWORD === passwordHash) {
					request.session.user = user;
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
			}).catch( function(error) {
				console.log('Error in router: ' + error);
				response.render('error.html');
			});
	});	

	app.get('/logout', function(request, response) {
		request.session.destroy();
		response.redirect('/index');
	});

	app.get('/home', function(request, response) {
		var user = request.session.user;		
		if(user.ROLE === 'coordinator') {												
			response.redirect('/manageForms');
		} else {
			response.redirect('/students');
		}		
	});
}