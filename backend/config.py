import os

class Config:
    # Conexão sem senha para o usuário root no MySQL local
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 
        'mysql+pymysql://root:@localhost:3306/safeher'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'safeher_secret_key')