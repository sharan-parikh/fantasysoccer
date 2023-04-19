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

-- sp to add players to a virtual team
DELIMITER $$
CREATE PROCEDURE AddPlayerToVirtualTeam(IN virtualTeamId INT, IN playerId INT)
BEGIN
    DECLARE playerPrice FLOAT;
    DECLARE remainingBudget INT;

    -- Get the price of the player
    SELECT virtual_player_price INTO playerPrice
    FROM player
    WHERE id = playerId;

    -- Check if the player is not already in the virtual team
    IF NOT EXISTS (SELECT 1 FROM virtual_team_player WHERE virtual_team_id = virtualTeamId AND player_id = playerId) THEN
        -- Get the remaining budget of the virtual team
        SELECT remaining_budget INTO remainingBudget
        FROM virtual_team
        WHERE id = virtualTeamId;

        -- Check if the virtual team has enough budget to buy the player
        IF remainingBudget >= playerPrice THEN
            -- Add the player to the virtual team
            INSERT INTO virtual_team_player (virtual_team_id, player_id)
            VALUES (virtualTeamId, playerId);

            -- Update the remaining budget of the virtual team
            UPDATE virtual_team
            SET remaining_budget = remaining_budget - playerPrice
            WHERE id = virtualTeamId;
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Not enough budget to buy the player';
        END IF;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Player is already in the virtual team';
    END IF;
END$$
DELIMITER ;

-- sp to remove player from a virtual team
DELIMITER $$
CREATE PROCEDURE RemovePlayerFromVirtualTeam(IN virtualTeamId INT, IN playerId INT)
BEGIN
    DECLARE playerPrice FLOAT;
    
    -- it also adds back the player cost back to the team remaining budget
    -- get player price
    SELECT virtual_player_price INTO playerPrice
    FROM player
    WHERE id = playerId;
    
    -- update the remaining budget
    UPDATE virtual_team
    SET remaining_budget = remaining_budget + playerPrice
    WHERE id = virtualTeamId;
    
    -- remove the player from virtual team
    DELETE FROM virtual_team_player
    WHERE virtual_team_id = virtualTeamId AND player_id = playerId;
END$$
DELIMITER ;

-- Get All players in a given virtual team
DELIMITER $$
CREATE PROCEDURE GetPlayersInVirtualTeam(IN virtualTeamId INT)
BEGIN
    SELECT
        player.id,
        player.first_name,
        player.last_name,
        player_position.name AS position,
        player.virtual_player_price AS price
    FROM
        virtual_team_player
    INNER JOIN player ON virtual_team_player.player_id = player.id
    INNER JOIN player_position ON player.position_id = player_position.id
    WHERE
        virtual_team_player.virtual_team_id = virtualTeamId;
END$$
DELIMITER ;

-- Get Virtual Team Info
DELIMITER $$
CREATE PROCEDURE GetVirtualTeamDetails(IN virtualTeamId INT)
BEGIN
    SELECT
        virtual_team.id,
        users.username,
        users.first_name,
        users.last_name,
        virtual_team.team_name,
        virtual_team.remaining_budget,
        virtual_team.creation_date,
        virtual_team.last_update
    FROM
        virtual_team
    INNER JOIN users ON virtual_team.username = users.username
    WHERE
        virtual_team.id = virtualTeamId;
END$$
DELIMITER ;
