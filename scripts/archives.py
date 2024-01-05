import random
import time
import pymongo
from bson import ObjectId
import datetime


# MongoDB connection details
client = pymongo.MongoClient("localhost", 27017)
db = client["CookHub"]
collectionArchive = db["OrderArchives"]
collectionUsers = db["Users"]
collectionCategories = db["Categories"]
collectionRecipes = db["Recipes"]
collectionTables = db["Tables"]


recipesIds = []
recipesPrices = []
tablesNames = []
tablesCapacity = []

waitersUsernames = []
waiterNames = []
waiterSurnames = []

productionUsernames = []
productionNames = []
productionSurnames = []

charge_per_person = 3


dateBegin = datetime.datetime(2024, 1, 1, 0, 0, 0)
dateEnd = datetime.datetime(2024, 12, 31, 23, 59, 59)



def get_tables():
    tables = list(collectionTables.find({}))
    for table in tables:
        table["_id"] = str(table["_id"])
        tablesNames.append(table["name"])
        tablesCapacity.append(table["capacity"])



def get_recipes():
    recipes = list(collectionRecipes.find({}))
    for recipe in recipes:
        recipe["_id"] = str(recipe["_id"])
        recipesIds.append(recipe["_id"])
        recipesPrices.append(recipe["base_price"])


def get_user():
    user = list(collectionUsers.find({}))
    for u in user:
        u["_id"] = str(u["_id"])

        if "role" in u:
            if u["role"]["waiter"]:
                waitersUsernames.append(u["username"])
                waiterNames.append(u["name"])
                waiterSurnames.append(u["surname"])
            if u["role"]["production"]:
                productionUsernames.append(u["username"])
                productionNames.append(u["name"])
                productionSurnames.append(u["surname"])

        
def init_order_archives():

    #for each day between the range

    days = (dateEnd - dateBegin).days + 1

    for i in range(days):
        date = dateBegin + datetime.timedelta(days=i)
        #random number of orders
        numbersOfOrders = random.randint(1, 4)
        for j in range(numbersOfOrders):
            finalPrice = 0
            #random waiter
            choiseWaiter = random.randint(0, len(waitersUsernames) - 1)
            choosenWaiter = waitersUsernames[choiseWaiter]
            choosenWaiterName = waiterNames[choiseWaiter]
            choosenWaiterSurname = waiterSurnames[choiseWaiter]
            #random table
            choiseTable = random.randint(0, len(tablesNames) - 1)
            chosenTable = tablesNames[choiseTable]
            choosenCapacity = tablesCapacity[choiseTable]
            #random number of people
            numberOfPeople = random.randint(1, choosenCapacity)

            #date of the order
            date = date + datetime.timedelta(hours=random.randint(0, 23), minutes=random.randint(0, 59), seconds=random.randint(0, 59))

            #course
            numberOfCourses = random.randint(1, 5)
            courses = []
            for k in range(numberOfCourses):
                numberOfDishes = numberOfPeople + random.randint(0, 3)
                dishes = []
                for l in range(numberOfDishes):
                    choiceDishNumber = random.randint(0, len(recipesIds) - 1)
                    chosenDish = recipesIds[choiceDishNumber]
                    chosenDishPrice = recipesPrices[choiceDishNumber]

                    choosenProductionNumberDish = random.randint(0, len(productionUsernames) - 1)
                    choosenProductionDish = productionUsernames[choosenProductionNumberDish]
                    choosenProductionNameDish = productionNames[choosenProductionNumberDish]
                    choosenProductionSurnameDish = productionSurnames[choosenProductionNumberDish]
                    
                    tempDishDate = date + datetime.timedelta(minutes=random.randint(0, 59), seconds=random.randint(0, 59))
                    tempDish = {
                        "_id": ObjectId(),
                        "recipe": chosenDish,
                        "actual_price": chosenDishPrice,
                        "logs_status":{
                            "start_cooking": {
                                "actor": {
                                    "username": choosenProductionDish,
                                    "name": choosenProductionNameDish,
                                    "surname": choosenProductionSurnameDish,
                                },
                                "timestamp":  tempDishDate,
                            },
                            "finish_cooking": {
                                "actor": {
                                    "username": choosenProductionDish,
                                    "name": choosenProductionNameDish,
                                    "surname": choosenProductionSurnameDish,
                                },
                                "timestamp": tempDishDate + datetime.timedelta(minutes=random.randint(0, 59), seconds=random.randint(0, 59)),
                            },
                        },
                        "modifications": [],
                    }
                    dishes.append(tempDish)
                    finalPrice += chosenDishPrice

                
                choosenProductionNumber = random.randint(0, len(productionUsernames) - 1)
                choosenProduction = productionUsernames[choosenProductionNumber]
                choosenProductionName = productionNames[choosenProductionNumber]
                choosenProductionSurname = productionSurnames[choosenProductionNumber]

                dateReadyCourse = date + datetime.timedelta(minutes=random.randint(0, 59), seconds=random.randint(0, 59))

                tempCourse = {
                    "_id": ObjectId(),
                    "logs_course": {
                        "created_course": {
                            "actor": {
                                "username": choosenWaiter,
                                "name": choosenWaiterName,
                                "surname": choosenWaiterSurname,
                            },
                            "timestamp": date,
                        },
                        "served_course": {
                            "actor": {
                                "username": choosenWaiter,
                                "name": choosenWaiterName,
                                "surname": choosenWaiterSurname,
                            },
                            "timestamp": dateReadyCourse + datetime.timedelta(minutes=random.randint(0, 10), seconds=random.randint(0, 59)),
                        },
                        "ready_course": {   
                            "actor": {
                                "username": choosenProduction,
                                "name": choosenProductionName,
                                "surname": choosenProductionSurname,
                            },
                            "timestamp": dateReadyCourse,
                        },
                    },
                    "dishes": dishes,
                }
                courses.append(tempCourse)


            finalPrice = finalPrice + charge_per_person * numberOfPeople
            #insert into db
            record = {
                "_id": ObjectId(),
                "tables": [chosenTable],
                "guests": numberOfPeople,
                "capacity": choosenCapacity,
                "logs_order": {
                    "created_order": {
                        "actor": {
                            "username": choosenWaiter,
                            "name": choosenWaiterName,
                            "surname": choosenWaiterSurname,
                        },
                        "timestamp": date,
                    }
                },
                "courses": courses,
                "charges_persons": charge_per_person*numberOfPeople,
                "final_price": finalPrice

            }

            result = collectionArchive.insert_one(record)
            if result.inserted_id:
                print("Inserted order archive with id: " + str(result.inserted_id)+ " date: " + str(date) + " numberOfOrder " + str(j) )


if __name__ == "__main__":
    get_recipes()
    get_tables()
    get_user()

    print(productionUsernames)
    #wait 5 second
    time.sleep(2)
    init_order_archives()
