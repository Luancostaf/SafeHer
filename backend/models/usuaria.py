from extensions import db

class Usuaria(db.Model):
    __tablename__ = 'usuaria'

    id_usuario = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(100), nullable=False)
    telefone = db.Column(db.String(20))
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)

    def salvar(self):
        db.session.add(self)
        db.session.commit()

    def atualizar(self, nome=None, telefone=None, email=None, senha=None):
        if nome is not None: self.nome = nome
        if telefone is not None: self.telefone = telefone
        if email is not None: self.email = email
        if senha is not None: self.senha = senha
        db.session.commit()

    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def listar_todos():
        return Usuaria.query.all()

    @staticmethod
    def buscar_por_id(id_usuario):
        return Usuaria.query.get(id_usuario)

    def to_dict(self):
        return {
            'id_usuario': self.id_usuario,
            'nome': self.nome,
            'telefone': self.telefone,
            'email': self.email
        }