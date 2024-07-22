from app.extensions import db
from datetime import datetime, timezone
from pgvector.sqlalchemy import Vector

class Note(db.Model):
    __tablename__ = "notes"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String, nullable=False)
    content = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(tz=timezone.utc))
    embeddings = db.Column(Vector(1024))
    user = db.relationship('User', back_populates='notes')