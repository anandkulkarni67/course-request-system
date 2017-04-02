var db = require('../util/oracleUtil');
var oracledb    = require('oracledb');
var async = require('async');

module.exports.getAllForms = function() {	
	return new Promise( function (resolve, reject) {		
		async.waterfall([
			function fetchForms(callback) {
				var query = "SELECT form_id, title, no_preferences, creation_date, start_time, end_time FROM FORMS";	
				db.doConnect().then( function (connection) {
					db.doExecute(connection, query, {})
						.then( function (result) {
							db.doRelease(connection)
								.then ( function (op){								
									callback(null, result.rows);
								}).catch( function (error) {
									callback(error, null);
							});
						});
				}).catch( function (error) {
					reject(error);
				});
			},
			function fetchCourses(forms, callback) {
				// check if entries is empty array/object.				
				consolidateInformation(forms).then( function (result) {
					callback(null, result);
				}).catch(function (error) {
					callback(error, null);
				});
			}
			], 
			function (error, result) {
				if(error) {
					console.log('error');
					reject(error);
				} else {

					resolve(result);
				}					
			}
		);		
	});	
}

function consolidateInformation(forms) {			
	return new Promise( function(resolve, reject) {
		async.forEach(forms ,
		function (form, callback) {					
				var query = "SELECT c.course_id, c.course_code, c.title FROM FORM_COURSES fc, COURSES c WHERE fc.form_id = :form_id AND fc.course_id = c.course_id";	
				db.doConnect().then( function (connection) {
					db.doExecute(connection, query, 
						{
							form_id: form.FORM_ID
						})
						.then( function (result) {
							db.doRelease(connection)
								.then ( function (op){									
									form.courses = result.rows;
									callback();
								}).catch( function (error) {
									callback(error);
							});
						});
				}).catch( function (error) {
					reject(error);
				});					
			}, 
			function(error) {
				if(error) {
					reject(error);
				} else {					
					resolve(forms);
				}
		});
	});
}