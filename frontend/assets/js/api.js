const API_BASE_URL = 'http://127.0.0.1:5000';

const ApiService = {
    // === USUÁRIAS ===
    async login(email, senha) {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || result.message || "Erro ao realizar login.");
        return result;
    },

    async cadastrarUsuario(dados) {
        const response = await fetch(`${API_BASE_URL}/usuarias`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || result.message || "Erro ao cadastrar.");
        return result;
    },

    async atualizarUsuario(id, dados) {
        const response = await fetch(`${API_BASE_URL}/usuarias/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || result.message || "Erro ao atualizar.");
        return result;
    },

    async alterarSenha(id, senhaAtual, novaSenha) {
        const response = await fetch(`${API_BASE_URL}/usuarias/${id}/senha`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || result.message || "Erro ao alterar senha.");
        return result;
    },
    
    // === PERGUNTAS ===
    async buscarPerguntas() {
        const response = await fetch(`${API_BASE_URL}/perguntas`);
        if (!response.ok) throw new Error("Erro ao carregar perguntas.");
        return await response.json();
    },

    // === DICAS ===
    async buscarDicaDoDia() {
        const response = await fetch(`${API_BASE_URL}/dicas`);
        if (!response.ok) return null;
        return await response.json();
    },

    // === REGISTROS / AVALIAÇÕES ===
    async salvarRegistro(dados) {
        const response = await fetch(`${API_BASE_URL}/registros`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || result.message || "Erro ao salvar avaliação.");
        return result;
    },

    async salvarRespostas(dadosRespostas) {
        const response = await fetch(`${API_BASE_URL}/registro-pergunta`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_registro: dadosRespostas.id_registro,
                id_pergunta: dadosRespostas.id_pergunta,
                valor_resposta: dadosRespostas.resposta ?? dadosRespostas.valor_resposta
            })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || "Erro ao salvar respostas das perguntas.");
        return result;
    },

    async buscarHistorico(id_usuario) {
        const response = await fetch(`${API_BASE_URL}/usuarias/${id_usuario}/historico`);
        if (!response.ok) throw new Error("Erro ao buscar histórico.");
        return await response.json();
    },

    async deletarRegistro(id_registro) {
        const response = await fetch(`${API_BASE_URL}/registros/${id_registro}`, {
            method: "DELETE"
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || "Erro ao excluir avaliação.");
        return result;
    },

    async limparHistorico(id_usuario) {
        const response = await fetch(`${API_BASE_URL}/usuarias/${id_usuario}/historico`, {
            method: "DELETE"
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || "Erro ao limpar histórico.");
        return result;
    },

    // === RECOMENDAÇÕES ===
    async buscarRecomendacoes() {
        const response = await fetch(`${API_BASE_URL}/recomendacoes`);
        if (!response.ok) throw new Error("Erro ao buscar recomendações.");
        return await response.json();
    },

    // === CONTATOS DE EMERGÊNCIA ===
    async buscarContatos(id_usuario) {
        const response = await fetch(`${API_BASE_URL}/usuarias/${id_usuario}/contatos`);
        if (!response.ok) throw new Error("Erro ao buscar contatos.");
        return await response.json();
    },

    async cadastrarContato(dados) {
        const response = await fetch(`${API_BASE_URL}/contatos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || "Erro ao cadastrar contato.");
        return result;
    },

    async deletarContato(id_contato) {
        const response = await fetch(`${API_BASE_URL}/contatos/${id_contato}`, {
            method: "DELETE"
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || "Erro ao remover contato.");
        return result;
    },

    // === DIÁRIO DE BORDO ===
    async buscarDiario(id_usuario) {
        const response = await fetch(`${API_BASE_URL}/usuarias/${id_usuario}/diario`);
        if (!response.ok) throw new Error("Erro ao buscar diário.");
        return await response.json();
    },

    async salvarDiario(dados) {
        const response = await fetch(`${API_BASE_URL}/diario`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || "Erro ao salvar registro do diário.");
        return result;
    },

    async deletarDiario(id_diario) {
        const response = await fetch(`${API_BASE_URL}/diario/${id_diario}`, {
            method: "DELETE"
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || "Erro ao excluir registro do diário.");
        return result;
    },

    // === MAPA DE APOIO ===
    async buscarLocaisApoio(categoria = 'Todos') {
        const response = await fetch(`${API_BASE_URL}/locais-apoio?categoria=${encodeURIComponent(categoria)}`);
        if (!response.ok) throw new Error("Erro ao buscar locais de apoio.");
        return await response.json();
    },

    // === CARTILHA DE DIREITOS ===
    async buscarCartilha(categoria = 'Todos') {
        const response = await fetch(`${API_BASE_URL}/cartilha?categoria=${encodeURIComponent(categoria)}`);
        if (!response.ok) throw new Error("Erro ao buscar artigos da cartilha.");
        return await response.json();
    },

    // === PLANO DE SEGURANÇA ===
    async buscarPlanoSeguranca(id_usuario) {
        const response = await fetch(`${API_BASE_URL}/usuarias/${id_usuario}/plano-seguranca`);
        if (!response.ok) throw new Error("Erro ao buscar plano de segurança.");
        return await response.json();
    },

    async salvarPlanoSeguranca(dados) {
        const response = await fetch(`${API_BASE_URL}/plano-seguranca`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || "Erro ao salvar plano de segurança.");
        return result;
    },
    
    // === RELATÓRIOS E EVIDÊNCIAS ===
    async buscarRelatorios(id_usuario) {
        const response = await fetch(`${API_BASE_URL}/usuarias/${id_usuario}/relatorios`);
        if (!response.ok) throw new Error("Erro ao buscar relatórios.");
        return await response.json();
    },

    async gerarRelatorio(dados) {
        const response = await fetch(`${API_BASE_URL}/relatorios/gerar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || "Erro ao gerar relatório.");
        return result;
    },

    // === MEU AUTOCUIDADO
    async buscarTarefas(id_usuario) {
        const response = await fetch(`${API_BASE_URL}/usuarias/${id_usuario}/tarefas`);
        if (!response.ok) throw new Error("Erro ao buscar tarefas.");
        return await response.json();
    },

    async criarTarefa(dados) {
        const response = await fetch(`${API_BASE_URL}/tarefas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || "Erro ao criar tarefa.");
        return result;
    },

    async atualizarStatusTarefa(id_tarefa, concluida) {
        const response = await fetch(`${API_BASE_URL}/tarefas/${id_tarefa}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ concluida })
        });
        if (!response.ok) throw new Error("Erro ao atualizar tarefa.");
        return await response.json();
    },

    async deletarTarefa(id_tarefa) {
        const response = await fetch(`${API_BASE_URL}/tarefas/${id_tarefa}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Erro ao excluir tarefa.");
        return await response.json();
    },

    // === MINHA AGENDA ===
    async buscarAgenda(id_usuario) {
        const response = await fetch(`${API_BASE_URL}/usuarias/${id_usuario}/agenda`);
        if (!response.ok) throw new Error("Erro ao buscar agenda.");
        return await response.json();
    },

    async criarEventoAgenda(dados) {
        const response = await fetch(`${API_BASE_URL}/agenda`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.erro || "Erro ao criar evento.");
        return result;
    },

    async deletarEventoAgenda(id_evento) {
        const response = await fetch(`${API_BASE_URL}/agenda/${id_evento}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Erro ao excluir evento.");
        return await response.json();
    },

    // === CHAT DE APOIO ===
    async enviarMensagemChat(dados) {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.erro || "Erro ao enviar mensagem para o assistente");
        }
        
        return await response.json();
    },

    async buscarHistoricoChat(idUsuario) {
        const response = await fetch(`${API_BASE_URL}/chat/${idUsuario}`);
        
        if (!response.ok) {
            throw new Error("Erro ao carregar o histórico do chat");
        }
        
        return await response.json();
    }
};