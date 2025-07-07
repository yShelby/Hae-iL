#  감정 분석 코드 파일
from model.ainame import tokenizer_6, model_6, device, tokenizer_2C, model_2C
from model.utils import label2emotion_6
import torch

def predict_sentiment(text):
    inputs = tokenizer_2C(text, return_tensors="pt", truncation=True, padding=True)
    # 인풋딕셔너리에 토크나이저_2C로 토큰화한 데이터를 넣는다.
    # 텍스트를 받아와 파이토치로 텐서화를 시키고 길면 자르고 모라자련 공백으로 채운다
    inputs = {k: v.to(device) for k, v in inputs.items()}
    # 인풋에 담겨진 목록의 키와 밸류값을 디바이스에 옮겨 담는다.
    with torch.no_grad():
        logits = model_2C(**inputs).logits
        # 모델에 넘겨서 분석결과 받기
    probs = torch.softmax(logits, dim=1).squeeze().cpu().numpy()
    # 분석결과의 1차원인 열 부분을 대상으로 계산하여 확률로 변환
    # 스퀴즈로 의미없는 1차원을 제거하여
    # cpu로 담아서 넘파이배열 로 변경
    print(f"로짓로짓: {logits}")
    print(f"프롭프롭: {probs}")
    
    pos_prob, neg_prob = probs[1], probs[0]

    # 3개 확률 합
    # total = pos_prob + neg_prob + neutral_prob

    # # 정규화
    # pos_prob_norm = pos_prob / total
    # neg_prob_norm = neg_prob / total
    # neutral_prob_norm = neutral_prob / total
    # 각 값을 토탈으로 나눠 총합이 1이 되도록 계산

    sentiment_probs = {
        "긍정": float(pos_prob),
        "부정": float(neg_prob),
    }
    
    print(f"pos_prob: {pos_prob}, neg_prob: {neg_prob}")
    if pos_prob > neg_prob:
        print("긍정 판단")
        return "긍정", sentiment_probs, pos_prob, neg_prob
    else:
        print("부정 판단")
        return "부정", sentiment_probs, pos_prob, neg_prob
    
def predict_6_emotions(text, top_k=3):
    inputs = tokenizer_6(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        logits = model_6(**inputs).logits
    probs = torch.softmax(logits, dim=1).squeeze().cpu().numpy()
    top_idx = probs.argsort()[::-1][:top_k]
    return [(label2emotion_6[idx], round(float(probs[idx]), 2)) for idx in top_idx], probs

def two_stage_emotion_classification(text):
    # sentiment, sentiment_probs = predict_sentiment(text)
    sentiment, sentiment_probs, pos_prob, neg_prob = predict_sentiment(text)
    print(f"sentiment: {sentiment}, sentiment_probs: {sentiment_probs}")
    top_emotions, emotion_probs = predict_6_emotions(text)
    print(f"top_emotions: {top_emotions}")
    sentiment_result = int(round((pos_prob - neg_prob)*100, 0))
    
        # 여기 emotion_probs는 numpy.ndarray임
    return {
            "stage": 1,
            "sentiment": sentiment,
            # "pos_prob": float(pos_prob),
            # "neg_prob": float(neg_prob),
            "sentiment_probs": {
                "pos_prob": float(pos_prob),
                "neg_prob": float(neg_prob)
            },
            "sentiment_result" : sentiment_result,
            "detailed_emotions": top_emotions,
            "emotion_probs": emotion_probs.tolist()  # 리스트로 변환해서 반환
        }

# if __name__ == "__main__":
#     text = input("분석할 문장을 입력하세요: ")
#     result = two_stage_emotion_classification(text)
#     print("분석 결과:", result)