# digita. — memória do projeto

Este arquivo é a fonte da verdade do projeto. A **Parte 1** é o briefing original, como
foi escrito pelo Fernando. A **Parte 2** são as decisões e convenções combinadas depois.
A **Parte 3** lista o que **não** deve ser construído na versão 1.

> ## ⚠️ Antes de qualquer trabalho: consulte o [PLANO.md](PLANO.md)
>
> O `CLAUDE.md` diz **o quê**; o `PLANO.md` diz **como** e em **que ordem** — a estrutura
> de arquivos, o formato das lições, as conferências automáticas, as chaves do
> `localStorage`, os 17 passos, as pausas para teste no Safari e as regras de publicação.
>
> **Ao concluir um passo, marcar a caixa correspondente** na seção "Estado dos passos", no
> fim do `PLANO.md`, dentro do mesmo commit do passo. Se o plano mudar durante a
> construção, atualizar o `PLANO.md` — ele não pode ficar desatualizado em relação ao
> código.

---

# PARTE 1 — BRIEFING DO PROJETO: digita.

## OBJETIVO

Site de treino de digitação com foco em português brasileiro. Diferenciais: palavras em
PT-BR, treino de Ç e acentos, e um módulo de acentuação para quem usa teclado americano
(comum em MacBooks importados).

## TECNOLOGIA

- Site estático em HTML, CSS e JavaScript puro, sem etapa de build, para publicar no
  GitHub Pages (repositório público).
- Todos os arquivos em UTF-8, com `<meta charset="UTF-8">`.
- Estilos e ícones dentro do próprio projeto (sem depender de nada externo para a
  aparência).
- Código com comentários em português. Inicie um repositório Git e faça commits pequenos
  e descritivos.

## VISUAL

Minimalista e elegante, sem gradientes nem sombras pesadas. Crie um arquivo `tema.css`
com todas as cores em variáveis CSS e use apenas essas variáveis no resto do site.

Fontes (do sistema, sem baixar nada):

- Títulos: `Georgia, "New York", serif`
- Texto: `system-ui, -apple-system, "Segoe UI", sans-serif`
- Texto de digitação: `ui-monospace, "SF Mono", Menlo, Consolas, monospace`

**Modo claro:**

| Elemento | Cor |
|---|---|
| Fundo da página | `#F1EFE8` |
| Cartões e painéis | `#FFFFFF` |
| Bordas | `#D3D1C7` |
| Texto principal | `#2C2C2A` |
| Texto secundário | `#5F5E5A` |
| Texto discreto e letras ainda não digitadas | `#888780` |
| Botão principal | fundo `#2C2C2A`, texto `#FFFFFF` |

**Modo escuro:**

| Elemento | Cor |
|---|---|
| Fundo da página | `#1F1F1D` |
| Cartões e painéis | `#2C2C2A` |
| Bordas | `#444441` |
| Texto principal | `#F1EFE8` |
| Texto secundário | `#B4B2A9` |
| Texto discreto | `#888780` |
| Botão principal | fundo `#F1EFE8`, texto `#2C2C2A` |

**Cores dos dedos** (fundo da tecla / texto da tecla):

| Dedo | Claro | Escuro |
|---|---|---|
| Mínimo (violeta) | `#EEEDFE` / `#3C3489` | `#3C3489` / `#CECBF6` |
| Anelar (azul) | `#E6F1FB` / `#0C447C` | `#0C447C` / `#B5D4F4` |
| Médio (verde-água) | `#E1F5EE` / `#085041` | `#085041` / `#9FE1CB` |
| Indicador (verde) | `#EAF3DE` / `#27500A` | `#27500A` / `#C0DD97` |
| Polegar e teclas neutras (cinza) | `#F1EFE8` / `#5F5E5A` | `#444441` / `#D3D1C7` |

**Erro:** claro `#FCEBEB` / `#A32D2D` · escuro `#791F1F` / `#F7C1C1`

Use esta paleta como base. Se no planejamento você enxergar alguma melhoria de contraste
ou legibilidade, sugira antes de aplicar, mas não troque as cores por conta própria.

## IDIOMA DA INTERFACE

PT e EN. Detectar pelo idioma do navegador ao abrir, com seletor PT/EN no canto superior.

## TELA DE ENTRADA

- Duas escolhas manuais em cartões: formato do teclado (Brasileiro ABNT2 / Americano US)
  e sistema (Windows / Mac). A escolha manual é sempre a palavra final.
- Sistema detectado automaticamente ao abrir (`navigator.userAgent`).
- Formato padrão: Brasileiro.
- Botão "Detectar automaticamente", **SEM caixa de texto**:
  1. Se existir `navigator.keyboard.getLayoutMap` (Chrome/Edge), ler a tecla física
     `"Semicolon"`: `"ç"` = ABNT2, `";"` = US.
  2. Se não existir (Safari/Firefox), a tecla à direita do L pulsa na prévia do teclado
     com o texto "Aperte a tecla destacada"; escutar um único `keydown` no documento e
     comparar `event.code` `"Semicolon"` com `event.key`.
- Prévia do teclado que muda conforme as escolhas (ABNT2 × US, teclas de Windows × Mac),
  com cores por dedo e marcação em F e J.
- Caixa de dica de acentuação conforme o teclado (ABNT2: tecla ´ própria; US no Windows:
  layout US Internacional; US no Mac: `Option + E`, depois `E` = é; `Option + C` = ç).
- Rede de segurança: durante as fases, se a tecla física não bater com o layout escolhido,
  sugerir a troca com um aviso discreto.

## FLUXO DE TELAS (VERSÃO 1)

1. **Entrada** (acima).
2. **Nivelamento**: "Você já digita sem olhar para o teclado?" Não = fase 1. Sim = teste
   de 1 minuto que libera as fases dominadas.
3. **Fase de digitação**: texto em fonte monoespaçada; teclado todo cinza com a próxima
   tecla na cor do dedo; desenho de duas mãos acima com o dedo certo aceso; legenda
   "Próxima: F · indicador esquerdo"; o cursor trava até acertar; tecla errada pisca em
   vermelho; métricas ao vivo de PPM, precisão e progresso. Capturar a digitação por um
   campo de texto invisível (tratando eventos de composição para acentos compostos), não
   por `keydown` no documento.
4. **Resultado**: PPM, precisão, teclas com mais erros, botões Repetir e Próxima fase.
5. **Tela inicial**: "Continuar de onde parei", sequência de dias praticando, atalhos para
   as seções.
6. **Trilha de fases**: fileira base, fileira de cima, fileira de baixo, números, acentos,
   pontuação, teclado numérico. Fase 1 usa só as letras da fileira base com palavras reais
   (ex.: asa, sala, fada, saga, salada, falsa).

## DEPOIS DA VERSÃO 1

Estatísticas (evolução, mapa de calor do teclado, precisão por dedo), treino livre (modo
adaptativo com foco nas teclas mais lentas, texto próprio, acentos, teclado numérico),
jogos (primeiro "palavras caindo", depois cobrinha), conquistas e configurações.

## SALVAMENTO

`localStorage`, sem login. Todas as chaves com o prefixo `"digita:"` (ex.: `digita:config`,
`digita:progresso`). Botões para exportar e importar o progresso em arquivo.

## SONS

Web Audio API. Clique de tecla desligado por padrão (opcional, com estilos); som de erro
suave opcional; som curto ao concluir fase. Nos jogos, sons ligados por padrão. Botão de
mudo sempre visível e controle de volume. Nunca tocar som antes da primeira interação.

---

# PARTE 2 — DECISÕES E CONVENÇÕES

## Código

- **Módulos ES** (`import` / `export`) em todos os arquivos `.js`. Consequência: o site
  **não** funciona por duplo clique (`file://`) — precisa de um servidor local.
- Comentários e nomes de arquivo em português.
- Nada de dependências externas, nem CDN. Zero etapa de build.
- Caminhos **relativos** em todos os `href`/`src`/`import` — o GitHub Pages publica o
  projeto numa subpasta (`usuario.github.io/digita/`).

## Textos e tradução

Nenhum texto visível fica escrito direto no HTML ou no JavaScript. Todos moram em
`dados/i18n/pt.js` e `dados/i18n/en.js`, com **exatamente as mesmas chaves** nos dois
arquivos, e são aplicados por marcadores no HTML:

| Marcador | Troca |
|---|---|
| `data-i18n="secao.chave"` | o texto de dentro do elemento |
| `data-i18n-aria="secao.chave"` | o atributo `aria-label` |
| `data-i18n-titulo="secao.chave"` | o atributo `title` |

O texto em português fica escrito no HTML como reserva, para a página não aparecer vazia
antes de o JavaScript rodar. Chave faltando não quebra a tela: o site cai no português e
avisa no console.

## Como testar

Quando o Fernando pedir para testar, **eu** (Claude) subo o servidor e abro o navegador —
ele não precisa rodar nada:

```bash
cd /Users/fernando/Documents/ClaudeCode/Digita && python3 -m http.server 8000
```

Ambiente conferido: `python3` 3.9.6 e `git` 2.39.5. Não há Node nem Homebrew.

## Git e GitHub

- Autoria configurada **só neste repositório** (sem `--global`):
  `Fernando Rodrigo Trajano da Silva` ·
  `327606988+fernando-trajano@users.noreply.github.com`.
- Branch principal: `main`.
- Um commit pequeno e descritivo por passo.
- **Regra fixa:** quem envia para o GitHub é o Fernando, pelo **GitHub Desktop**.
  Claude faz `git init`, `git add` e `git commit`, mas **nunca** roda `git push`,
  `git remote add`, `gh auth` ou qualquer comando que peça senha ou token.

## Ritmo de trabalho

Ao final de cada passo, Claude entrega um **resumo curto**: o que mudou, o que o Fernando
deve testar e o que ele deve ver. Nos passos da tela de entrada, do motor de digitação e
da tela de lição, Claude **para e pede um teste manual no Safari** — com roteiro do tipo
"faça isto, você deve ver aquilo" — porque o Safari não tem `getLayoutMap` e trata acentos
compostos de um jeito próprio.

## Escopo da versão 1

Fluxo completo de ponta a ponta (entrada → nivelamento → lição → resultado → trilha →
início) com a trilha **fileira base** inteira (18 lições). As outras 6 trilhas aparecem
como **"em breve"**, mas a estrutura de dados já nasce pronta para recebê-las.

## Programa de ensino (meta final, ~100 lições)

Baseado em pesquisas sobre ensino de digitação: um iniciante leva de **8 a 10 horas** para
concluir a trilha, organizada como um **programa de 30 dias** com sessões de 15 a 20
minutos e lições de **~5 minutos**.

| Trilha | Lições |
|---|---|
| Fileira base | 18 |
| Fileira de cima | 18 |
| Fileira de baixo | 14 |
| Números | 10 |
| Acentos e Ç | 16 |
| Pontuação e maiúsculas | 14 |
| Teclado numérico | 10 |
| **Total** | **100** |

Cada trilha segue o ritmo: **teclas novas → palavras → frases → revisão → desafio final**,
e o desafio final libera a trilha seguinte.

- **Precisão mínima de 90%** para passar de lição.
- Até **3 estrelas** por metas de velocidade (PPM).
- As lições ficam em **arquivos de dados separados do código** (`dados/licoes/`), para o
  Fernando adicionar conteúdo depois sem tocar na lógica.

## Regra do Ç e das teclas que não existem em todo layout

A tecla à direita do L é `Ç` no ABNT2 e `;` no US — mesma posição física, letras
diferentes. Portanto:

- A **fileira base usa somente** `a s d f g h j k l`. Nada de Ç, `;` ou acentos.
- O **Ç é assunto da trilha de acentos**, com explicação por teclado (ABNT2: tecla própria
  · US no Mac: `Option + C` · US no Windows: `'` seguido de `c`, com o US Internacional).
- **Nada de palavra de outro idioma.** Só português do Brasil, conferida uma a uma.
- `dados/licoes/conferencia.js` roda **duas verificações automáticas** e avisa no console:
  1. **Layout** — nenhuma lição pode pedir uma tecla que o layout escolhido não tem.
  2. **Letras já ensinadas** — o conteúdo de uma lição só pode usar as letras de
     `teclasNovas` dela somadas às de todas as lições anteriores da mesma trilha.
- Antes de escrever as lições de uma trilha, apresentar ao Fernando a lista de palavras e
  a distribuição proposta **para revisão**. Onde faltar vocabulário real, usar sílabas e
  combinações (ex.: `sa fa la ga`, `dfd jkj`).

## Contraste da paleta

A paleta fica **intacta** — nenhuma cor trocada. Mas `#888780` sobre `#F1EFE8` dá ~3:1,
que é suficiente para texto grande e fraco para texto pequeno. Regra:

- `#888780` **só** nas letras ainda não digitadas, em fonte de **24px ou maior**.
- Em legendas e textos pequenos, usar o texto secundário `#5F5E5A` (modo claro) ou
  `#B4B2A9` (modo escuro).

## Outros

- **Dois READMEs:** `README.md` (português) e `README.en.md` (inglês), com link cruzado.
- **Sem teclado físico:** se o site for aberto em celular ou tablet, mostrar uma mensagem
  amigável explicando que ele foi feito para computador com teclado (em PT e EN).

---

# PARTE 3 — FORA DA VERSÃO 1

Não construir agora, mesmo que pareça fácil:

- Estatísticas: evolução, mapa de calor do teclado, precisão por dedo.
- Treino livre: modo adaptativo com foco nas teclas mais lentas, texto próprio, acentos,
  teclado numérico.
- Jogos: "palavras caindo" primeiro, cobrinha depois.
- Conquistas e tela de configurações.
- Meta diária de 15 minutos com sequência de dias, modo adaptativo e desafio do dia.
- Na trilha de acentos: detectar se o usuário de Windows está com o layout **US padrão
  (sem teclas mortas)** e orientar a ativar o **US Internacional**.
