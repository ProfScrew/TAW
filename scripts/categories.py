import pymongo

# MongoDB connection details
client = pymongo.MongoClient("localhost", 27017)
db = client["CookHub"]
collection = db["Categories"]

# Read categories from the file and insert into the database
with open("categories.txt", "r") as file:
    categories = file.readlines()
    for category in categories:
        category_data = category.strip().split("/")
        category_doc = {
            "name": category_data[0],
            "color": category_data[1],
            "order": int(category_data[2])
        }
        # Insert the category into the collection
        collection.insert_one(category_doc)

print("Categories inserted successfully.")
