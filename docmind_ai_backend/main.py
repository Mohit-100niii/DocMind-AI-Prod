import shutil
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader

from service.Chunking import extract_text_from_pdf
from service.embedding import build_index, embed_chunks
from service.retriver import retrieve_from_doc
from service.llm import llmRetriver
import os
from database.chroma_db import chroma_db
from fastapi.responses import StreamingResponse
app = FastAPI()

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/docMind/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = f"documents/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    reader = PdfReader(file_path)

    doc_chunks = extract_text_from_pdf(reader)
    doc_embeddings = embed_chunks(doc_chunks)

    document_id = str(uuid.uuid4())
    ids = [
    f"{document_id}_{i}"
    for i in range(len(doc_chunks))]

    chroma_db.add_document(
    ids=ids,
    documents=doc_chunks,
    embeddings=doc_embeddings,
    metadatas = [
    {
        "document_id": document_id,
        "filename": file.filename,
        "chunk_number": i
    }
    for i in range(len(doc_chunks))])

    return {
        "message": "PDF uploaded successfully",
        "chunks": len(doc_chunks),
        "document_id": document_id
    }


# @app.get("/get-Queryanswer")
# async def get_query_answer(query: str, document_id: str):
#     print("Received query:", query, "for document_id:", document_id)
#     query_embedding = embed_chunks([query])

#     results = chroma_db.search(
#     query_embedding=query_embedding,
#     document_id=document_id,
#     top_k=5
#     )

#     print("Results from ChromaDB:", results)
#     retrieved_chunks = results["documents"][0]

#     answer = await llmRetriver(
#         query,
#         "\n".join(retrieved_chunks)
#     )

#     return {
#         "query": query,
#         "answer": answer,
#         "retrieved_chunks": retrieved_chunks
#     }


@app.get("/get-Queryanswer")
async def get_query_answer(query: str, document_id: str):

    print("Received query:", query, "for document_id:", document_id)

    # Step 1: Generate embedding
    query_embedding = embed_chunks([query])

    # Step 2: Search ChromaDB
    results = chroma_db.search(
        query_embedding=query_embedding,
        document_id=document_id,
        top_k=5
    )

    print("Results from ChromaDB:", results)

    retrieved_chunks = results["documents"][0]

    # Step 3: Create streaming generator
    async def generate():
        async for token in llmRetriver(
            query,
            "\n".join(retrieved_chunks)
        ):
            yield token

    # Step 4: Stream tokens to frontend
    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )