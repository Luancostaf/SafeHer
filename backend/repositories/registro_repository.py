from models.registro import Registro
from extensions import db
from sqlalchemy import text

class RegistroRepository:
    @staticmethod
    def listar_historico_usuario(id_usuario):
        return Registro.query.filter_by(id_usuario=id_usuario)\
                             .order_by(Registro.data_avaliacao.desc())\
                             .all()

    # Encapsulamento de Chamadas a Stored Procedures
    @staticmethod
    def listar_historico_procedure(id_usuario):
        sql = text("CALL listar_historico_usuario(:id_usuario)")
        result = db.session.execute(sql, {'id_usuario': id_usuario})
        return result.fetchall()

    @staticmethod
    def detalhes_registro_procedure(id_registro):
        sql = text("CALL detalhes_registro(:id_registro)")
        result = db.session.execute(sql, {'id_registro': id_registro})
        return result.fetchall()

    @staticmethod
    def resultado_avaliacao_procedure(id_registro):
        sql = text("CALL resultado_avaliacao(:id_registro)")
        result = db.session.execute(sql, {'id_registro': id_registro})
        return result.fetchone()