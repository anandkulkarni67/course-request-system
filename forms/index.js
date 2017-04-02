var dbOperations = require('./dbAccess');

module.exports = function(app) {	
	app.get('/manageForms', function (request, response) {
		console.log('Hello, Iamhere.');
		dbOperations.getCourseDetails()
			.then( function (courses) {
				response.render('forms.html', {
					courses: courses
				});
			}).catch( function (error) {	
				console.log(error);						
				response.render('error.html');
			});
	});

	app.post('/createForm', function(request, response) {
		var courseList = convertToList(request.body.courses);		
		dbOperations.createRequestForm({
			title: request.body.title,
			courseList: courseList,
			pref_count: request.body.preferenceCount,
			start_time: new Date(request.body.start_date + ' ' + request.body.start_time),
			end_time: new Date(request.body.end_date + ' ' + request.body.end_time)
		}, function(error) {
			if(error) {
				response.render('error.html');
			}
		});
		response.send(request.body);
	});

	app.get('/getAllForms', function(request, response) {				
		dbOperations.getAllForms().then( function (forms) {
			console.log(forms);
			response.send(forms);
		}).catch( function(error) {
			response.render('error.html');
		});
	});

	app.post('/removeForm', function(request, response) {
		var form_id = request.body.form_id;
		dbOperations.removeForm(form_id).then(function () {			
			response.send('success');
		}).catch( function(error) {
			response.render('error.html');
		});
	});
}

function convertToList(courses) {
	var courseList = [];
	courseList = courses.split(',');
	return courseList;
}