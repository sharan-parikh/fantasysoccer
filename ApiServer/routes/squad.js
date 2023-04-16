var express = require("express");
var router = express.Router();

router.get("/squad", function(req, res, next){
        res.send("Squad route requested!!");
        next();
});

module.exports = router;