import pymongo
from bson import ObjectId

# MongoDB connection details
client = pymongo.MongoClient("localhost", 27017)
db = client["CookHub"]
rooms_collection = db["Rooms"]
tables_collection = db["Tables"]

# Variable to set the number of rooms to insert
num_rooms = 5

# Insert rooms
for i in range(1, num_rooms + 1):
    room_doc = {
        "name": str(i)
    }
    # Insert room into the Rooms collection
    result = rooms_collection.insert_one(room_doc)
    print(f"Room {i} inserted with ObjectId: {result.inserted_id}")

# Insert tables and assign them to rooms
for i in range(1, num_rooms + 1):
    for j in range(1, 6):  # Assuming 5 tables per room
        table_doc = {
            "name": f"Table {i}{j}",  # Unique name for each table
            "capacity": 10,
            "room": rooms_collection.find_one({"name": str(i)})["_id"]
        }
        # Insert table into the Tables collection
        result = tables_collection.insert_one(table_doc)
        print(f"Table {i}{j} inserted with ObjectId: {result.inserted_id}")

print("Rooms and tables inserted successfully.")
