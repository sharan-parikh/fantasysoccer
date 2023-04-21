const express = require("express");
const router = express.Router();
const dbService = require('../dbService');
const responseUtil = require("../utils/response-util");

router.get("/squad", async function (req, res) {
      const conn = dbService.getConnection();

      try {
            const username = req.session.username;
            const query = "CALL get_squad_details_by_username(?)";
            const [result, field] = await conn.execute(query, [username]);
            const players = {
                  goalkeepers: result[1].filter(row => row.player_position === 'Goalkeeper').map(row => playerInfoRespHandler(row)),
                  defenders: result[1].filter(row => row.player_position === 'Defender').map(row => playerInfoRespHandler(row)),
                  midfielders: result[1].filter(row => row.player_position === 'Midfielder').map(row => playerInfoRespHandler(row)),
                  forwards: result[1].filter(row => row.player_position === 'Attacker').map(row => playerInfoRespHandler(row))
            }
            res.json(responseUtil.createHttpResponse({
                  status: 200,
                  message: 'Fantasy squad fetched successfully.',
                  content: {
                        players,
                        remainingBudget: result[0][0].remaining_budget,
                        fantasyTeamName: result[0][0].fantasy_team_name
                  }
            }));
      } catch (err) {
            console.error(err);
            if (err.sqlState === '45000') {
                  res.json(responseUtil.createHttpResponse({
                        status: 400,
                        message: err.sqlMessage,
                  }));
            } else {
                  res.status(500);
                  res.json(responseUtil.createHttpResponse({
                        status: 500,
                        message: 'Internal Server Error'
                  }));
            }
      }
});

function playerInfoRespHandler(player) {
      return {
            id: player.id,
            name: player.player_name,
            cost: player.player_cost.toFixed(2),
            totalPoints: player.totalPoints,
            position: player.player_position,
            realteamName: player.real_team_name
      };
}

router.put("/squad", async function (req, res) {
      const selectedPlayers = req.body;
      try {
            if (!selectedPlayers || selectedPlayers.length != 15) {
                  res.status(400);
                  res.json(responseUtil.createHttpResponse({
                        status: 400,
                        message: "No player list supplied or not all 15 players were supplied."
                  }));
            } else {
                  const selectedPlayerIds = selectedPlayers.map(player => player.id);
                  const conn = dbService.getConnection();
                  const query = "CALL update_squad(?,?)";
                  const [result, fields] = await conn.execute(query, [selectedPlayerIds.toString(), req.session.username]);
                  res.json(responseUtil.createHttpResponse({
                        status: 200,
                        message: "Fantasy sqaud updated successfully."
                  }));
            }
      } catch (err) {
            console.error(err);
            if (err.sqlState === '45000') {
                  res.status(400);
                  res.json(responseUtil.createHttpResponse({
                        status: 400,
                        message: err.sqlMessage,
                  }));
            } else {
                  res.status(500);
                  res.json(responseUtil.createHttpResponse({
                        status: 500,
                        message: 'Internal Server Error',
                  }));
            }
      }
});

router.put("/squad/name", async function (req, res) {
      const newSqaudName = req.body.name;
      const conn = dbService.getConnection();

      if (!newSqaudName) {
            res.status(400);
            res.json(responseUtil.createHttpResponse({
                  status: 400,
                  message: "name parameter missing."
            }));

      } else {
            try {
                  const query = "CALL update_virtual_team_name(?, ?)";
                  const [result, fields] = await conn.execute(query, [newSqaudName, req.session.username]);
                  res.json(responseUtil.createHttpResponse({
                        status: 200,
                        message: 'Fantasy team name changed successfully'
                  }));
            } catch (err) {
                  if (err.sqlState === '45000') {
                        res.status(400);
                        res.json(responseUtil.createHttpResponse({
                              status: 400,
                              message: err.sqlMessage,
                        }));
                  } else {
                        console.error(err);
                        res.status(500);
                        res.json(responseUtil.createHttpResponse({
                              status: 500,
                              message: 'Internal Server Error',
                        }));
                  }
            }
      }
});

router.delete('/', async function (req, res) {
      if (req.session.username) { // checking the user is logged in
            try {
                  const conn = dbService.getConnection();
                  const query = "DELETE FROM users WHERE username = ?";
                  const [results, fields] = await conn.execute(query, [req.session.username]);
                  if (results.affectedRows > 0) {
                        res.json(responseUtil.createHttpResponse({
                              status: 200,
                              message: 'User account successfully deleted'
                        }));
                  }
            } catch(err) {
                  console.error(err);
                  res.status(500);
                  res.json(responseUtil.createHttpResponse({
                        status: 500,
                        message: 'Internal Server Error'
                  }));
            }
      }
});

module.exports = router;