use fantasysoccer;

DELIMITER $$
CREATE PROCEDURE update_virtual_team_name(IN team_name_new VARCHAR(30), IN username_p VARCHAR(30))
BEGIN
	DECLARE virtual_team_name_old VARCHAR(30);
    
	IF(team_name_new IS NULL OR team_name_new = '')
		THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'New team name supplied is illegal';
	END IF;
    
	IF((SELECT team_name FROM virtual_team WHERE team_name = team_name_new) IS NOT NULL)
		THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Team name already exists.';
	END IF;
    
    IF((SELECT username FROM users WHERE username = username_p) IS NULL)
		THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Username supplied does not exist.';
	END IF;
    
    SET virtual_team_name_old = (SELECT team_name FROM virtual_team WHERE username = username_p);
    
	UPDATE virtual_team
		SET team_name = team_name_new
	WHERE team_name = virtual_team_name_old;
END$$
DELIMITER ;
