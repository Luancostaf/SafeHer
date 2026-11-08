from flask import request, jsonify
from services.registro.criar_registro_service import CriarRegistroService
from services.registro.listar_historico_service import ListarHistoricoService
from services.registro.deletar_registro_service import DeletarRegistroService
from services.registro.limpar_historico_service import LimparHistoricoService

class RegistroController:
    @staticmethod
    def criar():
        try:
            dados = request.get_json()
            registro = CriarRegistroService.executar(dados)
            return jsonify(registro.to_dict()), 201
        except Exception as e:
            return jsonify({'erro': str(e)}), 400

    @staticmethod
    def listar_historico(id_usuario):
        historico = ListarHistoricoService.executar(id_usuario)
        return jsonify([h.to_dict() for h in historico]), 200

    @staticmethod
    def deletar(id_registro):
        try:
            DeletarRegistroService.executar(id_registro)
            return jsonify({'mensagem': 'Avaliação excluída com sucesso.'}), 200
        except Exception as e:
            return jsonify({'erro': str(e)}), 400

    @staticmethod
    def limpar_historico(id_usuario):
        try:
            LimparHistoricoService.executar(id_usuario)
            return jsonify({'mensagem': 'Histórico limpo com sucesso.'}), 200
        except Exception as e:
            return jsonify({'erro': str(e)}), 400