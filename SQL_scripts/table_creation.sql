DROP DATABASE IF EXISTS FantasySoccer; -- to be commented out later
CREATE DATABASE IF NOT EXISTS FantasySoccer;

USE `FantasySoccer`;

-- table creation
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(32) PRIMARY KEY,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    date_of_birth DATE NOT NULL,
    password VARCHAR(32) NOT NULL
);

-- miscellaneous
CREATE TABLE IF NOT EXISTS country (
    name VARCHAR(100) PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS venue (
    id INT PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    address VARCHAR(256),
    country VARCHAR(32) NOT NULL,
    capacity INT
);

-- player & team related
CREATE TABLE IF NOT EXISTS player_position (
	id INT PRIMARY KEY,
    position_name VARCHAR(16) NOT NULL
);

CREATE TABLE IF NOT EXISTS physical_team (
    id INT PRIMARY KEY,
    name VARCHAR(32) UNIQUE NOT NULL
);
	
CREATE TABLE IF NOT EXISTS virtual_team (
    username VARCHAR(32) UNIQUE NOT NULL,
    team_name VARCHAR(160) UNIQUE NOT NULL,
    CONSTRAINT virtual_team_username_fk FOREIGN KEY (username)
        REFERENCES users (username),
    CONSTRAINT virtual_team_pk PRIMARY KEY (username , team_name)
);

CREATE TABLE IF NOT EXISTS player (
    id INT PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    physical_team_id INT NOT NULL,
    position_name VARCHAR(16),
    virtual_player_price INT NOT NULL,
    CONSTRAINT player_team_name_fk FOREIGN KEY (physical_team_id)
        REFERENCES physical_team (id)
);


CREATE TABLE IF NOT EXISTS fixture (
    id VARCHAR(32) PRIMARY KEY,
    venue_id INT NOT NULL,
    match_date DATE,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    CONSTRAINT physical_team_home_fk FOREIGN KEY (home_team_id)
        REFERENCES physical_team (id),
	CONSTRAINT physical_team_away_fk FOREIGN KEY (away_team_id)
        REFERENCES physical_team (id),
	CONSTRAINT fixture_details_venue_id_fk FOREIGN KEY (venue_id)
        REFERENCES venue (id),
    CONSTRAINT home_away_constraint UNIQUE (home_team_id, away_team_id)
);
    