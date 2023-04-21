USE fantasysoccer;

DELIMITER $$
CREATE TRIGGER update_player_points_scored_trigger
	AFTER INSERT
	ON match_stats FOR EACH ROW
BEGIN
	DECLARE pointsScored INT DEFAULT(0);
	DECLARE player_pos VARCHAR(20);
    
    SET player_pos = ( SELECT name FROM player_position WHERE id = (SELECT position_id FROM player WHERE id = NEW.player_id) );
	IF (NEW.minutes_played > 60) THEN SET pointsScored = pointsScored + 2;
    ELSEIF (NEW.minutes_played <= 60) THEN SET pointsScored = pointsScored + 1;
    END IF;
    
    IF (NEW.goals > 0) THEN
		IF (player_pos = 'Goalkeeper' OR player_pos = 'Defender') THEN SET pointsScored = pointsScored + 3;
        ELSEIF (player_pos = 'Midfielder') THEN SET pointsScored = pointsScored + 1;
        ELSEIF (player_pos = 'Attacker') THEN SET pointsScored = pointsScored + 4;
        END IF;
    END IF;
    
    IF (NEW.assists > 0) THEN SET pointsScored = pointsScored + 3;
    END IF;
    
    IF (NEW.yellow_cards > 0) THEN SET pointsScored = pointsScored - NEW.yellow_cards;
    END IF;
    
    IF (NEW.red_cards > 0) THEN SET pointsScored = pointsScored - (NEW.red_cards * 3);
    END IF;
    IF (NEW.saves >= 3) THEN SET pointsScored = pointsScored + ((NEW.saves - MOD(NEW.saves, 3)) DIV 3);
    END IF;
    
    UPDATE player
	SET totalPoints = pointsScored
    WHERE id = NEW.player_id;    
END$$
DELIMITER ;