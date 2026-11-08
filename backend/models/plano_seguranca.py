from extensions import db
from datetime import datetime

class PlanoSeguranca(db.Model):
    __tablename__ = 'plano_seguranca'

    id_plano = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuaria.id_usuario', ondelete='CASCADE'), nullable=False)
    onde_ir = db.Column(db.String(100), nullable=False)
    documentos = db.Column(db.Text)
    contatos_emergencia = db.Column(db.Text)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id_plano": self.id_plano,
            "id_usuario": self.id_usuario,
            "onde_ir": self.onde_ir,
            "documentos": self.documentos,
            "contatos_emergencia": self.contatos_emergencia,
            "data_atualizacao": self.data_atualizacao.strftime('%Y-%m-%d %H:%M:%S') if self.data_atualizacao else None
        }