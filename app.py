# pylint: skip-file
"""Flask is our WSGI framework.
lib.main is our backend processes"""

import json
from flask import Flask, render_template, jsonify, request
from lib.simulation import Simulation
from lib.read_toml import get_pattern_array, get_patterns


app = Flask(__name__)

@app.route("/")
def index():
    """Index URL
    The main webpage.
    """
    return render_template("index.html")


@app.route('/writepatterns')
def writepatterns():
    """Data URL
    Used to populate the select menu with
    patterns when select-menu-init.js runs.
    """
    data = get_patterns()
    return jsonify(data)


@app.route('/loadsim', methods=['POST'])
def loadsim():
    """Data URL
    Used to answer loadSimulation.
    Returns a simulation object. 
    """

    pattern_name = request.form['PatternName']
    pattern_name = json.loads(pattern_name)

    pattern_data = request.form['PatternData']
    pattern_data = json.loads(pattern_data)
    
    if pattern_name == "Random":
        pattern_data = None     # None is processed as random.

    data = Simulation(height = 50,
                    width= 90,
                    steps = 200,
                    pattern=pattern_data
                    ).render_data
    
    return jsonify(data)


@app.route('/simdata', methods=['POST'])
def simdata():
    """Data URL
    Used to answer fetchSimulation.
    Returns a simulation object. 
    """
    # number of rows, i.e length of a column = 36
    # number of columns, i.e. length of a row = 82
    # pattern = get_pattern_array("Toad")

    pattern_name = str(request.form.get('PatternName'))

    print(f"Pattern Name: {pattern_name}")

    if pattern_name == "Drawn":
        drawn_pattern = request.form.get('DrawnPattern')  # this should be a 2D array
        pattern = json.loads(drawn_pattern)
        print(f"This is pattern: {pattern}")
    elif pattern_name != "Random":
        pattern = get_pattern_array(pattern_name)
    else:
        pattern = None    # None is processed as random.

    data = Simulation(height = 50,
                    width= 90,
                    steps = 200,
                    pattern=pattern
                    ).render_data

    return jsonify(data)


if __name__ =="__main__":
    app.run()