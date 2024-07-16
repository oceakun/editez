import psycopg2
import numpy as np
from psycopg2.extras import DictCursor
from pgvector.psycopg2 import register_vector
from transformers import AutoTokenizer, AutoModel
import tiktoken
from datetime import datetime

def create_embedding_and_save_record(user_id: int, title: str, content: str, created_at: datetime):
    print(f"Processing new record")

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

    def chunk_text(text, max_tokens=512):
        tokens = tiktoken.get_encoding("cl100k_base").encode(text)
        chunks = []
        for i in range(0, len(tokens), max_tokens):
            chunk = tokens[i:i + max_tokens]
            chunks.append(tiktoken.get_encoding("cl100k_base").decode(chunk))
        return chunks

    print("Connecting to the database")
    conn = psycopg2.connect(
        dbname="second_brain",
        user="postgres",
        password="here_goes_the_password",
        host="localhost"
    )
    cur = conn.cursor(cursor_factory=DictCursor)

    print("Checking for vector extension")
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    conn.commit()
    register_vector(conn)

    print("Ensuring embeddings column exists")
    cur.execute("""
        ALTER TABLE notes
        ADD COLUMN IF NOT EXISTS embeddings VECTOR(1024);
    """)
    conn.commit()

    combined_text = f"{title} {content} {created_at}"
    print(f"Combined text length: {len(combined_text)} characters")
    token_len = num_tokens_from_string(combined_text)
    print(f"Token length: {token_len}")

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

    print("Inserting new record with embedding")
    cur.execute("""
        INSERT INTO notes (user_id, title, content, created_at, embeddings)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING *;
    """, (user_id, title, content, created_at, embedding_list))

    new_note = cur.fetchone()
    conn.commit()

    print("Ensuring index on embeddings column")
    cur.execute("""
        CREATE INDEX IF NOT EXISTS notes_embeddings_idx
        ON notes USING ivfflat (embeddings vector_cosine_ops);
    """)
    conn.commit()

    cur.close()
    conn.close()
    print("Record saved successfully. Database connection closed")

    # Convert new_note to a dictionary and ensure all values are JSON-serializable
    result = dict(new_note)
    result['created_at'] = result['created_at'].isoformat()  # Ensure datetime is JSON-serializable
    result['embeddings'] = result['embeddings'].tolist()  # Ensure embeddings are JSON-serializable

    return result
