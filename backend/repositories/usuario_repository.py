from models.usuaria import Usuaria

class UsuarioRepository:
    @staticmethod
    def buscar_por_email(email):
        return Usuaria.query.filter_by(email=email).first()

    @staticmethod
    def buscar_por_id(id_usuario):
        return Usuaria.query.get(id_usuario)