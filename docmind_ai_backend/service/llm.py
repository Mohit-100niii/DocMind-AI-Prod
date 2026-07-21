
# import os
# import httpx
# from dotenv import load_dotenv
# import json
# load_dotenv()
# OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")
# OPENROUTER_URL = os.getenv("OPENROUTER_URL")

# async def llmRetriver(query,context):
#     prompt = f"""
#                 You are a document question-answering assistant.

#                 Your job is to answer ONLY from the provided context.

#                 Rules:
#                 1. Use ONLY the information present in the context.
#                 2. Do NOT use your own knowledge.
#                 3. If the answer is not found in the context, reply exactly:
#                 "I couldn't find this information in the uploaded document."
#                 4. Keep the answer concise.

#                 Context:
#                 {context}

#                 Question:
#                 {query}

#                 Answer:
#                 """
    
        
#     headers = {
#         "Authorization": f"Bearer {OPENROUTER_KEY}",
#         "Content-Type": "application/json",
#         "HTTP-Referer": "https://your-frontend-domain.com",  # put dummy if local
#         "X-Title": "DocMind AI"
#     }

#     data = {
#           "model": "mistralai/mixtral-8x7b-instruct",
#           "model":"meta-llama/llama-3.1-8b-instruct",
#           "messages": [
#                 {"role": "user", "content": prompt}
#             ],
#            "max_tokens": 400,
#            "temperature": 0.3
#     }

  
#     async with httpx.AsyncClient() as client:
#         response = await client.post(OPENROUTER_URL, headers=headers, json=data)

#         #response= await httpx.post(OPENROUTER_URL, headers=headers, json=data)
    
#         result = response.json()

#         return result["choices"][0]["message"]["content"]
        
       
 
import os
import httpx
from dotenv import load_dotenv
import json
load_dotenv()
OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = os.getenv("OPENROUTER_URL")

async def llmRetriver(query,context):
    prompt = f"""
                You are a document question-answering assistant.

                Your job is to answer ONLY from the provided context.

                Rules:
                1. Use ONLY the information present in the context.
                2. Do NOT use your own knowledge.
                3. If the answer is not found in the context, reply exactly:
                "I couldn't find this information in the uploaded document."
                4. Keep the answer concise.

                Context:
                {context}

                Question:
                {query}

                Answer:
                """
    
        
    headers = {
        "Authorization": f"Bearer {OPENROUTER_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-frontend-domain.com",  # put dummy if local
        "X-Title": "DocMind AI"
    }

    data = {
          "model": "mistralai/mixtral-8x7b-instruct",
          "model":"meta-llama/llama-3.1-8b-instruct",
          "messages": [
                {"role": "user", "content": prompt}
            ],
           "max_tokens": 400,
           "temperature": 0.3,
           "stream": True
    }

  
    async with httpx.AsyncClient() as client:

        async with client.stream(
            "POST",
            OPENROUTER_URL,
            headers=headers,
            json=data
        ) as response:

            async for line in response.aiter_lines():
                print(repr(line))
                if not line:
                 continue

                if line.startswith(":"):
                 continue

                if line.startswith("data:"):
                 line = line.removeprefix("data:").strip()

                if line == "[DONE]":
                    break

                chunk = json.loads(line)

                token = chunk["choices"][0]["delta"].get("content")

                if token:
                    yield token
        
       
    

    
   

    
