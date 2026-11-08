from controllers.usuario_controller import UsuarioController
from controllers.pergunta_controller import PerguntaController
from controllers.dica_controller import DicaController
from controllers.registro_controller import RegistroController
from controllers.registro_pergunta_controller import RegistroPerguntaController
from controllers.contato_controller import ContatoController
from controllers.diario_controller import DiarioController
from controllers.local_apoio_controller import LocalApoioController
from controllers.cartilha_controller import CartilhaController
from controllers.plano_seguranca_controller import PlanoSegurancaController
from controllers.relatorio_controller import RelatorioController
from controllers.agenda_controller import AgendaController
from controllers.tarefa_controller import TarefaController
from controllers.chat_controller import ChatController

def registrar_rotas(app):
    # Autenticação e Usuárias
    app.add_url_rule('/usuarias', view_func=UsuarioController.cadastrar, methods=['POST'])
    app.add_url_rule('/login', view_func=UsuarioController.login, methods=['POST'])
    app.add_url_rule('/usuarias/<int:id_usuario>', view_func=UsuarioController.atualizar, methods=['PUT'])
    app.add_url_rule('/usuarias/<int:id_usuario>/senha', view_func=UsuarioController.alterar_senha, methods=['PUT'])

    # Conteúdo (Perguntas e Dicas)
    app.add_url_rule('/perguntas', view_func=PerguntaController.listar, methods=['GET'])
    app.add_url_rule('/dicas', view_func=DicaController.buscar_dica_dia, methods=['GET'])

    # Registros e Respostas de Avaliações
    app.add_url_rule('/registros', view_func=RegistroController.criar, methods=['POST'])
    app.add_url_rule('/registros/<int:id_registro>', endpoint='deletar_registro', view_func=RegistroController.deletar, methods=['DELETE'])
    app.add_url_rule('/usuarias/<int:id_usuario>/historico', endpoint='listar_historico_usuario', view_func=RegistroController.listar_historico, methods=['GET'])
    app.add_url_rule('/usuarias/<int:id_usuario>/historico', endpoint='limpar_historico_usuario', view_func=RegistroController.limpar_historico, methods=['DELETE'])
    app.add_url_rule('/registro-pergunta', view_func=RegistroPerguntaController.salvar, methods=['POST'])

    # === CONTATOS DE EMERGÊNCIA ===
    app.add_url_rule('/usuarias/<int:id_usuario>/contatos', endpoint='listar_contatos_usuario', view_func=ContatoController.listar, methods=['GET'])
    app.add_url_rule('/contatos', endpoint='cadastrar_contato', view_func=ContatoController.cadastrar, methods=['POST'])
    app.add_url_rule('/contatos/<int:id_contato>', endpoint='deletar_contato', view_func=ContatoController.deletar, methods=['DELETE'])

    # === DIÁRIO DE BORDO ===
    app.add_url_rule('/usuarias/<int:id_usuario>/diario', endpoint='listar_diario_usuario', view_func=DiarioController.listar, methods=['GET'])
    app.add_url_rule('/diario', endpoint='salvar_diario', view_func=DiarioController.salvar, methods=['POST'])
    app.add_url_rule('/diario/<int:id_diario>', endpoint='deletar_diario', view_func=DiarioController.deletar, methods=['DELETE'])

    # === MAPA DE APOIO ===
    app.add_url_rule('/locais-apoio', endpoint='listar_locais_apoio', view_func=LocalApoioController.listar, methods=['GET'])

    # === CARTILHA DE DIREITOS ===
    app.add_url_rule('/cartilha', endpoint='listar_cartilha', view_func=CartilhaController.listar, methods=['GET'])

    # === PLANO DE SEGURANÇA ===
    app.add_url_rule('/usuarias/<int:id_usuario>/plano-seguranca', endpoint='buscar_plano_seguranca', view_func=PlanoSegurancaController.buscar, methods=['GET'])
    app.add_url_rule('/plano-seguranca', endpoint='salvar_plano_seguranca', view_func=PlanoSegurancaController.salvar, methods=['POST'])

    # === RELATÓRIOS E EVIDÊNCIAS ===
    app.add_url_rule('/usuarias/<int:id_usuario>/relatorios', endpoint='listar_relatorios', view_func=RelatorioController.listar, methods=['GET'])
    app.add_url_rule('/relatorios/gerar', endpoint='gerar_relatorio', view_func=RelatorioController.gerar, methods=['POST'])

    # === MINHA AGENDA ===
    app.add_url_rule('/usuarias/<int:id_usuario>/agenda', endpoint='listar_agenda', view_func=AgendaController.listar, methods=['GET'])
    app.add_url_rule('/agenda', endpoint='criar_evento_agenda', view_func=AgendaController.criar, methods=['POST'])
    app.add_url_rule('/agenda/<int:id_evento>', endpoint='deletar_evento_agenda', view_func=AgendaController.deletar, methods=['DELETE'])

    # === MEU AUTOCUIDADO ===
    app.add_url_rule('/usuarias/<int:id_usuario>/tarefas', endpoint='listar_tarefas', view_func=TarefaController.listar, methods=['GET'])
    app.add_url_rule('/tarefas', endpoint='criar_tarefa', view_func=TarefaController.criar, methods=['POST'])
    app.add_url_rule('/tarefas/<int:id_tarefa>', endpoint='atualizar_tarefa', view_func=TarefaController.atualizar, methods=['PUT'])
    app.add_url_rule('/tarefas/<int:id_tarefa>', endpoint='deletar_tarefa', view_func=TarefaController.deletar, methods=['DELETE'])

    # === CHAT DE APOIO ===
    app.add_url_rule('/api/chat', view_func=ChatController.enviar_mensagem, methods=['POST'])
    app.add_url_rule('/api/chat/<int:id_usuario>', view_func=ChatController.obter_historico, methods=['GET'])