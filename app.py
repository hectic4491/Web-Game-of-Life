"""Flask is our WSGI framework.
lib.main is our backend processes"""

from flask import Flask, render_template, jsonify
from lib.simulation import Simulation


app = Flask(__name__)


@app.route("/")
@app.route("/home")
def home():
    """Home URL
    The main webpage.
    """
    return render_template("home.html")


@app.route('/simdata')
def simdata():
    """Data URL
    Used to retrieve Simulation Data.
    """
    # number of columns, i.e. length of a row = 82
    # number of rows, i.e length of a column = 36
    data = Simulation(height = 36, width= 82, steps = 100).render_data
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
