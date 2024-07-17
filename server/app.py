
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os
from extensions import db, jwt
from auth import auth_bp
from users import user_bp
from notes import note_bp
from models import User, TokenBlocklist

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Load configuration from environment variables
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['DEBUG'] = os.getenv('DEBUG_MODE') == 'development'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

    allowed_origins = os.getenv('ALLOWED_ORIGINS').split(',')

    CORS(app, resources={r"/*": {"origins": allowed_origins}})

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(user_bp, url_prefix="/users")
    app.register_blueprint(note_bp, url_prefix="/data")

    # JWT configuration

    # Load user
    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_headers, jwt_data):
        identity = jwt_data["sub"]
        return User.query.filter_by(username=identity).one_or_none()

    # Additional claims
    @jwt.additional_claims_loader
    def make_additional_claims(identity):
        if identity == "thecreator":
            return {"is_staff": True}
        return {"is_staff": False}

    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_data):
        return jsonify({"message": "Token has expired", "error": "token_expired"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"message": "Signature verification failed", "error": "invalid_token"}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({"message": "Request doesn't contain valid token", "error": "authorization_header"}), 401

    @jwt.token_in_blocklist_loader
    def token_in_blocklist_callback(jwt_header, jwt_data):
        jti = jwt_data['jti']
        token = db.session.query(TokenBlocklist).filter(TokenBlocklist.jti == jti).scalar()
        return token is not None

    with app.app_context():
        db.create_all()


    return app

# Main entry point for running the Flask application
if __name__ == "__main__":
    app = create_app()
    app.run(port=int(os.getenv("PORT", 4000)))