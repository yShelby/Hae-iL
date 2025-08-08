# label의 Percentage 계산 및 보정 함수
def _percentage_calculator(labels : list[tuple[str, int]], total : int) -> list[dict] :

    # label 결과 생성
    labels_result = [
        {
        "label" : label,
        "percentage" : round((value/total) * 100)
        } 
        for label, value in labels]
    
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

    



    