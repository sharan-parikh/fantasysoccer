USE `FantasySoccer`;

DELIMITER //
CREATE PROCEDURE insert_match_stats(
    IN fixture_id INT,
    IN player_id INT,
    IN minutes_played INT,
    IN goals INT,
    IN assists INT,
    IN yellow_cards INT,
    IN red_cards INT,
    IN saves INT
)
BEGIN
	DECLARE EXIT HANDLER FOR 1062 SELECT 'match stats already exists' Message;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION SELECT 'SQLException encountered' Message;
    INSERT INTO match_stats(
        id,
        player_id,
        minutes_played,
        goals,
        assists,
        yellow_cards,
        red_cards,
        saves
    )
    VALUES(
        fixture_id,
        player_id,
        minutes_played,
        goals,
        assists,
        yellow_cards,
        red_cards,
        saves
    );
END //
DELIMITER ;
