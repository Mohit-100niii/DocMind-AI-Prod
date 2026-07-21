from sentence_transformers import SentenceTransformer
import faiss

model = SentenceTransformer("all-MiniLM-L6-v2")
print("Model loaded successfully!")



def embed_chunks(chunks):
    embeddings = model.encode(
        chunks,
        convert_to_numpy=True
    )

    embeddings = embeddings.astype("float32")
    
    return embeddings

def build_index(embeddings):

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)

    index.add(embeddings)

    return index