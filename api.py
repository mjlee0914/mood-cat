"""
Mood Cat API (FastAPI)

브라우저(FE)는 API 키를 가질 수 없어서, 이 서버가 대신 mood_cat_chain을 실행해 준다.

실행: uvicorn api:app --reload
문서: http://127.0.0.1:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from main import mood_cat_chain

app = FastAPI(title="Mood Cat API")

# CORS: 다른 주소(FE)에서 이 API를 부를 수 있게 허락할 목록
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",        # 로컬 FE (VSCode Live Server)
        "http://localhost:5500",
        "https://mjlee0914.github.io",  # 배포된 FE (GitHub Pages)
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# 요청: FE가 보내는 모양
class MoodRequest(BaseModel):
    text: str = Field(min_length=1, max_length=200)  # 빈 문장, 너무 긴 문장은 막기 (LLM 비용)


# 응답: FE가 받는 모양
class MoodResponse(BaseModel):
    text: str
    mood: str
    caption: str
    image_url: str


# 서버가 살아 있는지 확인용
@app.get("/health")
def health():
    return {"status": "ok"}


# 문장 → 감정 + 캡션 + 고양이 짤
@app.post("/mood", response_model=MoodResponse)
def get_mood_cat(req: MoodRequest):
    return mood_cat_chain.invoke({"text": req.text})
