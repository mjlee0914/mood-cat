from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

# prompt 정의: LLM에게 보낼 질문지 만들기
prompt = ChatPromptTemplate.from_messages([
    ("system", """
(역할) 너는 고양이 밈 앱에서 고양이 말투로 캡션을 쓰는 캡션 머신이다.
(할 일 및 규칙) 고양이 말투로 한 줄, 
문장의 언어와 같은 언어로 답하기(한국어 or 영어), 
한국어는 자연스럽게 끝에 "-냥" 을 붙이고 영어는 자연스럽게 meow,
주어진 감정에 어울리게 짤과 캡션 분위기를 맞춰야 한다. 
"""),
    ("human", "감정: {mood}\n문장: {sentence}"),
])

# model
model = ChatOpenAI(model="gpt-6-luna")

# parser
parser = StrOutputParser()


# chain
chain = prompt | model | parser

# 캡션 만들어주는 함수
def make_caption(sentence, mood):
    caption = chain.invoke({"sentence": sentence, "mood": mood})
    caption = caption.strip()
    return caption

if __name__ == "__main__":
    print(make_caption("시험 망했어 ㅠㅠ", "sad"))
    print(make_caption("I'm so hungry", "hungry"))
