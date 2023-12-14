import subprocess
import os

# List of script filenames
scripts = ["categories.py", "ingredients.py", "recipes.py", "roomtables.py", "restaurant_information.py"]

# Get the current directory
current_directory = os.path.dirname(os.path.abspath(__file__))

# Execute each script
for script in scripts:
    script_path = os.path.join(current_directory, script)
    subprocess.run(["python", script_path])
