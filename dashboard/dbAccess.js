var db = require('../util/oracleUtil');
var oracledb    = require('oracledb');
var async = require('async');

var fetchPrefGraphData = function(formId) {
	var coursePrefCount = [];
	return new Promise( function (resolve, reject) {
		db.doConnect().then( function (connection) {
			async.waterfall([
				function fetchPrefs(callback) {
					var createFormQuery = "SELECT NO_PREFERENCES FROM FORMS WHERE FORM_ID = :formId";
					db.doExecute(
						connection, createFormQuery
						, {
							formId: formId
						}).then( function (result) {							
							callback(null, result.rows[0].NO_PREFERENCES);
						}).catch( function (error) {
							callback(error, null);
						});					
				},
				function fetchPrefsCount(noPrefs, callback) {
					var createFormQuery = "SELECT c.COURSE_CODE FROM FORM_COURSES fc, COURSES c WHERE fc.FORM_ID = :formId AND fc.COURSE_ID = c.COURSE_ID";
					db.doExecute(
						connection, createFormQuery
						, {
							formId: formId
						}).then( function (result) {							
							callback(null, {
								noPrefs : noPrefs,
								courses : result.rows
							});
						}).catch( function (error) {
							callback(error, null);
						});					
				},
				function fetchPrefData(formInfo, callback) {					
					var createCourseMappingQuery = "SELECT PREFERENCE, count(USER_ID) as count FROM STUDENT_PREFERENCES WHERE FORM_ID = :formId AND COURSE_CODE = :courseCode GROUP BY PREFERENCE ORDER BY PREFERENCE";					
					async.forEach(formInfo.courses,
						function (course, callback) {							
							db.doExecute(
								connection, createCourseMappingQuery
								, {
									formId: formId,
									courseCode: course.COURSE_CODE
								}).then(function (result) {									
									coursePrefCount.push({
										courseCode : course.COURSE_CODE,
										studentPrefCount : result.rows
									});
									callback();
								}).catch( function (error) {
									callback(error);
								});											
						}, 
						function(error) {
							if(error) {
								callback(error);
							} else {								
								callback(null, {
									noPrefs : formInfo.noPrefs,
									coursePrefCount : coursePrefCount	
								});
							}
					});
				}
				], 
				function (error, coursePrefInfo) {
					db.doRelease(connection).then(function (result) {
						if(error) {
							reject(error);
						} else {							
							resolve(coursePrefInfo);
						}							
					}).catch(function(error) {
						reject(error);
					});
				}
			);
		});
	});
}

var fetchSeatAvailabilityeData = function(formId) {	
	return new Promise( function (resolve, reject) {
		var createFormQuery = "SELECT coCap.COURSE_CODE, coCap.CAPACITY, nvl(stdReq.reqCount, 0) as REQUESTS FROM ( SELECT c.COURSE_CODE, c.CAPACITY FROM FORM_COURSES fc, COURSES c WHERE fc.FORM_ID = :formId AND c.COURSE_ID = fc.COURSE_ID ) coCap LEFT JOIN (   SELECT sp.COURSE_CODE, count(sp.USER_ID) as reqCount FROM STUDENT_PREFERENCES sp WHERE sp.FORM_ID = :formId GROUP BY sp.COURSE_CODE ) stdReq ON coCap.COURSE_CODE = stdReq.COURSE_CODE ORDER BY REQUESTS, coCap.COURSE_CODE";
		db.doConnect().then( function (connection) {		
			db.doExecute(
				connection, createFormQuery
				, {
					formId: formId
				}).then( function (stats) {
					db.doRelease(connection).then(function (result) {
						resolve(stats.rows);
					});
				}).catch( function (error) {
					reject(error);
				});
			});
	});
}

var fetchRequestsDistributionData = function(formId) {
	return new Promise( function (resolve, reject) {
		var createFormQuery = "SELECT coCap.COURSE_CODE, nvl(stdReq.reqCount, 0) as REQUESTS FROM ( SELECT c.COURSE_CODE, c.CAPACITY FROM FORM_COURSES fc, COURSES c WHERE fc.FORM_ID = :formId AND c.COURSE_ID = fc.COURSE_ID ) coCap LEFT JOIN ( SELECT sp.COURSE_CODE, count(sp.USER_ID) as reqCount FROM STUDENT_PREFERENCES sp WHERE sp.FORM_ID = :formId GROUP BY sp.COURSE_CODE ) stdReq ON coCap.COURSE_CODE = stdReq.COURSE_CODE ORDER BY REQUESTS, coCap.COURSE_CODE";
		db.doConnect().then( function (connection) {		
			db.doExecute(
				connection, createFormQuery
				, {
					formId: formId
				}).then( function (stats) {
					db.doRelease(connection).then(function (result) {
						resolve(stats.rows);
					});
				}).catch( function (error) {
					reject(error);
				});					
			});
	});
}

var fetchFormDetails = function(formId) {
	return new Promise( function (resolve, reject) {
		var createFormQuery = "SELECT f.form_id, f.title, f.no_preferences, f.creation_date, f.start_time, f.end_time FROM FORMS f WHERE f.FORM_ID = :formId";
		db.doConnect().then( function (connection) {		
			db.doExecute(
				connection, createFormQuery
				, {
					formId: formId
				}).then( function (details) {							
					db.doRelease(connection).then(function (result) {
						resolve(details.rows[0]);
					});					
				}).catch( function (error) {
					reject(error);
				});					
			});
	});
}

module.exports = {
	fetchFormDetails : fetchFormDetails,
	fetchPrefGraphData : fetchPrefGraphData,
	fetchSeatAvailabilityeData : fetchSeatAvailabilityeData,
	fetchRequestsDistributionData : fetchRequestsDistributionData
}