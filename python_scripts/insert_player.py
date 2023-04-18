from mysql.connector import connect, Error
import json
from pprint import pprint
from tqdm import tqdm
import random
random.seed(18042023)


def read_json(filename):
    with open(filename, 'r') as f:
        data = json.load(f)
        return data


def parse_json(data):
    out_arr = []
    for player in data:
        player_stats = {}
        player_stats['id'] = player['id']
        player_stats['first_name'] = player['firstName']
        player_stats['last_name'] = player['lastName']
        player_stats['physical_team_id'] = player['team']['id']
        if player['position'] == 'Goalkeeper':
            player_stats['position_id'] = 0
        elif player['position'] == 'Defender':
            player_stats['position_id'] = 1
        elif player['position'] == 'Midfielder':
            player_stats['position_id'] = 2
        elif player['position'] == 'Attacker':
            player_stats['position_id'] = 3
        player_stats['virtual_player_price'] = round(random.gauss(mu=8, sigma=1.0), 1)
        out_arr.append(player_stats)
    return out_arr


def enter_data(connection, filename):
    players = parse_json(read_json(filename))
    for player in tqdm(players):
        with connection.cursor() as cursor:
            sql = "INSERT IGNORE INTO player (id,first_name,last_name,physical_team_id,position_id,virtual_player_price) VALUES (%s,%s,%s,%s,%s,%s)"
            val = (player['id'], player['first_name'], player['last_name'], player['physical_team_id'], player['position_id'], player['virtual_player_price'])
            cursor.execute(sql, val)

    connection.commit()


if __name__ == '__main__':
    try:
        with connect(
            host="localhost",
            user="utsav",
            password="nandi",
            database='FantasySoccer'
        ) as connection:
            print('connected successfully!')
            print(connection)
            enter_data(connection=connection, 
                       filename='data/players1.json')
            enter_data(connection=connection, 
                       filename='data/players2.json')
    except Error as e:
        print(e)
