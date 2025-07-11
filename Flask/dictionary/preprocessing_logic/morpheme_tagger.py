from .kiwi_lib import kiwi #kiwi_library 호출

#형태소 분석 (품사 Tagging)
def _morpheme_tagger(sen_index: int, sentence:str) -> list[dict]:
    
    # 문장의 형태소 분석
    analyzed_result = kiwi.analyze(sentence)

    tokens = []
        
    # 각 형태소의 첫번째 토큰 리스트 추출
    for word_index, token in enumerate(analyzed_result[0][0]):
        word = token.form
        pos = token.tag
        tokens.append({
            "sentence_index" : sen_index,
            "word_index" : word_index,
            "word_root" : word,
            "pos" : pos
            })
    
    return tokens