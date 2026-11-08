from extensions import db

class Recomendacao(db.Model):
    __tablename__ = 'recomendacao'

    id_recomendacao = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nivel = db.Column(db.Enum('BAIXO', 'MODERADO', 'ALTO'), nullable=False)
    titulo = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=False)

    @staticmethod
    def listar_todos():
        return Recomendacao.query.all()

    def to_dict(self):
        return {
            'id_recomendacao': self.id_recomendacao,
            'nivel': self.nivel,
            'titulo': self.titulo,
            'descricao': self.descricao
        }