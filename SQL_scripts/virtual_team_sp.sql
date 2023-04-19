USE `FantasySoccer`;

-- SP to create virtual team
DELIMITER $$
CREATE PROCEDURE create_virtual_team (
    IN username VARCHAR(32),
    IN team_name VARCHAR(160),
    IN budget INT,
    OUT message VARCHAR(256)
)
create_virtual_team_proc:BEGIN
    DECLARE user_exists INT DEFAULT 0;
    DECLARE budget_enough INT DEFAULT 0;
    DECLARE team_id INT;
    DECLARE team_count INT;

    -- check if user exists
    SELECT COUNT(*) INTO user_exists FROM users WHERE username = username;
    IF user_exists = 0 THEN
        SET message = 'User does not exist';
        LEAVE create_virtual_team_proc;
    END IF;

    -- check if budget is enough
    IF budget < 0 THEN
        SET message = 'Budget cannot be negative';
        LEAVE create_virtual_team_proc;
    END IF;

    -- create virtual team
    INSERT INTO virtual_team (username, team_name, remaining_budget, creation_date)
    VALUES (username, team_name, budget, CURDATE());

    -- get team ID
    SELECT LAST_INSERT_ID() INTO team_id;

    -- check if team already has players
    SELECT COUNT(*) INTO team_count FROM virtual_team_player WHERE virtual_team_id = team_id;
    IF team_count > 0 THEN
        SET message = 'Virtual team already has players';
        LEAVE create_virtual_team_proc;
    END IF;

    SET message = 'Virtual team created successfully';
END $$
DELIMITER ;

-- sp to add or update players from a virtual team
DELIMITER //

CREATE PROCEDURE add_update_players(
    IN team_username VARCHAR(32),
    IN team_id INT,
    IN player_ids VARCHAR(255)
)
BEGIN
    -- Check if the virtual team exists
    DECLARE team_count INT;
    SELECT COUNT(*) INTO team_count FROM virtual_team WHERE id = team_id AND username = team_username;
    IF team_count = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Virtual team does not exist for the given username and id';
    END IF;

    -- Delete all existing players for the virtual team
    DELETE FROM virtual_team_player WHERE virtual_team_id = team_id;

    -- Add the new players for the virtual team
    INSERT INTO virtual_team_player (virtual_team_id, player_id)
    SELECT team_id, id FROM player
    WHERE FIND_IN_SET(id, player_ids) > 0;

    -- Update the last update date for the virtual team
    UPDATE virtual_team SET last_update = NOW() WHERE id = team_id;
END //

DELIMITER ;

