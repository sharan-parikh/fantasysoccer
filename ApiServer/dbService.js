const mysql = require("mysql2/promise");

var connection;

async function connect({dbConnectionUrl, username, password, dbName}) {
  if(connection) {
    return connection;
  }
  connection = await mysql.createConnection({
    host: dbConnectionUrl,
    port: 3306,
    user: username,
    password: password,
    database: dbName
  });
  return connection;
}

function getConnection() {
  return connection;
}

module.exports = {
  connect,
  getConnection
}