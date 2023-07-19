from pathlib import Path
import json

key_file = Path(__file__).with_name("key.json")
assert key_file.exists(), f"Key JSON file not found: {key_file.as_posix()}"

with open(key_file) as f:
    key = json.load(f)
    print(key)