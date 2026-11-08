from flask import jsonify
from services.pergunta.listar_perguntas_service import ListarPerguntasService

class PerguntaController:
    @staticmethod
    def listar():
        perguntas = ListarPerguntasService.executar()
        return jsonify([p.to_dict() for p in perguntas]), 200