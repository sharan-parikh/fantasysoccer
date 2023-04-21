const express = require("express");
const router = express.Router();
const dbService = require('../dbService');
const responseUtil = require('../utils/response-util');


router.get('/', function(req, res) {
    const conn = dbService.getConnection();

    const query = "SELECT "
});


module.exports = router;