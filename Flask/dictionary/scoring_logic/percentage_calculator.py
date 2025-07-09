# label의 Percentage 계산 및 보정 함수
def _percentage_calculator(labels_count : list[tuple[str, int]]) -> list[dict] :
    
    # Percentage 계산
    total_count = sum(count for _, count in labels_count)
    
    # label 결과 생성
    labels_result = [
        {
        "label" : label,
        # "count" : count,
        "percentage" : round((count/total_count) * 100)
        } 
        for label, count in labels_count]
    
    # Percentage 보정
    total_percentage = sum([item["percentage"] for item in labels_result]) #전체 percentage 합계
    
    diff = 100 - total_percentage
    
    if diff != 0:
        if diff > 0: # 총합이 99 이하
            labels_result[0]["percentage"] += diff # 가장 빈도수가 높은 라벨링에 diff(양수) 더하기
        else : # 총합이 101 이상
            last_idx = len(labels_result) - 1
            labels_result[last_idx]["percentage"] += diff # 가장 빈도수가 낮은 라벨링에 diff(음수) 더하기
            
    return labels_result

    



    