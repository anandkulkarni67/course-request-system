var dbOperations = require('./dbAccess');

var fetchAllForms = function (userId) {
	return new Promise(function (resolve, reject) {
		dbOperations.getAllForms(userId).then( function (forms) {
			resolve (forms);
		}).catch( function(error) {
			reject (error);
		});	
	});	
}

var submitForm = function(userId, preferenceInfo) {
	return new Promise( function(resolve, reject) {
		var userPreferences = {
			userId: userId,
			formId: preferenceInfo.formId,
			preferences: preferenceInfo.preferences
		};
		dbOperations.submitForm(userPreferences).then( function () {
			resolve('success');
		}).catch( function(error) {
			reject(error);
		});
	});
}

module.exports = {
	fetchAllForms : fetchAllForms,
	submitForm : submitForm
}