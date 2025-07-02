# 반복 문자 및 특수 문자 삭제
import re
from rules.emojis import face_emojis

cleaned_sentences = []

# 반복 데이터 처리 : 반복 구문을 탐지한 결과 호출
def remove_repeated_phrases_and_special_chars(sentences: list[str], repeated_counts: list[dict]) -> list[str]:
    cleaned_sentences = sentences.copy() # 원본데이터 손상 방지
    
    pattern = re.compile(r"[^A-Za-z0-9가-힣\u3131-\u318E\s!?.,{face_emojis}]") # 제외할 문자
        
    for item in repeated_counts:
        index = item["sentence_index"] # 몇 번째 문장인지
        target = item["matched_text"] # 반복된 텍스트 전체
        unit = item["base_unit_candidate"] # 반복 기본 단위 (1회만 남김)
        
        # 반복 문자
        cleaned_sentences[index] = cleaned_sentences[index].replace(target,unit)
        
        # 필요없는 특수 문자
        cleaned_sentences[index] = pattern.sub('',cleaned_sentences[index])
    
    return cleaned_sentences
