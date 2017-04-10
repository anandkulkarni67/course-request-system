var db = require('../util/oracleUtil');
var oracledb    = require('oracledb');
var async = require('async');

module.exports.getUserDetails = function(username, passowrd) {
	var query = "SELECT user_id, username, password, role FROM USERS WHERE username= :username";
	return new Promise( function (resolve, reject) {
		db.doConnect().then( function (connection) {
			db.doExecute(connection, query, {
				username: username
			}).then( function (result) {
				if(result.rows.length === 1) {
					var user = result.rows[0];
					db.doRelease(connection)
						.then ( function (op){
							return resolve(user);
						}).catch( function (error) {							
							reject(error);
						});
				} else {
					return resolve(null);
				}
			}).catch(function (error) {
				rejecte (error);
			});
		}).catch( function (error) {			
			reject(error);
		});	
	});	
}