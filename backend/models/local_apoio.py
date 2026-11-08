from extensions import db

class LocalApoio(db.Model):
    __tablename__ = 'local_apoio'

    id_local = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(150), nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    endereco = db.Column(db.String(255), nullable=False)
    telefone = db.Column(db.String(20))
    cidade = db.Column(db.String(100), default='Belo Horizonte')

    def to_dict(self):
        return {
            "id_local": self.id_local,
            "nome": self.nome,
            "categoria": self.categoria,
            "endereco": self.endereco,
            "telefone": self.telefone,
            "cidade": self.cidade
        }