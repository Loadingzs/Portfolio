from flask import Flask, render_template, jsonify, send_from_directory
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'sua_chave_secreta_aqui'

# Rota principal
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)