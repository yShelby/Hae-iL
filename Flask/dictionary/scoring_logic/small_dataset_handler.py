from collections import Counter

from .polarity_calculator import _polarity_calculator
from .percentage_calculator import _percentage_calculator

def _small_dataset_handler(results_mood : list[dict], p_threshold_sa : int, p_threshold_sb : int, last_threshold : int, top_label : int) -> tuple[list[dict], list[dict], list[dict]]:
    """
    
    소량 데이터셋 처리: 마지막 문장의 감정만 추출 
    (최빈도 레이블 수 < min_count)
    
    """
    # 마지막 sentence index 추출
    last_sen_idx = max(item["sentence_index"] for item in results_mood)
    
    # 마지막 문장의 감정어만 필터링 (list[dict])
    last_sen = [item for item in results_mood if item["sentence_index"] == last_sen_idx]

    # 마지막 문장의 word index 추출
    last_word_idx = max(item["word_index"] for item in last_sen)  
    
    # 마지막 감정어 추출 (list[dict])
    last_item = [item for item in last_sen if item["word_index"] == last_word_idx]
    
    # 마지막 감정어만 가중치 (반복적으로 리스트 넣기)
    for _ in range(last_threshold - 1) :
        last_sen.extend(last_item)
        
    # polarity 추출
    polarities = [item["polarity"] for item in last_sen]

    # label 추출
    labels = [item["label"] for item in last_sen] # 라벨 전체 리스트
    last_labels_count = Counter(labels).most_common()[:top_label-1] # 라벨 카운트, 최빈도 순부터 최대 3개까지 출력
    top_labels = set([label for label, _ in last_labels_count]) # 최빈도 라벨 이름 리스트
    total_count = sum(count for _, count in last_labels_count) # total_count 계산

    # tag    
    tags = [item["tag"] for item in last_sen if item["label"] in top_labels] # 태그 전체 리스트
    last_tags_count = Counter(tags).most_common() # 태그 카운트, 최빈도 순으로 정렬
    
    # 결과 생성
    polarity_result = _polarity_calculator(polarities, p_threshold_sa, p_threshold_sb) # polarity 계산
    labels_result = _percentage_calculator(last_labels_count, total_count) # Percentage 계산 및 보정 후 결과 생성
    tags_result = [tag for tag, _ in last_tags_count] # 태그 도출
    
    return polarity_result, labels_result, tags_result
    