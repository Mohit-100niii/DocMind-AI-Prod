import chromadb


class ChromaDBManager:
    def __init__(self):
        self.client = chromadb.PersistentClient(
            path="./chroma_storage"
        )

        self.collection = self.client.get_or_create_collection(
            name="documents"
        )

    def add_document(self, ids, documents, embeddings, metadatas):
      self.collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings.tolist(),
        metadatas=metadatas
    )

    def search(self, query_embedding, document_id, top_k=5):
     return self.collection.query(
        query_embeddings=query_embedding.tolist(),
        n_results=top_k,
        where={
            "document_id": document_id
        }
    )
    def delete_document(self, ids):
        self.collection.delete(ids=ids)

    def delete_all_documents(self):
        self.client.delete_collection("documents")

        self.collection = self.client.get_or_create_collection(
            name="documents"
        )



chroma_db = ChromaDBManager()