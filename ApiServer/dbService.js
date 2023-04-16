const mysql = require("mysql2");

var connection;

function connect({dbConnectionUrl, username, password, dbName}, callback) {
    connection = mysql.createConnection({
        host: dbConnectionUrl,
        port: 3306,
        user: username,
        password: password,
        database: dbName
      });
      
      connection.connect(function(err) {
        if (err) throw err;
        console.log("Database Connected!");
        callback()
      });
}

function getConnection() {
    return connection;
}

module.exports = {
    connect,
    getConnection
}