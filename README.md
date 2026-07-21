
# 📄 DocMind AI

An AI-powered document assistant that enables users to upload PDF documents and chat with them using natural language. Built using **FastAPI**, **Next.js**, **ChromaDB**, **Sentence Transformers**, and **LLMs** with a Retrieval-Augmented Generation (RAG) pipeline.

<img width="1885" height="888" alt="image" src="https://github.com/user-attachments/assets/da1f1b97-5537-4c71-bbd0-e936a13344c5" />

<img width="1871" height="887" alt="image" src="https://github.com/user-attachments/assets/060fcd24-bc68-4717-b8db-b0e92e6c9979" />
## ✨ Features

- 📄 Upload PDF documents
- 💬 Chat with uploaded PDFs
- 🧠 Retrieval-Augmented Generation (RAG)
- 🔍 Semantic search using vector embeddings
- ⚡ Real-time streaming AI responses
- 📦 ChromaDB vector database
- ✂️ Automatic PDF text extraction & chunking
- 🚀 FastAPI REST API backend
- 🎨 Responsive Next.js frontend

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- FastAPI
- Python
- Uvicorn

### AI Stack
- Sentence Transformers
- ChromaDB
- LangChain Text Splitter
- OpenRouter LLM API
- PyPDF

---

## 🏗️ Architecture

```
User
 │
 ▼
Upload PDF
 │
 ▼
Extract Text
 │
 ▼
Chunk Document
 │
 ▼
Generate Embeddings
 │
 ▼
Store in ChromaDB
 │
 ▼
────────────────────────────
 │
 ▼
Ask Question
 │
 ▼
Generate Query Embedding
 │
 ▼
Retrieve Top-K Relevant Chunks
 │
 ▼
LLM
 │
 ▼
Streaming Response
```


---

## ⚙️ Getting Started

### Clone the repository

```bash
git clone https://github.com/<your-username>/DocMind-AI-Prod.git
cd DocMind-AI-Prod
```

### Backend

```bash
cd docmind_ai_backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---


---




## 📄 License

This project is licensed under the MIT License.
