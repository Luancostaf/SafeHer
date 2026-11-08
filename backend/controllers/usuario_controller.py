from flask import request, jsonify
from services.usuario.cadastrar_usuario_service import CadastrarUsuarioService
from services.usuario.autenticar_usuario_service import AutenticarUsuarioService
from services.usuario.atualizar_usuario_service import AtualizarUsuarioService
from services.usuario.alterar_senha_service import AlterarSenhaService

class UsuarioController:
    @staticmethod
    def cadastrar():
        try:
            dados = request.get_json()
            usuario = CadastrarUsuarioService.executar(dados)
            return jsonify(usuario.to_dict()), 201
        except ValueError as e:
            return jsonify({'erro': str(e)}), 400

    @staticmethod
    def login():
        try:
            dados = request.get_json()
            usuario = AutenticarUsuarioService.executar(dados.get('email'), dados.get('senha'))
            return jsonify(usuario.to_dict()), 200
        except ValueError as e:
            return jsonify({'erro': str(e)}), 401

    @staticmethod
    def atualizar(id_usuario):
        try:
            dados = request.get_json()
            usuario = AtualizarUsuarioService.executar(id_usuario, dados)
            return jsonify(usuario.to_dict()), 200
        except ValueError as e:
            return jsonify({'erro': str(e)}), 400

    @staticmethod
    def alterar_senha(id_usuario):
        try:
            dados = request.get_json()
            AlterarSenhaService.executar(
                id_usuario, 
                dados.get('senha_atual'), 
                dados.get('nova_senha')
            )
            return jsonify({'mensagem': 'Senha alterada com sucesso.'}), 200
        except ValueError as e:
            return jsonify({'erro': str(e)}), 400