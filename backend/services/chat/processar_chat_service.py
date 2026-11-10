import os
from models.chat import ChatMensagem
from extensions import db

class ProcessarChatService:
    @staticmethod
    def processar(id_usuario, mensagem_usuario):
        # 1. Salva a mensagem da usuária no banco de dados
        try:
            msg_usuario = ChatMensagem(
                id_usuario=id_usuario,
                remetente='user',
                mensagem=mensagem_usuario
            )
            db.session.add(msg_usuario)
            db.session.commit()
        except Exception as db_err:
            print("Erro ao salvar mensagem do usuário no banco:", str(db_err))

        # 2. Resposta inteligente simulada baseada nas opções do SafeHer
        msg_lower = mensagem_usuario.lower()
        
        if "plano de segurança" in msg_lower:
            resposta_texto = (
                "**Plano de Segurança SafeHer:**\n\n"
                "1. Tenha sempre os números de emergência salvos e de fácil acesso (180, 190).\n"
                "2. Identifique um local seguro ou pessoa de confiança para onde possa ir rapidamente caso sinta perigo.\n"
                "3. Mantenha documentos essenciais e itens básicos separados caso precise sair com urgência.\n"
                "Lembre-se: a sua segurança vem sempre em primeiro lugar."
            )
        elif "pontos de apoio" in msg_lower or "próximos" in msg_lower:
            resposta_texto = (
                "**Pontos de Apoio Próximos:**\n\n"
                "• **Delegacias da Mulher (DEAM)** e postos policiais especializados.\n"
                "• **Centros de Referência de Atendimento à Mulher (CRAM)**.\n"
                "• Hospitais e unidades de saúde de referência.\n"
                "Pode consultar a aba 'Recursos' do nosso aplicativo para ver os endereços e contactos detalhados na sua região."
            )
        elif "risco" in msg_lower or "emergência" in msg_lower or "fazer" in msg_lower:
            resposta_texto = (
                "**O que fazer em caso de risco imediato:**\n\n"
                "• Afaste-se do local de perigo assim que possível.\n"
                "• Se estiver em perigo imediato, ligue imediatamente para a **Polícia Militar (190)**.\n"
                "• Para denúncias, orientações e apoio especializado, ligue para a **Central de Atendimento à Mulher (180)** (funciona 24h, é gratuito e confidencial).\n"
                "Você não está sozinha!"
            )
        else:
            resposta_texto = (
                f"Olá! Compreendo a sua mensagem ('{mensagem_usuario}'). Estou aqui para te ouvir e acolher com total sigilo. "
                "Pode utilizar os botões de atalho acima para ver o plano de segurança, pontos de apoio ou orientações em caso de risco. "
                "Em caso de emergência, lembre-se de ligar para o 180."
            )

        # 3. Salva a resposta do bot no banco de dados
        try:
            msg_bot = ChatMensagem(
                id_usuario=id_usuario,
                remetente='bot',
                mensagem=resposta_texto
            )
            db.session.add(msg_bot)
            db.session.commit()
        except Exception as db_err:
            print("Erro ao salvar resposta do bot no banco:", str(db_err))

        return resposta_texto

    @staticmethod
    def listar_historico(id_usuario):
        try:
            mensagens = ChatMensagem.query.filter_by(id_usuario=id_usuario).order_by(ChatMensagem.created_at.asc()).all()
            return [msg.to_dict() for msg in mensagens]
        except Exception as e:
            print("Erro ao buscar histórico:", str(e))
            return []