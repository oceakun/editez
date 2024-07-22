from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from .utils import get_all_users_logic

user_bp = Blueprint("users", __name__)

@user_bp.get("/all")
@jwt_required()
def get_all_users():
    claims = get_jwt()
    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=3, type=int)
    return get_all_users_logic(claims, page, per_page)