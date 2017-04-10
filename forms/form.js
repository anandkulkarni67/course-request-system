var dbOperations = require('./dbAccess');

// Fetch information about all courses.
var fetchCourses = function() {
	return new Promise( function(resolve, reject) {
		dbOperations.retrieveCourseDetails()
			.then( function (courses) {
				resolve({
					courses: courses
				}); 				
			}).catch(function (error) {
				reject(error);
			});
	});	
}

// Create a new form entry.
var create = function(request) {
	return new Promise( function(resolve, reject) {
		var courseList = convertToList(request.body.courses);
		var formDetails = {
			title: request.body.title,
			courseList: courseList,
			pref_count: request.body.preferenceCount,
			start_time: new Date(request.body.start_date + ' ' + request.body.start_time),
			end_time: new Date(request.body.end_date + ' ' + request.body.end_time)
		};
		dbOperations.createRequestForm(formDetails)
			.then( function (message) {				
				resolve('success');
			})
			.catch( function (error) {
				reject(error);
			});
	});
}

// Fetch information about all forms.
var fetchAllForms = function() {
	return new Promise(function (resolve, reject) {
		dbOperations.retreiveAllForms()
			.then( function (forms) {
				resolve(forms);
			}).catch( function(error) {				
				reject(error);
			});
	});
}

// Remove a form entry from the databse along with all its dependents.
var remove = function(request) {
	return new Promise(function (resolve, reject) {
		var form_id = request.body.form_id;
		dbOperations.removeForm(form_id)
			.then(function () {
				resolve('success');
			}).catch( function(error) {
				reject (error);
			});
	});
}

// Converts a comma separated list of elemtns into array of elements.
function convertToList(courses) {
	var courseList = [];
	courseList = courses.split(',');
	return courseList;
}

module.exports = {
	fetchCourses : fetchCourses,
	create : create,
	fetchAllForms: fetchAllForms,
	remove : remove
}