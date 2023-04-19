USE fantasysoccer;

DELIMITER $$
CREATE PROCEDURE get_players_by_position(IN position_p VARCHAR(20))
BEGIN
	IF(position_p IS NULL) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'position argument supplied is null.';
    END IF;
    
    SET @position_id = ( SELECT id FROM player_position WHERE name = position_p );
    IF(@position_id IS NULL) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'position argument supplied does not exist.';
    END IF;
    
	SELECT p.id, p.first_name, p.last_name, p.virtual_player_price, pp.name AS position, pt.name AS real_team
    FROM player AS p INNER JOIN player_position AS pp
    ON p.position_id = pp.id
    INNER JOIN physical_team AS pt ON p.physical_team_id = pt.id
    WHERE pp.name = position_p;
END$$
DELIMITER ;