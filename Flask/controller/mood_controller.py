from flask import request, jsonify, Blueprint
from service.mood_service import EmotionDiaryService
import traceback

# 1. 블루프린트 객체 생성
emotion_blueprint = Blueprint('emotion', __name__)
# 2. 라우트 등록
@emotion_blueprint.route("/analyze", methods=["POST"])
def diary_text():
    try:
        data = request.json
        text = data.get("text", "")
        if not text:
            return jsonify({"error": "텍스트가 없습니다."}), 400
        
        response_json = EmotionDiaryService.diary(text)
        
        return jsonify(response_json)
    except Exception as e:
        print("서버에러:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500