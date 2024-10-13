from flask import Flask, render_template, request
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

        return GenArray([matrixRows, matrixColumns], sequenceLength).genArray
