from model.predict import two_stage_emotion_classification
from model.tags import make_tags_prob_and_map
from model.utils import emotion_to_tags_map, custom_combinations

class EmotionDiaryService:
    @staticmethod
    def diary(text):
        result = two_stage_emotion_classification(text)

        mood_score = result.get("sentiment_result", 0)
        sentiment_probs = result.get("sentiment_probs", {})
        detailed_emotions = result.get("detailed_emotions", [])
        tags = make_tags_prob_and_map(detailed_emotions, emotion_to_tags_map, threshold=0.1)

        top3_emotions = tuple([emo for emo, _ in detailed_emotions[:3]])
        custom_tags = custom_combinations.get(top3_emotions, [])

        print("태그지롱",tags)
        print("세부감정", detailed_emotions)
        print("details", [{"mood_type": emo, "percentage":round(prob * 100, 2)} for emo, prob in detailed_emotions])

        return {
            "mood_score" : mood_score,
            "details" : [{"mood_type": emo, "percentage":round(prob * 100, 2)} for emo, prob in detailed_emotions],
            "tags": tags,
            "sentiment_probs": sentiment_probs,
            "custom_tags": custom_tags
        }