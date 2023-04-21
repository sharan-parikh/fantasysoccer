USE fantasysoccer;

DELIMITER $$
CREATE PROCEDURE get_squad_details_by_username(IN username_p VARCHAR(64))
BEGIN
	DECLARE fantasy_team_id INT;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
			@errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
			SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
			SELECT @full_error;
            RESIGNAL;
		END;
	IF ( (SELECT username FROM users WHERE username = username_p) IS NULL ) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User with supplied username does not exist';
	END IF;
    
    SET fantasy_team_id = ( SELECT id FROM virtual_team WHERE username = username_p );
    SELECT team_name AS fantasy_team_name, remaining_budget FROM virtual_team WHERE id = fantasy_team_id;
    
    SELECT p.id, CONCAT(p.first_name, " ", p.last_name) AS player_name,
		   p.virtual_player_price AS player_cost, p.totalPoints, pp.name AS player_position, pt.name AS real_team_name
           FROM virtual_team_player AS vtp
           INNER JOIN player AS p 
           ON vtp.player_id = p.id
           INNER JOIN player_position AS pp
           ON p.position_id = pp.id
           INNER JOIN physical_team AS pt
           ON p.physical_team_id = pt.id
           WHERE vtp.virtual_team_id = fantasy_team_id;
END$$
DELIMITER ;