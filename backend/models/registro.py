from extensions import db
from datetime import datetime

class Registro(db.Model):
    __tablename__ = 'registro'

    id_registro = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuaria.id_usuario'), nullable=False)
    id_recomendacao = db.Column(db.Integer, db.ForeignKey('recomendacao.id_recomendacao'), nullable=True)
    data_avaliacao = db.Column(db.DateTime, default=datetime.utcnow)
    indice_comportamental = db.Column(db.Numeric(5, 2), nullable=False)
    classificacao = db.Column(db.Enum('BAIXO', 'MODERADO', 'ALTO'), nullable=False)
    observacao = db.Column(db.Text, nullable=True)

    def salvar(self):
        db.session.add(self)
        db.session.commit()

    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def buscar_por_id(id_registro):
        return Registro.query.get(id_registro)

    def to_dict(self):
        return {
            'id_registro': self.id_registro,
            'id_usuario': self.id_usuario,
            'id_recomendacao': self.id_recomendacao,
            'data_avaliacao': self.data_avaliacao.strftime('%Y-%m-%d %H:%M:%S') if self.data_avaliacao else None,
            'indice_comportamental': float(self.indice_comportamental),
            'classificacao': self.classificacao,
            'observacao': self.observacao
        }