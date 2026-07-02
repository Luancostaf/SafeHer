# SafeHer

## 👥 Integrantes da Equipe

- Luan Franco
- Júlio César
- Heitor Rocha
- Ryan Antunes
- Lucas Freire
- Matheus Salomé

---

# 📖 Sobre o Projeto

O **SafeHer** é um aplicativo desenvolvido com o objetivo de auxiliar mulheres na identificação preventiva de possíveis comportamentos preocupantes em relacionamentos amorosos.

O sistema realiza uma avaliação comportamental por meio de um questionário adaptativo, apresentando observações e recomendações preventivas com base nas respostas fornecidas pela usuária.

O aplicativo possui caráter exclusivamente informativo e **não substitui** apoio psicológico, jurídico ou policial.

---

# 💻 Tecnologias Utilizadas

### Front-end
- HTML5
- CSS3
- JavaScript

### Back-end
- Python
- Flask

### Banco de Dados
- MySQL

### Controle de Versão
- Git
- GitHub

---

# ✨ Funcionalidades

- Cadastro de usuárias;
- Login com e-mail e senha;
- Avaliação comportamental adaptativa;
- Registro das respostas do questionário;
- Cálculo do índice comportamental;
- Exibição de observações preventivas;
- Recomendações informativas;
- Histórico de avaliações;
- Recursos de acessibilidade para auxílio na leitura.

---

# 📁 Estrutura do Projeto

```
SafeHer/
│
├── frontend/
│   ├── assets/
│   ├── pages/
│   └── index.html
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── repositories/
│   ├── services/
│   ├── database/
│   │   └── create_database.sql
│   ├── app.py
│   ├── config.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

# 🚀 Como executar o projeto

## Pré-requisitos

- Python 3.12 ou superior
- MySQL
- Git

## Passos

Clone o repositório:

```bash
git clone https://github.com/SEU-USUARIO/SafeHer.git
```

Acesse a pasta do projeto:

```bash
cd SafeHer
```

Instale as dependências:

```bash
pip install -r backend/requirements.txt
```

Configure o banco de dados MySQL.

Execute a aplicação:

```bash
cd backend
python app.py
```

Acesse no navegador:

```
http://localhost:5000
```

---

# 📄 Licença

Projeto desenvolvido para a disciplina de **Projeto de Software** do **Colégio COTEMIG**.

---

## 📌 Observação

Este projeto possui finalidade **acadêmica**. O SafeHer oferece uma pré-análise baseada nas respostas fornecidas pela usuária e apresenta recomendações preventivas, não realizando diagnósticos ou substituindo profissionais especializados.
