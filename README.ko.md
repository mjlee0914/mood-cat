[English](README.md) | **한국어**

# 🐱 Mood Cat

> "행복함", "배고픔"처럼 지금 기분이나 상태를 입력하면 고양이 밈이 나오는 미니 앱

거창한 건 없어요. 공부하면서 재미있는 걸 만들어 보는 게 이 프로젝트의 전부예요.

## 데모

**👉 [사이트 바로가기](https://mjlee0914.github.io/mood-cat/)**

> 서버(BE)가 Render 무료 플랜이라, 한동안 아무도 안 쓰면 잠들어요 😴 첫 검색은 깨어나는 데 시간이 조금 걸릴 수 있어요.

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

| 부분 | 기술 |
|---|---|
| AI 체인 | Python, LangChain (`langchain-core`, `langchain-openai`), OpenAI API |
| 짤 검색 | GIPHY API |
| 서버 (BE) | FastAPI, Uvicorn |
| 화면 (FE) | HTML / CSS / JavaScript (프레임워크 없이), GSAP |
| 소리 | Web Audio API (배경음악, "야옹", "쾅"을 음원 파일 없이 직접 합성) |
| 배포 | Render (BE), GitHub Pages (FE) |

### 화면(FE)에서 한 것
- 2007년 홈페이지 + 한국 PPT 과제 감성의 "밤티" 디자인
- 영어 / 한국어 전환 (브라우저 언어로 자동 선택)
- 일부러 열받게 만든 UI: 도망가는 버튼, 쿠키 알림창, 재촉 타이머, 가짜 버튼
- 마우스를 따라오는 무지개 꼬리, 클릭하면 💥, 캡션 타자기 효과

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

### 웹 앱으로 실행하기

터미널 **두 개**가 필요해요. 서버(BE)와 화면(FE)이 따로 돌아가요.

```bash
# 터미널 1: 서버 (BE)
uvicorn api:app --reload
# → http://127.0.0.1:8000/docs 에서 API를 직접 시험해 볼 수 있어요

# 터미널 2: 화면 (FE)
python -m http.server 5500 --directory frontend
# → 브라우저에서 http://localhost:5500 열기
```

> 화면은 `localhost`에서 열면 로컬 서버(8000)로, GitHub Pages에서 열면 Render 서버로 요청해요.

### 터미널에서만 실행하기

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

## 배포

| 부분 | 어디에 | 어떻게 |
|---|---|---|
| 서버 (BE) | [Render](https://render.com) 무료 플랜 | 레포의 `render.yaml`을 읽어서 자동 설정 (Blueprint) |
| 화면 (FE) | GitHub Pages | `main`에 push하면 `.github/workflows/pages.yml`이 `frontend/` 폴더만 배포 |

- API 키는 레포에 넣지 않고 **Render 화면의 환경변수**로만 넣어요.
- 서버는 CORS로 `https://mjlee0914.github.io`에서 오는 요청만 받아요.

## 진행 상황

- [x] Step 0. 환경 준비
- [x] Step 1. 키워드 감정 분류기 (LLM 없이)
- [x] Step 2. LLM 감정 분류기
- [x] Step 3. 감정 + 캡션 + GIF 합치기
- [x] Step 4. retry / fallback
- [x] 웹 화면(FE) + API 서버(BE)
- [x] 배포 (Render + GitHub Pages)
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
- 화면에 쓴 고양이 짤(헬로캣, 쿵푸캣, 노트북 고양이 등)의 저작권은 원작자에게 있어요.
- 배경음악, 효과음은 Web Audio로 직접 만들었어요.
