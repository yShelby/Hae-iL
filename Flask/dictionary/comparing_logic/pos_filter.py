
def _pos_filter (diary : list[list[dict]], target_pos:set) -> list[dict] :

    transformed_dict = []
    for sentence in diary : # 바깥쪽 list
        for item in sentence: # 안쪽 list
            if item["pos"] in target_pos:
                transformed_dict.append(item)

    return transformed_dict

def _negative_filter(words : list[list[dict]], NEGATIVE_WORDS: set[tuple[str, str]]) -> list[dict]:

    transformed_dict = []
    for sentence in words : # 바깥쪽 list
        for item in sentence: # 안쪽 list
            if (item["word_root"], item["pos"]) in NEGATIVE_WORDS:
                transformed_dict.append(item)

    return transformed_dict