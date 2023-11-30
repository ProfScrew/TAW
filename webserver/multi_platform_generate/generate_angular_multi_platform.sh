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
  cp -r general_config/* $destination_cordova/src/environments/

  # Copy Cordova config files to Cordova project
  cp -r cordova/* $destination_cordova/src/

  cd $destination_cordova/..

  rm -R CookHub

  cordova create ./CookHub it.unive.CookHub CookHub
  cd CookHub
  cordova platform add android
  cd ../angular
  ng build

  cp -r dist/angular/* ../CookHub/www/
  cd ../CookHub

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
  cp -r general_config/* $destination_electron/src/environments/

  # Copy Cordova config files to Electron project
  cp electron/index.html $destination_electron/src/index.html
  cp electron/main.js $destination_electron/main.js
  cp electron/package.json $destination_electron/package.json

  cd $destination_electron

  npm run electron
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
      build_electron
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done
