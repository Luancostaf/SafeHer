from flask import request, jsonify
from services.registro_pergunta.salvar_respostas_service import SalvarRespostasService

class RegistroPerguntaController:
    @staticmethod
    def salvar():
        try:
            dados = request.get_json()
            respostas = SalvarRespostasService.executar(dados)
            return jsonify([r.to_dict() for r in respostas]), 201
        except Exception as e:
            return jsonify({'erro': str(e)}), 400