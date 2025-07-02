
def remove_stopwords(sentences:list[list[tuple[str, str]]], stopwords:set[str]) -> list[list[tuple[str, str]]] : # [] : generic 표기법, [] 안에 type이 들어감
    
    sentences_removed_stopwords = []
    
    for sentence in sentences :
        
        cleaning_sentence = []

        for (word, tag) in sentence:
            if word not in stopwords :
                cleaning_sentence.append((word, tag))
                
        sentences_removed_stopwords.append(cleaning_sentence)
        
    return sentences_removed_stopwords