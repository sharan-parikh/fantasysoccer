import json
from datetime import datetime
from pprint import pprint
from mysql.connector import connect, Error
from tqdm import tqdm

def read_json(filename):
    with open(filename, 'r') as f:
        data = json.load(f)
        return data


def parse_json(data):
    out_arr = []
    for fixture_id, fixture in data.items():
        for team_player in fixture:
            players = team_player['players']
            for player in players:
                parsed_data = {}
                parsed_data['id'] = fixture_id
                parsed_data['player_id'] = player['player']['id']
                # parsed_data['team_id'] = team_player['team']['id']
                parsed_data['minutes_played'] = player['statistics'][0]['games']['minutes']
                if parsed_data['minutes_played'] is None:
                    parsed_data['minutes_played'] = 0
                parsed_data['goals'] = player['statistics'][0]['goals']['total']
                if parsed_data['goals'] is None:
                    parsed_data['goals'] = 0
                parsed_data['assists'] = player['statistics'][0]['goals']['assists']
                if parsed_data['assists'] is None:
                    parsed_data['assists'] = 0
                parsed_data['yellow_cards'] = player['statistics'][0]['cards']['yellow']
                parsed_data['red_cards'] = player['statistics'][0]['cards']['red']

                parsed_data['duels_won'] = player['statistics'][0]['duels']['won']
                if parsed_data['duels_won'] is None:
                    parsed_data['duels_won'] = 0

                parsed_data['saves'] = player['statistics'][0]['goals']['saves']
                if parsed_data['saves'] is None:
                    parsed_data['saves'] = 0
                for k, v in parsed_data.items():
                    if v is None:
                        print(k, parsed_data[k])
                out_arr.append(parsed_data)
    return out_arr


def enter_data(connection, filename):
    items = parse_json(read_json(filename))
    for item in tqdm(items):
        with connection.cursor() as cursor:
            try:
                sql = "INSERT INTO match_stats (fixture_id, player_id, minutes_played, goals, assists, yellow_cards, red_cards, saves) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
                val = (item['id'], item['player_id'], item['minutes_played'], item['goals'], item['assists'], item['yellow_cards'], item['red_cards'], item['saves'])
                cursor.execute(sql, val)
                # sql = "CALL insert_match_stats(%s, %s, %s, %s, %s, %s, %s, %s)"
                # val = (item['id'], item['player_id'], item['minutes_played'], item['goals'], item['assists'], item['yellow_cards'], item['red_cards'], item['saves'])
                # cursor.execute(sql, val)
                # results = cursor.fetchall()
                # print('\n', results[0][0])
                connection.commit()
            # except Error as error:
            #     cursor.rollback()
            except Exception as e:
                print(e)
                print(item)



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
            # result = parse_json(read_json('data/playerStats.json'))
            # pprint(result)
            # pprint(result)
            enter_data(connection=connection, 
                       filename='data/playerStats.json')
    except Error as e:
        print(e)
