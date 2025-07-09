

# 부정어 처리
    # 부정어가 포함된 sentence index 조회
    # 해당 sentence index의 부정어 개수 조회 (홀수인 경우 부정어 처리, 짝수인 경우 무효)
    # 홀수일 때 : 감정어 index -1 (앞) 또는 +1~+4 (뒤) 범위에서 부정어 검사 
        # -> 조건에 해당될 경우 감정어 무효화(polarity = 0, label = '', tag = '') ex) 싫지 않다, 안 좋다, 실망하지는 않았다 ...


def _negative_processer(emotion_list:list[dict], negative_list:list[dict]) -> list[dict]:
    """
    부정어 + 감정어를 처리하는 함수
    
    Args:
        emotions_list: 감정어 리스트 (sentence_index, word_index 포함)
        negative_list: 부정어 리스트 (sentence_index, word_index 포함)
    
    Returns:
        부정어 처리된 감정어 리스트
    """

    # 1. sentence_index를 참조하여 각 문장별로 부정어 그룹화
    negation_in_sentence = {}

    for neg_item in negative_list : 
        neg_sent_idx = neg_item["sentence_index"]
        negation_in_sentence.setdefault(neg_sent_idx, []).append(neg_item)

    # 2. 부정어 + 감정어 처리
    process_result = []

    for emo_item in emotion_list:
        emo_sent_idx = emo_item["sentence_index"]
        emo_word_idx = emo_item["word_index"]
        
        # 2. 부정어 유무 확인
        if emo_sent_idx not in negation_in_sentence: # 2-1. 해당 문장에 부정어가 없을 경우 : 전체 문장 추가하고 처음부터
            process_result.append(emo_item)
            continue
        else: # 2-2. 부정어가 있는 경우
            negative_words = negation_in_sentence[emo_sent_idx]

            # 3. 부정어 개수 확인 (홀수 : 감정어 처리, 짝수 : 처리 X)
            if len(negative_words) % 2 == 0 : # 짝수
                process_result.append(emo_item)
            else: # 홀수 : 감정어와 거리 기반으로 부정 여부 판단
                is_negated = False # 초기값

                # 4. 부정어가 감정어 index -1 (앞) 또는 +1~+4 (뒤) 범위에 위치했는지 확인
                for neg in negative_words: 
                    neg_position = neg["word_index"] # 부정어 위치

                    # 조건 1 : 부정어가 감정어 index -1 (앞)
                    condtion1 = (neg_position == emo_word_idx - 1)

                    # 조건 2 : 부정어가 감정어 index +1~+3 (뒤)
                    condtion2 = (emo_word_idx + 1 <= neg_position <= emo_word_idx + 4)

                    if condtion1 or condtion2:
                        is_negated = True
                        break
                
                if is_negated:
                    # 5. 감정어 polarity, label, tag 무효화
                    process_result.append({
                        **emo_item,
                        "polarity":0,
                        "label":"",
                        "tag":""
                    })
                else:
                    process_result.append(emo_item)

    return process_result

 







