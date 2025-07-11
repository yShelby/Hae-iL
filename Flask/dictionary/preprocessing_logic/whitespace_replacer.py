import re

def _whitespace_replacer(text: str) -> str:
    text = re.sub(r"\s+", " ", text)        # 탭, 줄바꿈 등 모든 공백 -> space로 바꿈
    return text.strip()                     # 양 끝 공백 제거