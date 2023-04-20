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
    name VARCHAR(16) NOT NULL
);

INSERT INTO player_position
	(id, name) 
VALUES
	(0, 'Goalkeeper'),
    (1, 'Defender'),
    (2, 'Midfielder'),
    (3, 'Attacker');

CREATE TABLE IF NOT EXISTS physical_team (
    id INT PRIMARY KEY,
    name VARCHAR(32) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS player (
    id INT PRIMARY KEY,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    physical_team_id INT NOT NULL,
    position_id INT NOT NULL,
    virtual_player_price FLOAT NOT NULL,
    CONSTRAINT player_team_name_fk FOREIGN KEY (physical_team_id)
        REFERENCES physical_team (id),
    CONSTRAINT player_position_fk FOREIGN KEY (position_id)
        REFERENCES player_position (id)
);


CREATE TABLE IF NOT EXISTS fixture (
    id INT PRIMARY KEY,
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
    CONSTRAINT home_away_unique UNIQUE (home_team_id , away_team_id)
);
    
CREATE TABLE IF NOT EXISTS match_stats (
    fixture_id INT NOT NULL,
    player_id INT NOT NULL,
    minutes_played INT NOT NULL,
    goals INT NOT NULL,
    assists INT NOT NULL,
    yellow_cards INT NOT NULL,
    red_cards INT NOT NULL,
    saves INT NOT NULL,
    CONSTRAINT match_stats_pk PRIMARY KEY (fixture_id , player_id),
    CONSTRAINT match_stats_fixture_fk FOREIGN KEY (fixture_id)
        REFERENCES fixture (id),
    CONSTRAINT match_stats_player_fk FOREIGN KEY (player_id)
        REFERENCES player (id)
);

CREATE TABLE IF NOT EXISTS virtual_team (
    id INT PRIMARY KEY auto_increment,
    username VARCHAR(32) UNIQUE NOT NULL,
    team_name VARCHAR(160) UNIQUE NOT NULL,
    remaining_budget INT NOT NULL,
    creation_date DATE NOT NULL DEFAULT(DATE(NOW())),
    last_update DATE NOT NULL DEFAULT(DATE(NOW())),
    CONSTRAINT virtual_team_username_fk FOREIGN KEY (username)
        REFERENCES users (username)
);

CREATE TABLE IF NOT EXISTS virtual_team_player (
    virtual_team_id INT NOT NULL,
    player_id INT NOT NULL,
    CONSTRAINT virtual_team_id_fk FOREIGN KEY (virtual_team_id)
        REFERENCES virtual_team (id),
    CONSTRAINT virtual_player_id_fk FOREIGN KEY (player_id)
        REFERENCES player (id),
    PRIMARY KEY(virtual_team_id , player_id)
);