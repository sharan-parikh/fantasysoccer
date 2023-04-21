USE fantasysoccer;

delimiter $$
CREATE PROCEDURE add_user(
	IN email varchar(100),
    IN firstname varchar(64),
    IN lastname varchar(64),
    IN dob date,
    IN pwd varchar(50),
    IN virtual_team_name varchar(50)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
			@errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
			SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
			SELECT @full_error;
            SET autocommit = 1;
			ROLLBACK;
            RESIGNAL;
		END;
    
    START TRANSACTION;
		SET autocommit = 0;
		SET @virtual_team_name_exist = ( SELECT team_name FROM virtual_team WHERE team_name = virtual_team_name );
		IF(@virtual_team_name_exist IS NOT NULL) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'team name already exists.';
		END IF;
		INSERT INTO users (username, first_name, last_name, date_of_birth, password) VALUES (email, firstname, lastname, dob, pwd);
		INSERT INTO virtual_team (username, team_name, remaining_budget) VALUES (email, virtual_team_name, 100);
	COMMIT;
    SET autocommit = 1;
END$$
delimiter ;