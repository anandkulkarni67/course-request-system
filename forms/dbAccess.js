var db = require('../util/oracleUtil');
var oracledb    = require('oracledb');
var async = require('async');

module.exports.getCourseDetails = function(callback) {
	var query = "SELECT course_id, course_code, title FROM COURSES";
	return new Promise( function (resolve, reject) {
		db.doConnect().then( function (connection) {
			db.doExecute(connection, query, {})
				.then( function (result) {
					db.doRelease(connection)
						.then ( function (op){
							return resolve(result.rows);
						}).catch( function (error) {
							return reject(error);
					});
				});
		}).catch( function (error) {
			reject(error);
		});	
	});	
}

module.exports.createRequestForm = function(callback) {
	var formDetails = arguments[0];
	return new Promise( function (resolve, reject) {
		db.doConnect().then( function (connection) {
			async.waterfall([
				function createFormEntry(callback) {
					var createFormQuery = "BEGIN :form_id := createForm(:title, :pref_count, :start_time, :end_time); END;";
					formDetails.form_id = { 
						dir: oracledb.BIND_OUT, 
						type: oracledb.INTEGER
					};					
					db.doExecute(
						connection, createFormQuery
						, {
							title: formDetails.title, 
							pref_count: formDetails.pref_count,
							form_id: formDetails.form_id,
							start_time: formDetails.start_time,
							end_time: formDetails.end_time
						}).then( function (result) {
							callback(null, result.outBinds.form_id);
						}).catch( function (error) {
							callback(error, null);
						});					
				},
				function createCourseMappings(form_id, callback) {
					var createCourseMappingQuery = "INSERT INTO form_courses VALUES(:fid, :cid)";					
					formDetails.courseList.forEach(function(course_id) {
						db.doExecute(
							connection, createCourseMappingQuery
							, {
								fid: form_id,
								cid: course_id
							}).then(function (result) {
								// logger
								console.log(form_id + '-' + course_id + 'mapping created successfully.');
							}).catch( function (error) {
								callback(error, null);
							});				
					});
					callback(null, 'success');
				}
				], 
				function (error, result) {
					if(error) {
						db.doRollback(connection).then( function (result) {
							db.doRelease(connection);
						}).then (function (result) {
							// logger
							console.log(result);
						}).catch(function(error) {
							console.log(error);
						});
					} else {
						console.log(result);
						db.doCommit(connection).then( function (result) {
							db.doRelease(connection);
						}).then (function (result) {
							// logger
							console.log(result);
						}).catch(function(error) {
							console.log(error);
						});
					}					
				}
			);
		});
	});
}

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

module.exports.removeForm = function (form_id) {
	console.log('Form ID to be removed is : ' + form_id);
	var query = "DELETE FROM FORMS WHERE FORM_ID =: form_id";
	return new Promise( function (resolve, reject) {
		db.doConnect().then( function (connection) {
			db.doExecute(
				connection, query
				, {
					form_id: form_id
				}).then( function (result) {
					db.doCommit(connection).then( function (result) {
						db.doRelease(connection);
					}).then (function (result) {								
						resolve('success');
					});
				}).catch( function (error) {
					db.doRollback(connection).then( function (result) {
						db.doRelease(connection);
					}).then (function (result) {
						reject(error);
					});
				});
		}).catch(function (error) {
			reject(error);
		});
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