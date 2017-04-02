module.exports = function(pool) {
  var oracledb = require("oracledb");
  var doConnect = function() {
    console.log("INFO: Module getConnection() called - attempting to retrieve a connection using the node-oracledb driver");
    return new Promise( function (resolve, reject) {
      pool.getConnection(function(err, connection) {
        if (err) {          
          return reject("ERROR: Cannot get a connection: ", err);
        }

        if (typeof pool !== "undefined") {
          console.log("INFO: Connections open: " + pool.connectionsOpen);
          console.log("INFO: Connections in use: " + pool.connectionsInUse);
        }

        doExecute(connection, "SELECT SYS_CONTEXT('userenv', 'sid') AS session_id FROM DUAL", {}).then( function (result) {
          console.log("INFO: Connection retrieved from the database, SESSION ID: ", result.rows[0]['SESSION_ID']);
          return resolve(connection);
        }).catch( function (error) {
          return reject(error);
        });
      });
    });
  }

  var doExecute = function(connection, sql, params) { 
    console.log("INFO: Module execute() called - attempting to execute a query : " + sql);
    return new Promise( function (resolve, reject) {
      connection.execute(sql, params, { autoCommit: false, outFormat: oracledb.OBJECT, maxRows:1000 }, function(err, result) {
        if (err) {
          console.log("ERROR: Unable to execute the SQL: ", err);
          releaseConnection(connection);
          return reject(err);
        }        
        return resolve(result);
      });
    });    
  }  

  var doCommit = function(connection) {
    return new Promise( function (resolve, reject) {
      connection.commit(function(err) {
        if (err) {
          console.log("ERROR: Unable to COMMIT transaction: ", err);
          return reject(err);
        }
          return resolve('success');
        });
    });    
  }

  var doRollback = function(connection) {
    return new Promise( function (resolve, reject) {
      connection.rollback(function(err) {
        if (err) {
          console.log("ERROR: Unable to ROLLBACK transaction: ", err);
          return reject (err);
        }
        return resolve('success');
      });
    });
  }

  var doRelease = function(connection) {
    console.log("INFO: Module release() called - attempting to release a connection.");    
    return new Promise( function (resolve, reject) {
      connection.release(function(err) {
        if (err) {
          reject(err);
        }
        if (typeof pool !== "undefined") {
          console.log("INFO: RELEASE STATS");
          console.log("INFO: Connections open: " + pool.connectionsOpen);
          console.log("INFO: Connections in use: " + pool.connectionsInUse);
        }
        return resolve('success');
      });
    });
  }

  module.exports.doConnect  = doConnect;
  module.exports.doExecute  = doExecute;
  module.exports.doCommit   = doCommit;
  module.exports.doRollback = doRollback;
  module.exports.doRelease  = doRelease;
}