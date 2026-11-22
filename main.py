from llm_classifier import llm_sentence_to_label
from caption import make_caption
from gif_search import label_to_gif_url

def run(text):
    mood = llm_sentence_to_label(text)
    caption = make_caption(text, mood=mood)
    image_url = label_to_gif_url(mood)
    return {"text": text, "mood": mood, "caption": caption, "image_url": image_url}

if __name__ == "__main__":
    print(run("시험 망했어 ㅠㅠ"))


# LCEL 적용
