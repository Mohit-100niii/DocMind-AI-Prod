def retrieve_from_doc(query_embedding, index, chunks, top_k=5):
    if query_embedding is None:
        raise ValueError(
            "query_embedding is None. Check the embedding generation step."
        )

    query_embedding = query_embedding.astype("float32").reshape(1, -1)

    distances, indices = index.search(query_embedding, top_k)

    results = []

    for idx in indices[0]:
        results.append(chunks[idx])

    return results