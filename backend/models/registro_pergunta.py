from extensions import db

class RegistroPergunta(db.Model):
    __tablename__ = 'registro_pergunta'

    id_registro = db.Column(db.Integer, db.ForeignKey('registro.id_registro', ondelete='CASCADE'), primary_key=True)
    id_pergunta = db.Column(db.Integer, db.ForeignKey('pergunta.id_pergunta'), primary_key=True)
    resposta = db.Column(db.Enum('NUNCA', 'RARAMENTE', 'AS_VEZES', 'FREQUENTEMENTE', 'SEMPRE'), nullable=False)

    def salvar(self):
        db.session.add(self)
        db.session.commit()

    def to_dict(self):
        return {
            'id_registro': self.id_registro,
            'id_pergunta': self.id_pergunta,
            'resposta': self.resposta
        }