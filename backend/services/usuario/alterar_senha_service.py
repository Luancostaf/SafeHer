from repositories.usuario_repository import UsuarioRepository

class AlterarSenhaService:
    @staticmethod
    def executar(id_usuario, senha_atual, nova_senha):
        if not senha_atual or not nova_senha:
            raise ValueError("Preencha a senha atual e a nova senha.")

        if len(nova_senha) < 6:
            raise ValueError("A nova senha deve ter pelo menos 6 caracteres.")

        usuario = UsuarioRepository.buscar_por_id(id_usuario)
        if not usuario:
            raise ValueError("Usuária não encontrada.")

        if usuario.senha != senha_atual:
            raise ValueError("A senha atual está incorreta.")

        usuario.atualizar(senha=nova_senha)
        return usuario