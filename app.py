from flask import Flask, render_template
from lib.main import GenArray

app = Flask(__name__)

@app.route("/")
def root():
    return render_template("app.html")

@app.route("/simulation")
def simulation():
    return GenArray([10,10], 100).genArray
