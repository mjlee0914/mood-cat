""" 
감정/상태 키워드 분류기

-> 한계 존재:
- 키워드를 아무리 늘려도 사람이 말하는 방식을 다 잡을 수 없음 (조사나 부정 등 모두 잡을 수 없음)
--> LLM 분류기를 사용해야 하는 이유
---> 이 키워드 분류기는 LLM의 실패했을 때의 fallback으로 남는다
----> 완벽하지는 않아도, "고양이는 나온다"!
"""

CATIFY_DICT = {
    # 상태: 구체적인 것부터 먼저 확인 
    # 파이썬 3.7부터 딕셔너리는 넣은 순서를 기억한다
    # -> 함수는 찾은 라벨을 바로 return
    # --> 위에 위치한 상태 라벨이 우선임.

    # 규칙(draft):
    # 어간만 넣는다 -> 한국어는 끝이 계속 바뀌므로
    # []"ㅠ", "좋아"] 는 일부러 뺀다: 너무 흔한 글자라서 잘못 걸릴 수 있음
    # 잘못 걸림 ex) "기분 안좋아" -> happy, "ㅠㅠ 배고파" -> sad 
    "go_home": ["집에 가고", "집 가고", "집가고", "퇴근"],
    "poop": ["똥", "응가", "화장실", "마렵다", "마려"],
    "hungry": ["배고", "배가 고", "출출", "허기", "밥 먹고"],
    "sleepy": ["졸려", "졸리", "잠와", "잠 와", "피곤", "자고 싶"],

    # 감정: Susan David, "A List of Emotions" (HBR.org)
    "angry": ["화나", "화가 나", "짜증", "빡치", "열받", "어이없"],
    "sad": ["슬퍼", "슬프", "우울", "망했", "속상", "눈물"],
    "anxious": ["불안", "걱정", "긴장", "떨려", "초조", "무서"],
    "hurt": ["서운", "배신", "상처", "질투", "외로"],
    "embarrassed": ["창피", "민망", "부끄", "쪽팔"],
    "happy": ["행복", "기뻐", "기쁘", "신나", "설레", "최고", "기분 좋"],
}

def sentence_to_label(sentence):
    for label, keylist in CATIFY_DICT.items():
        for key in keylist:
            if key in sentence:
                return label
    return "neutral"

if __name__ == "__main__":
    print(sentence_to_label("아 배고파"))       # hungry 나오면 성공
    print(sentence_to_label("오늘 날씨 좋다"))   # neutral 나오면 성공