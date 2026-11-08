from extensions import db
from datetime import datetime

class Agenda(db.Model):
    __tablename__ = 'agenda'

    id_evento = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuaria.id_usuario', ondelete='CASCADE'), nullable=False)
    titulo = db.Column(db.String(150), nullable=False)
    detalhe = db.Column(db.String(255))
    dia = db.Column(db.String(10), nullable=False)
    mes = db.Column(db.String(10), nullable=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id_evento": self.id_evento,
            "id_usuario": self.id_usuario,
            "titulo": self.titulo,
            "detalhe": self.detalhe,
            "dia": self.dia,
            "mes": self.mes
        }