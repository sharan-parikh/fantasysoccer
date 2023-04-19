USE `FantasySoccer`;

delimiter $$
CREATE PROCEDURE add_user(
	IN email varchar(100),
    IN pwd varchar(50),
    IN dob date
)
begin
	DECLARE EXIT HANDLER FOR 1062 SELECT 'username already exists' Message;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION SELECT 'SQLException encountered' Message;
	INSERT INTO users (username, first_name, last_name, date_of_birth, password) VALUES (email, pwd, dob);
end$$
delimiter ;