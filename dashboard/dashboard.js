var dbOperations = require('./dbAccess');

var fetchStudentPreferenceData = function (formId) {
	return new Promise( function (resolve, reject) {
		var rows = [];
		dbOperations.fetchPrefGraphData(formId).then( function (coursePrefInfo) {
		var cols = [];
		cols.push({	
			id: "",
			label: "Course",
			pattern: "",
			type: "string"
		});
		var counter = 0;
		for(counter = 0; counter < coursePrefInfo.noPrefs; counter++) {
			cols.push({
				id : "",
				label: "Preference " + (counter + 1),
				pattern: "",
				type: "number"
			});
		}
		coursePrefInfo.coursePrefCount.forEach( function (course) {
			var row = [];
			row.push({
				v : course.courseCode.trim(),
				f : null		
			});
			if(course.studentPrefCount.length > 0) {
				var counter = 0;
				for (counter = 0; counter < coursePrefInfo.noPrefs; counter++) {
					var entry = course.studentPrefCount.find(obj => obj.PREFERENCE === (counter + 1));
					if(typeof entry === 'undefined') {
						row.push({
							v : 0,
							f : null
						});
					} else {
						row.push({
							v : entry.COUNT,
							f: null
						});
					}						
				}				
			} else {
				var counter = 0;
				for (counter = 0; counter < coursePrefInfo.noPrefs; counter++) {
					row.push({
						v : 0,
						f : null
					});
				}					
			}
			rows.push({
				c : row
			});
		});	
		var jsonResponse = JSON.stringify({
			cols : cols,
			rows : rows
		});
		resolve(jsonResponse);
		}).catch( function(error) {
			console.log(error);
		});				
	});
}

var fetchSeatAvailabilityeData = function (formId) {
	return new Promise( function (resolve, reject) {
		var rows = [];
		dbOperations.fetchSeatAvailabilityeData(formId)
			.then( function (seatAvailabilityCount) {
				console.log(seatAvailabilityCount);
				var cols = [{	
							id: "",
							label: "Course",
							pattern: "",
							type: "string"
						},
						{
							id: "",
							label: "Capacity", 
							pattern: "",
							type: "number"
						},
						{
							id: "",
							label: "Requests",
							pattern: "",
							type: "number"	
						}
						];
				var rows = [];
				seatAvailabilityCount.forEach( function (course) {
					var row = [{
							v : course.COURSE_CODE.trim(),
							f : null		
						},
						{
							v : course.CAPACITY,
							f : null
						},
						{
							v : course.REQUESTS,
							f : null
						}];					
					rows.push({
						c : row
					});
				});
				var jsonResponse = JSON.stringify({
					cols : cols,
					rows : rows
				});
				resolve(jsonResponse);
			}).catch( function(error) {
				console.log(error);
			});
	});
}

var fetchRequestsDistributionData = function (formId) {
	return new Promise( function (resolve, reject) {
		var rows = [];
		dbOperations.fetchRequestsDistributionData(formId)
			.then( function (reqDistributionStats) {
				console.log(reqDistributionStats);
				var cols = [{	
							id: "",
							label: "Course",
							pattern: "",
							type: "string"
						},
						{
							id: "",
							label: "Number of Requests",
							pattern: "",
							type: "number"
						}
						];
				var rows = [];
				reqDistributionStats.forEach( function (course) {
					var row = [{
							v : course.COURSE_CODE.trim(),
							f : null		
						},
						{
							v : course.REQUESTS,
							f : null
						}];					
					rows.push({
						c : row
					});
				});
				var jsonResponse = JSON.stringify({
					cols : cols,
					rows : rows
				});
				resolve(jsonResponse);				
			}).catch( function(error) {
				console.log(error);
			});
	});	
}

var fetchFormDetails = function(formId) {
	return new Promise( function (resolve, reject) {
		dbOperations.fetchFormDetails(formId).then( function (details) {
			console.log(details);
			resolve(details);
		}).catch( function (error) {
			reject(error);
		});
	});
}

module.exports = {
	fetchFormDetails : fetchFormDetails,
	fetchStudentPreferenceData : fetchStudentPreferenceData,
	fetchSeatAvailabilityeData : fetchSeatAvailabilityeData,
	fetchRequestsDistributionData : fetchRequestsDistributionData
}