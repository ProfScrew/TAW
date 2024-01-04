import subprocess
import os
import sys

# Get the Python interpreter path
python_executable = sys.executable

# List of script filenames
scripts = [
    "categories.py",
    "ingredients.py",
    "recipes.py",
    "roomtables.py",
    "restaurant_information.py",
    "users.py",
    "archives.py",
]

# Get the current directory
current_directory = os.path.dirname(os.path.abspath(__file__))

# Execute each script
for script in scripts:
    script_path = os.path.join(current_directory, script)
    subprocess.run([python_executable, script_path])
