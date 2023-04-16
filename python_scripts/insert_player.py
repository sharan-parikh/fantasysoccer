from mysql.connector import connect, Error
import json
from pprint import pprint
from tqdm import tqdm

def read_json(filename):
    arr = []
    with open(filename, 'r') as f:
        data = json.load(f)
        for item_1 in data.values():
            for item_2 in item_1:
                players = item_2['players']
                team_id = item_2['team']['id']
                for player in players:
                    # print(player['player'])
                    player_data = player['player']
                    player_data['team_id'] = team_id
                    arr.append(player_data)
        return arr


def enter_data(connection, filename):
    players = read_json(filename)
    for player in tqdm(players):
        with connection.cursor() as cursor:
            sql = "INSERT INTO player (id, name, physical_team_id, position_name, virtual_player_price) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(sql, (player['id'], player['name'], player['team_id'], '', 0))
            # print(f"Inserted player: {player}")
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
            # read_json('data/playerStats.json')
            enter_data(connection=connection, 
                       filename='data/playerStats.json')
    except Error as e:
        print(e)
