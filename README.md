# 🎯 Gestão de Formatura — Tiro de Guerra

Sistema de gestão financeira da formatura do Tiro de Guerra. Permite controlar pagamentos de atiradores e familiares, com painel administrativo, autenticação por função (ADMIN / SUPERADMIN) e relatórios de arrecadação.

---

## ✨ Funcionalidades

| Módulo | Descrição |
|---|---|
| 🔐 Autenticação | Login com JWT + cookies HttpOnly; dois níveis de acesso (ADMIN e SUPERADMIN) |
| 📊 Dashboard | Painel com cards de resumo, navegação por seção e listagens de Atiradores e Familiares |
| 🎖️ Atiradores | CRUD completo, filtros por nome/número/status e seleção múltipla para exclusão |
| 👨‍👩‍👦 Familiares | Listagem vinculada ao atirador, filtros, exclusão individual e em massa |
| 💰 Pagamentos | Status (Pendente, Pago, 1ª Parcela, Cancelado, Isento) e métodos (PIX, Cartão, Dinheiro) |
| 🛡️ Admins | SUPERADMIN cria e gerencia admins; admins comuns só alteram a própria senha |

---

## 🏗️ Arquitetura

O projeto segue **Domain-Driven Design (DDD)** com **Clean Architecture** e **Hexagonal Architecture**, organizado em um monorepo **pnpm workspaces + Turborepo**.

```
gestao-formatura_tiro-de-guerra/
│
├── src/                          # Camada Next.js (UI + Server Actions)
│   ├── app/                      # Rotas App Router
│   ├── actions/                  # Server Actions (entrypoint → Controller)
│   ├── modules/                  # Componentes por domínio (UI)
│   ├── services/                 # Serviços de infraestrutura Next.js
│   ├── schemas/                  # Zod schemas compartilhados na camada Next
│   ├── contexts/                 # React Contexts (estado de UI)
│   ├── hooks/                    # React hooks reutilizáveis
│   └── lib/                      # Auth, helpers
│
├── packages/                     # Pacotes de domínio (@gestao_formatura/*)
│   ├── admin/                    # Domínio Admin
│   │   └── src/
│   │       ├── controllers/      # Ponto de entrada; delega para o Service
│   │       ├── services/         # Lógica de negócio pura (sem dependência Next.js)
│   │       ├── repositories/
│   │       │   ├── interfaces/   # Contratos (IAdminRepository)
│   │       │   └── actions/      # Implementações via Server Actions
│   │       └── dto/              # Zod schemas + tipos inferidos
│   │   └── tests/
│   │       ├── unit/             # Vitest
│   │       └── e2e/              # Playwright
│   │
│   ├── atirador/                 # Domínio Atirador
│   ├── family-member/            # Domínio Familiar
│   ├── payment/                  # Domínio Pagamento
│   ├── auth/                     # Domínio Autenticação
│   ├── dashboard/                # Domínio Dashboard
│   ├── shared/                   # Prisma client + interfaces base
│   ├── schemas/                  # Zod schemas compartilhados entre pacotes
│   └── types/                    # Tipos TypeScript compartilhados
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
└── tests/
    └── e2e/                      # Testes E2E Playwright (root)
```

### Fluxo de uma request

```
Browser → Server Action (src/actions/) → Controller (packages/*/controllers/)
       → Service (packages/*/services/) → Repository Interface
       → Repository Action (packages/*/repositories/actions/) → Prisma → PostgreSQL
```

### Regras de camada

- **Controllers**: nunca contêm lógica de negócio; delegam imediatamente ao Service.
- **Services**: lógica de negócio pura; sem imports de `next/*`; recebem dependências por injeção.
- **Repositories**: a interface define o contrato; a implementação usa Prisma via Server Actions.
- **DTOs**: 100% Zod — tipos sempre inferidos com `z.infer<>`, nunca escritos manualmente.

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Linguagem | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, Shadcn/UI, Lucide React |
| ORM | Prisma 7 + adaptador Neon (suporte a PostgreSQL serverless) |
| Banco | PostgreSQL (local ou [Neon](https://neon.tech)) |
| Autenticação | JWT (jsonwebtoken) + cookies HttpOnly + bcrypt |
| Validação | Zod 4 |
| Monorepo | pnpm workspaces + Turborepo |
| Testes | Vitest (unitários) — Playwright (E2E) |
| Toasts | Sonner |

---

## 🚀 Setup Local

### Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [pnpm 10+](https://pnpm.io/installation) — `npm i -g pnpm`
- PostgreSQL local **ou** conta gratuita em [Neon](https://neon.tech)

---

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/gestao-formatura_tiro-de-guerra.git
cd gestao-formatura_tiro-de-guerra
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie o arquivo `prisma/.env` (usado pelo Prisma):

```env
# prisma/.env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/formatura-db"
JWT_SECRET="sua-chave-secreta-longa-e-aleatoria"
ADMIN_PASSWORD="admin123"
```

> **Neon (serverless):** use a connection string do painel Neon com `?sslmode=require`.

### 4. Rode as migrations

```bash
pnpm migrate dev
```

> Isso aplica todas as migrations do `prisma/migrations/` e gera o Prisma Client.

### 5. (Opcional) Popule o banco com dados de exemplo

```bash
pnpm seed
```

Cria admins, atiradores e familiares de exemplo. O SUPERADMIN padrão criado pelo seed é documentado no próprio arquivo `prisma/seed.ts`.

### 6. Gere o Prisma Client (se necessário)

```bash
pnpm generate
```

### 7. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

Acesse: **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 Testes

```bash
# Testes unitários do pacote admin (Vitest)
pnpm --filter @gestao_formatura/admin test

# Testes E2E (Playwright) — requer servidor rodando na porta 3000
pnpm exec playwright test

# Build de produção (valida TypeScript + todos os pacotes)
pnpm build
```

---

## ⚙️ Scripts disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento (Turbopack) |
| `pnpm build` | Build de produção (Turborepo → Next.js) |
| `pnpm start` | Inicia a build de produção |
| `pnpm migrate dev` | Cria e aplica uma nova migration |
| `pnpm generate` | Gera o Prisma Client |
| `pnpm seed` | Popula o banco com dados iniciais |
| `pnpm studio` | Abre o Prisma Studio |
| `pnpm docker-compose` | Sobe o container PostgreSQL local |

---

## 👤 Papéis de acesso

| Papel | Pode fazer |
|---|---|
| `ADMIN` | Ver dashboard, gerenciar atiradores e familiares, alterar a própria senha |
| `SUPER_ADMIN` | Tudo acima + criar admins, promover admins a superadmin, remover admins |

A senha padrão criada pelo seed/cadastro é `admin123`. Altere no primeiro acesso.

---

## 📐 Convenções de código

- **Sem `else`**: use early returns.
- **Sem tipos manuais para schemas**: sempre `z.infer<typeof Schema>`.
- **Sem lógica nos controllers**: delegar 100% ao service.
- **Sem Prisma nos services**: apenas interfaces de repositório.
- **Nomes descritivos**: sem abreviações.
- Funções com no máximo 20 linhas; classes/arquivos com responsabilidade única.
