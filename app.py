from flask import Flask, render_template
from lib.main import GenArray

app = Flask(__name__)

@app.route("/")
def hello_world():
    return GenArray([10,10], 100).genArray

