
const express = require("express");
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const session = require('express-session');
var bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const playersRouter = require('./routes/players');

const dbService = require('./dbService');
const jsonParser = bodyParser.json();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours,
        httpOnly: true,
        sameSite: false
    },
    saveUninitialized: false,
}));

function sessionChecker(req, res, next) {
    if (req.session.username) {
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
    app.use(cors({
        origin: "http://localhost:4200",
        methods: ["POST", "PUT", "GET", "OPTIONS", "DELETE"],
        credentials: true
    }));
    app.use("/api/auth", jsonParser, addContentType, authRouter);
    app.use("/api/user", jsonParser, sessionChecker, addContentType, userRouter);
    app.use("/api/players", jsonParser, sessionChecker, addContentType, playersRouter);
    const port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log(`Application started and Listening on port ${port}`);
    });
} catch (err) {
    console.error(err);
}


