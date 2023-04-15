from mysql.connector import connect, Error
import json

def read_json(filename):
    with open(filename, 'r') as f:
        data = json.load(f)
        return data


def enter_data(connection, filename):
    items = read_json(filename)['response']
    for item in items:
        team = item.get('team')
        if team:
            with connection.cursor() as cursor:
                sql = "INSERT INTO physical_team (id, name) VALUES (%s, %s)"
                cursor.execute(sql, (team['id'], team['name']))
                print(f"Inserted team: {team}")
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
                       filename='data/teams.json')
    except Error as e:
        print(e)
