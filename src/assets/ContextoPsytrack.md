# 🧠 PsyTrack – Plataforma de Avaliações Psicológicas Corporativas

## 🎯 Objetivo Geral
PsyTrack é uma aplicação SaaS multilíngue voltada para **avaliações psicológicas corporativas**, desenvolvida com a stack:
- **Frontend:** Vite + React 18 + TypeScript  
- **Estilo:** Tailwind CSS  
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)  
- **Deploy:** Vercel  
- **Arquitetura:** Multi-tenant híbrida (um psicólogo administra várias empresas, cada qual com dados isolados)

A missão da plataforma é permitir que **psicólogos, empresas e funcionários** participem de processos estruturados de avaliação psicológica online, de forma moderna, segura e fácil de usar.

---

## 👥 Perfis de Usuário

### 1. Psicólogo (Administrador)
- Cria e edita **características psicológicas** (traits).
- Cria **quizzes** com 10 perguntas e 4 alternativas (pesos 1–4).
- Agrupa quizzes em **avaliações completas**.
- Gerencia múltiplas **empresas** vinculadas.
- Pode aplicar e reenviar avaliações.
- Visualiza **resultados individuais e agregados**.
- Gera relatórios interpretativos em PDF e Excel.

### 2. Empresa (RH / Gestão)
- Cadastra e gerencia **funcionários**.
- Importa dados via CSV/Excel.
- Aplica **avaliações criadas pelo psicólogo**.
- Monitora o status das avaliações: pendente, em andamento, concluída, expirada.
- Visualiza resultados e exporta relatórios.

### 3. Funcionário (Avaliado)
- Recebe link único de acesso à avaliação.
- Responde no idioma preferido (pt, es ou en).
- Pode pausar e retomar (auto-save).
- Visualiza o resultado final com interpretação automática.

---

## 🧩 Funcionalidades Principais
- Sistema multilíngue completo (Português, Espanhol e Inglês).  
- Criação e gestão de características, quizzes e avaliações.  
- Geração de links únicos para envio manual (WhatsApp, e-mail, etc.).  
- Cálculo automático de pontuação:
  - **Pontuação total:** 10 a 40  
  - **Percentual:** ((pontos − 10) / 30) × 100  
  - **Interpretação:**  
    - 0–33% → Baixo  
    - 34–66% → Médio  
    - 67–100% → Alto  
- Dashboard com resultados individuais e agregados.  
- Exportação de relatórios (PDF, CSV, Excel).  
- Controle de acesso com Supabase Auth (email/senha + tokens).

---

## 🧱 Estrutura de Dados (simplificada)
**Tabelas principais:**
- `psychologists` → psicólogos administradores  
- `companies` → empresas vinculadas  
- `traits` → características psicológicas  
- `quizzes` → conjuntos de perguntas  
- `questions` → perguntas (pt, es, en)  
- `alternatives` → alternativas com pesos (1 a 4)  
- `assessments` → agrupamentos de quizzes  
- `employees` → funcionários cadastrados  
- `applications` → avaliações aplicadas  
- `responses` → respostas individuais  
- `results` → resultados consolidados  

**Relacionamentos essenciais:**
- `psychologist` 1—* `companies`  
- `company` 1—* `employees`  
- `psychologist` 1—* `assessments`  
- `assessment` *—* `quizzes`  
- `quiz` 1—* `questions`  
- `question` 1—* `alternatives`  
- `application` 1—* `responses` → `results`

---

## 🔒 Segurança e Privacidade
- Cada empresa possui **dados isolados** (multi-tenant lógico).  
- O psicólogo acessa apenas empresas sob sua administração.  
- RLS (Row-Level Security) ativa em todas as tabelas.  
- Tokens únicos de acesso por avaliação.  
- Logs de auditoria e conformidade com LGPD e GDPR.

---

## 📊 Dashboards e Relatórios
- Resultados individuais e comparativos por funcionário e por cargo.  
- Gráficos radar, barra e linha (histórico de reavaliações).  
- Exportações em PDF e Excel.  
- Filtros por data, empresa e avaliação.

---

## 🌐 Internacionalização
- Interface e conteúdo disponíveis em **Português, Espanhol e Inglês**.  
- Textos armazenados no banco e sincronizados via hook i18n.  
- Usuário pode alterar idioma a qualquer momento.

---

## 🪶 Identidade Visual
- **Paleta sugerida:** tons de azul-escuro, lilás e cinza-claro.  
  - Azul escuro: `#0A2540`  
  - Lilás suave: `#A78BFA`  
  - Cinza claro: `#F5F7FA`
- Visual limpo, elegante e moderno.  
- Foco em UX fluida e responsiva.

---

## ⚙️ Stack Técnica
| Camada | Tecnologia |
|---------|-------------|
| Frontend | Vite + React 18 + TypeScript |
| Estilização | Tailwind CSS |
| Backend | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| Deploy | Vercel |
| Segurança | RLS + JWT Tokens |
| Idiomas | pt-BR, es, en |

---

## 🧩 Fluxo do Sistema
1. Psicólogo cria características, quizzes e avaliações.  
2. Empresa cadastra funcionários.  
3. Empresa ou psicólogo envia links aos avaliados.  
4. Funcionário responde e envia.  
5. Sistema calcula pontuação e classifica resultado.  
6. Psicólogo e empresa visualizam relatórios.  

---

## 🚀 Status do Projeto
**Versão:** 0.1 (MVP em desenvolvimento)  
**Responsável:** Daniel Correia Araújo  
**Agente de desenvolvimento:** Codex (OpenAI)  
**Ambiente:** VS Code  

O objetivo imediato é concluir o MVP com o fluxo completo de:
- Criação de testes pelo psicólogo  
- Aplicação pela empresa  
- Resposta pelo funcionário  
- Cálculo e visualização de resultados  

---

## 🧭 Observação para o Agente IA
Este documento serve como **contexto de referência** para todas as instruções futuras.  
O Codex deve **seguir esta visão** ao gerar código, rotas, componentes ou lógicas do banco de dados.  
Cada decisão técnica deve priorizar:
- Segurança dos dados (RLS e isolamento por empresa)
- Clareza do código (TypeScript e modularização)
- Escalabilidade (multi-tenant controlado)
- Experiência fluida para o usuário final.

---
