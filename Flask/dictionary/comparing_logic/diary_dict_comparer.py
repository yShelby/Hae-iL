def _diary_dict_comparer(diary : list[dict], sentiment_dict : list[dict]) -> list[dict]:

    # word_root를 keyname으로 하는 dictionary
    senti_lookup = {}
    for item in sentiment_dict:
        senti_lookup[item["word_root"]] = item


    #감정사전과 비교해 감정어일 경우 polarity, label, tag 첨부
    compared = []
    for item in diary : 
        sen_idx = item["sentence_index"]
        word_idx = item["word_index"]
        word_root = item["word_root"]
        pos = item["pos"]

        if word_root in senti_lookup:
            emotion_info = senti_lookup[word_root]
            compared.append({
                "sentence_index" : sen_idx,
                "word_index" : word_idx,
                "word_root" : word_root,
                "polarity" : int(emotion_info["polarity"]),
                "label" : emotion_info["label"],
                "tag" : emotion_info["tag"],
                "pos" : pos
                })

    return compared