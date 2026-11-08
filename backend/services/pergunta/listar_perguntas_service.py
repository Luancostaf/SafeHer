from models.pergunta import Pergunta

class ListarPerguntasService:
    @staticmethod
    def executar():
        return Pergunta.listar_todos()