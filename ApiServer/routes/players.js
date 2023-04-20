const express = require("express");
const router = express.Router();
const dbService = require('../dbService');
const responseUtil = require("../utils/response-util");

router.get('/', async function(req, res, next){
    const conn = dbService.getConnection();
    if(req.params.position) {
        const query = "CALL get_players_by_position(?)";
        const [rows, fields] = await conn.execute(query, [req.params.position]);
        const content = [];
        rows.forEach(row => {
            content.push({
                id: row.id,
                name: row.first_name + row.last_name,
                realteamName: row.real_team,
                cost: row.virtual_player_price,
                position: row.position
            });
        })
    } else {
        res.status(400);
        res.json(responseUtil.createHttpResponse({
            status: 400,
            message: "Position query param is mising."
        }));
    }
});