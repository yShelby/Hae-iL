from model.predict import two_stage_mood_classification # 분석 모델
from dictionary.scoring_logic.percentage_calculator import _percentage_calculator # percentage 계산

def _ai_weighted_calculator(chunks, tokens, total_token, top_k = 3) :
    weighted_polarity_sum = 0
    weighted_labels_sum = {} # dict 형태

    for chunk, token in zip(chunks, tokens):
        chunk_result = two_stage_mood_classification(chunk)  # AI LLM을 이용한 감정점수, 세부감정 라벨 추출

        # 1. polarity 점수 계산
        weighted_polarity_sum += chunk_result.get("polarity_result", 0) * token # 토큰 수를 가중치로 둔 polarity 점수 계산

        # 2. label별 probs 계산
        for label, prob in chunk_result.get("labels", []): # tuple 형태 (label, prob)
            # 가중치 적용 (dict 형태)
                # label을 키값으로 만듦
                    # 기존값 : weighted_labels_sum에 동일한 label 키가 있으면 그 값을 부름. 없다면 0으로 설정
                    # 새로운 가중치 값 : prob * token
            weighted_labels_sum[label] = weighted_labels_sum.get(label, 0) + prob * token # { 기쁨/행복 : 0.6, 슬픔/우울: 0.3, ...}

    # 1-2. 가중 평균 polarity 계산
    weighted_polarity = round(weighted_polarity_sum / total_token) if total_token and total_token > 0 else 0 # total_token이 null이거나 0일 때는 0으로 반환

    # 2-2. label을 빈도수로 정렬
    sorted_labels = sorted(weighted_labels_sum.items(), key=lambda x:x[1], reverse=True) # [(기쁨/행복, 0.6), (슬픔/우울, 0.3)...]

    weighted_labels = _percentage_calculator(sorted_labels, total_token)

    return {
        "polarity_result" : weighted_polarity,
        "labels" : [{"mood_type": item["label"], "percentage": item["percentage"]} for item in weighted_labels]
    }
