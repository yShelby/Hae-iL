from .kiwi_lib import kiwi #kiwi_library 호출

#형태소 분석 (품사 Tagging)
def tagging_morpheme(sentences:list[str]) -> list[list[tuple[str,str]]]:
    
    result_tagging_list = []
    
    for sentence in sentences :
        # 문장의 형태소 분석
        analyzed_result = kiwi.analyze(sentence)
    
        tokens = []
        
        # 각 형태소의 첫번째 토큰 리스트 추출
        for token in analyzed_result[0][0]:
            word = token.form
            tag = token.tag
            tokens.append((word, tag))
    
        result_tagging_list.append(tokens)
    
    return result_tagging_list