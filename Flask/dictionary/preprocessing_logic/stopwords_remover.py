
def _stopwords_remover(sentence:list[tuple[str,str]], stopwords:set[tuple[str,str]]) -> list[tuple[str, str]] :
        
    filter_stopwords = []

    for (word_root, pos) in sentence:
        if (word_root, pos) not in stopwords :
            filter_stopwords.append((word_root, pos))
        
    return filter_stopwords