
const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const userRouter = require('./routes/user'); 
const squadRouter = require('./routes/squad'); 

const dbService = require('./dbService');

const initAppAndServer = () => {
    app.use("/api/user", userRouter);
    app.use("/api/squad", squadRouter);
    app.listen(3000, function(){
        console.log("Application started and Listening on port 3000");
    });
}

dbService.connect({
    dbConnectionUrl: process.env.DB_CONNECTION_URL,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME
}, initAppAndServer);

