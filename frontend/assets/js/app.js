// ===================== Estado Global ======================
let DB_QUESTIONS = [];
let currentAnswers = [];
let currentQuestionIndex = 0;
let lastResult = null;

const PUBLIC_SCREENS = ["welcome", "register", "login"];

function formatDate(isoStr) {
    if (!isoStr) return "";
    const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(isoStr) ? `${isoStr}T00:00:00` : isoStr);
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
}

// ===================== Router ======================
function navigate(screen, opts = {}) {
    const session = getSession();

    if (!PUBLIC_SCREENS.includes(screen) && !session) {
        screen = "welcome";
    }
    if (PUBLIC_SCREENS.includes(screen) && session && !opts.force) {
        screen = "home";
    }

    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(`screen-${screen}`);
    if (!target) return;
    target.classList.add("active");
    window.scrollTo(0, 0);
    if (location.hash !== `#/${screen}`) {
        history.pushState({ screen }, "", `#/${screen}`);
    }

    document.querySelectorAll(".nav-item").forEach(n => {
        n.classList.toggle("active", n.dataset.nav === screen);
    });

    // Renderizações condicionais para cada tela
    if (screen === "home") renderHome();
    if (screen === "history") renderHistory();
    if (screen === "contatos") renderContatos();
    if (screen === "diario") renderDiario();
    if (screen === "profile") renderProfile();
    if (screen === "recommendations") renderRecommendations();
    if (screen === "quiz" || screen === "questions") startQuiz();
    if (screen === "disfarce") initDisfarce();
    if (screen === "chatbot") initChatbot();
    if (screen === "tarefas") initTarefas();
    if (screen === "agenda") initAgenda();
    if (screen === "cartilha") initCartilha();
    if (screen === "mapa" || screen === "mapa-apoio") initMapaApoio();
    if (screen === "plano") initPlanoSeguranca();
    if (screen === "relatorio" || screen === "relatorios") initRelatorios();
    if (screen === "disfarce" || screen === "disguise-calculadora") initDisfarce();
}

window.addEventListener("popstate", () => {
    const screen = (location.hash || "#/welcome").replace("#/", "");
    navigate(screen || "welcome");
});

document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-nav]");
    if (btn) navigate(btn.dataset.nav);
});

// ===================== Drawer / Menu Hambúrguer ======================
const btnHamburger = document.getElementById('btn-hamburger');
const btnCloseMenu = document.getElementById('btn-close-menu');
const sideMenu = document.getElementById('side-menu');
const menuOverlay = document.getElementById('menu-overlay');

function toggleMenu() {
    if (sideMenu && menuOverlay) {
        sideMenu.classList.toggle('open');
        menuOverlay.classList.toggle('active');
    }
}

if (btnHamburger) btnHamburger.addEventListener('click', toggleMenu);
if (btnCloseMenu) btnCloseMenu.addEventListener('click', toggleMenu);
if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

document.querySelectorAll('.side-menu-list button').forEach(btn => {
    btn.addEventListener('click', () => {
        toggleMenu();
        const targetNav = btn.dataset.nav;
        if (targetNav) navigate(targetNav);
    });
});

// ===================== Toast ======================
let toastTimer = null;
function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ===================== Register ======================
const formRegister = document.getElementById("form-register");
if (formRegister) {
    formRegister.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nome = document.getElementById("reg-nome").value.trim();
        const telefone = document.getElementById("reg-telefone").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const senha = document.getElementById("reg-senha").value;
        const confirma = document.getElementById("reg-confirma").value;
        const alertBox = document.getElementById("register-alert");

        function fail(msg) {
            alertBox.textContent = msg;
            alertBox.classList.add("show");
        }

        alertBox.classList.remove("show");

        if (!nome || !telefone || !email || !senha) return fail("Preencha todos os campos.");
        if (senha.length < 6) return fail("A senha deve ter pelo menos 6 caracteres.");
        if (senha !== confirma) return fail("As senhas não coincidem.");

        try {
            const usuario = await ApiService.cadastrarUsuario({ nome, telefone, email, senha });
            setSession(usuario);
            e.target.reset();
            navigate("home");
            showToast(`Bem-vinda, ${nome.split(" ")[0]}!`);
        } catch (err) {
            fail(err.message);
        }
    });
}

// ===================== Login ======================
const formLogin = document.getElementById("form-login");
if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const senha = document.getElementById("login-senha").value;
        const alertBox = document.getElementById("login-alert");
        alertBox.classList.remove("show");

        try {
            const usuario = await ApiService.login(email, senha);
            setSession(usuario);
            e.target.reset();
            navigate("home");
        } catch (err) {
            alertBox.textContent = err.message;
            alertBox.classList.add("show");
        }
    });
}

// ===================== Logout ======================
const btnLogout = document.getElementById("btn-logout");
if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        clearSession();
        navigate("welcome", { force: true });
    });
}

// ===================== Home ======================
async function renderHome() {
    const session = getSession();
    if (!session) return;

    const elUsername = document.getElementById("home-username");
    if (elUsername) elUsername.textContent = session.nome ? session.nome.split(" ")[0] : "amiga";

    try {
        const dica = await ApiService.buscarDicaDoDia();
        const elTip = document.getElementById("home-tip");
        if (dica && elTip) {
            elTip.textContent = dica.descricao || dica.texto;
        }
    } catch (e) {
        console.error("Erro ao carregar dica do dia", e);
    }
}

// ===================== History ======================
async function renderHistory() {
    const session = getSession();
    if (!session) return;

    const emptyEl = document.getElementById("history-empty");
    const listEl = document.getElementById("history-list");
    const btnClearAll = document.getElementById("btn-clear-history");

    try {
        const items = await ApiService.buscarHistorico(session.id_usuario);

        if (!items || !items.length) {
            if (emptyEl) emptyEl.classList.remove("hidden");
            if (listEl) listEl.innerHTML = "";
            if (btnClearAll) btnClearAll.style.display = "none";
            return;
        }

        if (emptyEl) emptyEl.classList.add("hidden");
        if (btnClearAll) btnClearAll.style.display = "block";

        if (listEl) {
            listEl.innerHTML = items.map(item => `
                <div class="history-item">
                    <div>
                        <div class="date">${formatDate(item.data_avaliacao || item.created_at)}</div>
                        <div class="tier">${item.classificacao}</div>
                    </div>
                    <div class="history-item-actions">
                        <div class="percent">${Math.round(item.indice_comportamental)}%</div>
                        <button class="btn-delete-item" data-id="${item.id_registro}" title="Excluir avaliação">🗑️</button>
                    </div>
                </div>
            `).join("");

            listEl.querySelectorAll(".btn-delete-item").forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    const idRegistro = e.currentTarget.dataset.id;
                    if (confirm("Deseja realmente excluir esta avaliação?")) {
                        try {
                            await ApiService.deletarRegistro(idRegistro);
                            showToast("Avaliação excluída com sucesso!");
                            renderHistory();
                        } catch (err) {
                            showToast("Erro ao excluir avaliação.");
                        }
                    }
                });
            });
        }
    } catch (err) {
        showToast("Erro ao carregar histórico.");
    }
}

const btnClearHistory = document.getElementById("btn-clear-history");
if (btnClearHistory) {
    btnClearHistory.addEventListener("click", async () => {
        const session = getSession();
        if (!session) return;

        if (confirm("Tem certeza que deseja apagar TODO o seu histórico de avaliações?")) {
            try {
                await ApiService.limparHistorico(session.id_usuario);
                showToast("Histórico limpo com sucesso!");
                renderHistory();
            } catch (err) {
                showToast("Erro ao limpar histórico.");
            }
        }
    });
}

// ===================== Render Contatos de Emergência ======================
async function renderContatos() {
    const session = getSession();
    if (!session) return;

    const listEl = document.getElementById("contacts-list");
    if (!listEl) return;

    try {
        const contatos = await ApiService.buscarContatos(session.id_usuario);

        if (!contatos || contatos.length === 0) {
            listEl.innerHTML = `
                <div class="empty-state">
                    <span class="title">Nenhum contato cadastrado</span>
                    <span class="subtitle">Adicione pessoas de confiança para emergências.</span>
                </div>
            `;
            return;
        }

        listEl.innerHTML = contatos.map(c => `
            <div class="contact-card">
                <div class="contact-card-info">
                    <div class="contact-avatar">👤</div>
                    <div class="contact-details">
                        <h4>${escapeHtml(c.nome)}</h4>
                        <p>${escapeHtml(c.telefone)}</p>
                        ${c.email ? `<p class="email">${escapeHtml(c.email)}</p>` : ''}
                    </div>
                </div>
                <div class="contact-actions">
                    <a class="btn-contact-action" href="tel:${encodeURIComponent(c.telefone)}" title="Ligar">📞</a>
                    <button type="button" class="btn-contact-action btn-delete-contact" data-id="${c.id_contato}" title="Excluir">🗑️</button>
                </div>
            </div>
        `).join("");

        listEl.querySelectorAll(".btn-delete-contact").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const idContato = e.currentTarget.dataset.id;
                if (confirm("Deseja realmente remover este contato?")) {
                    try {
                        await ApiService.deletarContato(idContato);
                        showToast("Contato removido com sucesso!");
                        renderContatos();
                    } catch (err) {
                        showToast("Erro ao remover contato.");
                    }
                }
            });
        });

    } catch (err) {
        showToast("Erro ao carregar contatos.");
    }
}

// Controle do Modal de Contatos
const contactModal = document.getElementById("contact-modal");
const btnOpenContactModal = document.getElementById("btn-open-contact-modal");
const btnCloseContactModal = document.getElementById("btn-close-contact-modal");
const formAddContact = document.getElementById("form-add-contact");

if (btnOpenContactModal && contactModal) {
    btnOpenContactModal.addEventListener("click", () => {
        contactModal.style.display = "flex";
    });
}

if (btnCloseContactModal && contactModal) {
    btnCloseContactModal.addEventListener("click", () => {
        contactModal.style.display = "none";
        formAddContact.reset();
    });
}

if (formAddContact) {
    formAddContact.addEventListener("submit", async (e) => {
        e.preventDefault();
        const session = getSession();
        if (!session) return;

        const nome = document.getElementById("modal-contact-nome").value.trim();
        const telefone = document.getElementById("modal-contact-telefone").value.trim();
        const email = document.getElementById("modal-contact-email").value.trim();

        try {
            await ApiService.cadastrarContato({
                id_usuario: session.id_usuario,
                nome,
                telefone,
                email: email || null
            });
            
            contactModal.style.display = "none";
            formAddContact.reset();
            showToast("Contato cadastrado com sucesso!");
            renderContatos();
        } catch (err) {
            showToast(err.message || "Erro ao cadastrar contato.");
        }
    });
}

// ===================== 2. Funcionaliade: Diário de Bordo ======================
async function renderDiario() {
    const session = getSession();
    if (!session) return;

    const listEl = document.getElementById("diario-list");
    if (!listEl) return;

    try {
        const registros = await ApiService.buscarDiario(session.id_usuario);

        if (!registros || registros.length === 0) {
            listEl.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 20px;">
                    <span class="title" style="font-weight: bold; display: block; margin-bottom: 4px;">Nenhum relato registrado</span>
                    <p style="color: #666; font-size: 13px;">Use o botão acima para registrar um acontecimento.</p>
                </div>
            `;
            return;
        }

        listEl.innerHTML = registros.map(r => `
            <div class="diario-card" style="background: white; padding: 14px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid var(--primary-pink, #e91e63);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h4 style="margin: 0 0 4px 0; font-size: 15px; color: #333;">${escapeHtml(r.titulo)}</h4>
                        <span style="font-size: 11px; color: #888; display: block; margin-bottom: 8px;">Ocorrido em: ${r.data_ocorrido}</span>
                    </div>
                    <button type="button" class="btn-delete-diario" data-id="${r.id_diario}" title="Excluir" style="background: none; border: none; cursor: pointer; font-size: 16px;">🗑️</button>
                </div>
                <p style="margin: 0; font-size: 13px; color: #555; white-space: pre-wrap;">${escapeHtml(r.descricao)}</p>
            </div>
        `).join("");

        listEl.querySelectorAll(".btn-delete-diario").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const idDiario = e.currentTarget.dataset.id;
                if (confirm("Deseja realmente remover este registro do diário?")) {
                    try {
                        await ApiService.deletarDiario(idDiario);
                        renderDiario();
                    } catch (err) {
                        alert("Erro ao remover registro.");
                    }
                }
            });
        });

    } catch (err) {
        console.error("Erro ao carregar diário:", err);
    }
}

// Controle do Modal de Diário
document.addEventListener("DOMContentLoaded", () => {
    const diarioModal = document.getElementById("diario-modal");
    const btnOpenDiarioModal = document.getElementById("btn-open-diario-modal");
    const btnCloseDiarioModal = document.getElementById("btn-close-diario-modal");
    const formAddDiario = document.getElementById("form-add-diario");

    if (btnOpenDiarioModal && diarioModal) {
        btnOpenDiarioModal.addEventListener("click", () => {
            // Define a data atual como padrão no campo de data
            const today = new Date().toISOString().split("T")[0];
            const inputData = document.getElementById("modal-diario-data");
            if (inputData) inputData.value = today;

            diarioModal.style.display = "flex";
        });
    }

    if (btnCloseDiarioModal && diarioModal) {
        btnCloseDiarioModal.addEventListener("click", () => {
            diarioModal.style.display = "none";
            if (formAddDiario) formAddDiario.reset();
        });
    }

    if (formAddDiario) {
        formAddDiario.addEventListener("submit", async (e) => {
            e.preventDefault();
            const session = getSession();
            if (!session) {
                alert("Sessão expirada. Faça login novamente.");
                return;
            }

            const titulo = document.getElementById("modal-diario-titulo").value.trim();
            const data_ocorrido = document.getElementById("modal-diario-data").value;
            const descricao = document.getElementById("modal-diario-descricao").value.trim();

            try {
                await ApiService.salvarDiario({
                    id_usuario: session.id_usuario,
                    titulo,
                    data_ocorrido,
                    descricao
                });

                diarioModal.style.display = "none";
                formAddDiario.reset();
                renderDiario();
            } catch (err) {
                alert(err.message || "Erro ao salvar registro do diário.");
            }
        });
    }
});

// ===================== 3. Funcionalidade: Modo Disfarce ======================
function initDisfarce() {
    const btnAtivar = document.getElementById("btn-ativar-disfarce");
    const btnSairDisfarce = document.getElementById("btn-sair-disfarce");
    const modalSair = document.getElementById("sair-disfarce-modal");
    const btnCloseModal = document.getElementById("btn-close-disfarce-modal");
    const formSair = document.getElementById("form-sair-disfarce");

    // Lógica interativa da calculadora disfarçada
    const display = document.getElementById("calc-display");
    let currentInput = "0";
    let pendingValue = null;
    let operation = null;
    let resetOnNextInput = false;

    if (display) {
        const updateDisplay = () => {
            display.textContent = currentInput;
        };

        document.querySelectorAll("#screen-disguise-calculadora button.calc-num").forEach(btn => {
            btn.onclick = () => {
                const num = btn.dataset.num;
                if (currentInput === "0" || resetOnNextInput) {
                    currentInput = num;
                    resetOnNextInput = false;
                } else {
                    currentInput += num;
                }
                updateDisplay();
            };
        });

        document.querySelectorAll("#screen-disguise-calculadora button.calc-action").forEach(btn => {
            btn.onclick = () => {
                const action = btn.dataset.action;
                if (action === "clear") {
                    currentInput = "0";
                    pendingValue = null;
                    operation = null;
                    updateDisplay();
                } else if (action === "decimal") {
                    if (!currentInput.includes(".")) {
                        currentInput += ".";
                        updateDisplay();
                    }
                } else if (action === "sign") {
                    currentInput = (parseFloat(currentInput) * -1).toString();
                    updateDisplay();
                } else if (action === "percent") {
                    currentInput = (parseFloat(currentInput) / 100).toString();
                    updateDisplay();
                } else if (action === "equals") {
                    if (operation && pendingValue !== null) {
                        const current = parseFloat(currentInput);
                        if (operation === "add") currentInput = (pendingValue + current).toString();
                        if (operation === "subtract") currentInput = (pendingValue - current).toString();
                        if (operation === "multiply") currentInput = (pendingValue * current).toString();
                        if (operation === "divide") currentInput = current === 0 ? "Erro" : (pendingValue / current).toString();
                        pendingValue = null;
                        operation = null;
                        resetOnNextInput = true;
                        updateDisplay();
                    }
                }
            };
        });

        document.querySelectorAll("#screen-disguise-calculadora button.calc-op").forEach(btn => {
            btn.onclick = () => {
                const op = btn.dataset.op;
                pendingValue = parseFloat(currentInput);
                operation = op;
                resetOnNextInput = true;
            };
        });
    }

    // Verificar se já existe um disfarce ativo ao carregar a página
    const disfarceAtivo = localStorage.getItem("safeher_disfarce");
    if (disfarceAtivo === "calculadora") {
        setTimeout(() => navigate("disguise-calculadora"), 50);
    }

    if (btnAtivar) {
        btnAtivar.onclick = () => {
            const selectedRadio = document.querySelector("input[name='disguise-theme']:checked");
            if (!selectedRadio) return;

            const tema = selectedRadio.value;

            if (tema === "padrao") {
                localStorage.removeItem("safeher_disfarce");
                showToast("Modo padrão ativado.");
                navigate("home");
            } else if (tema === "calculadora") {
                localStorage.setItem("safeher_disfarce", "calculadora");
                showToast("Modo disfarce ativado com sucesso!");
                navigate("disguise-calculadora");
            }
        };
    }

    // Abrir o Modal Customizado de Senha ao clicar em "Sair"
    if (btnSairDisfarce && modalSair) {
        btnSairDisfarce.onclick = () => {
            modalSair.style.display = "flex";
        };
    }

    // Fechar o Modal ao clicar em Cancelar
    if (btnCloseModal && modalSair) {
        btnCloseModal.onclick = () => {
            modalSair.style.display = "none";
            if (formSair) formSair.reset();
        };
    }

    // Validação da Senha no Backend ao enviar o Form do Modal
    if (formSair) {
        formSair.onsubmit = async (e) => {
            e.preventDefault();
            const session = getSession();
            if (!session || !session.email) {
                showToast("Sessão expirada. Faça login novamente.");
                modalSair.style.display = "none";
                navigate("login");
                return;
            }

            const senhaInformada = document.getElementById("modal-disfarce-senha").value;
            if (!senhaInformada) return;

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: session.email, senha: senhaInformada })
                });

                const resultado = await response.json();

                if (response.ok) {
                    localStorage.removeItem("safeher_disfarce");
                    modalSair.style.display = "none";
                    formSair.reset();
                    showToast("Retornando ao SafeHer.");
                    navigate("home");
                } else {
                    showToast(resultado.erro || "Senha incorreta. Acesso negado.");
                }
            } catch (err) {
                console.error("Erro ao validar senha:", err);
                showToast("Erro de conexão com o servidor.");
            }
        };
    }
}

// ===================== 4. Funcionaliade: Mapa de Apoio ======================
async function renderMapaApoio(categoriaFiltro = 'Todos') {
    const listEl = document.getElementById("mapa-list");
    if (!listEl) return;

    try {
        const locais = await ApiService.buscarLocaisApoio(categoriaFiltro);
        if (!locais || locais.length === 0) {
            listEl.innerHTML = `<div class="empty-state" style="text-align: center; padding: 20px;"><span class="title" style="font-weight: bold;">Nenhum local encontrado</span></div>`;
            return;
        }
        listEl.innerHTML = locais.map(l => `
            <div class="local-card" style="background: white; padding: 14px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div>
                    <span style="font-size: 10px; background: #e3f2fd; color: #1976d2; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">${escapeHtml(l.categoria)}</span>
                    <h4 style="margin: 6px 0 4px 0; font-size: 15px; color: #333;">${escapeHtml(l.nome)}</h4>
                </div>
                <p style="margin: 4px 0; font-size: 13px; color: #555;">📍 ${escapeHtml(l.endereco)} (${escapeHtml(l.cidade)})</p>
                ${l.telefone ? `<p style="margin: 4px 0 0; font-size: 13px;"><a href="tel:${encodeURIComponent(l.telefone)}" style="text-decoration: none; color: var(--primary-pink, #e91e63); font-weight: bold;">📞 Ligar: ${escapeHtml(l.telefone)}</a></p>` : ''}
            </div>
        `).join("");
    } catch (err) {
        console.error("Erro ao carregar mapa de apoio:", err);
    }
}

function initMapaApoio() {
    renderMapaApoio('Todos');
    const filterButtons = document.querySelectorAll(".map-filter-btn");
    filterButtons.forEach(btn => {
        btn.onclick = (e) => {
            filterButtons.forEach(b => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
            renderMapaApoio(e.currentTarget.dataset.categoria || 'Todos');
        };
    });
}

// ===================== 5. Funcionaliade: Cartilha de Direitos ======================
async function renderCartilha(categoriaFiltro = 'Todos') {
    const listEl = document.getElementById("cartilha-list");
    if (!listEl) return;

    try {
        const artigos = await ApiService.buscarCartilha(categoriaFiltro);
        if (!artigos || artigos.length === 0) {
            listEl.innerHTML = `<div class="empty-state" style="text-align: center; padding: 20px;"><span class="title" style="font-weight: bold;">Nenhum conteúdo encontrado</span></div>`;
            return;
        }

        function obterIcone(titulo) {
            const t = titulo.toLowerCase();
            if (t.includes('lei') || t.includes('proteção')) return '⚖️';
            if (t.includes('violência') || t.includes('tipos')) return '⚠️';
            if (t.includes('direito')) return '🛡️';
            if (t.includes('dúvida') || t.includes('pergunta')) return '❓';
            return '📖';
        }

        listEl.innerHTML = artigos.map(a => `
            <div class="cartilha-card" style="background: white; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #f0f0f0;">
                <div class="cartilha-header" style="padding: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-size: 20px;">${obterIcone(a.titulo)}</div>
                        <h4 style="margin: 0; font-size: 15px; color: #333;">${escapeHtml(a.titulo)}</h4>
                    </div>
                    <span class="arrow-icon" style="font-size: 14px; color: #888;">▼</span>
                </div>
                <div class="cartilha-body" style="padding: 0 16px 16px 16px; display: none; border-top: 1px solid #f9f9f9; color: #555; font-size: 13px; line-height: 1.5;">
                    <p style="margin: 12px 0 0 0;">${escapeHtml(a.conteudo)}</p>
                </div>
            </div>
        `).join("");

        listEl.querySelectorAll(".cartilha-header").forEach(header => {
            header.onclick = (e) => {
                const card = e.currentTarget.closest(".cartilha-card");
                const body = card.querySelector(".cartilha-body");
                const arrow = card.querySelector(".arrow-icon");
                const isClosed = body.style.display === "none" || body.style.display === "";

                listEl.querySelectorAll(".cartilha-body").forEach(b => b.style.display = "none");
                listEl.querySelectorAll(".arrow-icon").forEach(a => { a.style.transform = "rotate(0deg)"; a.textContent = "▼"; });

                if (isClosed) {
                    body.style.display = "block";
                    arrow.style.transform = "rotate(180deg)";
                    arrow.textContent = "▲";
                }
            };
        });
    } catch (err) {
        console.error("Erro ao carregar cartilha:", err);
    }
}

function initCartilha() {
    renderCartilha('Todos');
    const cartilhaFilterBtns = document.querySelectorAll(".cartilha-filter-btn");
    cartilhaFilterBtns.forEach(btn => {
        btn.onclick = (e) => {
            cartilhaFilterBtns.forEach(b => { b.classList.remove("active", "btn-primary"); b.classList.add("btn-outline"); });
            e.currentTarget.classList.add("active", "btn-primary");
            e.currentTarget.classList.remove("btn-outline");
            renderCartilha(e.currentTarget.dataset.categoria || 'Todos');
        };
    });
}

// ===================== 6. Funcionalidade: Chat de Apoio (Gemini + MySQL) ======================
async function initChatbot() {
    const session = getSession();
    if (!session) return;

    const chatContainer = document.getElementById("chat-messages-container");
    const userInput = document.getElementById("chat-user-input");
    const btnSend = document.getElementById("btn-send-chat");
    const optionsStack = document.getElementById("chat-options-stack");

    if (!chatContainer) return;

    // 1. Carregar histórico salvo no MySQL
    try {
        const historico = await ApiService.buscarHistoricoChat(session.id_usuario);
        if (historico && historico.length > 0) {
            chatContainer.innerHTML = historico.map(m => `
                <div class="chat-bubble ${m.remetente === 'user' ? 'user' : 'bot'}">
                    ${escapeHtml(m.mensagem)}
                </div>
            `).join("");
        }
    } catch (e) {
        console.error("Erro ao carregar histórico do chat:", e);
    }

    // 2. Enviar mensagem
    const enviarMensagem = async (texto) => {
        if (!texto || !texto.trim()) return;

        // Adiciona a mensagem da usuária visualmente
        chatContainer.innerHTML += `
            <div class="chat-bubble user">
                ${escapeHtml(texto)}
            </div>
        `;
        userInput.value = "";
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Indicador de "Digitando..."
        const loadingId = "loading-" + Date.now();
        chatContainer.innerHTML += `
            <div class="chat-bubble bot" id="${loadingId}">
                Acolhendo e pensando numa resposta...
            </div>
        `;
        chatContainer.scrollTop = chatContainer.scrollHeight;

        try {
            const res = await ApiService.enviarMensagemChat({
                id_usuario: session.id_usuario,
                mensagem: texto
            });

            // Remove o indicador de carregamento
            const loadingEl = document.getElementById(loadingId);
            if (loadingEl) loadingEl.remove();

            // Exibe a resposta retornada pelo Gemini
            chatContainer.innerHTML += `
                <div class="chat-bubble bot">
                    ${escapeHtml(res.resposta)}
                </div>
            `;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        } catch (err) {
            const loadingEl = document.getElementById(loadingId);
            if (loadingEl) loadingEl.remove();
            showToast(err.message || "Erro ao obter resposta do assistente.");
        }
    };

    if (btnSend && userInput) {
        btnSend.onclick = () => enviarMensagem(userInput.value);
        userInput.onkeypress = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                enviarMensagem(userInput.value);
            }
        };
    }

    if (optionsStack) {
        optionsStack.querySelectorAll(".chat-option-btn, button[data-action]").forEach(btn => {
            btn.onclick = (e) => {
                const textoAcao = e.currentTarget.textContent;
                enviarMensagem(textoAcao);
            };
        });
    }
}

// ===================== 7. Funcionaliade: Planos de Segurança ======================
let passoAtual = 1;
let dadosPlano = { onde_ir: "Casa de familiar/amigo", documentos: "", contatos_emergencia: "" };

function initPlanoSeguranca() {
    passoAtual = 1;
    const screenPlano = document.getElementById("screen-plano");
    if (!screenPlano) return;

    let actionContainer = screenPlano.querySelector(".plan-actions-container");
    if (!actionContainer) {
        const btnAntigo = screenPlano.querySelector(".btn-primary");
        if (btnAntigo) btnAntigo.remove();
        actionContainer = document.createElement("div");
        actionContainer.className = "plan-actions-container";
        actionContainer.style.cssText = "margin-top: 20px;";
        const bottomNav = screenPlano.querySelector(".bottom-nav");
        screenPlano.insertBefore(actionContainer, bottomNav);
    }

    function atualizarPassoPlano() {
        const titleEl = screenPlano.querySelector(".section-title-bold");
        const descEl = screenPlano.querySelector(".section-desc");
        const contentEl = screenPlano.querySelector(".plan-options");
        const steps = screenPlano.querySelectorAll(".stepper-bar .step");

        steps.forEach((s, index) => {
            s.classList.toggle("active", index + 1 <= passoAtual);
        });

        const tituloTexto = passoAtual === 1 ? "1. Onde ir" : passoAtual === 2 ? "2. Documentos essenciais" : passoAtual === 3 ? "3. Contatos de Emergência" : "4. Finalizar Plano";

        if (titleEl) {
            titleEl.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    ${passoAtual > 1 ? '<button type="button" id="btn-plano-voltar-seta" style="background: none; border: none; font-size: 18px; cursor: pointer; padding: 0; color: var(--primary-pink, #e91e63); font-weight: bold;" title="Voltar">←</button>' : ''}
                    <span>${tituloTexto}</span>
                </div>
            `;
        }

        if (passoAtual === 1) {
            if (descEl) descEl.textContent = "Escolha um local seguro para ir, caso precise sair rapidamente.";
            if (contentEl) {
                contentEl.innerHTML = `
                    <label class="plan-card" style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:12px; margin-bottom:8px; border-radius:8px; border:1px solid #ddd; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;"><span style="font-size:20px;">🏠</span><strong>Casa de familiar/amigo</strong></div>
                        <input type="radio" name="plan-location" value="Casa de familiar/amigo" ${dadosPlano.onde_ir === "Casa de familiar/amigo" ? "checked" : ""}>
                    </label>
                    <label class="plan-card" style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:12px; margin-bottom:8px; border-radius:8px; border:1px solid #ddd; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;"><span style="font-size:20px;">🛡️</span><strong>Delegacia da Mulher</strong></div>
                        <input type="radio" name="plan-location" value="Delegacia da Mulher" ${dadosPlano.onde_ir === "Delegacia da Mulher" ? "checked" : ""}>
                    </label>
                    <label class="plan-card" style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:12px; margin-bottom:8px; border-radius:8px; border:1px solid #ddd; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;"><span style="font-size:20px;">🏢</span><strong>Centro de Referência</strong></div>
                        <input type="radio" name="plan-location" value="Centro de Referência" ${dadosPlano.onde_ir === "Centro de Referência" ? "checked" : ""}>
                    </label>
                    <label class="plan-card" style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:12px; margin-bottom:8px; border-radius:8px; border:1px solid #ddd; cursor:pointer;">
                        <div style="display:flex; align-items:center; gap:10px;"><span style="font-size:20px;">📍</span><strong>Outro local</strong></div>
                        <input type="radio" name="plan-location" value="Outro local" ${dadosPlano.onde_ir === "Outro local" ? "checked" : ""}>
                    </label>
                `;
                contentEl.querySelectorAll("input[name='plan-location']").forEach(radio => {
                    radio.onchange = (e) => { dadosPlano.onde_ir = e.target.value; };
                });
            }
        } else if (passoAtual === 2) {
            if (descEl) descEl.textContent = "Liste documentos importantes que deve levar consigo (RG, CPF, certidões).";
            if (contentEl) {
                contentEl.innerHTML = `<div class="field"><textarea id="input-documentos" rows="5" placeholder="Ex: RG, CPF, Cartão do SUS..." style="width:100%; padding:10px; border:1px solid #ccc; border-radius:8px; font-size:14px;">${dadosPlano.documentos}</textarea></div>`;
            }
        } else if (passoAtual === 3) {
            if (descEl) descEl.textContent = "Indique nomes e telefones de pessoas de confiança ou autoridades.";
            if (contentEl) {
                contentEl.innerHTML = `<div class="field"><textarea id="input-contatos" rows="5" placeholder="Ex: Maria (Mãe) - (31) 99999-9999 / 190" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:8px; font-size:14px;">${dadosPlano.contatos_emergencia}</textarea></div>`;
            }
        } else if (passoAtual === 4) {
            if (descEl) descEl.textContent = "Revise as suas informações antes de guardar em segurança no sistema.";
            if (contentEl) {
                contentEl.innerHTML = `
                    <div style="background:#f9f9f9; padding:14px; border-radius:8px; font-size:13px; color:#333; line-height:1.6; border:1px solid #eee;">
                        <p style="margin: 0 0 8px 0;"><strong>📍 Onde ir:</strong> ${escapeHtml(dadosPlano.onde_ir)}</p>
                        <p style="margin: 0 0 8px 0;"><strong>📄 Documentos:</strong> ${escapeHtml(dadosPlano.documentos || 'Nenhum especificado')}</p>
                        <p style="margin: 0;"><strong>📞 Contatos:</strong> ${escapeHtml(dadosPlano.contatos_emergencia || 'Nenhum especificado')}</p>
                    </div>
                `;
            }
        }

        actionContainer.innerHTML = `<button type="button" id="btn-plano-avancar" class="btn btn-primary" style="width: 100%;">${passoAtual === 4 ? 'Salvar Plano de Segurança' : 'Próximo'}</button>`;

        const btnVoltarSeta = document.getElementById("btn-plano-voltar-seta");
        if (btnVoltarSeta) {
            btnVoltarSeta.onclick = () => {
                salvarRascunhoAtual();
                if (passoAtual > 1) { passoAtual--; atualizarPassoPlano(); }
            };
        }

        const btnAvancar = document.getElementById("btn-plano-avancar");
        if (btnAvancar) {
            btnAvancar.onclick = async () => {
                salvarRascunhoAtual();
                if (passoAtual < 4) {
                    passoAtual++;
                    atualizarPassoPlano();
                } else {
                    const session = getSession();
                    if (!session) { alert("Sessão expirada."); return; }
                    try {
                        await ApiService.salvarPlanoSeguranca({
                            id_usuario: session.id_usuario,
                            onde_ir: dadosPlano.onde_ir,
                            documentos: dadosPlano.documentos,
                            contatos_emergencia: dadosPlano.contatos_emergencia
                        });
                        alert("Plano de segurança guardado com sucesso!");
                        passoAtual = 1;
                        atualizarPassoPlano();
                    } catch (err) {
                        alert(err.message || "Erro ao salvar plano.");
                    }
                }
            };
        }
    }

    function salvarRascunhoAtual() {
        if (passoAtual === 2) {
            const docInput = document.getElementById("input-documentos");
            if (docInput) dadosPlano.documentos = docInput.value.trim();
        } else if (passoAtual === 3) {
            const contInput = document.getElementById("input-contatos");
            if (contInput) dadosPlano.contatos_emergencia = contInput.value.trim();
        }
    }

    atualizarPassoPlano();
}

// ===================== 8. Funcionalidade: Relatórios e evidências ======================
async function initRelatorios() {
    const session = getSession();
    if (!session) return;

    const screenRelatorio = document.getElementById("screen-relatorio");
    if (!screenRelatorio) return;

    const historyListEl = document.getElementById("history-pdf-list-dinamica");
    const inputSenha = document.getElementById("input-senha-pdf");
    const btnGerarPdf = document.getElementById("btn-gerar-pdf-acao");
    const toggleSenha = document.getElementById("toggle-senha-pdf");

    // Funcionalidade do Olho (Ver / Ocultar Senha)
    if (toggleSenha && inputSenha) {
        toggleSenha.onclick = () => {
            if (inputSenha.type === "password") {
                inputSenha.type = "text";
                toggleSenha.textContent = "🙈";
            } else {
                inputSenha.type = "password";
                toggleSenha.textContent = "👁️";
            }
        };
    }

    // Carregar histórico do MySQL
    try {
        const relatorios = await ApiService.buscarRelatorios(session.id_usuario);
        if (historyListEl) {
            if (!relatorios || relatorios.length === 0) {
                historyListEl.innerHTML = `<div style="text-align: center; padding: 16px; color: #666; font-size: 13px; background: white; border-radius: 8px;">Nenhum relatório gerado ainda.</div>`;
            } else {
                historyListEl.innerHTML = relatorios.map(r => `
                    <div class="pdf-file-card" style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
                        <div class="pdf-file-info" style="display: flex; align-items: center; gap: 10px;">
                            <span class="pdf-file-icon" style="font-size: 20px;">📄</span>
                            <div>
                                <strong style="font-size: 14px; color: #333; display: block;">${escapeHtml(r.titulo)}</strong>
                                <p style="font-size: 11px; color: #777; margin: 0;">Gerado em ${r.data_geracao}</p>
                            </div>
                        </div>
                        <button class="btn-download" title="Baixar Relatório" style="background: none; border: none; font-size: 18px; cursor: pointer;">📥</button>
                    </div>
                `).join("");
            }
        }
    } catch (err) {
        console.error("Erro ao carregar relatórios:", err);
    }

    // Botão Gerar PDF
    if (btnGerarPdf) {
        btnGerarPdf.onclick = async () => {
            const senha = inputSenha ? inputSenha.value.trim() : "12345678";
            try {
                btnGerarPdf.textContent = "A gerar PDF...";
                await ApiService.gerarRelatorio({ id_usuario: session.id_usuario, senha });
                alert("Relatório integrado com avaliações gerado com sucesso!");
                btnGerarPdf.textContent = "Gerar PDF";
                initRelatorios();
            } catch (err) {
                alert(err.message || "Erro ao gerar relatório.");
                btnGerarPdf.textContent = "Gerar PDF";
            }
        };
    }
}

// ===================== 9. Funcionalidade: Meu Autocuidado ======================
async function initTarefas() {
    const session = getSession();
    if (!session) return;

    const container = document.getElementById("tasks-list-container");
    if (!container) return;

    try {
        const tarefas = await ApiService.buscarTarefas(session.id_usuario);

        if (!tarefas || tarefas.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 20px;">
                    <span class="title" style="font-weight: bold;">Nenhuma tarefa</span>
                    <span class="subtitle" style="color: #666; font-size: 13px;">Adicione pequenas tarefas diárias para cuidar de si.</span>
                </div>
            `;
            return;
        }

        container.innerHTML = tarefas.map(t => `
            <label class="task-card ${t.concluida ? 'checked' : ''}" data-id="${t.id_tarefa}" style="display: flex; align-items: center; background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.04); cursor: pointer;">
                <input type="checkbox" class="task-checkbox" ${t.concluida ? 'checked' : ''} style="margin-right: 10px;">
                <div class="task-info" style="flex: 1;">
                    <strong style="font-size: 14px; color: #333; display: block; ${t.concluida ? 'text-decoration: line-through; color: #888;' : ''}">${escapeHtml(t.titulo)}</strong>
                    ${t.detalhe ? `<p style="font-size: 12px; color: #666; margin: 0;">${escapeHtml(t.detalhe)}</p>` : ''}
                </div>
                <button type="button" class="btn-delete-item btn-delete-task" data-id="${t.id_tarefa}" title="Excluir tarefa" style="background:none; border:none; cursor:pointer; font-size: 16px;">🗑️</button>
            </label>
        `).join("");

        // Atualizar estado do checkbox no banco
        container.querySelectorAll('.task-checkbox').forEach(chk => {
            chk.onchange = async (e) => {
                const card = e.target.closest(".task-card");
                const idTarefa = card.dataset.id;
                const concluida = e.target.checked;

                try {
                    await ApiService.atualizarStatusTarefa(idTarefa, concluida);
                    card.classList.toggle("checked", concluida);
                    const titleStrong = card.querySelector("strong");
                    if (titleStrong) {
                        titleStrong.style.textDecoration = concluida ? "line-through" : "none";
                        titleStrong.style.color = concluida ? "#888" : "#333";
                    }
                } catch (err) {
                    showToast("Erro ao atualizar status da tarefa.");
                }
            };
        });

        // Deletar tarefa
        container.querySelectorAll('.btn-delete-task').forEach(btn => {
            btn.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const idTarefa = btn.dataset.id;

                if (confirm("Deseja realmente remover esta tarefa?")) {
                    try {
                        await ApiService.deletarTarefa(idTarefa);
                        showToast("Tarefa removida!");
                        initTarefas();
                    } catch (err) {
                        showToast("Erro ao remover tarefa.");
                    }
                }
            };
        });

    } catch (err) {
        console.error("Erro ao carregar tarefas:", err);
    }
}

// Controle do Modal de Tarefas
document.addEventListener("DOMContentLoaded", () => {
    const tarefaModal = document.getElementById("tarefa-modal");
    const btnOpenTarefaModal = document.getElementById("btn-add-task"); // Botão na tela de tarefas
    const btnCloseTarefaModal = document.getElementById("btn-close-tarefa-modal");
    const formAddTarefa = document.getElementById("form-add-tarefa");

    if (btnOpenTarefaModal && tarefaModal) {
        btnOpenTarefaModal.onclick = () => {
            tarefaModal.style.display = "flex";
        };
    }

    if (btnCloseTarefaModal && tarefaModal) {
        btnCloseTarefaModal.onclick = () => {
            tarefaModal.style.display = "none";
            if (formAddTarefa) formAddTarefa.reset();
        };
    }

    if (formAddTarefa) {
        formAddTarefa.onsubmit = async (e) => {
            e.preventDefault();
            const session = getSession();
            if (!session) {
                alert("Sessão expirada.");
                return;
            }

            const titulo = document.getElementById("modal-tarefa-titulo").value.trim();
            const detalhe = document.getElementById("modal-tarefa-detalhe").value.trim();

            try {
                await ApiService.criarTarefa({
                    id_usuario: session.id_usuario,
                    titulo,
                    detalhe
                });

                tarefaModal.style.display = "none";
                formAddTarefa.reset();
                showToast("Tarefa de autocuidado adicionada!");
                initTarefas();
            } catch (err) {
                alert(err.message || "Erro ao salvar tarefa.");
            }
        };
    }
});

// ===================== 10. Funcionalidade: Minha Agenda ======================
async function initAgenda() {
    const session = getSession();
    if (!session) return;

    const container = document.getElementById("events-list-container");
    if (!container) return;

    try {
        const eventos = await ApiService.buscarAgenda(session.id_usuario);

        if (!eventos || eventos.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 20px;">
                    <span class="title" style="font-weight: bold;">Nenhum evento</span>
                    <span class="subtitle" style="color: #666; font-size: 13px;">Agende datas importantes para acompanhar.</span>
                </div>
            `;
            return;
        }

        container.innerHTML = eventos.map(e => `
            <div class="event-card" style="display: flex; align-items: center; background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
                <div class="event-date-badge" style="background: #ffebee; color: #c2185b; padding: 8px 12px; border-radius: 6px; text-align: center; margin-right: 12px; min-width: 45px;">
                    <span class="day" style="display: block; font-weight: bold; font-size: 16px;">${escapeHtml(e.dia)}</span>
                    <span class="month" style="display: block; font-size: 10px; text-transform: uppercase;">${escapeHtml(e.mes)}</span>
                </div>
                <div class="event-info" style="flex: 1;">
                    <strong style="font-size: 14px; color: #333; display: block;">${escapeHtml(e.titulo)}</strong>
                    <p style="font-size: 12px; color: #666; margin: 0;">${escapeHtml(e.detalhe)}</p>
                </div>
                <button type="button" class="btn-delete-event" data-id="${e.id_evento}" title="Excluir evento" style="background:none; border:none; cursor:pointer; font-size: 16px;">🗑️</button>
            </div>
        `).join("");

        container.querySelectorAll('.btn-delete-event').forEach(btn => {
            btn.onclick = async (e) => {
                const idEvento = e.currentTarget.dataset.id;
                if (confirm("Deseja realmente remover este evento?")) {
                    try {
                        await ApiService.deletarEventoAgenda(idEvento);
                        showToast("Evento removido com sucesso!");
                        initAgenda();
                    } catch (err) {
                        showToast("Erro ao remover evento.");
                    }
                }
            };
        });

    } catch (err) {
        console.error("Erro ao carregar agenda:", err);
    }
}

// Controle do Modal de Agenda
document.addEventListener("DOMContentLoaded", () => {
    const agendaModal = document.getElementById("agenda-modal");
    const btnOpenAgendaModal = document.getElementById("btn-open-agenda-modal");
    const btnCloseAgendaModal = document.getElementById("btn-close-agenda-modal");
    const formAddAgenda = document.getElementById("form-add-agenda");

    if (btnOpenAgendaModal && agendaModal) {
        btnOpenAgendaModal.onclick = () => {
            agendaModal.style.display = "flex";
        };
    }

    if (btnCloseAgendaModal && agendaModal) {
        btnCloseAgendaModal.onclick = () => {
            agendaModal.style.display = "none";
            if (formAddAgenda) formAddAgenda.reset();
        };
    }

    if (formAddAgenda) {
        formAddAgenda.onsubmit = async (e) => {
            e.preventDefault();
            const session = getSession();
            if (!session) {
                alert("Sessão expirada.");
                return;
            }

            const titulo = document.getElementById("modal-agenda-titulo").value.trim();
            const detalhe = document.getElementById("modal-agenda-detalhe").value.trim();
            const dia = parseInt(document.getElementById("modal-agenda-dia").value);
            const mes = parseInt(document.getElementById("modal-agenda-mes").value);

            // Validação rigorosa de Datas
            if (dia < 1 || dia > 31) {
                alert("Por favor, insira um dia válido entre 1 e 31.");
                return;
            }
            if (mes < 1 || mes > 12) {
                alert("Por favor, insira um mês válido entre 1 e 12.");
                return;
            }

            try {
                await ApiService.criarEventoAgenda({
                    id_usuario: session.id_usuario,
                    titulo,
                    detalhe,
                    dia: dia.toString(),
                    mes: mes.toString()
                });

                agendaModal.style.display = "none";
                formAddAgenda.reset();
                showToast("Compromisso agendado com sucesso!");
                initAgenda();
            } catch (err) {
                alert(err.message || "Erro ao salvar evento.");
            }
        };
    }
});

// ===================== Profile ======================
function getProfilePhotoKey(session) {
    return `safeher_photo_${session.email.toLowerCase()}`;
}

function renderProfile() {
    const session = getSession();
    if (!session) return;

    const elName = document.getElementById("profile-username");
    const elEmail = document.getElementById("profile-email");
    const elPhoto = document.getElementById("profile-photo");

    if (elName) elName.textContent = session.nome;
    if (elEmail) elEmail.textContent = session.email;
    if (elPhoto) {
        const savedPhoto = localStorage.getItem(getProfilePhotoKey(session));
        elPhoto.src = savedPhoto || "assets/img/foto-perfil.png";
    }
}

const profilePhotoInput = document.getElementById("profile-photo-input");
if (profilePhotoInput) {
    profilePhotoInput.addEventListener("change", () => {
        const session = getSession();
        const file = profilePhotoInput.files[0];
        if (!session || !file) return;

        if (!file.type.startsWith("image/")) {
            showToast("Selecione um arquivo de imagem.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            localStorage.setItem(getProfilePhotoKey(session), reader.result);
            const elPhoto = document.getElementById("profile-photo");
            if (elPhoto) elPhoto.src = reader.result;
            showToast("Foto de perfil atualizada!");
        };
        reader.readAsDataURL(file);
    });
}

const btnEditProfile = document.getElementById("btn-edit-profile");
if (btnEditProfile) {
    btnEditProfile.addEventListener("click", async () => {
        const session = getSession();
        if (!session) return;

        const nome = window.prompt("Nome completo:", session.nome);
        if (nome === null) return;

        const telefone = window.prompt("Telefone:", session.telefone || "");
        if (telefone === null) return;

        try {
            await ApiService.atualizarUsuario(session.id_usuario, {
                nome: nome.trim() || session.nome,
                telefone: telefone.trim() || session.telefone,
                email: session.email
            });

            const novaSessao = { ...session, nome: nome.trim() || session.nome, telefone: telefone.trim() || session.telefone };
            setSession(novaSessao);

            renderProfile();
            renderHome();
            showToast("Perfil atualizado com sucesso!");
        } catch (err) {
            showToast("Erro ao atualizar perfil.");
        }
    });
}

const btnChangePassword = document.getElementById("btn-change-password");
if (btnChangePassword) {
    btnChangePassword.addEventListener("click", async () => {
        const session = getSession();
        if (!session) return;

        const senhaAtual = window.prompt("Digite sua senha atual:");
        if (!senhaAtual) return;

        const novaSenha = window.prompt("Digite a nova senha (mínimo 6 caracteres):");
        if (!novaSenha) return;

        if (novaSenha.length < 6) {
            showToast("A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }

        const confirmaSenha = window.prompt("Confirme a nova senha:");
        if (confirmaSenha !== novaSenha) {
            showToast("As senhas não coincidem.");
            return;
        }

        try {
            await ApiService.alterarSenha(session.id_usuario, senhaAtual, novaSenha);
            showToast("Senha alterada com sucesso!");
        } catch (err) {
            showToast(err.message || "Erro ao alterar senha.");
        }
    });
}

const btnStartAssessment = document.getElementById("btn-start-assessment");
if (btnStartAssessment) {
    btnStartAssessment.addEventListener("click", () => {
        navigate("questions");
    });
}

// ===================== Quiz ======================
async function startQuiz() {
    try {
        DB_QUESTIONS = await ApiService.buscarPerguntas();

        if (!DB_QUESTIONS || DB_QUESTIONS.length === 0) {
            showToast("Nenhuma pergunta cadastrada no banco.");
            navigate("home");
            return;
        }

        currentAnswers = new Array(DB_QUESTIONS.length).fill(null);
        currentQuestionIndex = 0;
        renderQuestion();
    } catch (err) {
        showToast("Erro ao carregar perguntas.");
        navigate("home");
    }
}

function renderQuestion() {
    const q = DB_QUESTIONS[currentQuestionIndex];
    const total = DB_QUESTIONS.length;

    const counterEl = document.getElementById("q-counter");
    const percentEl = document.getElementById("q-percent");
    const progressBar = document.getElementById("q-progress-bar");
    const textEl = document.getElementById("q-text");

    const currentPercent = Math.round(((currentQuestionIndex + 1) / total) * 100);

    if (counterEl) counterEl.textContent = `Pergunta ${currentQuestionIndex + 1} de ${total}`;
    if (percentEl) percentEl.textContent = `${currentPercent}%`;
    if (progressBar) progressBar.style.width = `${currentPercent}%`;
    if (textEl) textEl.textContent = q.texto_pergunta || q.texto;

    const options = [
        { label: "Nunca", val: 0 },
        { label: "Raramente", val: 1 },
        { label: "Às vezes", val: 2 },
        { label: "Frequentemente", val: 3 },
        { label: "Sempre", val: 4 }
    ];

    const selectedVal = currentAnswers[currentQuestionIndex];

    const optionsContainer = document.getElementById("q-options");
    if (optionsContainer) {
        optionsContainer.innerHTML = options.map(opt => {
            const isSelected = selectedVal === opt.val ? "selected" : "";
            return `
                <button type="button" class="quiz-option ${isSelected}" data-val="${opt.val}">
                  <span>${opt.label}</span>
                  <span class="check">✓</span>
                </button>
            `;
        }).join("");

        optionsContainer.querySelectorAll(".quiz-option").forEach(btn => {
            btn.addEventListener("click", () => {
                currentAnswers[currentQuestionIndex] = parseInt(btn.dataset.val);
                renderQuestion();
            });
        });
    }

    const prevBtn = document.getElementById("btn-question-back");
    const nextBtn = document.getElementById("btn-question-next");

    if (prevBtn) prevBtn.style.visibility = currentQuestionIndex === 0 ? "hidden" : "visible";
    if (nextBtn) {
        nextBtn.disabled = currentAnswers[currentQuestionIndex] === null;
        nextBtn.textContent = currentQuestionIndex === total - 1 ? "Finalizar" : "Próxima";
    }
}

const btnQuestionBack = document.getElementById("btn-question-back");
if (btnQuestionBack) {
    btnQuestionBack.addEventListener("click", () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    });
}

const btnQuestionNext = document.getElementById("btn-question-next");
if (btnQuestionNext) {
    btnQuestionNext.addEventListener("click", () => {
        if (currentQuestionIndex < DB_QUESTIONS.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
        } else {
            finishAssessment();
        }
    });
}

// ===================== Processamento -> Resultado ======================
function finishAssessment() {
    navigate("analyzing");
    setTimeout(() => {
        const maxScore = DB_QUESTIONS.length * 4;
        const score = currentAnswers.reduce((sum, v) => sum + (v || 0), 0);
        const percent = Math.round((score / maxScore) * 100);
        const tier = getResultTier(percent);
        lastResult = { date: new Date().toISOString(), percent, tier, saved: false };
        renderResult();
        navigate("result");
    }, 1600);
}

function renderResult() {
    if (!lastResult) return;
    const gauge = document.getElementById("result-gauge");
    if (gauge) gauge.style.setProperty("--pct", lastResult.percent);

    const percentEl = document.getElementById("result-percent");
    if (percentEl) {
        percentEl.innerHTML = `${lastResult.percent}%<span id="result-tier">${lastResult.tier.label}</span>`;
    }

    const msgEl = document.getElementById("result-message");
    if (msgEl) msgEl.textContent = lastResult.tier.message;

    const saveBtn = document.getElementById("btn-save-result");
    if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `<img src="assets/img/icon-salvar.png" alt="">Salvar`;
    }
}

// ===================== Salvar Avaliação e Respostas ======================
const btnSaveResult = document.getElementById("btn-save-result");
if (btnSaveResult) {
    btnSaveResult.addEventListener("click", async () => {
        const session = getSession();
        if (!session || !lastResult || lastResult.saved) return;

        try {
            let labelTexto = typeof lastResult.tier === "string" ? lastResult.tier : lastResult.tier.label;
            let classificacao = "BAIXO";
            if (labelTexto.toLowerCase().includes("alta")) {
                classificacao = "ALTO";
            } else if (labelTexto.toLowerCase().includes("moderada") || labelTexto.toLowerCase().includes("medio")) {
                classificacao = "MODERADO";
            }

            const resRegistro = await ApiService.salvarRegistro({
                id_usuario: session.id_usuario,
                indice_comportamental: lastResult.percent,
                classificacao: classificacao,
                observacao: "Avaliação realizada pelo aplicativo"
            });

            const idRegistroCriado = resRegistro.id_registro || resRegistro.id;
            if (!idRegistroCriado) throw new Error("ID do registro não retornado.");

            for (let i = 0; i < DB_QUESTIONS.length; i++) {
                const idPergunta = DB_QUESTIONS[i].id_pergunta || DB_QUESTIONS[i].id;
                const valorResposta = currentAnswers[i] !== null ? currentAnswers[i] : 0;

                await ApiService.salvarRespostas({
                    id_registro: idRegistroCriado,
                    id_pergunta: idPergunta,
                    resposta: valorResposta
                });
            }

            lastResult.saved = true;
            btnSaveResult.innerHTML = `<img src="assets/img/icon-salvar.png" alt="">Salvo`;
            btnSaveResult.disabled = true;
            showToast("Avaliação e respostas salvas no banco!");
        } catch (err) {
            showToast("Erro ao salvar avaliação.");
        }
    });
}

// ===================== Recommendations ======================
async function renderRecommendations() {
    const listEl = document.getElementById("reco-list");
    if (!listEl) return;

    try {
        const recsBD = await ApiService.buscarRecomendacoes();
        if (recsBD && recsBD.length > 0) {
            listEl.innerHTML = recsBD.map(item => `
                <div class="reco-item">
                    <div class="circle"><img src="assets/img/icon-recomendacao.png" alt=""></div>
                    <div>
                        <strong>${item.titulo || 'Recomendação'}</strong>
                        <p>${item.descricao || item.texto}</p>
                    </div>
                </div>
            `).join("");
        } else {
            listEl.innerHTML = RECOMMENDATIONS.map(text => `
                <div class="reco-item">
                    <div class="circle"><img src="assets/img/icon-recomendacao.png" alt=""></div>
                    <p>${text}</p>
                </div>
            `).join("");
        }
    } catch (err) {
        listEl.innerHTML = RECOMMENDATIONS.map(text => `
            <div class="reco-item">
                <div class="circle"><img src="assets/img/icon-recomendacao.png" alt=""></div>
                <p>${text}</p>
            </div>
        `).join("");
    }
}

// ===================== Boot ======================
(function boot() {
    const session = getSession();
    const hashScreen = (location.hash || "").replace("#/", "");
    if (hashScreen && (PUBLIC_SCREENS.includes(hashScreen) || session) && document.getElementById(`screen-${hashScreen}`)) {
        navigate(hashScreen);
    } else {
        navigate(session ? "home" : "welcome", { force: true });
    }
})();