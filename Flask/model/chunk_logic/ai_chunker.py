from model.ai_name import tokenizer_2C # 사용 토크나이저

def _ai_chunker(sentences, tokenizer = tokenizer_2C, max_tokens = 512, overlapping = 1):
    accumulated_chunks = [] # 문장별 누적 chunk
    accumulated_tokens = 0 # 문장별 누적 토큰

    chunks = [] # 512토큰 미만의 chunks로 구성된 리스트
    tokens = [] # chunks의 토큰 리스트

    for sentence in sentences:
        count_tokens = len(tokenizer.tokenize(sentence))

        if accumulated_tokens + count_tokens > max_tokens : # 누적 토큰 + 현재 토큰 > 512 토큰일 때
            # accumulated_chunks을 최종 결과물인 chunks에 추가
            list_to_text = " ".join(accumulated_chunks) # accumulated_chunks list를 하나의 텍스트로 합침 (연결 지점 : 공백으로 처리)
            chunks.append(list_to_text)
            tokens.append(accumulated_tokens)

            # overlapping 숫자만큼 이전 문장들을 포함하여 다음 청킹 시작
            accumulated_chunks = accumulated_chunks[-overlapping:] # -overlapping부터 마지막 요소([-1])까지 포함 ex) [-1:] : 마지막 요소만 포함
            accumulated_tokens = sum(len(tokenizer.tokenize(item)) for item in accumulated_chunks)  # accumulated_chunks 안에 있는 문장들의 토큰 합

        # 조건에 관계 없이
        accumulated_chunks.append(sentence) # 문장 추가
        accumulated_tokens += count_tokens # 토큰 누적

    # 루프가 끝난 후 마지막 accumulated_chunks 처리
    if accumulated_chunks : #accumulated_chunks가 비어있지 않을 때
        list_to_text = " ".join(accumulated_chunks)
        chunks.append(list_to_text)
        tokens.append(accumulated_tokens)

    # 가중치 계산을 위한 총 token 계산 (overlapping 포함)
    total_token = sum(tokens)

    return chunks, tokens, total_token







