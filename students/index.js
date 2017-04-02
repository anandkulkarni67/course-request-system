var dbOperations = require('./dbAccess');

module.exports = function(app) {
	app.get('/students', function(request, response) {				
		dbOperations.getAllForms().then( function (forms) {	
			console.log(forms);
			console.log('sending forms');		
			response.render('students.html',{
				forms: forms
			});
		}).catch( function(error) {
			response.render('error.html');
		});
	});
}