# Diagrama de Classes - SafeHer

Este documento apresenta o diagrama de classes do domínio que representa as classes implementadas no backend (`Models`), seus principais atributos, métodos e os relacionamentos do sistema (composição e agregação).

```mermaid
classDiagram
    class Usuaria {
        +int id_usuario
        +string nome
        +string telefone
        +string email
        +string senha_hash
        +datetime data_cadastro
        +cadastrar()
        +autenticar()
        +atualizarPerfil()
        +alterarSenha()
    }

    class RegistroAvaliacao {
        +int id_registro
        +int id_usuario
        +float indice_comportamental
        +string classificacao
        +string observacao
        +datetime data_avaliacao
        +salvar()
        +deletar()
    }

    class Pergunta {
        +int id_pergunta
        +string texto_pergunta
        +int peso
        +string categoria
        +listar()
    }

    class RegistroPergunta {
        +int id_registro_pergunta
        +int id_registro
        +int id_pergunta
        +int valor_resposta
        +salvar()
    }

    class ContatoEmergencia {
        +int id_contato
        +int id_usuario
        +string nome
        +string telefone
        +string email
        +salvar()
        +deletar()
    }

    class DiarioBordo {
        +int id_diario
        +int id_usuario
        +string titulo
        +string descricao
        +date data_ocorrido
        +datetime data_criacao
        +salvar()
        +deletar()
    }

    class TarefaAutocuidado {
        +int id_tarefa
        +int id_usuario
        +string titulo
        +string detalhe
        +boolean concluida
        +salvar()
        +alternarStatus()
        +deletar()
    }

    class EventoAgenda {
        +int id_evento
        +int id_usuario
        +string titulo
        +string detalhe
        +string dia
        +string mes
        +salvar()
        +deletar()
    }

    class DicaDoDia {
        +int id_dica
        +string descricao
        +string categoria
        +obterDicaAleatoria()
    }

    class Recomendacao {
        +int id_recomendacao
        +string titulo
        +string descricao
        +string nivel_risco
        +listarPorNivel()
    }

    %% Relacionamentos do Domínio
    Usuaria "1" -- "0..*" RegistroAvaliacao : realiza > (Composição)
    Usuaria "1" -- "0..*" ContatoEmergencia : possui > (Composição)
    Usuaria "1" -- "0..*" DiarioBordo : registra > (Composição)
    Usuaria "1" -- "0..*" TarefaAutocuidado : gerencia > (Agregação)
    Usuaria "1" -- "0..*" EventoAgenda : agenda > (Agregação)

    RegistroAvaliacao "1" -- "1..*" RegistroPergunta : contem > (Composição)
    Pergunta "1" -- "0..*" RegistroPergunta : associada_a >