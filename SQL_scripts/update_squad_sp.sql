
USE fantasysoccer;

DELIMITER $$
CREATE PROCEDURE update_squad(IN playerIdList TEXT, IN username_p VARCHAR(64))
BEGIN
	DECLARE done INT DEFAULT FALSE;
    DECLARE player_cur_id INT;
    DECLARE player_cur CURSOR FOR SELECT id FROM player WHERE FIND_IN_SET(id, playerIdList);
    DECLARE
    CONTINUE HANDLER FOR NOT FOUND
	SET done = TRUE;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
			@errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
			SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
			SELECT @full_error;
			ROLLBACK;
		END;
    SET autocommit = 0;
    
    START TRANSACTION;
		SET @playersCount = ( SELECT COUNT(id) FROM player WHERE FIND_IN_SET(id, playerIdList));
        IF (@playersCount < 15) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'number of player ids supplied is less than 15';
        END IF;
        
        SET @totalCost = ( SELECT SUM(virtual_player_price) FROM player WHERE FIND_IN_SET (id, playerIdList));
        IF (@totalCost > 100) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'total team budget exceeded the maximum budget allowed';
        END IF;
        
        SET @virtualTeamId = ( SELECT id FROM virtual_team WHERE username = username_p );
        DELETE FROM virtual_team_player WHERE virtual_team_id = @virtualTeamId;
        
        OPEN player_cur;
		player_loop:
		LOOP
			FETCH player_cur INTO player_cur_id;
		IF done THEN LEAVE player_loop;
        END IF;
			INSERT INTO virtual_team_player (virtual_team_id, player_id) VALUES (@virtualTeamId, player_cur_id);
		END LOOP player_loop;
        CLOSE player_cur;
	COMMIT;
    SET autocommit = 1;
END$$
DELIMITER ;
