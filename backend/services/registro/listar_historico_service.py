from repositories.registro_repository import RegistroRepository

class ListarHistoricoService:
    @staticmethod
    def executar(id_usuario):
        return RegistroRepository.listar_historico_usuario(id_usuario)