# CookHub Project TAW 2022/23
## Setup Guide Production Branch:
In order to run this application you will only need docker and docker-compose that you can install from the major repositories.

After you have installed docker and docker-compose you can type the following comand into the terminal for start the project(in the project folder):

``` docker-compose up ```

After the startup of all the container data are already present in the database because are loaded from the volumes, so you can start to use the application (the users you have to use are show in the next table).

**Possible-Erros**: If there are some problem with the database you can delete the volume of the database and restart the project, remember after that to start the populate data script.

We have provided simple python scripts to fill the database with information (if you not have it, please install python3).

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

**Security-Note**: If you want to limit the number of the open ports you can edit the docker-compose file and remove from backend, frontend and mongodb container the External Network, in this way you can only access to these container from the reverse-proxy (IMPORTANT: The first time you run docker-compose up you must hold external network because the container need to download their dependency after that you can remove)

# Generate Cordova and Electron Application
For build and generate starting from angular app the cordova and electron app you have to see the README.md in the folder multi_platform_generate

# Useful commands for docker and docker-compose
- docker-compose up # start all container with log
- docker-compose down # stop all container
- docker-compose down --rmi all -v --remove-orphans # stop all container and remove images
- docker exec -it <container-name-or-id> sh
