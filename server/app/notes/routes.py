from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.notes.utils import (
    get_notes_logic, create_note_logic, get_note_by_id_logic,
    update_note_by_id_logic, delete_note_by_id_logic,
    summarize_content_logic, search_notes_logic
)

note_bp = Blueprint("notes", __name__)

@note_bp.route("/notes", methods=["GET"])
@jwt_required()
def get_notes():
    return get_notes_logic(get_jwt_identity())

@note_bp.route("/notes", methods=["POST"])
@jwt_required()
def create_note():
    return create_note_logic(get_jwt_identity(), request.json)

@note_bp.route("/notes/<int:id>", methods=["GET"])
@jwt_required()
def get_note_by_id(id):
    return get_note_by_id_logic(get_jwt_identity(), id)

@note_bp.route("/notes/<int:id>", methods=["PATCH"])
@jwt_required()
def update_note_by_id(id):
    return update_note_by_id_logic(get_jwt_identity(), id, request.json)

@note_bp.route("/notes/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_note_by_id(id):
    return delete_note_by_id_logic(get_jwt_identity(), id)

@note_bp.route("/summarize", methods=["POST"])
@jwt_required()
def summarize_content():
    return summarize_content_logic(request.json)

@note_bp.route("/search", methods=["POST"])
@jwt_required()
def search_notes():
    return search_notes_logic(get_jwt_identity(), request.json)