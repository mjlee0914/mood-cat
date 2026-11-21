from dotenv import load_dotenv
from classifier import CATIFY_DICT
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

# 환경변수 불러오기
load_dotenv()

# 라벨 리스트 정의 (검사용)
label_list = list(CATIFY_DICT.keys()) + ["neutral"]
# 라벨 ", " 로 묶기 (LLM에게 보여주기 용)
labels = ", ".join(label_list)

# prompt 정의: LLM에게 보낼 질문지 만들기
prompt = ChatPromptTemplate.from_messages([
    ("system", """
(역할) 너는 고양이 밈 앱에서 사용자 기분을 분류하는 분류기다.
(할 일) 다음 문장의 감정/상태를 아래 라벨 중 하나로 분류해.
(라벨) {labels}
(규칙) 라벨 한 단어로 / 목록 안에서만 / 소문자로, 설명 없이 / 없으면 neutral
"""),
    ("human", "문장: {sentence}"),
])

# model 정의: LLM에게 prompt를 보내고 답 받기
model = ChatOpenAI(model="gpt-6-luna")

# parser 정의: LLM으로부터 온 답의 글자만 꺼내기
# LLM이 내보낸 AIMessage(content="hungry", ...) 에서 content만 꺼낸다
parser = StrOutputParser()

# chain으로 잇기
# LCEL 파이프 순서는 출력 모양 -> 입력 모양이 맞아야 한다
chain = prompt | model | parser

# 문장을 넣으면 라벨이 나오는 함수 정의
def llm_sentence_to_label(sentence):
    # chain.invoke()로 LLM에게 물어보기
    answer = chain.invoke({"labels": labels, "sentence": sentence})
    # LLM이 준 답을 공백/줄바꿈 제거 + 소문자 통일
    answer = answer.strip().lower()
    # label_list에 없는 답 걸러내기 - 있으면 LLM 답을 돌려줌, 없으면 "neutral" 기본값 돌려줌
    if answer in label_list:
        return answer
    return "neutral"

if __name__ == "__main__":
    # test
    print(llm_sentence_to_label("아 진짜 너무 배고파"))
    print(llm_sentence_to_label("아 진짜 너무 안배고파"))

