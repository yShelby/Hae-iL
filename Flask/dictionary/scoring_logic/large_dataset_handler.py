from collections import Counter

from scoring_logic.percentage_calculator import _percentage_calculator
from scoring_logic.polarity_calculator import _polarity_calculator


def _large_dataset_handler(results_emotion : list[dict], labels_count: list[tuple[str, int]], p_threshold_la : int, p_threshold_lb : int, min_count : int, top_label : int, top_tag: int, neutral_threshold : int) -> tuple[list[dict], list[dict], list[dict]]:
    """
    일반 데이터셋 처리
    (레이블 빈도수 >= min_count)
    """
    
    # polarity 추출 및 계산
    polarities = [item["polarity"] for item in results_emotion]
    polarity_result = _polarity_calculator(polarities, p_threshold_la, p_threshold_lb) ##### polarity 결과
    
    # label
    labels_count = [(label, count) for label, count in labels_count if count >= min_count][:top_label] # 빈도수 >= min_count인 레이블만 필터링(최대 3개)
    labels_list = set([label for label, _ in labels_count]) # top 레이블 이름 목록
    labels_count_sum = sum(count for _, count in labels_count) # top 레이블 빈도수 합
    
    # tag
    tags = [item["tag"] for item in results_emotion if item["label"] in labels_list][:top_tag] # top 레이블에 속하는 태그만 추출(최대 7개)
    tags_count = Counter(tags).most_common() # 태그 카운트, 최빈도 순 정렬
    tags_result = [item for item, _ in tags_count] ##### tag 결과
    
    
    # 1. 레이블에 "중립/기타" 추가 분기
    if len(labels_count) < top_label and labels_count_sum < neutral_threshold and -15 <= polarity_result <= 15: # 레이블이 2개 이하 & 레이블 빈도수의 합이 9 미만 & polarity 중립(-15~15)
        
        # 중립 레이블 및 카운트 생성
        neutral_label = "중립/기타"
        neutral_count = neutral_threshold - labels_count_sum # 백분위를 위해 인위적 카운트 생성
        
        # 기존 레이블에 추가
        neutral_labels_count = labels_count.copy() # neutral_labels_count 생성
        neutral_labels_count.append((neutral_label, neutral_count)) # 기존의 레이블 리스트에 추가
        neutral_labels_count.sort(key=lambda token:token[1], reverse=True) # count를 빈도순으로 재정렬
        
        labels_result = _percentage_calculator(neutral_labels_count) ##### label 결과
            
    # 2. 해당이 없는 경우
    else : 
        labels_result = _percentage_calculator(labels_count) ##### label 결과

    return polarity_result, labels_result, tags_result