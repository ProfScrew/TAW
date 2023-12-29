import pymongo
import execjs

# MongoDB connection setup
client = pymongo.MongoClient("mongodb://localhost:27017/")  
db = client["CookHub"]
collection = db["Users"]



# JavaScript code
javascript_code = """
const crypto = require('crypto');

const HASH_METHOD ='sha512';

function setPassword(password) {
    const result = {};

    result.password_salt = crypto.randomBytes(16).toString('hex');

    const hash = crypto.createHmac(HASH_METHOD, result.password_salt);
    hash.update(password);

    result.password_hash = hash.digest('hex');

    return result;
}
"""


def generate_password_hash(password):
    # Initialize PyExecJS context
    ctx = execjs.compile(javascript_code)

    # Call the JavaScript function and get the result
    result = ctx.call("setPassword", password)

    return result["password_salt"], result["password_hash"]


def parse_user_info(user_info):
    user_info = user_info.strip().split("/")
    username, password, name, surname, phone, roles = user_info[0], user_info[1], user_info[2], user_info[3], user_info[4], user_info[5]
    role_info = roles.split(":")[1] if ":" in roles else ""
    role_data = {
        "admin": role_info[0] == "T",
        "waiter": role_info[1] == "T",
        "production": role_info[2] == "T",
        "cashier": role_info[3] == "T",
        "analytics": role_info[4] == "T"
    }
    return {
        "username": username,
        "password": password,
        "name": name,
        "surname": surname,
        "phone": phone,
        "role": role_data
    }


def read_users_from_file(file_name):
    users = []
    with open(file_name, 'r') as file:
        lines = file.readlines()
        for line in lines:
            user_data = parse_user_info(line)
            users.append(user_data)
    return users


def insert_users_into_db(users):
    for user_data in users:
        password = user_data.pop("password")
        password_salt, password_hash = generate_password_hash(password)
        user_data["password_salt"] = password_salt
        user_data["password_hash"] = password_hash
        user_data["category"] = []
        user_data["room"] = []
        insert_result = collection.insert_one(user_data)
        #if insert_result.inserted_id:
            #print("User inserted successfully with ID:", insert_result.inserted_id, " name:", user_data["name"])
            #do nothing
        #else:
        #    print("Failed to insert user.")


if __name__ == "__main__":
    file_name = "users.txt"
    users_info = read_users_from_file(file_name)
    insert_users_into_db(users_info)
    print("Users inserted successfully.")
