USE `FantasySoccer`;

-- Get PlayerInfoById
DELIMITER $$
CREATE PROCEDURE GetPlayerInformationById (IN playerId INT)
BEGIN
    SELECT
        player.id,
        player.first_name,
        player.last_name,
        player_position.name AS position,
        physical_team.name AS team,
        player.virtual_player_price AS price
    FROM
        player
    INNER JOIN player_position ON player.position_id = player_position.id
    INNER JOIN physical_team ON player.physical_team_id = physical_team.id
    WHERE
        player.id = playerId;
END$$
DELIMITER ;
-- 
