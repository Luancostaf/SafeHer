from extensions import db
from datetime import datetime

class ChatMensagem(db.Model):
    __tablename__ = 'chat_mensagens'

    id_mensagem = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_usuario = db.Column(db.Integer, nullable=False)
    remetente = db.Column(db.String(20), nullable=False)
    mensagem = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id_mensagem": self.id_mensagem,
            "id_usuario": self.id_usuario,
            "remetente": self.remetente,
            "mensagem": self.mensagem,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }