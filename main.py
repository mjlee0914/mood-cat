from llm_classifier import llm_sentence_to_label
from caption import make_caption
from gif_search import label_to_gif_url
from langchain_core.runnables import RunnablePassthrough

# LCEL 적용 전 연습
# def run(text):
#     mood = llm_sentence_to_label(text)
#     caption = make_caption(text, mood=mood)
#     image_url = label_to_gif_url(mood)
#     return {"text": text, "mood": mood, "caption": caption, "image_url": image_url}

# if __name__ == "__main__":
#     print(run("시험 망했어 ㅠㅠ"))


# LCEL 적용 연습
mood_cat_chain = (
    # mood <- text 주입
    RunnablePassthrough.assign(mood=lambda x: llm_sentence_to_label(x["text"]))
    # caption <- text, mood 주입
    | RunnablePassthrough.assign(caption=lambda x: make_caption(x["text"], x["mood"]))
    # image_url <- mood 주입 (text, mood, caption 사용)
    | RunnablePassthrough.assign(image_url=lambda x: label_to_gif_url(x["mood"]))
)

if __name__ == "__main__":
    print(mood_cat_chain.invoke({"text": "시험 망했어 ㅠㅠ"}))
