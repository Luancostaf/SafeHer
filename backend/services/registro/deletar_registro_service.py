from models.registro import Registro

class DeletarRegistroService:
    @staticmethod
    def executar(id_registro):
        registro = Registro.buscar_por_id(id_registro)
        if not registro:
            raise ValueError("Avaliação não encontrada.")
        registro.deletar()
        return True