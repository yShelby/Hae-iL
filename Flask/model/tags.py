# 태그 매칭 파일

def make_tags_prob_and_map(top_emotions, tag_map, threshold=0.05):
    tags = set()
    # 중복없이 데이터 저장
    for emotion, prob in top_emotions:
        if prob >= threshold:
            if emotion in tag_map:
                tags.update(tag_map[emotion])
                # 탑 이모션의 이모션과 프롭을 돌면서 0.05 이상의 프롭을 가진애들에 대해
                # 태그를 찾아 한꺼번에 추가
            else:
                tags.add("#" + emotion)
                # 태그가 없을시 이모션 앞에 #을 붙여서 반환
    return list(tags)