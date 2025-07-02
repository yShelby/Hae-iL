import json

from preprocessing_logic.whitespace_replacer import replace_whitespace
from preprocessing_logic.sentence_splitter import split_into_sentences
from preprocessing_logic.repeated_counter import repeated_count_sentence
from preprocessing_logic.repeated_and_special_chars_remover import remove_repeated_phrases_and_special_chars
from preprocessing_logic.morpheme_tagger import tagging_morpheme
from preprocessing_logic.stopwords_remover import remove_stopwords

#=====================================#
# 감정 사전 호출
# with open("./rules/stopwords_v1.json", "r", encoding="utf-8") as f:
#     senti_dic = json.load(f)
    
# senti_words = set()

# for word in senti_dic.values():
#     senti_dic.update(senti_words) # update : set(), dict() 등에 여러 요소를 한꺼번에 넣을 때 사용

#=====================================#
# 감정 분석에도 쓰이지 않는 불용어 호출
with open("./rules/stopwords_v1.json", "r", encoding="utf-8") as f:
    stopwords_data = json.load(f)
    
stopwords = set()

for word in stopwords_data.values():
    stopwords.update(word) # update : set(), dict() 등에 여러 요소를 한꺼번에 넣을 때 사용
#=====================================#   

#=====================================#   
# Loads Diary text
with open("diaries/diary_repeat.json", "r", encoding="utf-8") as f:
    data = json.load(f)
#=====================================#
    
# extract context
diary_text = data["context"]

# 0. 공백 처리
diary_text = replace_whitespace(diary_text)

# 1. 문장 분리 실행
split_sen = split_into_sentences(diary_text)

# 2-1. 반복 문자 처리
repeated_count = repeated_count_sentence(split_sen)

# 2-2. 반복 문자 및 불필요한 특수 문자 제거
remove_unuseful_sen = remove_repeated_phrases_and_special_chars(split_sen, repeated_count)

# 3. 형태소 분석 + 품사 Tagging
analyze_morpheme_sen = tagging_morpheme(remove_unuseful_sen) 

# 4. 불용어 제거
cleaned_stopwords_sen = remove_stopwords(analyze_morpheme_sen, stopwords)

# 오탈자 수정
#fixed_sen = fixed_spelling(split_sen)
print(f"cleaned_stopwords_sen:{cleaned_stopwords_sen}")

