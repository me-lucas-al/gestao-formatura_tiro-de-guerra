# 🎯 Gestão de Pagamentos - Formatura Tiro de Guerra

Este projeto é um **sistema completo de gestão financeira** desenvolvido para a **formatura do Tiro de Guerra**, oferecendo uma plataforma centralizada e eficiente para controle das arrecadações.

Destinado aos **administradores do evento**, o sistema permite acompanhar o status de pagamentos dos **atiradores e seus familiares**, garantindo **transparência, segurança e praticidade** em todo o processo de gestão.

---

## ✨ Principais Funcionalidades

* **🔐 Autenticação Segura:**
  Acesso restrito a administradores via **JWT (JSON Web Tokens)**, garantindo que apenas usuários autorizados possam visualizar e manipular os dados.

* **📊 Dashboard Intuitivo:**
  Um painel de controle moderno com indicadores essenciais:

  * Total de atiradores e familiares cadastrados.
  * Quantidade de pagamentos confirmados e pendentes.
  * Progresso geral da arrecadação.

* **🎖️ Gestão de Atiradores:**
  Listagem completa e organizada dos atiradores, com visualização de nome, número e status de pagamento.

* **👨‍👩‍👦 Familiares Associados:**
  Exibição detalhada dos familiares vinculados a cada atirador e seus respectivos status de pagamento.

* **💰 Controle de Pagamentos:**
  Registro e atualização de pagamentos com suporte a múltiplos métodos (PIX, Cartão, etc.) e diferentes status (Pendente, Pago, Cancelado).

* **⚙️ API Robusta:**
  Endpoints seguros para CRUD completo de atiradores, familiares e pagamentos, com validação e autenticação integradas.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído com foco em **performance, segurança e escalabilidade**, utilizando um stack moderno e consolidado.

### **Frontend**

* [Next.js](https://nextjs.org/) (App Router)
* [React](https://react.dev/)
* [React Query](https://tanstack.com/query/latest) — gerenciamento de estado assíncrono.
* [Tailwind CSS](https://tailwindcss.com/) — estilização rápida e responsiva.
* [Shadcn/UI](https://ui.shadcn.com/) — biblioteca de componentes acessíveis e elegantes.

### **Backend**

* [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
* [Prisma ORM](https://www.prisma.io/) — abstração segura e tipada do banco de dados.

### **Banco de Dados**

* [PostgreSQL](https://www.postgresql.org/)

### **Autenticação e Segurança**

* [JWT (JSON Web Tokens)](https://jwt.io/) — autenticação baseada em tokens.
* **Cookies HttpOnly** — armazenamento seguro do token de sessão.
* [bcrypt](https://www.npmjs.com/package/bcrypt) — hashing de senhas.

### **Validação e Tipagem**

* [Zod](https://zod.dev/) — validação robusta e schemas tipados.

---

## 🚀 Como Executar o Projeto

Siga as instruções abaixo para rodar o projeto em seu ambiente de desenvolvimento.

### **Pré-requisitos**

* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [pnpm](https://pnpm.io/) (recomendado) ou `npm` / `yarn`

---

### **1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/gestao-formatura_tiro-de-guerra.git
cd gestao-formatura_tiro-de-guerra
```

### **2. Instale as dependências**

```bash
pnpm install
```

### **3. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto e defina as seguintes variáveis:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
JWT_SECRET="sua-chave-secreta-para-jwt"
```

---

### **5. Execute as migrações**

Cria as tabelas no banco conforme o schema Prisma:

```bash
pnpx prisma migrate dev
```

### **6. (Opcional) Popule o banco com dados iniciais**

Execute o script de *seed* para criar administradores e atiradores de exemplo:

```bash
pnpm run seed
```

### **7. Inicie o servidor de desenvolvimento**

```bash
pnpm run dev
```

Acesse a aplicação em:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🧩 Estrutura do Projeto

```
📦 gestao-formatura_tiro-de-guerra
├── 📁 src
│   ├── 📁 app           # Páginas e rotas (App Router)
│   ├── 📁 components    # Componentes reutilizáveis
│   ├── 📁 lib           # Configurações e helpers
│   ├── 📁 prisma        # Schema e migrações do banco
│   └── 📁 api           # Rotas e controladores do backend
├── .env                 # Configurações das variáveis de ambiente
├── docker-compose.yml   # Configuração do container PostgreSQL
├── package.json
└── README.md
```

````
DATABASE_URL="postgresql://postgres:lucas@localhost:5432/formatura-db"
JWT_SECRET="d85c8f971d4c3beb56e92e2a6ea414baa79cbe36abf116cf4a6bf428ddb55ff1e9e648610b10fcaab68d9fe66a082ae85721303e51f1797fa63a5e2c9efe6a1d"
````
