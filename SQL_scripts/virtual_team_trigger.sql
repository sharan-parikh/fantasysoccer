USE `FantasySoccer`;

DELIMITER $$
CREATE TRIGGER check_max_players_in_team
BEFORE INSERT ON virtual_team_player
FOR EACH ROW
BEGIN
    DECLARE player_count INT;
    
    SELECT COUNT(*) INTO player_count
    FROM virtual_team_player
    WHERE virtual_team_id = NEW.virtual_team_id;
    
    IF player_count >= 11 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Cannot add more than 11 players in a virtual team.';
    END IF;
END$$
DELIMITER ;
