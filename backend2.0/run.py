import os
import sys

try:
    from app import create_app
    from app.extensions import db
except ModuleNotFoundError as e:
    print(f"Missing dependency: {e.name}")
    print("Install with:  python -m pip install -r requirements.txt")
    sys.exit(1)

# 1. Initialize the app using the factory
app = create_app()

# 2. Database & Folder Setup (Runs in both Local & Production)
with app.app_context():
    # Ensure the upload directory exists
    UPLOAD_FOLDER = os.path.join(app.root_path, 'data', 'uploads')
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
    # Ensure tables exist before the app starts
    try:
        db.create_all()
        print("✅ Database tables verified/created.")
    except Exception as e:
        print(f"❌ Database error: {e}")

# 3. Local Development Entry Point
# This block only runs if you type 'python run.py' manually.
# Gunicorn will ignore this and use the 'app' object above.
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(
        debug=True,
        host='0.0.0.0',
        port=port
    )
