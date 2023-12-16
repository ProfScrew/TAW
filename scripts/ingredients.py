import pymongo
from bson import ObjectId

# MongoDB connection details
client = pymongo.MongoClient("localhost", 27017)
db = client["CookHub"]
collection = db["Ingredients"]

# Read ingredient data from the file
with open("ingredients.txt", "r") as file:
    for line in file:
        # Splitting each line into separate components
        data = line.strip().split("/")
        ingredient = {
            "name": data[0],
            "modification_price": int(data[1]),
            "modification_percentage": int(data[2]),
            "alergens": [data[3]] if data[3] else []
        }
        ingredient["_id"] = ObjectId()  # Generating ObjectId for each record
        collection.insert_one(ingredient)

print("Ingredients inserted successfully.")
