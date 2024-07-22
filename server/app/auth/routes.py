from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    jwt_required,
    get_jwt,
    current_user,
    create_access_token,
    get_jwt_identity,
)
from .utils import register_user_logic, login_user_logic, logout_user_logic

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def register_user():
    return register_user_logic(request.get_json())

@auth_bp.post("/login")
def login_user():
    return login_user_logic(request.get_json())

@auth_bp.get("/whoami")
@jwt_required()
def whoami():
    return jsonify(
        {
            "message": "message",
            "user": {
                "username": current_user.username,
                "email": current_user.email,
            },
        }
    )

@auth_bp.get("/refresh")
@jwt_required(refresh=True)
def refresh_access():
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity)
    return jsonify({"access_token": new_access_token})

@auth_bp.get('/logout')
@jwt_required(verify_type=False)
def logout_user():
    jwt = get_jwt()
    return logout_user_logic(jwt)