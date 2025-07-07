from flask import request, jsonify, Blueprint
from service.emotion_service import EmotionDiaryService
import traceback

emotion_blueprint = Blueprint('emotion', __name__)

@emotion_blueprint.route("/diary", methods=["POST"])
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