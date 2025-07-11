import math

def _polarity_calculator(polarities : list[int], p_threshold_a : int, p_threshold_b : int) -> int:
    pol_positive = sum([pol for pol in polarities if pol > 0])
    pol_negative = sum([pol for pol in polarities if pol < 0])
    n_pol = len(polarities)
    
    # polarity 점수 계산
        # 분모 가중치 : 입력 글자 수가 적을 때를 고려
    raw_score = ((pol_positive + pol_negative + p_threshold_a) / (n_pol + p_threshold_b)) * 100 # a = 분자 가중치, b = 분모 가중치
    
    # Ceil (negative에 좀 더 보수적으로 처리)
        # 감정사전 : 긍정단어 < 부정단어 (1:1.92)
        # 비율 가중치 넣는 것을 고려하였으나, 넣지 않은 것이 실제 결과와 유사함
    if raw_score >= 0:
        pol_score = math.ceil(raw_score)
    else:
        pol_score = math.ceil(raw_score)
        
    # 점수 범위 : -100 ~ 100으로 제한
    pol_score = max(min(pol_score, 100), -100) # 상한선 : 100, 하한선 : -100
    
    return pol_score
