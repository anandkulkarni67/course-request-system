var dbOperations = require('./dbAccess');

module.exports = function(app) {
	app.get('/students', function(request, response) {
		if(!request.session.user) {
			response.render('error.html');
		} else {
			var userID = request.session.user.USER_ID;
			dbOperations.getAllForms(userID).then( function (forms) {
				response.render('students.html',{
					forms: forms
				});
			}).catch( function(error) {
				response.render('error.html');
			});
		}
	});

	app.post('/submitForm', function(request, response) {				
		if(!request.session.user) {
			response.render('error.html');
		} else {
			var userPreferences = {
				userId: request.session.user.USER_ID,
				formId: request.body.formId,
				preferences: request.body.preferences
			};
			console.log(userPreferences);
			dbOperations.submitForm(userPreferences).then( function () {
			console.log('Form submission SUCCESSFUL !!');			
				// response.render('students.html',{
				// 	forms: forms
				// });
			}).catch( function(error) {
				response.render('error.html');
			});
		}		
	});
}