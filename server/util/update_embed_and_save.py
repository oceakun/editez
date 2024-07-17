import psycopg2,os,tiktoken
import numpy as np
from psycopg2.extras import execute_values
from pgvector.psycopg2 import register_vector
from transformers import AutoTokenizer, AutoModel
from datetime import datetime

def update_embedding_for_record(id: int, title: str, content: str, created_at: datetime):
    print(f"Processing record: {id}")
    
    # Initialize the tokenizer and model
    print("Initializing tokenizer and model")
    tokenizer = AutoTokenizer.from_pretrained("thenlper/gte-large")
    model = AutoModel.from_pretrained("thenlper/gte-large")

    def get_gte_large_embeddings(text):
        print("Generating embeddings")
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        outputs = model(**inputs)
        embeddings = outputs.last_hidden_state.mean(dim=1).detach().numpy()
        return embeddings

    def num_tokens_from_string(string: str, encoding_name="cl100k_base") -> int:
        if not string:
            return 0
        encoding = tiktoken.get_encoding(encoding_name)
        num_tokens = len(encoding.encode(string))
        return num_tokens

    print("Connecting to the database")
    dbname = os.getenv('DB_NAME')
    user = os.getenv('DB_USER')
    password = os.getenv('DB_PASSWORD')
    host = os.getenv('DB_HOST')

    # Connect to the database
    conn = psycopg2.connect(
    dbname=dbname,
    user=user,
    password=password,
    host=host
    )
    cur = conn.cursor()

    print("Checking for vector extension")
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    conn.commit()
    register_vector(conn)

    combined_text = f"{title} {content} {created_at}"
    print(f"Combined text length: {len(combined_text)} characters")
    token_len = num_tokens_from_string(combined_text)
    print(f"Token length: {token_len}")

    def chunk_text(text, max_tokens=512):
        tokens = tiktoken.get_encoding("cl100k_base").encode(text)
        chunks = []
        for i in range(0, len(tokens), max_tokens):
            chunk = tokens[i:i + max_tokens]
            chunks.append(tiktoken.get_encoding("cl100k_base").decode(chunk))
        return chunks

    if token_len <= 512:
        print("Text fits within 512 tokens, generating single embedding")
        embedding = get_gte_large_embeddings(combined_text)
        embedding_list = embedding.flatten().tolist()
    else:
        print("Text exceeds 512 tokens, chunking and combining embeddings")
        chunks = chunk_text(combined_text)
        embeddings = []
        for chunk in chunks:
            chunk_embedding = get_gte_large_embeddings(chunk)
            embeddings.append(chunk_embedding)
        
        # Combine embeddings by taking their mean
        combined_embedding = np.mean(embeddings, axis=0)
        embedding_list = combined_embedding.flatten().tolist()

    print("Updating record in database")
    cur.execute("""
        UPDATE notes
        SET title = %s, content = %s, created_at = %s, embeddings = %s
        WHERE id = %s;
    """, (title, content, created_at, embedding_list, id))
    print(f"Record with id {id} updated successfully with new embedding.")

    conn.commit()

    print("Ensuring index on embeddings column")
    cur.execute("""
        CREATE INDEX IF NOT EXISTS notes_embeddings_idx
        ON notes USING ivfflat (embeddings vector_cosine_ops);
    """)
    conn.commit()

    cur.close()
    conn.close()
