from repositories.usuario_repository import UsuarioRepository

class AtualizarUsuarioService:
    @staticmethod
    def executar(id_usuario, dados):
        usuario = UsuarioRepository.buscar_por_id(id_usuario)
        if not usuario:
            raise ValueError("Usuária não encontrada.")

        usuario.atualizar(
            nome=dados.get('nome'),
            telefone=dados.get('telefone'),
            email=dados.get('email'),
            senha=dados.get('senha')
        )
        return usuario