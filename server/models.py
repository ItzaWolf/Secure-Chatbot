from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from flask_bcrypt import Bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
from config import db

bcrypt = Bcrypt()

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    _password_hash = db.Column(db.String)

    messages_sent = db.relationship("Message", foreign_keys="Message.author_id", back_populates="author")
    messages_received = db.relationship("Message", foreign_keys="Message.recipient_id", back_populates="recipient")

    serialize_rules = ("-messages_sent.author", "-messages_received.recipient",)

    @validates('username')
    def validate_username(self, key, username):
        if len(username) < 2:
            raise ValueError("Username must be at least two characters long")
        return username

    @validates('password_hash')
    def validate_password_hash(self, key, password_hash):
        # Add any additional validation logic for password_hash if needed
        return password_hash

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise ValueError("Invalid email address, must contain @ symbol")
        return email

class Message(db.Model, SerializerMixin):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    author = db.relationship("User", foreign_keys=[author_id], back_populates="messages_sent")
    recipient = db.relationship("User", foreign_keys=[recipient_id], back_populates="messages_received")

    serialize_rules = ("-author.messages_sent", "-recipient.messages_received", "author_id", "recipient_id", "content",)

    @validates('content')
    def validate_content(self, key, content):
        if content is None or len(content) < 1:
            raise ValueError("Content must be at least one character long")
        return content