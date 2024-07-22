from marshmallow import fields, Schema

class NoteSchema(Schema):
    id = fields.String()
    title = fields.String()
    content = fields.String()
    created_at = fields.DateTime()