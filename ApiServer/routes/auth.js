const express = require("express");
const router = express.Router();
const dbService = require('../dbService');
const responseUtil = require('../utils/response-util');

router.post("/login", async function(req, res){
    const conn = dbService.getConnection();
    if(req.session && req.session.username) {
        res.json(responseUtil.createHttpResponse({
            content: {
                username: req.session.username,
            },
            status: 200,
            message: 'User is already autheticated'
        }));
    }
    try {
        const [rows, fields] = await conn.execute(
            'SELECT * FROM `users` WHERE `username` = ? AND `password` = ?',
            [req.body.username, req.body.password]
        );
        if(rows.length == 1) {
            req.session.username = req.body.username;
            res.end(JSON.stringify(responseUtil.createHttpResponse({
                content: {
                    username: req.session.username,
                },
                status: 200,
                message: 'User login successfull.'
            })));
        } else {
            res.json(responseUtil.createHttpResponse({
                content: undefined,
                status: 400,
                message: 'Incorrect credentials supplied'
            }));
        }
    } catch(err) {
        console.error(err);
        res.json(responseUtil.createHttpResponse({
            content: undefined,
            status: 500,
            message: 'Internal server error'
        }));
    }
});

router.post("/logout", function(req, res) {
    req.session.destroy();
});

router.post("/signup", async function(req, res) {
    const conn = dbService.getConnection();
    try {
        const email = req.body.email;
        const password = req.body.password;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const dob = req.body.dob;

        if(!email || !password || !firstName || !lastName || !dob) {
            throw new Error("One or more user attributes are missing");
        }

        const query = "CALL add_user(?, ?, ?, ?, ?)";
        await conn.execute(query, [email, firstName, lastName, dob, password]);
        res.json(responseUtil.createHttpResponse({
            status: 200,
            message: "User creation successful"
        }));
    } catch(err) {
        console.error(err);
        res.status(500);
        res.json(responseUtil.createHttpResponse({
            status: 500,
            message: err.message || "Unable to add new user."
        }));
    }
});

module.exports = router;