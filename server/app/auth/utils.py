from flask import jsonify
from flask_jwt_extended import create_access_token, create_refresh_token
from app.models.user import User
from app.models.tokenblocklist import TokenBlocklist

def register_user_logic(data):
    user = User.get_user_by_username(username=data.get("username"))
    if user is not None:
        return jsonify({"error": "User already exists"}), 409
    new_user = User(username=data.get("username"), email=data.get("email"))
    new_user.set_password(password=data.get("password"))
    new_user.save()
    return jsonify({"message": "User created"}), 201

def login_user_logic(data):
    username = data.get('username')
    password = data.get('password')
    user = User.get_user_by_username(username)
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.username)
        refresh_token = create_refresh_token(identity=user.username)
        return (
            jsonify(
                {
                    "message": "Logged In ",
                    "tokens": {"access": access_token, "refresh": refresh_token},
                    "user": {
                        "email": user.get_email(),
                        "username": user.username
                    }
                }
            ),
            200,
        )
    return jsonify({"error": "Invalid username or password"}), 400

def logout_user_logic(jwt):
    jti = jwt['jti']
    token_type = jwt['type']
    token_b = TokenBlocklist(jti=jti)
    token_b.save()
    return jsonify({"message": f"{token_type} token revoked successfully"}), 200