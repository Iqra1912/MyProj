# __init__.py - cleaned up, one create_app()
from flask import Flask, app, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from .extensions import db, jwt, mail, oauth, bcrypt

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
      # In create_app(), add these lines:
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False  # False for localhost
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config.setdefault('SQLALCHEMY_DATABASE_URI', 'sqlite:///database.db')
    app.config.setdefault('SQLALCHEMY_TRACK_MODIFICATIONS', False)
    app.config.setdefault('SECRET_KEY', 'eedbef9e9d4b97e472e29d880ec4fc46129640baa871a99d04649929e90edb20')
    
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    oauth.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    oauth.register(
        name='google',
        client_id=app.config.get("GOOGLE_CLIENT_ID"),
        client_secret=app.config.get("GOOGLE_CLIENT_SECRET"),
        access_token_url='https://oauth2.googleapis.com/token',
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'}
    )

    from .routes.auth import auth_bp
    from .routes.dataset import datasets_bp
    from .routes.dashboard import dashboard_bp
    from .routes.data_routes import data_bp
    from .routes.upload import upload_bp
    from .routes.ai_routes import ai_bp

    app.register_blueprint(auth_bp,      url_prefix="/api/auth")
    app.register_blueprint(datasets_bp,  url_prefix="/api/datasets")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(data_bp,      url_prefix="/api/data")
    app.register_blueprint(upload_bp,    url_prefix="/api")
    app.register_blueprint(ai_bp,        url_prefix="/api")

    @app.route("/")
    def home():
        return redirect("http://localhost:5173")

    return app