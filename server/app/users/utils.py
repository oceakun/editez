from flask import jsonify
from app.models.user import User
from app.schemas.user import UserSchema

def get_all_users_logic(claims, page, per_page):
    if claims.get("is_staff") == True:
        users = User.query.paginate(page=page, per_page=per_page)
        result = UserSchema().dump(users, many=True)
        return (
            jsonify(
                {
                    "users": result,
                }
            ),
            200,
        )
    return jsonify({"message": "You are not authorized to access this"}), 401