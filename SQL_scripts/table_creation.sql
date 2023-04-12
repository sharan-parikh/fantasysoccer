DROP DATABASE IF EXISTS FantasySoccer; -- to be commented out later
CREATE DATABASE IF NOT EXISTS FantasySoccer;

USE `FantasySoccer`;

-- table creation

-- user related
CREATE TABLE users
(
    username VARCHAR(32) PRIMARY KEY,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    date_of_birth DATE NOT NULL,
    password VARCHAR(32) NOT NULL
);

-- miscellaneous
CREATE TABLE country
(
	name VARCHAR(32) PRIMARY KEY
);

CREATE TABLE venue
(
	venue_name VARCHAR(32) PRIMARY KEY,
    venue_country VARCHAR(32) NOT NULL,
    venue_capacity INT
);

-- player & team related
CREATE TABLE player_position
(
	position_name VARCHAR(16) PRIMARY KEY
);

CREATE TABLE physical_team
(
	team_name VARCHAR(32) PRIMARY KEY
);

CREATE TABLE virtual_team
(
	username VARCHAR(32) UNIQUE NOT NULL,
    team_name VARCHAR(160) UNIQUE NOT NULL,
    CONSTRAINT virtual_team_username_fk
		FOREIGN KEY (username)
		REFERENCES users (username),
	CONSTRAINT virtual_team_pk
		PRIMARY KEY (username, team_name)
);

CREATE TABLE physical_player
(
	player_id VARCHAR(32) PRIMARY KEY,
    physical_team_name VARCHAR(32) UNIQUE NOT NULL,
    position_name VARCHAR(16) NOT NULL,
    virtual_player_price INT NOT NULL,
    CONSTRAINT physical_player_team_name_fk
		FOREIGN KEY (physical_team_name)
		REFERENCES physical_team (team_name),
	CONSTRAINT physical_player_position_name_fk
		FOREIGN KEY (position_name)
		REFERENCES player_position (position_name)
);

