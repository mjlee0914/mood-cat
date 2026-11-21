import os
import requests
from dotenv import load_dotenv

load_dotenv()

# 예외 딕셔너리 - 자동 규칙이 안 통할때 혹은 안구보호할 때 쓰는 검색어 전체
GIPHY_QUERY = {
    "go_home": "go home cat",
    "poop": "litter box cat",
}

# 라벨 -> 검색어 함수
def label_to_query(label):
    # 예외딕셔너리.get(찾을 것, 없으면 이거)
    return GIPHY_QUERY.get(label , f"{label} cat")

def label_to_gif_url(label):
    query = label_to_query(label)
    r = requests.get(
        "https://api.giphy.com/v1/gifs/search",
        params={
            "api_key": os.getenv("GIPHY_API_KEY"),
            "q": query,
            "limit": 1,
            "rating": "g",
        },
    )
    data = r.json()
    return data["data"][0]["images"]["original"]["url"]


if __name__ == "__main__":
    print(label_to_gif_url("hungry"))
    print(label_to_gif_url("go_home"))

