#!/usr/bin/env python3

# Standard library imports
# Remote library imports

# Local imports
from app import app
from models import db, User, Message

user_data = [
    {
        "username": "KB",
        "email": "kalebbolack14@gmail.com",
        "password": "3517"
    },
    {
        "username": "KAB",
        "email": "shutupkk22@gmail.com",
        "password": "0314"
    }
]

message_data = [
    {
        "content": "What's up, friend!",
        "author_id": 1,
        "recipient_id": 2
    }
]

if __name__ == '__main__':
    with app.app_context():
        try:
            print("Starting seed...")

            db.drop_all()
            db.create_all()

            print("Tables reset")

            for user_info in user_data:
                user = User.query.filter_by(email=user_info["email"]).first()
                if user is None:
                    user = User(username=user_info["username"], email=user_info["email"])
                    user.password_hash = user_info["password"]
                    db.session.add(user)
            db.session.commit()
            print("Finished Seeding User")

            for message_info in message_data:
                message = Message(
                    content=message_info["content"],
                    author_id=message_info["author_id"],
                    recipient_id=message_info["recipient_id"]
                )
                db.session.add(message)

            db.session.commit()
            print("Finished Seeding Message")

            print("Seeding Completed! Tables have been compiled!")

        except Exception as e:
            print(f"Error during seed: {e}")
