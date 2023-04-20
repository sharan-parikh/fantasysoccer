const express = require("express");
const router = express.Router();
const dbService = require('../dbService');
const responseUtil = require("../utils/response-util");

router.get("/", async function(req, res, next){
        const conn = dbService.getConnection();
        
        try {
          const username = req.session.username;
          const query = "CALL get_sqaud_by_username(?)";
          const [rows, field] = await conn.execute(query, [username]);
          const players = {
                goalkeepers: rows.filter(row => row.position === 'Goalkeeper'),
                defenders: rows.filter(row => row.position === 'Defender'),
                midfielders: rows.filter(row => row.position === 'Midfielder'),
                forwards: rows.filter(row => row.position === 'Attacker')
          }
          res.json(responseUtil.createHttpResponse({
                status: 200,
                message: 'Fantasy squad fetched successfully.',
                content: players
          }));
        } catch(err) {
          console.error(err);
          res.status(500);
          res.json(responseUtil.createHttpResponse({
                status: 500,
                message: 'Could not fetch fantasy squad.'
          }));
        }
        next();
});



module.exports = router;