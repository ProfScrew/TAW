# CookHub Project TAW 2022/23
## Development Branch Setup Guide
In order to run this application you will only need docker and docker-compose that you can install from the major repositories.

### Running the Application
After installing Docker and Docker Compose, navigate to the project folder in your terminal and execute the following command:

``` docker-compose up ```

### Database Initialization

It's crucial to have data in the database. For this purpose, we've provided simple Python scripts to populate the database. Ensure Python3 and PIP is installed before proceeding.

**Note: Running the scripts requires a Node.js runtime on your Linux system for parts of the script where user passwords are encrypted. If you are unable or unwilling to install the Node runtime, you can manually start each script in the order listed in the init.py file. However, refrain from starting the users.py script, as you will need to manually insert user data into the database. Also, do not start the archives.py script if you do not have accounts in the database with the waiter and production roles.**

Use the MongoDB shell or Compass to access the database and insert data. Below is an example document:

```json
{
  "_id": {
    "$oid": "65a5538db73ca1900f71e7c5"
  },
  "username": "admin",
  "name": "admin",
  "surname": "admin",
  "phone": "3506342301",
  "role": {
    "admin": true,
    "waiter": true,
    "production": true,
    "cashier": true,
    "analytics": true
  },
  "password_salt": "4ce97b495c8537910950e55e85c02674",
  "password_hash": "3ac7ab67ed48d928f063a6f60105ef5152b1a6d7826d3af1d64415fc44e305ffe3c741cf4976391deee899106c4c43182decf69c0e61eecb1be3f6828d9f087c",
  "category": [],
  "room": []
}
```

**Alternatively, if you have Node.js installed, follow the instructions below.**

**Note**: START THE SCRIPTS AFTER THE CONTAINERS ARE ALL UP

To start the scripts you will have to navigate to the script folder

``` cd scripts```

Create a virtual environment for the python scripts:

``` python3 -m venv venv ```

``` source venv/bin/activate ```

Pay attention to the requirements of the python script:

``` pip3 install -r requirements.txt ```

Execute the following line to start the python scripts
this will initialize all the data for the application:

``` python3 init.py ```

Also you can start each indivitual script individualy.

Here is the table of the users generate by the script(you can also find them in the user.txt):

| **Username**   | **Password** | **Name**  | **Surname**  | **Role**   |
| -------------- | ------------ | --------- | ------------ | ---------- |
| admin          | password     | admin     | admin        | all        |
| JoeyAdmin      | password     | Joey      | Tribbiani    | admin      |
| RachelWaiter   | password     | Rachel    | Green        | waiter     |
| GuntherWaiter  | password     | Gunther   | Unknown      | waiter     |
| JaniceWaiter   | password     | Janice    | Hosenstein   | waiter     |
| EddieWaiter    | password     | Eddie     | Menuek       | waiter     |
| PhibyBartender | password     | Phiby     | Buffay       | production |
| MonicaCook     | password     | Monica    | Geller       | production |
| JoeyCook       | password     | Joey      | Watson       | production |
| EmilyCook      | password     | Emily     | Watson       | production |
| ChandlerCashier| password     | Chandler  | Bing         | cashier    |
| RossAnalitics  | password     | Ross      | Geller       | analitics  |

**Note**: If you want to use all the features in one account you can use the 'admin' account, that have all the role.

**Possible-Erros**: Rarely happen when we syncronize the volume of the database with the volume in github that corrupted the database and mongo exit with an error code, in this case you can solve the problem by deleting the volume of the database and restart the project, remember after that to start the populate data script.


# Useful commands for docker and docker-compose
- docker-compose up # start all container with log
- docker-compose down # stop all container
- docker-compose down --rmi all -v --remove-orphans # stop all container and remove images
- docker exec -it <container-name-or-id> sh
