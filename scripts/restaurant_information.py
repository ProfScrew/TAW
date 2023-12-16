import pymongo

# MongoDB connection details
client = pymongo.MongoClient("localhost", 27017)
db = client["CookHub"]
collection = db["RestaurantInformations"]

# Record to insert
record = {
    "name": "CookHub",
    "address": "Galileo",
    "phone": "3456787654",
    "email": "cook@hub.com",
    "logo": "logo",
    "iva": "3436535634",
    "charge_per_person": 12
}

# Insert record into the RestaurantInformations collection
result = collection.insert_one(record)
print(f"Record inserted with ObjectId: {result.inserted_id}")