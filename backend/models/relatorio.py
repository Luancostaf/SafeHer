from extensions import db
from datetime import datetime

class Relatorio(db.Model):
    __tablename__ = 'registro_relatorio'

    id_relatorio = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuaria.id_usuario', ondelete='CASCADE'), nullable=False)
    titulo = db.Column(db.String(150), nullable=False)
    senha_hash = db.Column(db.String(255))
    data_geracao = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id_relatorio": self.id_relatorio,
            "id_usuario": self.id_usuario,
            "titulo": self.titulo,
            "data_geracao": self.data_geracao.strftime('%d/%m/%Y') if self.data_geracao else None
        }