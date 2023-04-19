const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next){
        res.send("Squad route requested!!");
        next();
});

module.exports = router;