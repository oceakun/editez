import os
from dotenv import load_dotenv

print("Before importing create_app")
from app import create_app
print("After importing create_app")

load_dotenv()
app = create_app()

if __name__ == "__main__":
    app.run(port=int(os.getenv("PORT", 4000)))