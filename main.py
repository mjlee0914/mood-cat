from llm_classifier import llm_sentence_to_label
from caption import make_caption
from gif_search import label_to_gif_url
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from classifier import sentence_to_label

# LCEL 적용 전 연습
# def run(text):
#     mood = llm_sentence_to_label(text)
#     caption = make_caption(text, mood=mood)
#     image_url = label_to_gif_url(mood)
#     return {"text": text, "mood": mood, "caption": caption, "image_url": image_url}

# if __name__ == "__main__":
#     print(run("시험 망했어 ㅠㅠ"))

# step별 retry 및 fallback 정의
mood_step = (
    RunnableLambda(lambda x: llm_sentence_to_label(x["text"]))
    .with_retry(stop_after_attempt=3)
    .with_fallbacks([RunnableLambda(lambda x: sentence_to_label(x["text"]))])
)

caption_step = (
    RunnableLambda(lambda x: make_caption(x["text"], x["mood"]))
    .with_retry(stop_after_attempt=3)
    .with_fallbacks([RunnableLambda(lambda x: "서버가 낮잠중이다냥")])
)

# fallback으로 나오는 고양이 짤
TEABAGGING_CAT_URL = "https://media.giphy.com/media/WykUqckDqi95YIqtFZ/giphy.gif"

giphy_step = (
    RunnableLambda(lambda x: label_to_gif_url(x["mood"]))
    .with_retry(stop_after_attempt=3)
    .with_fallbacks([RunnableLambda(lambda x: TEABAGGING_CAT_URL)])
)

# LCEL 적용 연습
mood_cat_chain = (
    # mood <- text 주입
    RunnablePassthrough.assign(mood=mood_step)
    # caption <- text, mood 주입
    | RunnablePassthrough.assign(caption=caption_step)
    # image_url <- mood 주입 (text, mood, caption 사용)
    | RunnablePassthrough.assign(image_url=giphy_step)
)

if __name__ == "__main__":
    print(mood_cat_chain.invoke({"text": "시험 망했어 ㅠㅠ"}))
