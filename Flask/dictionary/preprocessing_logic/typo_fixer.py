from .symspellpy_lib import sym_spell

# 오탈자 수정
def _typo_fixer(sentence:str) -> str:  

    try:
        fixed = sym_spell.lookup_compound(sentence, max_edit_distance=2) # max_edit_distance=2 : 최대 편집거리 2까지 교정
        return fixed[0].term # 가장 적합한 교정 문장
    except(KeyError, Exception) as e:
        print(f"koSymSpell_error : {e}")
        return sentence