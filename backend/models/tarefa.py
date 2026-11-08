from extensions import db
from datetime import datetime

class Tarefa(db.Model):
    __tablename__ = 'autocuidado_tarefas'

    id_tarefa = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuaria.id_usuario', ondelete='CASCADE'), nullable=False)
    titulo = db.Column(db.String(150), nullable=False)
    detalhe = db.Column(db.String(255))
    concluida = db.Column(db.Boolean, default=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id_tarefa": self.id_tarefa,
            "id_usuario": self.id_usuario,
            "titulo": self.titulo,
            "detalhe": self.detalhe,
            "concluida": self.concluida
        }