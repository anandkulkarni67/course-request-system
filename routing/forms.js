var form = require('../forms');

module.exports = function (app) {

	app.get('/manageForms', function (request, response) {
		form.fetchCourses().then( function(courseInformation) {
			response.render('forms.html', courseInformation);
		}).catch( function (error) {
			console.log('Error in router: ' + error);
			response.render('error.html');
		}); 
	});

	app.post('/createForm', function(request, response) {		
		form.create(request)
			.then(function () {				
				response.send('success');
			})
			.catch( function (error) {
				console.log('Error in router: ' + error);
				response.render('error.html');
			});
	});

	app.get('/getAllForms', function(request, response) {
		form.fetchAllForms()
			.then( function(forms) {			
				response.send(forms);
			}).catch( function(error) {
				console.log('Error in router: ' + error);
				response.render('error.html');
			});		
	});

	app.post('/removeForm', function(request, response) {		
		form.remove(request).then(function (message) {
			response.send('success');
			}).catch( function(error) {
				console.log('Error in router: ' + error);
				response.render('error.html');
			});
	});

}