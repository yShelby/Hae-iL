from flask import Flask
from flask_cors import CORS
from controller.emotion_controller import emotion_blueprint

app = Flask(__name__) # Flask 앱 생성
CORS(app) # CORS 허용 → 프론트 React에서 요청 가능

app.register_blueprint(emotion_blueprint) # 감정 라우터 등록

if __name__ == "__main__":
    app.run(debug=True)