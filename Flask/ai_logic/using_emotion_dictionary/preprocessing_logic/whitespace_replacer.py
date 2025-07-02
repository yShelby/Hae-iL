import re

def replace_whitespace(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    return text.strip() 