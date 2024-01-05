# TAW
## Setup Guide:
In order to run this application you will only need the docker.

By typing the following comand into the terminal(in the project folder):

``` docker-compose up ```

Also it is essential to have data for the database, so we have provided simple python
scripts to fill the database with information.

Note: START THE SCRIPTS AFTER THE CONTAINERS ARE ALL UP

To start the scripts you will have to navigate to the script folder

``` cd script```

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

Note: that if you want to use all the features in one account you can use the 'admin' account

# Generate Cordova and Electron Application
For build and generate starting from angular app the cordova and electron app you have to see the README.md in the folder multi_platform_generate

# Useful commands
- docker-compose up # start all container with log
- docker-compose down # stop all container
- docker-compose down --rmi all -v --remove-orphans # stop all container and remove images
- docker exec -it <container-name-or-id> sh

