
# 예시 감성 사전
sentilex = [
    {"word_root": "갑갑", "polarity": -1},
    {"word_root": "신나", "polarity": 1},
    {"word_root": "갑갑 궁금", "polarity": -1},
    {"word_root": "감회 새롭", "polarity": 2},
    # ... (실제 감성 사전은 더 방대)
]

def extract_nouns_adjectives_from_tagged(
    tagged_sentence: list[tuple[str, str]]
) -> list[str]:
    """형태소 분석 결과에서 명사/형용사 어근만 추출"""
    return [
        word for word, tag in tagged_sentence
        if tag.startswith("NN") or tag.startswith("VA")
    ]

def match_with_sentilex(
    tokens: list[str],
    sentilex: list[dict]
) -> list[tuple[str, int]]:
    """토큰화된 문장에서 감성 사전 word_root와 부분/전체 일치 매칭"""
    matches = []
    token_set = set(tokens)
    for entry in sentilex:
        roots = entry["word_root"].split()
        # 모든 어근이 tokens에 존재하면 매칭
        if all(root in token_set for root in roots):
            matches.append((entry["word_root"], entry["polarity"]))
    return matches

# 예시 문장
sentence = "요즘 갑갑하고 궁금한 마음이 들어서 신나기도 하다."
