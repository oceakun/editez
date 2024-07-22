from flask import jsonify
from app.models.note import Note
from app.models.user import  User
from app.extensions import db
from datetime import datetime, timezone
import numpy as np
from util import summarize_this, create_embedding_and_save_record, update_embedding_for_record, retrieve_similar_content

def to_dict(model):
    dict_representation = {}
    for column in model.__table__.columns:
        value = getattr(model, column.name)
        if isinstance(value, np.ndarray):
            dict_representation[column.name] = value.tolist()
        elif isinstance(value, datetime):
            dict_representation[column.name] = value.isoformat()
        else:
            dict_representation[column.name] = value
    return dict_representation

def validate_note(note):
    errors = []
    if 'title' not in note or not isinstance(note['title'], str):
        errors.append("Title is required and must be a string.")
    if 'content' not in note or not isinstance(note['content'], str):
        errors.append("Content is required and must be a string.")
    return errors

def get_notes_logic(current_user):
    try:
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        notes = Note.query.filter_by(user_id=user.id).all()
        return jsonify([to_dict(note) for note in notes])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

def create_note_logic(current_user, data):
    try:
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
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

def get_note_by_id_logic(current_user, id):
    try:
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        note = Note.query.filter_by(id=id, user_id=user.id).first()
        if not note:
            return jsonify({"error": "Note not found"}), 404
        return jsonify(to_dict(note))
    except Exception as e:
        return jsonify({"error": str(e)}), 400

def update_note_by_id_logic(current_user, id, data):
    try:
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
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
            print(f"Error updating embedding: {str(embedding_error)}")
        return jsonify(to_dict(note))
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

def delete_note_by_id_logic(current_user, id):
    try:
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

def summarize_content_logic(data):
    try:
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

def search_notes_logic(current_user, data):
    try:
        if 'query' not in data:
            return jsonify({"error": "Query not passed in body"}), 400
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        similar_notes = retrieve_similar_content(data['query'], user.id)
        results = [
            {
                "id": note[0],
                "title": note[1],
                "content": note[2],
                "created_at": note[3].isoformat()
            } for note in similar_notes
        ]
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500