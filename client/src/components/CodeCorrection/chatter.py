from langchain_together import Together
import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv('TOGETHER_AI_API_KEY') 
llm = Together(together_api_key=api_key,
               model='meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
               temperature=0.0,
               max_tokens=512,
)
template = """Analyze precisely based only on the following  code if error is present display the corrected code.
If there are errors in the code, display them. Otherwise, provide the time complexity of the code.
Display only the fixed solution and avoid displaying step by step analysis of problem

Code:
{code}
"""

prompt = ChatPromptTemplate.from_template(template)
chain = (
    {"code": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

code_input = """
def is_even(number):
    if number % 2 == 1:  
        return True
    else:
        return False


print(is_even(4))  
print(is_even(5))  
"""
response = chain.invoke(code_input)

# Print the response
print(response)