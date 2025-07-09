# 문장 분리 및 구조화
from .kiwi_lib import kiwi #kiwi_library 호출

# 문장 분리 함수 정의
def _sentence_splitter(text: str) -> list[str]:
    """Split Korean diary context into sentence-level units using Kiwi

    Args:
        text (str): A long diary text in Korean loaded from JSON

    Returns:
        list[str] : A list of separeted sentences
    """
    sentences = []

    for result in kiwi.split_into_sents(text):
        sentences.append(result.text.strip())

    return sentences
