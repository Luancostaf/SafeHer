# SafeHer

## 👥 Integrantes da Equipe
- Luan Franco
- Júlio César
- Heitor Rocha
- Lucas Freire
- Matheus Salomé

---

# 📖 Sobre o Projeto
O **SafeHer** é uma aplicação voltada para a segurança e o suporte, cujo backend foi desenvolvido em **Python** utilizando o framework **Flask**. O sistema conta com uma estrutura modularizada para gerenciamento de usuárias, diário, planos de segurança, chats, rotas de apoio, entre outras funcionalidades de apoio.

*O aplicativo possui caráter exclusivamente informativo e **não substitui** apoio psicológico, jurídico ou policial.*

---

# 💻 Tecnologias Utilizadas

## Front-end
- HTML5 / CSS3 / JavaScript (Fetch API)
- Jinja2 (Servido nativamente pelo Flask)

## Back-end
- Python (Flask)
- Flask-CORS
- SQLAlchemy / PyMySQL

## Banco de Dados
- MySQL (com Stored Procedures)

## Controle de Versão
- Git / GitHub

---

# 🛠️ Destaques Técnicos e Arquitetura
O Back-end foi implementado em arquitetura em camadas (MVC / Layered Architecture), promovendo o desacoplamento e a manutenibilidade do código.

* **Controllers (Blueprints):** Responsáveis pelo gerenciamento das rotas, validações das requisições HTTP e tratamento do recebimento de dados multipart/form-data ou JSON.
* **Services:** Responsáveis pela concentração das regras de negócio da aplicação.
* **Repositories:** Responsáveis pela abstração das consultas e comandos de persistência no banco de dados através do ORM / PyMySQL.

---

# 🛠️ Stored Procedures
* `listar_historico_usuario(p_id_usuario)`: Retorna as avaliações comportamentais da usuária ordenadas por data decrescente.
* `detalhes_registro(p_id_registro)`: Retorna a lista de perguntas e respostas gravadas em uma determinada avaliação.
* `resultado_avaliacao(p_id_registro)`: Retorna a pontuação, classificação e a recomendação final associada.
* `listar_perguntas_categoria(p_categoria)`: Filtra as perguntas por categoria específica ordenadas pelo campo ordem.

---

# ⚙️ Funcionalidades Implementadas
Abaixo está a lista completa de 20 funcionalidades do sistema, todas funcionando de ponta a ponta (Interface → API Flask → Controller → Service → Model/Repository → Banco de Dados MySQL):

1. **Cadastrar Usuária**
   * *Fluxo:* Tela de Cadastro → UsuarioController.criar → CriarUsuariaService → Usuaria.salvar() → Tabela usuaria
2. **Autenticar Usuária (Login)**
   * *Fluxo:* Tela de Login → UsuarioController.login → AutenticarUsuariaService → Usuaria.buscar_por_email()
3. **Buscar Perfil da Usuária**
   * *Fluxo:* Tela de Perfil → UsuarioController.buscar_por_id → BuscarUsuariaService → Usuaria.buscar_por_id()
4. **Atualizar Dados do Perfil**
   * *Fluxo:* Tela de Perfil → UsuarioController.atualizar → AtualizarUsuariaService → Usuaria.atualizar()
5. **Alterar Senha de Acesso**
   * *Fluxo:* Tela de Perfil → UsuarioController.alterar_senha → Verificação de senha atual → Atualização do Hash de Senha no MySQL
6. **Listar Perguntas da Avaliação Comportamental**
   * *Fluxo:* Tela do Questionário → PerguntaController.listar → ListarPerguntasService → Pergunta.listar_todos()
7. **Filtrar Perguntas por Categoria (Procedure)**
   * *Fluxo:* Filtros no Quiz → PerguntaController.por_categoria → Procedure listar_perguntas_categoria
8. **Criar Novo Registro de Avaliação**
   * *Fluxo:* Conclusão do Quiz → RegistroController.criar → CriarRegistroService → Persistência do índice percentual na tabela registro
9. **Salvar Respostas do Questionário**
   * *Fluxo:* Envio do Quiz → RegistroPerguntaController.salvar → SalvarRespostasService → Tabela registro_pergunta
10. **Consultar Histórico de Avaliações (Procedure)**
    * *Fluxo:* Tela de Histórico → RegistroController.listar_historico → Procedure listar_historico_usuario
11. **Excluir Avaliação Individual do Histórico**
    * *Fluxo:* Tela de Histórico → RegistroController.deletar → DeletarRegistroService → Remoção física no banco de dados
12. **Limpar Histórico Completo de Avaliações**
    * *Fluxo:* Botão Limpar Tudo no Histórico → RegistroController.limpar_historico → Exclusão em lote no banco
13. **Cadastrar Contato de Emergência**
    * *Fluxo:* Tela de Contatos → ContatoController.cadastrar → CadastrarContatoService → Tabela contato_emergencia
14. **Listar e Ligar para Contatos de Emergência**
    * *Fluxo:* Tela de Contatos → ContatoController.buscar_por_usuario → Renderização em tela com ação de chamada direta (tel:)
15. **Excluir Contato de Emergência**
    * *Fluxo:* Tela de Contatos → ContatoController.deletar → Remoção no MySQL
16. **Registrar Incidente no Diário de Bordo**
    * *Fluxo:* Tela do Diário → DiarioController.salvar → SalvarDiarioService → Gravação criptografada de relatos com data no MySQL
17. **Listar e Excluir Registros do Diário de Bordo**
    * *Fluxo:* Tela do Diário → DiarioController.buscar_por_usuario e DiarioController.deletar → Atualização dinâmica no MySQL
18. **Consultar Dica do Dia e Recomendações Preventivas**
    * *Fluxo:* Tela Inicial e Tela de Resultado → Consulta dinâmica via API REST das tabelas dica e recomendacao
19. **Cartilha de Direitos Expansível (Accordion)**
    * *Fluxo:* Tela de Cartilha → Exibição interativa em sanfona com tópicos da Lei Maria da Penha e tipos de violência
20. **Checklist de Autocuidado e Agenda de Compromissos**
    * *Fluxo:* Telas de Autocuidado e Agenda → Adição, marcação de conclusão, agendamento de consultas e remoção dinâmica de itens

---

# 📊 Diagrama de Classes

O diagrama de classes do domínio que representa as classes implementadas no backend (`Models`) e seus relacionamentos está localizado na pasta `docs/`:
- **Caminho do arquivo:** [`docs/diagrama_classes.md`](./docs/diagrama_classes.md)

---

# 📁 Estrutura do Projeto

```text
SafeHer/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── repositories/
│   ├── services/
|   ├── venv/
│   ├── app.py                # Ponto de entrada da aplicação
│   ├── config.py             # Configurações do Banco de Dados
│   ├── extensions.py
│   ├── routes.py             # Mapeamento de rotas
│
├── docs/
│   └── diagrama_classes.md   # Diagrama de classes do domínio
|
├── frontend/
│   ├── assets/
|   |     ├── css/
|   |     ├── img/
|   |     ├── js/
|   |          ├── api.js
|   |          ├── app.js
|   |          ├── data.js
|   |          ├── storage.js
|   |
|   ├── index.html
├── .gitignore
├── requirements.txt
└── README.md
```

---

# 🚀 Como Executar o Projeto

### Pré-requisitos
* Python 3.12 ou superior
* MySQL (XAMPP / Wampserver / Instalação Nativa)
* Git

### Passos para Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/SEU-USUARIO/SafeHer.git
   ```

2. **Acesse a pasta do projeto**
   ```bash
   cd SafeHer
   ```

3. **Configure o banco de dados MySQL**
   * Ajuste as credenciais de acesso no arquivo `backend/config.py`:
     ```python
     SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://seu_usuario:sua_senha@localhost/nome_do_banco'
     ```

5. **Inicie o servidor Flask**
   ```bash
   python backend/app.py
   ```
   * Acesse a aplicação pelo navegador no endereço indicado no terminal (geralmente `http://127.0.0.1:5000`).



