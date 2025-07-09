from symspellpy_ko import KoSymSpell # pip install symspellpy-ko
                                     # Verbosity : 오타 교정 결과를 어떤 기준으로 반환할지에 대한 옵션

# 사전 호출
sym_spell = KoSymSpell()
sym_spell.load_korean_dictionary(load_bigrams=True) # load_bigrams : 단어 쌍(bigrams) 빈도 호출