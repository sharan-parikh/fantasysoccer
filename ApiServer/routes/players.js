const express = require("express");
const router = express.Router();
const dbService = require('../dbService');
const responseUtil = require("../utils/response-util");

router.get('/', async function (req, res, next) {
    const conn = dbService.getConnection();
    if (req.query.position) {
        const query = "CALL get_players_by_position(?)";
        const [result, fields] = await conn.execute(query, [req.query.position]);
        const content = [];
        result[0].forEach(row => {
            content.push({
                id: row.id,
                name: row.first_name + " " + row.last_name,
                realteamName: row.real_team,
                cost: row.virtual_player_price.toFixed(2),
                position: row.position
            });
        });
        res.json(responseUtil.createHttpResponse({
            status: 200,
            content,
            message: "Players fetched successfuly"
        }));
    } else {
        res.status(400);
        res.json(responseUtil.createHttpResponse({
            status: 400,
            message: "Position query param is mising."
        }));
    }
});

module.exports = router;