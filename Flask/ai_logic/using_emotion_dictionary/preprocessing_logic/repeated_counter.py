import re
from rules.repetition_rules_v1 import REPETITION_RULES # 1단어 반복 의성어 및 의태어 Rules


# 매치 결과를 딕셔너리로 변환하는 헬퍼 함수
def match_result(match : re.Match, index:int, unit:str, full:str, repeated_count:int, sentence:str) : 
     match_dict = {
            "sentence_index": index,
            "base_unit_candidate": unit,
            "matched_text": full,
            "repeat_count": repeated_count,
            "start": match.start(),
            "end":match.end(),
            "text":sentence
            }
     return match_dict


# 문장 하나에서 반복 단어 확인
def repeated_words(index:str, sentence:str, min_repeats:int=2, rules:dict = REPETITION_RULES)->list[dict]:
    """
        sentence:str : each sentence
        min_repeats:int=2 : 같은 문자열이 2번 이상 반복된 경우 탐지
        
    """   
    
    # 각 단어당 순회
    pattern = re.compile(rf"(\w+)\1{{{min_repeats - 1},}}"
                         rf"|([!?.,])\2{{{min_repeats - 1},}}"
                         rf"|([\u3131-\u318E])\3{{{min_repeats - 1},}}")
    matches = pattern.finditer(sentence) # pattern method를 사용해 re.Match Object 생성
    
    result = []
    for match in matches:
        
        #unit
        if match.group(1):  # 일반 단어 그룹
            unit = match.group(1)
        elif match.group(2):  # 특수문자 그룹
            unit = match.group(2)
        elif match.group(3):  # 한글 자음/모음 그룹
            unit = match.group(3)
            
        full = match.group()
        repeated_count = len(full) // len(unit)
        
        # 단어가 rules에 있으면 해당 단어 임계값으로 필터링 함
        if unit in rules:
            threshold = rules[unit].get("threshold", min_repeats)
            if repeated_count < threshold:
                continue
        
        result.append(match_result(match, index, unit, full, repeated_count, sentence))
    
    return result


# 모든 문장 순회
def repeated_count_sentence(sentences:list[str]) -> list[dict]:
    
    sentences = sentences.copy() # 원본 데이터 보존
    all_repeated_count = []
    
    # 각 문장의 index와 sentence 추출
    for index, sentence in enumerate(sentences): # enumerate : index와 값을 동시에 얻는 함수
        sentence = sentence.strip() #공백 제거
        matches = repeated_words(index, sentence) # 문장 1개를 담기
        all_repeated_count.extend(matches) 
    
    return all_repeated_count




