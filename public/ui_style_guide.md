# 🎨 UI Style Guide – PsyTrack

## 🛠️ Objetivo
Unificar a identidade visual do PsyTrack e aplicar um design moderno, leve e coerente com a proposta de uma plataforma SaaS voltada a avaliações psicológicas corporativas.

---

## 🎨 Identidade Visual
**Paleta principal:**  
- Azul-escuro: `#1e3a8a`  
- Lilás suave: `#6366f1`  
- Cinza-claro: `#f8fafc`  
- Branco: `#ffffff`  
- Teal (destaques): `#0d9488`

**Tipografia:**  
- Fonte: `Inter`, `Rubik`, `sans-serif`  
- Texto: `text-gray-700`  
- Títulos: `text-indigo-700`  

**Atmosfera:**  
Calma, profissional e tecnológica. Foco em legibilidade, espaçamento e contraste equilibrado.

**Animações:**  
Transições suaves (`transition-all`, `duration-300`), `hover:scale-105`, `animate-fade-in`, `animate-slide-up`.

---

## 🗓 Layouts Base
### AuthLayout (Login / Cadastro)
- Fundo: `bg-gradient-to-br from-indigo-50 to-indigo-200`
- Centralizar conteúdo vertical e horizontalmente.
- Container principal: `Card` do `shadcn/ui`.
- Padding: `p-8`, `max-w-md`, `rounded-2xl`, `shadow-xl`, `bg-white/90`.
- Logo no topo: `<span className="font-bold text-indigo-700">PsyTrack</span>`.

### AppLayout (Dashboard / Admin)
- Fundo: `bg-slate-50`.
- Barra lateral branca com sombra leve: `bg-white/90 shadow-md`.
- Cabeçalho fixo com nome do usuário e botão de logout.

---

## 🎨 Tailwind Config
- Adicionar cor personalizada `psy` (tons 50–900, base azul/lilás).
- Fonte padrão: `Inter`, `Rubik`, `sans-serif`.
- `borderRadius`: expandir para `xl`, `2xl`.
- Espaçamentos generosos: `lg`, `xl`, `2xl`.

---

## 🔢 Componentes de Formulário
Usar componentes `shadcn/ui`: `Label`, `Input`, `Select`, `Button`.

- Inputs: `rounded-lg border-gray-300 focus:ring-psy-400`
- Botões: `bg-psy-600 hover:bg-psy-700 text-white font-semibold`
- Espaçamento: `space-y-4`
- Transições: `transition-all hover:scale-[1.01]`

---

## 📊 Dashboard
- Fundo: `bg-slate-50`
- Cards com bordas suaves e sombras discretas.
- Grid responsivo: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Cabeçalho com avatar e menu.
- Animações de entrada: `animate-fade-in`.

---

## 🔧 Microinterações
- `hover:shadow-lg`, `transition-all`, `duration-300`.
- Feedback de carregamento: `animate-pulse`.
- Estados de foco: `ring-offset-2 ring-psy-400`.
- Mensagens de erro/sucesso: `text-red-500`, `text-green-600`.

---

## 🔄 Etapas de Aplicação
1. **Prompts 1 a 3:** layout e tema global.  
2. **Prompt 4:** dashboard refinado.  
3. **Prompt 5:** microinterações e feedback.

---

## 🔖 Resultado Esperado
- Layout unificado, responsivo e consistente.  
- Identidade visual moderna, limpa e confiável.  
- Experiência de uso fluida e profissional.  
- Visual de SaaS contemporâneo (inspirado em Linear, Notion e Vercel).

