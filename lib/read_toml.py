"""Module to store the read toml functions."""

from pathlib import Path
import toml

DATA_PATH = Path('lib') / "patterns.toml"


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
