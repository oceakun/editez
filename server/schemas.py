from marshmallow import fields, Schema


class UserSchema(Schema):
    id = fields.String()
    username = fields.String()
    email = fields.String()

class NoteSchema(Schema):
    id = fields.String()
    title = fields.String()
    content = fields.String()
    created_at = fields.DateTime()