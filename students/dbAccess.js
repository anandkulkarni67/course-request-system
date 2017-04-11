var db = require('../util/oracleUtil');
var oracledb    = require('oracledb');
var async = require('async');

module.exports.getAllForms = function(userId) {	
	return new Promise( function (resolve, reject) {		
		async.waterfall([
			function fetchForms(callback) {
				var query = "SELECT form_id, title, no_preferences, creation_date, start_time, end_time FROM FORMS";	
				db.doConnect().then( function (connection) {
					db.doExecute(connection, query, {})
						.then( function (result) {
							db.doRelease(connection)
								.then ( function (op){								
									callback(null, {
										forms: result.rows,
										userId: userId
									});
								}).catch( function (error) {
									callback(error, null);
							});
						});
				}).catch( function (error) {
					reject(error);
				});
			},
			function fetchCourses(formList, callback) {
				// check if entries is empty array/object.				
				consolidateInformation(formList)
					.then( function (result) {
						callback(null, result);
					}).catch(function (error) {
						callback(error, null);
					});
			}
			], 
			function (error, result) {
				if(error) {					
					reject(error);
				} else {

					resolve(result);
				}					
			}
		);		
	});	
}

function consolidateInformation(formList) {	
	var userId = formList.userId;		
	return new Promise( function(resolve, reject) {
		async.forEach(formList.forms ,
		function (form, callback) {		
				var query = "SELECT c.course_id, c.course_code, c.title FROM FORM_COURSES fc, COURSES c WHERE fc.form_id = :form_id AND fc.course_id = c.course_id";	
				db.doConnect().then( function (connection) {
					db.doExecute(connection, query, 
						{
							form_id: form.FORM_ID
						})
						.then( function (result) {
							var courses = result.rows;
							async.waterfall([
								function checkCreateorUpdate(callback) {
									var createFormQuery = "SELECT submission_date FROM FORM_SUBMISSION WHERE user_id = :userId AND form_id = :formId";
									db.doExecute(
										connection, createFormQuery
										, {
											userId: userId,
											formId: form.FORM_ID
										}).then( function (result) {
											if(result.rows.length === 1) {
												callback(null, {
													isNew: false,
													submissionDate: result.rows[0].SUBMISSION_DATE,
													courses: courses
												});											
											} else {											
												callback(null, {
													isNew: true,
													submissionDate: undefined,
													courses: courses
												});											
											}							
										}).catch( function (error) {
											callback(error, null);
										});
								},
								function registerStudentPreferences(formSubmissionStatus, callback) {									
									if(formSubmissionStatus.isNew) {
										formSubmissionStatus.courses.forEach(function (course) {
											course.PREFERENCE = -1;
										});
										form.SUBMISSION_DATE = formSubmissionStatus.submissionDate;
										form.courses = formSubmissionStatus.courses;
										callback(null, 'success');
									} else {
										var courseWPref = [];
										async.forEach(formSubmissionStatus.courses,
											function (course, callback) {
												db.doExecute(
												connection, "SELECT preference FROM STUDENT_PREFERENCES WHERE user_id = :userId AND form_id = :formId AND course_code= :courseCode"
												, {
													userId: userId,
													formId: form.FORM_ID,
													courseCode: course.COURSE_CODE
												}).then(function (result) {
													if(result.rows.length === 1) {
														course.PREFERENCE = result.rows[0].PREFERENCE;
													} else {
														course.PREFERENCE = -1;
													}
													courseWPref.push(course);
													callback();													
												}).catch( function (error) {													
													callback(error);
												});	
											}, function (error) {
												if(error) {
													callback(error, null);
												} else {
													form.courses = courseWPref;
													form.SUBMISSION_DATE = formSubmissionStatus.submissionDate;													
													callback(null, form);
												}
											});										
									}	
								}
							], 
							function (error, result) {
								if(error) {									
									callback(error);
								}
								db.doRelease(connection)
									.then ( function (op){	
										console.log(op);								
										callback();
									}).catch( function (error) {
										callback(error);
									});								
							});
						});
					});
			}, 
			function(error) {
				if(error) {					
					reject(error);
				} else {					
					resolve(formList.forms);
				}
		});
	});
}

module.exports.submitForm = function(userPreferences) {
	return new Promise( function (resolve, reject) {
		db.doConnect().then( function (connection) {
			async.waterfall([
				function checkCreateorUpdate(callback) {
					var createFormQuery = "SELECT count(*) as cnt FROM FORM_SUBMISSION WHERE user_id = :userId AND form_id = :formId";					
					db.doExecute(
						connection, createFormQuery
						, {
							userId: userPreferences.userId,
							formId: userPreferences.formId
						}).then( function (result) {
							var exists = result.rows[0].CNT;
							if(exists) {
								db.doExecute(
								connection, "UPDATE FORM_SUBMISSION SET SUBMISSION_DATE = sysdate"
								, {}).then(function (result) {									
									callback(null, {
										isNew: false
									});
								}).catch( function (error) {
									callback(error, null);
								});
							} else {
								db.doExecute(
								connection, "INSERT INTO FORM_SUBMISSION VALUES (:userId, :formId, sysdate)"
								, {
									userId: userPreferences.userId,
									formId: userPreferences.formId
								}).then(function (result) {									
									callback(null, {
										isNew: true
									});
								}).catch( function (error) {
									callback(error, null);
								});
							}							
						}).catch( function (error) {
							callback(error, null);
						});					
				},
				function registerStudentPreferences(formSubmissionStatus, callback) {
					var studentPreferenceQuery;					
					if(formSubmissionStatus.isNew) {
						studentPreferenceQuery = "INSERT INTO STUDENT_PREFERENCES VALUES(:userId, :formId, :courseCode, :preference)";						
					} else {
						studentPreferenceQuery = "UPDATE STUDENT_PREFERENCES SET PREFERENCE = :preference WHERE USER_ID = :userId AND FORM_ID = :formId AND COURSE_CODE = :courseCode";						
					}					
					userPreferences.preferences.forEach(function(preference) {
					db.doExecute(
						connection, studentPreferenceQuery
						, {
							userId: userPreferences.userId,
							formId: userPreferences.formId,
							courseCode: preference.courseCode,
							preference: preference.preference
						}).then(function (result) {
							// logger								
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
							reject(error);
						}).catch(function(error) {
							reject(error);
						});
					} else {						
						db.doCommit(connection).then( function (result) {
							db.doRelease(connection);
						}).then (function (result) {
							resolve(result);
						}).catch(function(error) {
							reject(error);
						});
					}					
				}
			);
		});
	});
}