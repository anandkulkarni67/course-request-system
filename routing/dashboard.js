var dashboard = require('../dashboard');
var async = require('async');

module.exports = function(app, socket) {
	app.get('/studentPreferenceData', function (request, response) {
		var formId = request.query.formId;		
		dashboard.fetchStudentPreferenceData(formId).then(function (jsonResponse) {			
			response.send(jsonResponse);
		}).catch( function (error) {
			console.log(error);
		});
	});

	app.get('/seatAvailabilityData', function (request, response) {
		var formId = request.query.formId;
		dashboard.fetchSeatAvailabilityeData(formId).then(function (jsonResponse) {
			// console.log(jsonResponse);
			response.send(jsonResponse);
		}).catch( function (error) {
			console.log(error);
		});
	});

	app.get('/requestsDistributionData', function (request, response) {
		var formId = request.query.formId;
		dashboard.fetchRequestsDistributionData(formId).then(function (jsonResponse) {
			// console.log(jsonResponse);
			response.send(jsonResponse);
		}).catch( function (error) {
			console.log(error);
		});
	});
	
	app.get('/dashboard', function (request, response) {
		dashboard.fetchFormDetails(request.query.formId).then (function (details) {
			response.render('dashboard.html', {
				formDetails : details
			});
		}).catch( function (error) {
			console.log(error);
		});
	});

	app.get('/changeNotification', function (request, response) {
		var formId = request.query.formId;
		async.parallel({
				studentPreferenceData : function (callback) {
					dashboard.fetchStudentPreferenceData(formId).then(function (jsonResponse) {
						callback(null, jsonResponse);
					}).catch( function (error) {
						callback(error, null);
					});
				},
				seatAvailabilityData : function (callback) {
					dashboard.fetchSeatAvailabilityeData(formId).then(function (jsonResponse) {						
						callback(null, jsonResponse);
					}).catch( function (error) {
						callback(error, null);
					});
				},
				requestsDistributionData : function (callback) {
					dashboard.fetchRequestsDistributionData(formId).then(function (jsonResponse) {
						callback(null, jsonResponse);
					}).catch( function (error) {
						callback(error, null);
					});				
				}
			}, function (error, data) {
				if(error) {
					console.log('Error in /changeNotificatio service.');
					console.log(error);
				} else {					
					socket.emit('changeNotification', data);
					response.send();
				}
			});
	});
}