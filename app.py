"""Flask is our WSGI framework.
lib.main is our backend processes"""

from flask import Flask, render_template, jsonify, request
from lib.simulation import Simulation
from lib.read_toml import get_pattern_array


app = Flask(__name__)


blinker = [[3, 3], [4, 3], [5, 3]]

@app.route("/")
@app.route("/home")
def home():
    """Home URL
    The main webpage.
    """
    return render_template("home.html")


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
        print(f"DEBUG!!!: {pattern_name}") # this is returning as none.
        pattern = get_pattern_array(pattern_name)

        data = Simulation(height = 36,
                        width= 82,
                        steps = 300,
                        pattern=pattern
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


## Travis' initial Code

# @app.route("/")
# def root():
#   return render_template("app.html")

# # Doesn't provide explicit error handling for none POST case.
# # Unsure if sepcifying only POST prevents GET requests,
# # which may be desired. Should test this to see how it
# # behaves when we throw certains verbs and invalid formats at it.
# @app.route("/simulation", methods=['POST'])
# def simulation():
#   if request.method == 'POST':
#     # Naturally, form params are read from the html file; so their strings.
#     # Parse the values to int as we read them from the request.
#     matrixRows = int(request.form.get('matrixRows'))
#     matrixColumns = int(request.form.get('matrixColumns'))
#     sequenceLength = int(request.form.get('sequenceLength'))

#     return GenArray([matrixColumns, matrixRows], sequenceLength).genArray
