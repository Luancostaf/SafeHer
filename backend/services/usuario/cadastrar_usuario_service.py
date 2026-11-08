from models.usuaria import Usuaria
from repositories.usuario_repository import UsuarioRepository

class CadastrarUsuarioService:
    @staticmethod
    def executar(dados):
        if not dados.get('nome') or not dados.get('email') or not dados.get('senha'):
            raise ValueError("Nome, e-mail e senha são obrigatórios.")

        if UsuarioRepository.buscar_por_email(dados['email']):
            raise ValueError("E-mail já cadastrado no sistema.")

        novo_usuario = Usuaria(
            nome=dados['nome'],
            telefone=dados.get('telefone'),
            email=dados['email'],
            senha=dados['senha']
        )
        novo_usuario.salvar()
        return novo_usuario