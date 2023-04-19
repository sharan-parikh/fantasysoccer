USE `FantasySoccer`;

delimiter $$
CREATE PROCEDURE add_user(
	IN email varchar(100),
    IN firstname varchar(64),
    IN lastname varchar(64),
    IN dob date,
    IN pwd varchar(50)
)
begin
	DECLARE EXIT HANDLER FOR 1062 SELECT 'username already exists' Message;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION SELECT 'SQLException encountered' Message;
	INSERT INTO users (username, first_name, last_name, date_of_birth, password) VALUES (email, firstname, lastname, dob, pwd);
end$$
delimiter ;