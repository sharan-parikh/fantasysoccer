
const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const session = require('express-session');
var bodyParser = require('body-parser');
const userRouter = require('./routes/auth'); 
const squadRouter = require('./routes/squad'); 

const dbService = require('./dbService');
const jsonParser = bodyParser.json();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
    saveUninitialized: false
}));

app.get('/', function(req, res, next) {
    res.sendStatus(404);
});

function sessionChecker(req, res, next) {
    if(req.session.username) {
        next();
    } else {
        res.sendStatus(401);
    }
}

function addContentType(req, res, next) {
    res.setHeader('Content-type', "application/json");
    next();
}

async function connectDB() {
    await dbService.connect({
        dbConnectionUrl: process.env.DB_CONNECTION_URL,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        dbName: process.env.DB_NAME
    });
}

try {
    connectDB();
    app.use("/api/auth", jsonParser, addContentType, userRouter);
    app.use("/api/squad", jsonParser, sessionChecker, addContentType, squadRouter);
    app.listen(3000, function(){
        console.log("Application started and Listening on port 3000");
    });
} catch(err) {
    console.error(err);
}


