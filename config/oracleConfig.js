module.exports = {
  user          : process.env.NODE_ORACLEDB_USER || "STUDENT_REG_APP",
  password      : process.env.NODE_ORACLEDB_PASSWORD || "oracleabc",
  connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "localhost/xe",
  externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
};
