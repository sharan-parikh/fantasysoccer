var express = require("express");
var router = express.Router();

router.get("/user", function(req, res, next){
    res.send("User route requested.");
    next();
});

module.exports = router;