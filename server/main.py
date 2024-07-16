from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from datetime import datetime, timezone
from transformers import pipeline
from flask_cors import CORS
from util import summarize_this
from util import create_embedding_and_save_record
from util import update_embedding_for_record
from util import retrieve_similar_content
from models import Note

load_dotenv()

app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": "*"}})
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # Adjust the origin as needed
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db = SQLAlchemy(app)

# Define the Note model
class Note(db.Model):
    __tablename__ = 'secondbrain_notes_record'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    content = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(tz=timezone.utc))

# Utility function to convert model instance to dictionary
def to_dict(model):
    return {c.name: getattr(model, c.name) for c in model.__table__.columns}

# Simple data validation function
def validate_note(note):
    errors = []
    if 'title' not in note or not isinstance(note['title'], str):
        errors.append("Title is required and must be a string.")
    if 'content' not in note or not isinstance(note['content'], str):
        errors.append("Content is required and must be a string.")
    return errors

@app.before_request
def before_request():
    headers = {'Access-Control-Allow-Origin': '*',
               'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
               'Access-Control-Allow-Headers': 'Content-Type'}
    if request.method.lower() == 'options':
        return jsonify(headers), 200

# GET endpoint to retrieve all notes
@app.route("/api/notes", methods=["GET"])
def get_notes():
    try:
        notes = Note.query.all()
        return jsonify([to_dict(note) for note in notes])
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
# POST endpoint to create a note
@app.route("/api/notes", methods=["POST"])
def create_note():
    try:
        data = request.json
        validation_errors = validate_note(data)
        if validation_errors:
            return jsonify({"errors": validation_errors}), 400
        
        title = data['title']
        content = data['content']
        created_at = datetime.now(tz=timezone.utc)
        
        new_note = create_embedding_and_save_record(title, content, created_at)
        return jsonify(new_note), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
# GET endpoint to retrieve a single note by ID
@app.route("/api/notes/<int:id>", methods=["GET"])
def get_note_by_id(id):
    try:
        note = Note.query.get(id)
        if not note:
            return jsonify({"error": "Note not found"}), 404
        return jsonify(to_dict(note))
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# PUT endpoint to update a note by ID

@app.route("/api/notes/<int:id>", methods=["PATCH"])
def update_note_by_id(id):
    try:
        data = request.json
        validation_errors = validate_note(data)
        if validation_errors:
            return jsonify({"errors": validation_errors}), 400

        note = Note.query.get(id)
        if not note:
            return jsonify({"error": "Note not found"}), 404

        # Update only the fields that are present in the request
        if 'title' in data:
            note.title = data['title']
        if 'content' in data:
            note.content = data['content']
        
        note.created_at = datetime.now(tz=timezone.utc)
        
        # Commit changes to get the updated timestamp
        db.session.commit()
        
        # Update embedding
        try:
            update_embedding_for_record(
                id=note.id,
                title=note.title,
                content=note.content,
                created_at=note.created_at
            )
        except Exception as embedding_error:
            # Log the error, but don't fail the whole request
            print(f"Error updating embedding: {str(embedding_error)}")

        return jsonify(to_dict(note))

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

# DELETE endpoint to delete a note by ID
@app.route("/api/notes/<int:id>", methods=["DELETE"])
def delete_note_by_id(id):
    try:
        note = Note.query.get(id)
        if not note:
            return jsonify({"error": "Note not found"}), 404

        db.session.delete(note)
        db.session.commit()
        return jsonify({"message": "Note deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# New endpoint to summarize content
@app.route("/api/summarize", methods=["POST"])
def summarize_content():
    try:
        data = request.json
        if 'content' not in data or not isinstance(data['content'], str):
            return jsonify({"error": "Content is required and must be a string."}), 400
        if 'model' not in data or not isinstance(data['model'], str):
            return jsonify({"error": "Model is required and must be a string."}), 400

        content = data['content']
        model_path = data['model']
        print("model_path : ", model_path)

        # if model_path=="Falconsai/text_summarization"

        summary = summarize_this(input=content, model=model_path)
        return jsonify({"summary": summary}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# endpoint to run vector search
@app.route("/api/search", methods=["POST"])
def search_notes():
    try:
        data = request.json
        if 'query' not in data:
            return jsonify({"error": "Query not passed in body"}), 400

        similar_notes = retrieve_similar_content(data['query'])
        results = [
            {
                "id": note[0],            # ID is the first element of the tuple
                "title": note[1],         # Title is the second element of the tuple
                "content": note[2],       # Content is the third element of the tuple
                "created_at": note[3].isoformat()  # Created_at is the fourth element of the tuple
            } for note in similar_notes
        ]
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(port=int(os.getenv("PORT", 4000)))
