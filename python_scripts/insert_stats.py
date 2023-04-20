import json
from mysql.connector import connect, Error
from tqdm import tqdm


def read_json(filename):
    with open(filename, 'r') as f:
        data = json.load(f)
        return data


def replace_null(val):
    return val if val is not None else 0


def parse_json(data):
    out_arr = []
    for fixture_id, fixture in data.items():
        for team_player in fixture:
            players = team_player['players']
            for player in players:
                parsed_data = {}
                parsed_data['id'] = fixture_id
                parsed_data['player_id'] = player['player']['id']
                parsed_data['minutes_played'] = replace_null(player['statistics'][0]['games']['minutes'])
                parsed_data['goals'] = replace_null(player['statistics'][0]['goals']['total'])
                parsed_data['assists'] = replace_null(player['statistics'][0]['goals']['assists'])
                parsed_data['yellow_cards'] = replace_null(player['statistics'][0]['cards']['yellow'])
                parsed_data['red_cards'] = replace_null(player['statistics'][0]['cards']['red'])
                parsed_data['duels_won'] = replace_null(player['statistics'][0]['duels']['won'])
                parsed_data['key_passes'] = replace_null(player['statistics'][0]['passes']['key'])
                parsed_data['saves'] = replace_null(player['statistics'][0]['goals']['saves'])
                assert parsed_data['id'] is not None
                assert parsed_data['player_id'] is not None
                out_arr.append(parsed_data)
    return out_arr


def enter_data(connection, filename):
    items = parse_json(read_json(filename))
    for item in tqdm(items):
        with connection.cursor() as cursor:
            try:
                sql = "INSERT INTO match_stats (fixture_id, player_id, minutes_played, goals, assists, yellow_cards, red_cards, saves, duels_won, key_passes) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
                val = (item['id'], item['player_id'], item['minutes_played'], item['goals'], 
                       item['assists'], item['yellow_cards'], item['red_cards'], item['saves'],
                       item['duels_won'], item['key_passes'])
                cursor.execute(sql, val)
                connection.commit()
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
            enter_data(connection=connection, 
                       filename='data/playerStats.json')
    except Error as e:
        print(e)
