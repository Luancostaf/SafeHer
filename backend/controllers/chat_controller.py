from flask import request, jsonify
from services.chat.processar_chat_service import ProcessarChatService

class ChatController:
    @staticmethod
    def enviar_mensagem():
        dados = request.get_json()
        id_usuario = dados.get('id_usuario')
        mensagem = dados.get('mensagem')

        if not id_usuario or not mensagem:
            return jsonify({"erro": "ID de usuário e mensagem são obrigatórios."}), 400

        try:
            # Alinhado para chamar o método correto do serviço
            resposta = ProcessarChatService.processar(id_usuario, mensagem)
            return jsonify({"resposta": resposta}), 200
        except Exception as e:
            print(f"Erro no ChatController (enviar_mensagem): {str(e)}")
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def obter_historico(id_usuario):
        try:
            historico = ProcessarChatService.listar_historico(id_usuario)
            return jsonify(historico), 200
        except Exception as e:
            print(f"Erro no ChatController (obter_historico): {str(e)}")
            return jsonify({"erro": str(e)}), 500