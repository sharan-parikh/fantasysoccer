DROP DATABASE IF EXISTS FantasySoccer; -- to be commented out later
CREATE DATABASE IF NOT EXISTS FantasySoccer;

USE `FantasySoccer`;

-- table creation:

CREATE TABLE users
(
    username VARCHAR(160) PRIMARY KEY,
    first_name VARCHAR(160) NOT NULL,
    last_name VARCHAR(160) NOT NULL,
    date_of_birth DATE NOT NULL,
    password BINARY(64) NOT NULL
);

CREATE TABLE country
(
	name VARCHAR(32) PRIMARY KEY
);

CREATE TABLE player_position
(
	position_name VARCHAR(16) PRIMARY KEY
);

CREATE TABLE venue
(
	venue_name VARCHAR(32) PRIMARY KEY,
    venue_country VARCHAR(32) NOT NULL,
    venue_capacity INT
);


