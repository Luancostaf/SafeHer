from flask import Flask, render_template
from flask_cors import CORS
from config import Config
from extensions import db

def create_app():
    app = Flask(__name__, static_folder='../frontend/assets', template_folder='../frontend')
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)

    # IMPORTANTE: Força o registo de todos os modelos no SQLAlchemy antes do roteamento
    with app.app_context():
        from models.usuaria import Usuaria
        from models.pergunta import Pergunta
        from models.dica import Dica
        from models.recomendacao import Recomendacao
        from models.registro import Registro
        from models.registro_pergunta import RegistroPergunta
        from models.contato import Contato
        from models.diario import Diario 
        from models.chat import ChatMensagem

    @app.route('/')
    def index():
        return render_template('index.html')

    from routes import registrar_rotas
    registrar_rotas(app)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)