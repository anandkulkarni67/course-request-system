var dbOperations = require('./dbAccess');

var login = function(request, hash) {
	return new Promise( function(resolve, reject) {	
		dbOperations.getUserDetails(request.body.username, hash)
			.then( function (user) {				
				resolve(user);				
			}).catch(function (error) {
				reject(error);
			});
	});
}

module.exports = {
	login : login
}