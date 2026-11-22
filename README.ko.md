[English](README.md) | **한국어**

# 🐱 Mood Cat

> "행복함", "배고픔"처럼 지금 기분이나 상태를 입력하면 고양이 밈이 나오는 미니 앱

거창한 건 없어요. 공부하면서 재미있는 걸 만들어 보는 게 이 프로젝트의 전부예요.

## 데모

<!-- TODO: 실행 화면 GIF 또는 스크린샷 -->

```
입력:  "시험 망했어 ㅠㅠ"
감정:  sad
캡션:  "괜찮아, 나도 츄르 놓쳤어"
이미지: (슬픈 고양이 GIF)
```

## 왜 만들었나요?

수업에서 배운 LangChain Runnable / LCEL이 이론 위주라서 잘 와닿지 않았어요.
그래서 작은 프로젝트를 직접 조립하면서 이해해 보려고 만들었어요.
그리고 고양이는 최고고, 고양이 밈은 웃기니까요!

### 이 프로젝트로 연습하는 개념

- `A | B | C` 파이프로 체인 조립하기 (LCEL)
- `@chain`, `invoke()`, `batch()`
- `RunnablePassthrough.assign()`으로 이전 단계의 값 유지하기
- `.with_retry()`, `.with_fallbacks()`로 실패에 대비하기
- `.stream()`

## 동작 구조

```
입력 텍스트
  → [감정 분류]  자유로운 문장을 정해진 감정 라벨 하나로 (LLM)
  → [캡션 생성]  고양이 말투로 한 줄 (LLM)
  → [GIF 검색]   "{감정} cat"으로 GIPHY 검색 (API)
  → { text, mood, caption, image_url }
```

LLM은 감정 분류와 캡션 작성에만 써요. 이미지는 생성하지 않고 API에서 가져오기 때문에 결과가 안정적이고 비용이 적어요.

### 실패해도 고양이는 나온다

| 단계          | 실패하면                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| LLM 감정 분류 | 최대 3번 시도 → 키워드 분류기 (Step 1)                                                                                               |
| LLM 캡션      | 최대 3번 시도 → "서버가 낮잠중이다냥"                                                                                                |
| GIPHY         | 최대 3번 시도 → [teabagging cat](https://giphy.com/gifs/cat-salam-salamualaikum-alaikum-WykUqckDqi95YIqtFZ) (검색 결과가 0개일 때도) |

OpenAI 키와 GIPHY 키를 일부러 망가뜨려서, 네 가지 경우(정상 / OpenAI 고장 / GIPHY 고장 / 둘 다 고장) 모두 결과가 나오는 것을 확인했어요.

## 기술 스택

- Python, LangChain (`langchain-core`, `langchain-openai`)
- OpenAI API
- GIPHY API

## 실행 방법

**필요한 것:** Python 3.11 이상 (3.13에서 개발), OpenAI API 키, GIPHY API 키

```bash
# 1. 레포 받기
git clone https://github.com/mjlee0914/mood-cat.git
cd mood-cat

# 2. 가상환경 만들고 켜기
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# 3. 패키지 설치
pip install -r requirements.txt

# 4. API 키 설정
cp .env.example .env             # 만든 .env 파일에 진짜 키를 넣어 주세요
```

| 키               | 발급받는 곳                                             |
| ---------------- | ------------------------------------------------------- |
| `OPENAI_API_KEY` | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `GIPHY_API_KEY`  | [GIPHY Developers](https://developers.giphy.com/)       |

> `.env`는 `.gitignore`에 들어 있어서 커밋되지 않아요.

### 실행하기

```bash
python main.py
```

실행하면 이런 딕셔너리가 출력돼요. 캡션과 GIF는 실행할 때마다 달라질 수 있어요.

```python
{
    "text": "시험 망했어 ㅠㅠ",
    "mood": "sad",
    "caption": "시험 망해서 세상이 무너진 줄 알았다냥… ㅠㅠ",
    "image_url": "https://media3.giphy.com/media/.../giphy.gif",
}
```

> 다른 문장을 넣어 보려면 `main.py` 맨 아래의 `"시험 망했어 ㅠㅠ"`를 바꿔 주세요.
> 캡션은 입력 언어를 따라가요. 한국어로 입력하면 "-냥", 영어로 입력하면 "meow"로 끝나요.

## 진행 상황

- [x] Step 0. 환경 준비
- [x] Step 1. 키워드 감정 분류기 (LLM 없이)
- [x] Step 2. LLM 감정 분류기
- [x] Step 3. 감정 + 캡션 + GIF 합치기
- [x] Step 4. retry / fallback
- [ ] Step 5. (선택) 캡션 스트리밍
- [ ] Step 6. (선택) 블로그 데모
- [ ] Step 7. 회고

## 배운 점

<!-- TODO: Step 7에서 채우기 -->

## 참고

- KANT AX 부트캠프 11/20 LangChain Runnable 수업을 바탕으로 한 개인 학습 프로젝트예요.
- [프로젝트 기획서](https://mjlee0914.github.io/coding/mood-cat/)
- [LangChain 공식 문서](https://python.langchain.com/)

## Credits

- GIF: [GIPHY](https://giphy.com/) (Powered by GIPHY)
