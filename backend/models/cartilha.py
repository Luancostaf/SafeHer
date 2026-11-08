from extensions import db

class Cartilha(db.Model):
    __tablename__ = 'cartilha'

    id_artigo = db.Column(db.Integer, primary_key=True, autoincrement=True)
    titulo = db.Column(db.String(150), nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    conteudo = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            "id_artigo": self.id_artigo,
            "titulo": self.titulo,
            "categoria": self.categoria,
            "conteudo": self.conteudo
        }