import json

from dictionary.processing import extract_emotion_with_dict
# from model.predict import two_stage_emotion_classification
# from model.tags import make_tags_prob_and_map
# from model.utils import emotion_to_tags_map, custom_combinations

class EmotionDiaryService:
    @staticmethod
    def diary(diary_text):
        try: # AI LLM 모델 호출
            raise Exception("ai LLM 파인튜닝 중")
            result = two_stage_emotion_classification(diary_text)

            mood_score = result.get("sentiment_result", 0)
            detailed_emotions = result.get("detailed_emotions", []) # 지금 tuple 형태로 나오고 있으므로 수정 필요
            tags = make_tags_prob_and_map(detailed_emotions, emotion_to_tags_map, threshold=0.1)
            # sentiment_probs = result.get("sentiment_probs", {})

            top3_emotions = tuple([emo for emo, _ in detailed_emotions[:3]])
            custom_tags = custom_combinations.get(top3_emotions, [])
            
            return_result = {
                "mood_score" : mood_score,
                "details" : [{"emotion_type": emo, "percentage":round(prob * 100, 2)} for emo, prob in detailed_emotions],
                "tags": tags,
                # "sentiment_probs": sentiment_probs,
                "custom_tags": custom_tags
            }
        except Exception as e: # 호출이 안 될 시 감성사전 호출 (이후 하이브리드 고민)
            result = extract_emotion_with_dict(diary_text)

            mood_score = result.get("polarity", 0)
            detailed_emotions = result.get("label", [])
            tags = result.get("tag", [])

            # 샘플 : {'polarity': -84, 'label': [{'label': '슬픔/우울', 'percentage': 47}, {'label': '분노/짜증', 'percentage': 33}, {'label': '불안/걱정', 'percentage': 20}], 'tag': ['#불안한', '#지친']}
            return_result =  {
                "mood_score" : mood_score,
                "details" : [{"emotion_type": item["label"], "percentage": item["percentage"]} for item in detailed_emotions],
                "tags": tags
            }
            
        return return_result