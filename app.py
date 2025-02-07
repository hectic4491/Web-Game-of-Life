"""Flask is our WSGI framework.
lib.main is our backend processes"""

from flask import Flask, render_template, jsonify, request
from lib.simulation import Simulation
from lib.read_toml import get_pattern_array


app = Flask(__name__)

@app.route("/")
def index():
    """Index URL
    The main webpage.
    """
    return render_template("index.html")


@app.route('/simdata', methods=['GET', 'POST'])
def simdata():
    """Data URL
    Used to retrieve Simulation Data.
    """
    # number of columns, i.e. length of a row = 82
    # number of rows, i.e length of a column = 36
    # pattern = get_pattern_array("Toad")

    if request.method == 'POST':
        pattern_name = str(request.form.get('Pattern'))
        if pattern_name != "Random":
            pattern = get_pattern_array(pattern_name)

            data = Simulation(height = 36,
                            width= 82,
                            steps = 300,
                            pattern=pattern
                            ).render_data

        else:
            data = Simulation(height = 36,
                width= 82,
                steps = 300,
                ).render_data

    elif request.method == 'GET':
        data = Simulation(height = 36,
                        width= 82,
                        steps = 300,
                        ).render_data

    else:
        data = Simulation(height = 36,
                width= 82,
                steps = 300,
                ).render_data

    return jsonify(data)


if __name__ =="__main__":
    app.run(debug=True)
