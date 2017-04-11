var students = require('../students');

module.exports = function (app) {
	app.get('/students', function(request, response) {
		if(!request.session.user) {
			response.render('error.html');
		} else {
			var userID = request.session.user.USER_ID;
			students.fetchAllForms(userID).then( function (forms) {
				response.render('students.html',{
					forms: forms
				});
			}).catch( function(error) {
				console.log('Error in router: ' + error);
				response.render('error.html');
			});
		}
	});

	app.post('/submitForm', function(request, response) {				
		if(!request.session.user) {
			response.render('error.html');
		} else {			
			var preferenceInfo = {			
				formId: request.body.formId,
				preferences: request.body.preferences
			};			
			students.submitForm(request.session.user.USER_ID, preferenceInfo).then( function (message) {
				response.send('success');
			}).catch( function(error) {
				console.log('Error in router: ' + error);
				response.render('error.html');
			});
		}		
	});	
}