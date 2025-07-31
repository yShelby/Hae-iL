import json
import time

from dictionary.processing import extract_mood_with_dict
from model.predict import two_stage_mood_classification
from model.tags import make_tags_prob_and_map
from model.utils import mood_to_tags_map, custom_combinations
from dictionary.preprocessing_logic.whitespace_replacer import _whitespace_replacer
from dictionary.preprocessing_logic.sentence_splitter import _sentence_splitter

class MoodDiaryService:
    @staticmethod
    def diary(json_text):
        
        # json str -> dict 형태로 변경
        editor_json = json.loads(json_text)

        # 순수 텍스트 추출
        diary_text = "\n".join(
            text_obj.get("text", "")
            for block in editor_json.get("content", [])
            for text_obj in block.get("content", [])
            if text_obj.get("type") == "text"
        )

        # text 전체 공백 처리
        diary_text = _whitespace_replacer(diary_text)

        # 문장 분리 실행
        sentences = _sentence_splitter(diary_text)

        print(sentences)

        #==================================================#

        # AI LLM 모델 호출 (최대 2번 재시도)
        max_retries = 2 # 최대 2번 순환
        retry_count = 0 # 초기값

        while retry_count < max_retries:

            try: # AI LLM 모델 호출
                # raise Exception("ai LLM 파인튜닝 중")

                result = two_stage_mood_classification(json_text) # 이후 청크 로직 재수정
                result_dict = extract_mood_with_dict(sentences)

                polarity = result.get("polarity_result", 0)
                labels = result.get("labels", []) # tuple 형태
                tags = result_dict.get("tag", []) # 사전

                # 기존 커스터마이징 tag
                # tags = make_tags_prob_and_map(detailed_moods, mood_to_tags_map, threshold=0.1)
                # sentiment_probs = result.get("sentiment_probs", {})
                # top3_moods = tuple([emo for emo, _ in detailed_moods[:3]])
                # custom_tags = custom_combinations.get(top3_moods, [])

                return_result = {
                    "mood_score" : polarity,
                    "details" : [{"mood_type": label, "percentage":round(prob * 100, 2)} for label, prob in labels],
                    "tags": tags,
                    # "sentiment_probs": sentiment_probs,
                    # "custom_tags": custom_tags
                }

                print(return_result)

                return return_result

            except ConnectionError as network_error:
                retry_count += 1
                print(f"네트워크 오류 발생 (시도 {retry_count}/{max_retries}): {network_error}")
                if retry_count < max_retries:
                    # 재시도 전 잠시 대기 (백오프 전략)
                    wait_time = 2 ** (retry_count - 1)  # 1초, 2초, 4초...
                    print(f"{wait_time}초 후 재시도...")
                    time.sleep(wait_time)
                else:
                    print("최대 재시도 횟수 초과, 감성사전 방식으로 전환")
                    break
            except Exception as other_error:
                # 네트워크 오류가 아닌 다른 오류는 바로 감성사전으로 전환
                print(f"AI 모델 오류: {other_error}")
                break

        # ==================================================#

        try : # 호출이 안 될 시 감성사전 분석으로 전환
            result = extract_mood_with_dict(diary_text)

            polarity = result.get("polarity", 0)
            labels = result.get("label", [])
            tags = result.get("tag", [])

            # 샘플 : {'polarity': -84, 'label': [{'label': '슬픔/우울', 'percentage': 47}, {'label': '분노/짜증', 'percentage': 33}, {'label': '불안/걱정', 'percentage': 20}], 'tag': ['#불안한', '#지친']}
            return_result = {
                "mood_score": polarity,  # Spring의 moodScore
                "details": [{"mood_type": item["label"], "percentage": item["percentage"]} for item in labels],
                # Spring의 details
                "tags": tags
            }

            print(return_result)

            return return_result

        except Exception as dict_error:
            print(f"감성사전 처리 오류: {dict_error}")
            # 기본 반환값 또는 오류 처리
            return {
                "mood_score": 0,
                "details": [],
                "tags": []
            }


