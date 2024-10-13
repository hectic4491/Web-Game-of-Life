from flask import Flask, render_template, request
from lib.main import GenArray

app = Flask(__name__)

@app.route("/")
def root():
    return render_template("app.html")

@app.route("/simulation", methods=['POST'])
def simulation():
    if request.method == 'POST':
        matrixRows = int(request.form.get('matrixRows'))
        matrixColumns = int(request.form.get('matrixColumns'))
        sequenceLength = int(request.form.get('sequenceLength'))

        return GenArray([matrixRows, matrixColumns], sequenceLength).genArray
