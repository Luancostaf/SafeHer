from models.registro import Registro

class LimparHistoricoService:
    @staticmethod
    def executar(id_usuario):
        registros = Registro.query.filter_by(id_usuario=id_usuario).all()
        for registro in registros:
            registro.deletar()
        return True