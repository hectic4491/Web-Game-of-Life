from flask import Flask, render_template, request, jsonify
from lib.main import GenArray

app = Flask(__name__)

@app.route("/")
def root():
  return render_template("app.html")

# Doesn't provide explicit error handling for none POST case.
# Unsure if sepcifying only POST prevents GET requests,
# which may be desired. Should test this to see how it
# behaves when we throw certains verbs and invalid formats at it.
@app.route("/simulation", methods=['POST'])
def simulation():
  if request.method == 'POST':
    # Naturally, form params are read from the html file; so their strings.
    # Parse the values to int as we read them from the request.
    matrixRows = int(request.form.get('matrixRows'))
    matrixColumns = int(request.form.get('matrixColumns'))
    sequenceLength = int(request.form.get('sequenceLength'))

    return GenArray([matrixColumns, matrixRows], sequenceLength).genArray


### Rob's stuff ###


# This routes to the page rob has been working on.
# This page shows the intended design of the web-app.
# We can change the route to the root "/" later.
#
@app.route("/home")
def home():
  #GenArray([36, 82], 100).genArray
  return render_template("home.html")

@app.route('/simdata')
def simdata():
  data = GenArray([82, 36], 300).genArray
  return jsonify(data)

# This code is just so I can run the program through
# the "run python file" button in VScode.
if __name__ =="__main__":
  app.run(debug=True)

