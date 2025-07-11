from flask import Flask
from flask_cors import CORS
from controller.emotion_controller import emotion_blueprint

app = Flask(__name__)
CORS(app)

app.register_blueprint(emotion_blueprint)

if __name__ == "__main__":
    app.run(debug=True)