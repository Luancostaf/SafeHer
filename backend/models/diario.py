from extensions import db
from datetime import datetime

class Diario(db.Model):
    __tablename__ = 'diario'

    id_diario = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuaria.id_usuario', ondelete='CASCADE'), nullable=False)
    titulo = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    data_ocorrido = db.Column(db.Date, nullable=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id_diario": self.id_diario,
            "id_usuario": self.id_usuario,
            "titulo": self.titulo,
            "descricao": self.descricao,
            "data_ocorrido": self.data_ocorrido.strftime('%Y-%m-%d') if self.data_ocorrido else None,
            "data_criacao": self.data_criacao.strftime('%Y-%m-%d %H:%M:%S') if self.data_criacao else None
        }