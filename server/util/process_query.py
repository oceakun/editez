import psycopg2
import numpy as np
from psycopg2.extras import execute_values
from pgvector.psycopg2 import register_vector
from transformers import AutoTokenizer, AutoModel
import tiktoken

import psycopg2
import numpy as np
from psycopg2.extras import execute_values
from pgvector.psycopg2 import register_vector
from transformers import AutoTokenizer, AutoModel
import tiktoken

def retrieve_similar_content(query, user_id):
    print("entered retrieve_similar_content")
    
    def get_top_similar_docs(query_embedding, user_id):
        conn = psycopg2.connect(
            dbname="second_brain",
            user="postgres",
            password="here_goes_the_password",
            host="localhost"
        )
        embedding_array = np.array(query_embedding)
        register_vector(conn)
        cur = conn.cursor()
        # Ensure we filter by user_id
        cur.execute("""
            SELECT id, title, content, created_at 
            FROM notes 
            WHERE user_id = %s 
            ORDER BY embeddings <-> %s::vector 
            LIMIT 1
        """, (user_id, embedding_array,))
        top3_docs = cur.fetchall()
        cur.close()
        conn.close()
        return top3_docs

    def get_gte_large_embeddings(text):
        tokenizer = AutoTokenizer.from_pretrained("thenlper/gte-large")
        model = AutoModel.from_pretrained("thenlper/gte-large")
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        outputs = model(**inputs)
        embeddings = outputs.last_hidden_state.mean(dim=1).detach().numpy()
        embedding_1d = embeddings.flatten().tolist()
        return embedding_1d

    def num_tokens_from_string(string: str, encoding_name="cl100k_base") -> int:
        if not string:
            return 0
        encoding = tiktoken.get_encoding(encoding_name)
        num_tokens = len(encoding.encode(string))
        return num_tokens

    def chunk_text(text, max_tokens=512):
        tokens = tiktoken.get_encoding("cl100k_base").encode(text)
        chunks = []
        for i in range(0, len(tokens), max_tokens):
            chunk = tokens[i:i + max_tokens]
            chunks.append(tiktoken.get_encoding("cl100k_base").decode(chunk))
        return chunks

    token_len = num_tokens_from_string(query)

    if token_len <= 512:
        print("Text fits within 512 tokens, generating single embedding")
        embedding = get_gte_large_embeddings(query)
    else:
        print("Text exceeds 512 tokens, chunking and combining embeddings")
        chunks = chunk_text(query)
        embeddings = []
        for chunk in chunks:
            chunk_embedding = get_gte_large_embeddings(chunk)
            embeddings.append(chunk_embedding)

        # Combine embeddings by taking their mean
        combined_embedding = np.mean(embeddings, axis=0)
        embedding = combined_embedding.flatten().tolist()
    
    result = get_top_similar_docs(embedding, user_id)
    print("result:", result)
    
    return result
