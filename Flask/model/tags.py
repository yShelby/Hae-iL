# 태그 매칭 파일

def make_tags_prob_and_map(top_moods, tag_map, threshold=0.05):
    tags = set()
    # 중복없이 데이터 저장
    for mood, prob in top_moods:
        if prob >= threshold:
            if mood in tag_map:
                tags.update(tag_map[mood])
                # 탑 이모션의 이모션과 프롭을 돌면서 0.05 이상의 프롭을 가진애들에 대해
                # 태그를 찾아 한꺼번에 추가
            else:
                tags.add("#" + mood)
                # 태그가 없을시 이모션 앞에 #을 붙여서 반환

    print("생성된태그",tags)
    return list(tags)