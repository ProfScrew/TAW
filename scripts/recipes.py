import pymongo
from bson import ObjectId

# MongoDB connection details
client = pymongo.MongoClient("localhost", 27017)
db = client["CookHub"]
collection = db["Recipes"]

# Read recipes from the file
with open("recipes.txt", "r") as file:
    recipes = file.readlines()
    for recipe in recipes:
        recipe_data = recipe.strip().split("/")
        category_name, name, description, price, ingredients_str = recipe_data

        # Find the category ID based on the category name
        category = db["Categories"].find_one({"name": category_name})
        if category:
            category_id = category["_id"]
        else:
            # Handle category not found (You may choose to create it if not found)
            print(f"Category '{category_name}' not found.")
            continue

        # Extract ingredient IDs
        ingredient_ids = []
        ingredients_list = ingredients_str.split("|")
        for ingredient_name in ingredients_list:
            ingredient = db["Ingredients"].find_one({"name": ingredient_name})
            if ingredient:
                ingredient_ids.append(ingredient["_id"])
            else:
                # Handle ingredient not found (You may choose to create it if not found)
                print(f"Ingredient '{ingredient_name}' not found.")
        
        # Create the recipe document
        recipe_doc = {
            "name": name,
            "description": description,
            "base_price": int(price[1:]),  # Removing the '$' sign and converting to int
            "category": category_id,
            "ingredients": ingredient_ids
        }
        recipe_doc["_id"] = ObjectId()  # Generate a new ObjectId for the recipe

        # Insert the recipe into the collection
        collection.insert_one(recipe_doc)

print("Recipes inserted successfully.")
