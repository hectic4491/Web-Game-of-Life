"""Module to store the read toml functions."""
import toml
import os

if "PYTHONANYWHERE_SITE" in os.environ:
    # This is the data path when I deploy the app on pythonanywhere.
    DATA_PATH = "mysite/lib/patterns.toml"
else:
    # This is the data path when I run the app locally.
    DATA_PATH = "lib/patterns.toml"


def get_pattern_names():
    """Reads the pattern names."""
    with open(DATA_PATH, 'r', encoding="utf8") as f:
        patterns = toml.load(f)
    return patterns.keys()


def get_pattern_array(pattern_name):
    """Reads the pattern array."""
    with open(DATA_PATH, 'r', encoding="utf8") as f:
        pattern_array = toml.load(f)
    return pattern_array[pattern_name]['alive_cells']


def get_patterns():
    """Returns all pattern data."""
    with open(DATA_PATH, 'r', encoding="utf8") as f:
        patterns = toml.load(f)
    return patterns


### Example Code ###
if __name__ == '__main__':
    names = get_pattern_names()
    array = get_pattern_array("Toad")
    print(names)
    print(array)
