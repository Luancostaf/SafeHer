from repositories.usuario_repository import UsuarioRepository

class AutenticarUsuarioService:
    @staticmethod
    def executar(email, senha):
        if not email or not senha:
            raise ValueError("Informe e-mail e senha.")

        usuario = UsuarioRepository.buscar_por_email(email)
        if not usuario or usuario.senha != senha:
            raise ValueError("E-mail ou senha incorretos.")

        return usuario