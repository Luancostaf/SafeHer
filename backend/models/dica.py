from extensions import db

class Dica(db.Model):
    __tablename__ = 'dica'

    id_dica = db.Column(db.Integer, primary_key=True, autoincrement=True)
    titulo = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=False)

    def salvar(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def listar_todos():
        return Dica.query.all()

    def to_dict(self):
        return {
            'id_dica': self.id_dica,
            'titulo': self.titulo,
            'descricao': self.descricao
        }