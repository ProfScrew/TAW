#!/bin/bash
# Directory of your Angular project
source_angular="../frontend/angular"

# Function to build Cordova project
build_cordova() {
  # Directory of your Cordova project
  destination_cordova="../frontend_cordova/angular"

  # Copy Angular project to Cordova project
  cp -r $source_angular $destination_cordova

  # Copy general config files to Cordova project
  cp general_config/environment.ts $destination_cordova/src/environments/environment.ts
  cp general_config/environment.development.ts $destination_cordova/src/environments/environment.development.ts
  cp general_config/socket.service.ts $destination_cordova/src/app/core/services/socket.service.ts

  # Copy Cordova config files to Cordova project
  cp cordova/index.html $destination_cordova/src/index.html
  cp cordova/main.ts $destination_cordova/src/main.ts

  cd $destination_cordova
  npm install
  cd ../

  rm -R CookHub

  cordova create ./CookHub it.unive.CookHub CookHub
  cd CookHub
  cp ../../multi_platform_generate/cordova/logo.png www/img/logo.png
  cordova platform add android
  cd ../angular
  ng build

  cp -r dist/angular/* ../CookHub/www/
  cd ../CookHub
  cp ../../multi_platform_generate/cordova/config.xml config.xml

  # Set Android SDK path
  export ANDROID_HOME=/home/stefano/Android/Sdk
  export ANDROID_SDK_ROOT=/home/stefano/Android/Sdk
  
  cordova build
}

# Function to build Electron project 
build_electron() {
  # Directory of your Electron project
  destination_electron="../frontend_electron/angular"

  # Copy Angular project to Electron project
  cp -r $source_angular $destination_electron

  # Copy general config files to Electron project
  cp general_config/environment.ts $destination_electron/src/environments/environment.ts
  cp general_config/environment.development.ts $destination_electron/src/environments/environment.development.ts
  cp general_config/socket.service.ts $destination_electron/src/app/core/services/socket.service.ts

  # Copy Cordova config files to Electron project
  cp electron/index.html $destination_electron/src/index.html
  cp electron/main.js $destination_electron/main.js
  cp electron/package.json $destination_electron/package.json

  cd $destination_electron
  npm install

  #Uncomment for run Electron app in development mode
  #npm run electron

  # Uncomment the following lines to build Electron app for production for the platform you want
  # Build Electron app for Windows
  #npm run package-win

  # Build Electron app for Linux
  npm run package-linux

  # Build Electron app for Mac
  #npm run package-mac
}

# Parse command line options
while [[ $# -gt 0 ]]; do
  key="$1"

  case $key in
    -c|--cordova)
      build_cordova
      shift
      ;;
    -e|--electron)
      build_electron
      shift
      ;;
    -a|--all)
      build_cordova
      cd ../../multi_platform_generate/
      build_electron
      shift
      ;;
    -cl|--clean)
      rm -R ../frontend_cordova/angular
      rm -R ../frontend_cordova/CookHub
      rm -R ../frontend_cordova/output
      rm -R ../frontend_electron/angular
      rm -R ../frontend_electron/output
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done