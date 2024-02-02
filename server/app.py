#!/usr/bin/env python3

# Remote library imports
from flask import request, render_template, session, jsonify
from flask_restful import Resource
from models import User, Message

# Local imports
from config import app, db, api
# Requests
class UserResource(Resource):
    """Handles user-related operations.

    - GET: Retrieve user information by user ID.
    - POST: Create a new user.
    - DELETE: Delete a user by user ID.
    """

    def get(self, user_id):
        """Retrieve user information by user ID."""
        user = User.query.get(user_id)
        if user:
            return user.to_dict(rules=('-message',)), 200
        else:
            return {"message": "User not found"}, 404

    def post(self):
        """Create a new user."""
        data = request.get_json()
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user:
            return {"message": "Username already exists"}, 409
        new_user = User(
            username=data['username'],
            email=data['email'],
            password_hash=data['password']
        )

        db.session.add(new_user)
        db.session.commit()
        session["user_id"] = new_user.id
        print(session['user_id'])
        return new_user.to_dict(), 201

    def delete(self, user_id):
        """Delete a user by user ID."""
        user = User.query.get(user_id)

        if not user:
            return {"message": "User not found"}, 404

        db.session.delete(user)
        db.session.commit()

        return {"message": "User has been deleted"}, 204


api.add_resource(UserResource, '/users', '/users/<int:user_id>')

class EditUserResource(Resource):
    """Handles editing user information.

    - PATCH: Update user details by user ID.
    """

    methods = ['PATCH']

    def patch(self, user_id):
        """Update user details by user ID."""
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404

        data = request.get_json()

        if 'username' in data:
            user.username = data['username']
        if 'password' in data:
            user.password_hash = data['password']

        db.session.commit()

        return user.to_dict(), 200

api.add_resource(EditUserResource, '/edituser/<int:user_id>')

class Login(Resource):
    """Handles user login operations.

    - POST: Authenticate user credentials and create a session.
    """

    def post(self):
        """Authenticate user credentials and create a session."""
        data = request.get_json()
        username = data["username"]
        password = data["password"]
        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            session["user_id"] = user.id
            return user.to_dict(), 200
        else:
            return "Unauthorized", 401


api.add_resource(Login, '/login', endpoint="login")

class Logout(Resource):
    """Handles user logout operations.

    - DELETE: Clear user session and log out.
    """

    def delete(self):
        """Clear user session and log out."""
        if session.get("user_id"):
            session.clear()
            return {}, 204
        else:
            return {"message": "User not logged in"}, 401


api.add_resource(Logout, '/logout', endpoint="logout")

class MessageResource(Resource):
    """Handles user message operations.

    - GET: Retrieve messages for a specific user.
    - POST: Send a new message.
    - DELETE: Delete a message by message ID.
    """

    def get(self, user_id):
        """Retrieve messages for a specific user."""
        messages = Message.query.filter(
            (Message.outgoing_user_id == user_id) | (Message.receiving_user_id == user_id)
        ).all()

        messages_list = [message.to_dict() for message in messages]

        return {"messages": messages_list}, 200

    def post(self, user_id):
        """Send a new message."""
        data = request.get_json()

        if 'outgoing_user_id' not in data or 'receiving_user_id' not in data:
            return {"message": "Both outgoing_user_id and receiving_user_id are required"}, 400

        outgoing_user = User.query.get(data['outgoing_user_id'])
        receiving_user = User.query.get(data['receiving_user_id'])

        if not outgoing_user or not receiving_user:
            return {"message": "Invalid user IDs"}, 404

        new_message = Message(
            content=data.get('content'),
            outgoing_user_id=data['outgoing_user_id'],
            receiving_user_id=data['receiving_user_id']
        )

        db.session.add(new_message)
        db.session.commit()

        return new_message.to_dict(), 201

    def delete(self, user_id, message_id):
        """Delete a message by message ID."""
        message = Message.query.get(message_id)

        if not message:
            return {"message": "Message not found"}, 404

        if message.outgoing_user_id == user_id or message.receiving_user_id == user_id:
            db.session.delete(message)
            db.session.commit()

            return {"message": f"Message with ID {message_id} has been deleted"}, 200
        else:
            return {"message": "Unauthorized to delete this message"}, 403


api.add_resource(MessageResource, '/users/<int:user_id>/messages', '/users/<int:user_id>/messages/<int:message_id>')

@app.before_request
def check_session():
    print(session)
    if session.get("user_id") is None:
        session["user_id"] = None
        print(session["user_id"])
    else:
        print("There is a session")
        print(session["user_id"])

class CheckSession(Resource):

    def get(self):
        user_id = session.get('user_id')

        if user_id:
            user = User.query.filter(User.id == user_id).first()
            return user.to_dict(), 200

        return {'message': 'No user session'}, 200

api.add_resource(CheckSession, '/check_session', endpoint="check_session")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")

if __name__ == '__main__':
    app.run(port=5555, debug=True)
