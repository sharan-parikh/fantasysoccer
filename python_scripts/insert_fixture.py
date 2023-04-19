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
    response = data['response']
    for item in response:
        parsed_data = {}
        fixture = item['fixture']
        teams = item['teams']
        # league = item['league']
        # goals = item['goals']
        # score = item['score']

        parsed_data['id'] = fixture['id']
        parsed_data['venue_id'] = fixture['venue']['id']
        parsed_data['match_date'] = datetime.fromisoformat(fixture['date'])
        parsed_data['home_team_id'] = teams['home']['id']
        parsed_data['away_team_id'] = teams['away']['id']
        out_arr.append(parsed_data)
    return out_arr
    


def enter_data(connection, filename):
    items = parse_json(read_json(filename))
    for item in tqdm(items):
        with connection.cursor() as cursor:
            try:
                sql = "INSERT INTO fixture (id, venue_id, match_date, home_team_id, away_team_id) VALUES (%s, %s, %s, %s, %s)"
                cursor.execute(sql, (item['id'], item['venue_id'], item['match_date'], item['home_team_id'], item['away_team_id']))
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
            # result = parse_json(read_json('data/fixtures.json'))
            # pprint(result)
            enter_data(connection=connection, 
                       filename='data/fixtures.json')
    except Error as e:
        print(e)
