import json

from dictionary.processing import extract_mood_with_dict
# from model.predict import two_stage_mood_classification
# from model.tags import make_tags_prob_and_map
# from model.utils import mood_to_tags_map, custom_combinations

class MoodDiaryService:
    @staticmethod
    def diary(diary_text):
        
        print(diary_text)
        
        try: # AI LLM 모델 호출
            raise Exception("ai LLM 파인튜닝 중")
            result = two_stage_mood_classification(diary_text)

            polarity = result.get("polarity", 0)
            labels = result.get("label", []) # 지금 tuple 형태로 나오고 있으므로 수정 필요
            tags = make_tags_prob_and_map(detailed_moods, mood_to_tags_map, threshold=0.1)
            # sentiment_probs = result.get("sentiment_probs", {})

            top3_moods = tuple([emo for emo, _ in detailed_moods[:3]])
            custom_tags = custom_combinations.get(top3_moods, [])
            
            return_result = {
                "mood_score" : polarity,
                "details" : [{"emotion_type": emo, "percentage":round(prob * 100, 2)} for emo, prob in labels],
                "tags": tags,
                # "sentiment_probs": sentiment_probs,
                # "custom_tags": custom_tags
            }
        except Exception as e: # 호출이 안 될 시 감성사전 호출 (이후 하이브리드 고민)
            result = extract_mood_with_dict(diary_text)

            polarity = result.get("polarity", 0)
            labels = result.get("label", [])
            tags = result.get("tag", [])

            # 샘플 : {'polarity': -84, 'label': [{'label': '슬픔/우울', 'percentage': 47}, {'label': '분노/짜증', 'percentage': 33}, {'label': '불안/걱정', 'percentage': 20}], 'tag': ['#불안한', '#지친']}
            return_result =  {
                "mood_score" : polarity, #Spring의 moodScore
                "details" : [{"mood_type": item["label"], "percentage": item["percentage"]} for item in labels], #Spring의 details
                "tags": tags
            }
            
            print(return_result)
            
        return return_result