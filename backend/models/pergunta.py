from extensions import db

class Pergunta(db.Model):
    __tablename__ = 'pergunta'

    id_pergunta = db.Column(db.Integer, primary_key=True, autoincrement=True)
    texto = db.Column(db.Text, nullable=False)
    categoria = db.Column(db.String(50))
    peso = db.Column(db.Integer, nullable=False)
    ordem = db.Column(db.Integer, nullable=False)

    def salvar(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def listar_todos():
        return Pergunta.query.order_by(Pergunta.ordem.asc()).all()

    @staticmethod
    def buscar_por_id(id_pergunta):
        return Pergunta.query.get(id_pergunta)

    def to_dict(self):
        return {
            'id_pergunta': self.id_pergunta,
            'texto': self.texto,
            'categoria': self.categoria,
            'peso': self.peso,
            'ordem': self.ordem
        }