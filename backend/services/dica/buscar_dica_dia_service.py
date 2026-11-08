from models.dica import Dica

class BuscarDicaDiaService:
    @staticmethod
    def executar():
        dicas = Dica.listar_todos()
        return dicas[0] if dicas else None