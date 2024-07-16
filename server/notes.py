from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timezone
from models import Note, User
from extensions import db
from util import summarize_this, create_embedding_and_save_record, update_embedding_for_record, retrieve_similar_content

note_bp = Blueprint("notes", __name__)

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


# GET endpoint to retrieve all notes
@note_bp.route("/notes", methods=["GET"])
@jwt_required()
def get_notes():
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        notes = Note.query.filter_by(user_id=user.id).all()
        return jsonify([to_dict(note) for note in notes])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    
# POST endpoint to create a note
@note_bp.route("/notes", methods=["POST"])
@jwt_required()
def create_note():
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.json
        validation_errors = validate_note(data)
        if validation_errors:
            return jsonify({"errors": validation_errors}), 400

        title = data['title']
        content = data['content']
        created_at = datetime.now(tz=timezone.utc)

        new_note = create_embedding_and_save_record(user.id, title, content, created_at)
        return jsonify(new_note), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    
# GET endpoint to retrieve a single note by ID
@note_bp.route("/notes/<int:id>", methods=["GET"])
@jwt_required()
def get_note_by_id(id):
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        note = Note.query.filter_by(id=id, user_id=user.id).first()
        if not note:
            return jsonify({"error": "Note not found"}), 404
        return jsonify(to_dict(note))
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# PATCH endpoint to update a note by ID
@note_bp.route("/notes/<int:id>", methods=["PATCH"])
@jwt_required()
def update_note_by_id(id):
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.json
        validation_errors = validate_note(data)
        if validation_errors:
            return jsonify({"errors": validation_errors}), 400

        note = Note.query.filter_by(id=id, user_id=user.id).first()
        if not note:
            return jsonify({"error": "Note not found"}), 404

        if 'title' in data:
            note.title = data['title']
        if 'content' in data:
            note.content = data['content']
        note.created_at = datetime.now(tz=timezone.utc)

        db.session.commit()

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
@note_bp.route("/notes/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_note_by_id(id):
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        note = Note.query.filter_by(id=id, user_id=user.id).first()
        if not note:
            return jsonify({"error": "Note not found"}), 404

        db.session.delete(note)
        db.session.commit()
        return jsonify({"message": "Note deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# endpoint to summarize content
@note_bp.route("/summarize", methods=["POST"])
@jwt_required()
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

        summary = summarize_this(input=content, model=model_path)
        return jsonify({"summary": summary}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# endpoint to run vector search
@note_bp.route("/search", methods=["POST"])
@jwt_required()
def search_notes():
    try:
        data = request.json
        if 'query' not in data:
            return jsonify({"error": "Query not passed in body"}), 400

        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Pass userId to the retrieve_similar_content function
        similar_notes = retrieve_similar_content(data['query'], user.id)
        
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
