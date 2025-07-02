# 오탈자 수정
from symspellpy_ko import KoSymSpell # pip install symspellpy-ko


# 사전 호출
sym_spell = KoSymSpell()
sym_spell.load_korean_dictionary(load_bigrams=True) # load_bigrams : 단어 쌍(bigrams) 빈도 호출

def fixed_spelling(sentences:list[str]) -> list[str]:
    
    fixed_sentences = []
    
    for sentence in sentences:
        
        try:
            result = sym_spell.lookup_compound(sentence, max_edit_distance=2)
            fixed_sentences.append(result[0].term) # 가장 적합한 교정 문장
        except(KeyError, Exception) as e:
            print(f"koSymSpell_error : {e}")
            fixed_sentences.append(sentence)  
            
    return fixed_sentences