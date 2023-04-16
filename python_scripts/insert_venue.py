from mysql.connector import connect, Error
import json
from tqdm import tqdm
from pprint import pprint

def read_json(filename):
    with open(filename, 'r') as f:
        data = json.load(f)
        return data
        

def enter_data(connection, filename):
    data = read_json(filename)
    for venue in tqdm(data['venues']):
        with connection.cursor() as cursor:
            cursor.execute(f"INSERT INTO venue (id, name, address, country, capacity) VALUES ({venue['id']}, '{venue['name']}', '{venue['address']}', '{venue['country']}', {venue['capacity']})")
            # pprint(venue['name'])
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
                       filename='data/venues.json')
            connection.close()
    except Error as e:
        print(e)
