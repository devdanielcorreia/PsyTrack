# 🧠 PSYTRACK – CONTEXTUALIZAÇÃO TÉCNICA DO PROJETO -PRONTO PARA  CRUD DO PSICÓLOGO (traits, quizzes, assessments)
## 💡 Visão Geral
PsyTrack é uma plataforma web para **avaliações psicológicas corporativas**, desenvolvida em **React + Vite + TypeScript + Tailwind CSS** com **Supabase** como backend.  
O objetivo é permitir que **psicólogos**, **empresas** e **funcionários** participem de processos de avaliação personalizados, com segurança, clareza e interface moderna.

---

## ⚙️ Stack Tecnológica
| Camada | Tecnologia |
|--------|-------------|
| Frontend | Vite + React 18 + TypeScript |
| Estilização | Tailwind CSS |
| Backend | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| Deploy | Vercel |
| Banco de dados | Modelo relacional multi-tenant híbrido |
| Segurança | RLS (Row-Level Security) |
| Idiomas | pt-BR, es, en |

---

## 🧱 Estrutura de Pastas (Frontend)

src/
├─ components/
├─ pages/
│ ├─ auth/
│ │ └─ Login.tsx
├─ context/
│ └─ AuthContext.tsx
├─ lib/
│ └─ supabase.ts
├─ hooks/
├─ types/
├─ App.tsx
└─ main.tsx


---

## 👥 Perfis de Usuário

### 1. Psicólogo (Administrador)
- Cria características (traits) e quizzes.  
- Agrupa quizzes em avaliações (assessments).  
- Gerencia empresas associadas.  
- Envia e reenvia avaliações.  
- Visualiza resultados individuais e agregados.  

### 2. Empresa (Gestão / RH)
- Cadastra e gerencia funcionários.  
- Importa planilhas CSV/Excel.  
- Aplica avaliações criadas por psicólogos.  
- Acompanha status das aplicações e resultados.  

### 3. Funcionário (Avaliado)
- Recebe link único para responder.  
- Responde avaliações no idioma preferido.  
- Visualiza o resultado final após envio.

---

## 🧩 Banco de Dados (Resumo Estrutural)

### 🔸 Tabelas Principais
- `psychologists` → psicólogos administradores  
- `companies` → empresas vinculadas ao psicólogo  
- `employees` → funcionários das empresas  
- `traits` → características psicológicas  
- `quizzes` → conjuntos de perguntas  
- `questions` → perguntas multilíngues  
- `alternatives` → alternativas com pesos (1–4)  
- `assessments` → agrupamentos de quizzes  
- `assessment_quizzes` → relação muitos-para-muitos  
- `applications` → avaliações aplicadas a funcionários  
- `responses` → respostas individuais  
- `results` → resultados consolidados  
- `v_results_full` → *view* de resultados agregados

### 🔒 Segurança
- RLS (Row-Level Security) habilitado em todas as tabelas principais.  
- Políticas específicas:
  - Psicólogo → acessa apenas suas empresas e dados.
  - Empresa → acessa apenas seus próprios funcionários.
  - Funcionário → acessa apenas sua aplicação via token único.
- Dados totalmente isolados por psicólogo (multi-tenant lógico).  

---

## 🔐 Autenticação (Etapa 3)

### 📦 Contexto
A autenticação é gerenciada pelo Supabase Auth com controle de roles via `user_metadata`.

### 🧩 Estrutura
- `AuthContext.tsx` fornece:
  - `user`, `session`, `loading`
  - Métodos: `signIn`, `signUp`, `signOut`
- `signUp` insere o usuário no `auth.users`
  - Se `role = psychologist`, cria também registro na tabela `psychologists`
- `AuthProvider` envolve a aplicação em `main.tsx`

### 🧭 Fluxo
1. Usuário acessa `/`
2. Se não autenticado → exibe `Login.tsx`
3. Se autenticado → exibe `Dashboard` (temporário no `App.tsx`)
4. Pode fazer logout via `signOut()`

---

## 💻 Variáveis de Ambiente
Arquivo `.env.local` (sem aspas):


Essas variáveis são usadas em `src/lib/supabase.ts` para inicializar o cliente Supabase.

---

## 🧭 Etapas do Desenvolvimento

| Etapa | Descrição | Status |
|-------|------------|--------|
| 1️⃣ | Criação do projeto base (Vite + Tailwind) | ✅ Concluída |
| 2️⃣ | Modelagem do banco + RLS (Supabase) | ✅ Concluída |
| 3️⃣ | Conexão + Autenticação (Supabase Auth) | 🚧 Concluída |
| 4️⃣ | CRUD do Psicólogo (traits, quizzes, assessments) | 🔜 Próxima |
| 5️⃣ | CRUD da Empresa e Funcionários | 🔜 |
| 6️⃣ | Aplicação e respostas de avaliações | 🔜 |
| 7️⃣ | Dashboards e relatórios | 🔜 |
| 8️⃣ | Internacionalização | 🔜 |
| 9️⃣ | Deploy na Vercel | 🔜 |

---

## 🧠 Diretrizes para o Agente Codex

O Codex deve:
1. Seguir a arquitetura descrita acima.  
2. Usar TypeScript e Vite + React 18.  
3. Adotar Tailwind CSS para layout.  
4. Utilizar o cliente `supabase` central em `src/lib/supabase.ts`.  
5. Escrever código completo e autocontido (sem trechos parciais).  
6. Manter clareza nos imports (`@/` para caminhos absolutos).  
7. Priorizar segurança (sem expor chaves ou bypass de RLS).  
8. Usar `async/await` e `try/catch` para lidar com erros.  
9. Sempre comentar blocos de código que envolvem lógica de negócio.  
10. Preservar o padrão visual minimalista e profissional.

---

## 🧾 Autor do Projeto
**Daniel Correia Araújo**  
Empreendedor e engenheiro civil, fundador da **CodeNode.AI**  
Desenvolvedor de soluções SaaS com **Inteligência Artificial e automações corporativas**.






