from extensions import db

class Contato(db.Model):
    __tablename__ = 'contato'
    
    id_contato = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuaria.id_usuario', ondelete='CASCADE'), nullable=False)
    nome = db.Column(db.String(100), nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100))

    def to_dict(self):
        return {
            "id_contato": self.id_contato,
            "id_usuario": self.id_usuario,
            "nome": self.nome,
            "telefone": self.telefone,
            "email": self.email
        }