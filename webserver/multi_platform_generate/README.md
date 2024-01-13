## Generate Multi Platform App

This script will generate an angular app for electron and cordova.

**Prerequisites:**
- If you want to use the generator for the cordova app, you need to install globally ```npm install -g cordova``` and you need to set the path of the android sdk in the script generate_angular_multi_platform

- If you want to use the generator for the electron app, you need to change in the script generate_angular_multi_platform the platform for which you want to generate the app

**How to use:**
- Change in general_config folder the route of the api in the environment file and the socket route in the socket file

- Launch the script with ```./generate_angular_multi_platform [--electron] [--cordova] [--all] [--clean] ```

**After the generation of the app you will find where the build app is located in the terminal output!!**
