# Plano de construção — digita. (versão 1)

Este é o plano completo e aprovado. O `CLAUDE.md` guarda o **quê** (briefing e regras);
este arquivo guarda o **como** e em **que ordem**. Ao concluir cada passo, marcar a caixa
na seção [Estado dos passos](#estado-dos-passos).

---

## Contexto

Site de treino de digitação em português do Brasil, para o portfólio do Fernando: site
estático (HTML + CSS + JavaScript puro, sem etapa de build), publicado no GitHub Pages.
Os diferenciais são palavras em PT-BR, treino de Ç e acentos, e ajuda para quem usa
teclado americano.

O projeto começou de uma pasta vazia, inclusive o repositório Git.

A meta final (não toda construída agora) é um programa de ~30 dias, 8 a 10 horas de
prática, com ~100 lições de ~5 minutos divididas em 7 trilhas. A **versão 1** entrega o
fluxo inteiro funcionando de ponta a ponta com a trilha "fileira base" completa
(18 lições); as outras 6 trilhas aparecem como "em breve", mas a estrutura de dados já
nasce pronta para receber todas elas.

### Decisões tomadas

| Decisão | Escolha | Motivo |
|---|---|---|
| Organização do JS | **Módulos ES** (`import`/`export`) | Código isolado, sem globais se misturando |
| Como testar | Claude inicia `python3 servidor.py` e abre no painel de navegador | Módulos ES não funcionam com duplo clique (`file://`), e o servidor padrão serve código velho do cache |
| Escopo v1 | Fluxo completo + fileira base (18 lições) | Ver o site rodando e publicável rápido |
| Paleta | **Trocada no passo 6** para branco neutro no modo claro; escuro intacto | Ver a seção VISUAL do `CLAUDE.md`, que é a fonte da verdade |
| Ç na fileira base | **Não entra** | No teclado US essa posição é `;` — Ç vira assunto da trilha de acentos |
| Publicação | Logo após a tela de entrada (passo 7) | Confirmar o endereço real antes de construir o resto |
| Safari | Fernando testa à mão em 3 momentos | Simulação não substitui o navegador de verdade |
| Envio ao GitHub | **GitHub Desktop, sempre pelo Fernando** | Claude commita na pasta; nunca roda `push` nem nada que peça senha |
| README | **Dois arquivos**: `README.md` (PT) e `README.en.md` (EN) | Portfólio lido por gente dos dois idiomas |
| Licença | **MIT**, em nome de Fernando Rodrigo Trajano da Silva | Padrão para projeto público de portfólio |
| Nome do repositório | **`digita`** → `fernando-trajano.github.io/digita/` | Confirmado |

Ambiente conferido: `python3` 3.9.6 e `git` 2.39.5. Não há Node nem Homebrew — o que
combina com o projeto sem etapa de build.

---

## Passo 1 — CLAUDE.md e repositório

Comandos do Git, nesta ordem:

```bash
git init -b main            # branch principal "main" (o Git 2.39 usaria "master")
git config user.name "Fernando Rodrigo Trajano da Silva"
git config user.email "327606988+fernando-trajano@users.noreply.github.com"
```

Sem `--global`: a autoria vale **só nesta pasta**, e o e-mail de privacidade do GitHub
mantém o endereço pessoal fora do histórico público.

E criar o `CLAUDE.md` contendo:

1. O **briefing na íntegra**, exatamente como o Fernando escreveu (objetivo, tecnologia,
   visual, paleta completa, idioma, tela de entrada, fluxo de telas, pós-v1, salvamento,
   sons).
2. Uma seção **"Decisões e convenções"**: módulos ES, comando para testar, escopo da v1,
   meta de ~100 lições em 7 trilhas com o ritmo (teclas novas → palavras → frases →
   revisão → desafio), precisão mínima de 90%, até 3 estrelas por velocidade, regra do
   contraste do `#888780`, a instrução de que quando o Fernando pedir para testar
   **Claude** sobe o servidor e abre o navegador, a regra do Ç fora da fileira base, os
   dois READMEs e o resumo curto ao fim de cada passo.
3. Uma seção **"Fora da versão 1"** com o que fica para depois (estatísticas, treino
   livre, jogos, conquistas, meta diária de 15 min, modo adaptativo, desafio do dia),
   incluindo: **na trilha de acentos, detectar se o usuário de Windows está com o layout
   US padrão (sem teclas mortas) e orientar a ativar o US Internacional.**

---

## Estrutura de pastas e arquivos

```
Digita/
├── CLAUDE.md                  # briefing + convenções (memória do projeto)
├── PLANO.md                   # este arquivo: estrutura, ordem dos passos, regras
├── LICENSE                    # MIT
├── README.md                  # em português: o que é, como rodar, como publicar
├── README.en.md               # o mesmo em inglês, com link cruzado entre os dois
├── .gitignore                 # .DS_Store etc.
├── .nojekyll                  # obrigatório no GitHub Pages p/ pastas normais
├── index.html                 # ÚNICA página; as telas trocam por JavaScript
│
├── css/
│   ├── tema.css               # SÓ variáveis: cores claro/escuro, fontes, espaçamentos
│   ├── base.css               # reset, tipografia, layout da página, cabeçalho
│   ├── componentes.css        # botões, cartões, selos, barra de progresso, estrelas
│   ├── teclado.css            # teclado na tela + desenho das mãos
│   └── telas.css              # o que é específico de cada tela
│
├── js/
│   ├── app.js                 # ponto de entrada: liga tudo e mostra a 1ª tela
│   ├── roteador.js            # troca de telas (#/entrada, #/trilha, #/licao/base-01…)
│   ├── armazenamento.js       # ler/gravar localStorage com prefixo "digita:"
│   ├── estado.js              # config + progresso em memória, avisa quem depende
│   ├── i18n.js                # idioma: detectar, trocar, traduzir a tela
│   ├── deteccao.js            # detectar SO e layout (getLayoutMap + tecla destacada)
│   ├── teclado.js             # desenha o teclado e acende a próxima tecla
│   ├── maos.js                # SVG das duas mãos, acende o dedo certo
│   ├── motor-digitacao.js     # campo invisível, composição de acentos, trava no erro
│   ├── metricas.js            # PPM, precisão, teclas com mais erros
│   ├── progresso.js           # concluir lição, estrelas, desbloqueio, sequência de dias
│   ├── som.js                 # Web Audio API, mudo, volume
│   └── telas/
│       ├── sem-teclado.js     # aviso amigável em celular/tablet sem teclado físico
│       ├── entrada.js         # teclado + sistema + detecção + dica de acentuação
│       ├── nivelamento.js     # "já digita sem olhar?" / teste de 1 minuto
│       ├── inicio.js          # continuar, sequência de dias, atalhos
│       ├── trilha.js          # as 7 trilhas e suas lições
│       ├── licao.js           # a tela de digitação em si
│       └── resultado.js       # PPM, precisão, estrelas, repetir/próxima
│
├── dados/                     # CONTEÚDO separado da LÓGICA (dá para editar sem medo)
│   ├── layouts/
│   │   ├── abnt2.js           # posição física das teclas do teclado brasileiro
│   │   ├── us.js              # idem, teclado americano
│   │   └── dedos.js           # qual dedo aperta cada tecla + cor
│   ├── i18n/
│   │   ├── pt.js              # todos os textos em português
│   │   └── en.js              # todos os textos em inglês
│   └── licoes/
│       ├── indice.js          # as 7 trilhas: ordem, metas, quais estão liberadas
│       ├── conferencia.js     # as duas verificações automáticas de conteúdo
│       ├── fileira-base.js    # 18 lições COM conteúdo (a única na v1)
│       └── MODELO.md          # esquema de uma lição, para criar as próximas
│
└── (os ícones ficam desenhados no topo do index.html, num <svg> de símbolos
    reusados com <use href="#icone-x"> — ver nota abaixo)
```

**Mudança em relação ao plano original:** a pasta `assets/` com um `icones.svg` externo
foi trocada por um bloco `<svg>` de símbolos no próprio `index.html`. Motivo: referência a
arquivo SVG externo dentro de `<use>` tem suporte irregular entre navegadores, e são
poucos ícones — assim não há requisição extra nem risco de o ícone sumir em algum
navegador.

**Por que uma página só:** o site inteiro vive no `index.html` e o JavaScript troca o
conteúdo. É o que faz o GitHub Pages funcionar sem servidor e mantém a digitação fluida,
sem recarregar a página.

---

## Layout das telas

Regras definidas depois do briefing original (a paleta clara e a tipografia também
mudaram — ver a seção VISUAL do `CLAUDE.md`, que é a fonte da verdade):

- Sem caixas com borda em volta das seções; separar por espaço e, quando precisar, por uma
  linha fina. Sem sombras, sem gradientes.
- Conteúdo centralizado, largura máxima de cerca de **1100px** (`--largura-max`).
- Nunca preencher as laterais com enfeites.

| Tela | Colunas em tela larga |
|---|---|
| **Início** e **Trilha** (passos 13 e 15) | Três: navegação à esquerda · conteúdo no centro · progresso à direita |
| **Entrada** (passo 6) | Duas: escolhas de um lado · prévia do teclado do outro |
| **Lição** (passo 11) | Uma, centralizada, laterais vazias; teclado até ~900px (`--largura-teclado-max`) |

**Navegação** (à esquerda, nas telas de início e trilha): Início, Trilha, Treino livre,
Jogos, Estatísticas, Configurações. O que não existe na v1 aparece marcado como
**"em breve"**.

**Painel de progresso** (à direita, nas telas de início e trilha): sequência de dias e
meta diária, teclas mais lentas (lidas de `digita:estatisticas`) e progresso geral
(lições concluídas de 100).

**Telas estreitas:** tudo vira uma coluna só, nesta ordem — conteúdo principal, progresso,
navegação; a navegação vira um menu no topo.

---

## Formato de uma lição (`dados/licoes/`)

Contrato entre conteúdo e código — lições novas são criadas copiando este molde:

```js
{
  id: 'base-07',
  tipo: 'palavras',        // teclas-novas | palavras | frases | revisao | desafio
  titulo: { pt: 'Palavras com D e K', en: 'Words with D and K' },
  teclasNovas: ['d', 'k'],
  conteudo: ['sala', 'fada', 'salada', 'falsa'],
  metas: { precisaoMinima: 90, estrelas: [12, 18, 25] }  // PPM p/ 1, 2 e 3 estrelas
}
```

As 7 trilhas ficam declaradas em `indice.js` com a contagem final planejada
(base 18 · cima 18 · baixo 14 · números 10 · acentos e Ç 16 · pontuação 14 · numérico 10
= 100), e cada trilha segue o ritmo **teclas novas → palavras → frases → revisão →
desafio final**, sendo o desafio o que libera a trilha seguinte.

---

## Regra do Ç e das teclas que não existem em todo layout

A tecla à direita do L é `Ç` no teclado brasileiro e `;` no americano — **a mesma posição
física, letras diferentes**. Por isso:

- A trilha **fileira base usa apenas** `a s d f g h j k l` (as 8 letras da posição de
  descanso mais o G e o H). Nada de Ç, `;` ou acentos: o conteúdo funciona igual nos dois
  teclados.
- O **Ç é assunto da trilha de acentos**, onde a lição explica o caminho conforme o
  teclado escolhido (ABNT2: tecla própria · US no Mac: `Option + C` · US no Windows:
  `'` seguido de `c` com o US Internacional ativo).
- **Nada de palavra de outro idioma.** Só português do Brasil, conferida uma a uma.

### As duas conferências automáticas (`dados/licoes/conferencia.js`)

Rodam sobre todas as lições e avisam no console:

1. **Layout** — nenhuma lição pode pedir uma tecla que o layout escolhido não tem
   (ex.: Ç no teclado americano). As teclas necessárias são **deduzidas do próprio
   conteúdo**, e não declaradas à mão: assim é impossível a declaração ficar
   desatualizada em relação ao texto da lição.
2. **Letras já ensinadas** — o conteúdo de uma lição só pode usar as letras de
   `teclasNovas` dela **somadas às de todas as lições anteriores da mesma trilha**.
   Assim o aluno nunca encontra uma letra que ainda não aprendeu.

É a rede de segurança para quando as outras 82 lições forem escritas.

---

## Chaves do localStorage

Todas com o prefixo `digita:`:

| Chave | Guarda |
|---|---|
| `digita:config` | idioma, layout do teclado, sistema, tema, som, volume |
| `digita:progresso` | por lição: melhor PPM, melhor precisão, estrelas, concluída |
| `digita:sequencia` | dias praticando seguidos, última data |
| `digita:estatisticas` | erros por tecla (base para as estatísticas do futuro) |

Botões para exportar e importar o progresso em arquivo (passo 17).

---

## Ordem de construção — os 17 passos

Cada passo termina com algo visível na tela e com um **resumo curto**: o que mudou, o que
o Fernando deve testar e o que deve ver. Um commit pequeno e descritivo por passo.

| # | O que | Entrega visível |
|---|---|---|
| 1 | `git init`, CLAUDE.md, .gitignore, .nojekyll, README PT + EN, LICENSE | Repositório pronto |
| 2 | `tema.css` + `base.css` + `componentes.css` + `telas.css` + `index.html` + `app.js` | Página com as cores certas, claro e escuro |
| 3 | `i18n.js` + `dados/i18n/*` | Botão PT/EN trocando os textos de verdade |
| 4 | `dados/layouts/*` + `teclado.js` + `teclado.css` | Teclado desenhado, ABNT2 × US, Win × Mac, cores por dedo, marcas em F e J |
| 5 | `maos.js` | Duas mãos em SVG com um dedo aceso |
| 6 | `deteccao.js` + tela de **entrada** | Escolha de teclado/sistema, "Detectar automaticamente" nos 2 caminhos, dica de acentuação · **🛑 PAUSA: teste no Safari** |
| 7 | Tela **sem teclado físico** + **publicar no GitHub Pages** | Aviso amigável no celular e o site no ar, no endereço real · **🛑 PAUSA: Claude guia, Fernando executa** |
| 8 | `armazenamento.js` + `estado.js` | Escolhas sobrevivem ao recarregar a página |
| 9 | `dados/licoes/*` (18 lições, sem Ç) | Conteúdo pronto, ainda sem tela · **🛑 PAUSA: revisão do conteúdo** |
| 10 | `motor-digitacao.js` + `metricas.js` | Digitação por campo invisível, acentos compostos ok, trava no erro · **🛑 PAUSA: teste no Safari** |
| 11 | Tela de **lição** | O coração do site: texto, teclado, mãos, "Próxima: F · indicador esquerdo", PPM/precisão ao vivo, aviso de layout errado · **🛑 PAUSA: teste no Safari** |
| 12 | Tela de **resultado** + `progresso.js` | Estrelas, mínimo de 90%, Repetir / Próxima |
| 13 | Tela de **trilha** | 7 trilhas, cadeados, 6 marcadas "em breve" |
| 14 | Tela de **nivelamento** | Teste de 1 minuto que libera fases dominadas |
| 15 | Tela **inicial** | Continuar de onde parei, sequência de dias, atalhos |
| 16 | `som.js` | Mudo e volume sempre visíveis, nada toca antes da primeira interação |
| 17 | Exportar/importar progresso + responsivo + polimento | Versão 1 fechada e publicada |

Os passos 4, 10 e 11 são os mais delicados — devem ser explicados com calma durante a
construção.

---

## As três pausas para teste no Safari

Nos passos 6, 10 e 11, **parar e chamar o Fernando**, com um roteiro do tipo "faça isto,
você deve ver aquilo". O Safari não tem `navigator.keyboard.getLayoutMap` e trata acentos
compostos de um jeito próprio — é exatamente onde a simulação pode enganar:

- **Passo 6** — clicar em "Detectar automaticamente" deve destacar a tecla à direita do L
  e pedir que ele a aperte; ao apertar, o formato correto deve ser escolhido sozinho.
- **Passo 10** — digitar `´` e depois `a` deve virar **um** `á`, sem letra fantasma no
  meio.
- **Passo 11** — a lição inteira deve fluir sem travar, com as métricas corretas ao final.

---

## Passo 9 — revisão do conteúdo antes de escrever

Com apenas `a s d f g h j k l`, o vocabulário real do português é limitado. Então,
**antes** de escrever as 18 lições, apresentar ao Fernando para revisão:

1. A **lista completa de palavras reais** possíveis com essas letras — só português do
   Brasil, conferidas uma a uma (asa, asas, ala, fala, sala, gala, fada, saga, salada,
   falsa, dadas, afaga…) — agrupada por quais letras cada uma exige. Nada de palavra de
   outro idioma e nada com letra fora do conjunto: conferir letra por letra antes de
   mostrar.
2. A **distribuição proposta das 18 lições**, dizendo o que cada uma treina e de onde vem
   o conteúdo: sílabas e combinações (`sa fa la ga`, `dfd jkj`) onde faltarem palavras,
   palavras reais quando o alfabeto disponível já permitir, e frases curtas nas últimas.

Só escrever os arquivos depois do "ok". Se faltar material, a alternativa a propor é
antecipar uma ou duas letras vizinhas (E e O, por exemplo) — mas a decisão é do Fernando.

---

## Passo 7 — publicação pelo GitHub Desktop

Claude prepara tudo e guia, mas **as ações na conta são do Fernando**. Claude monta os
arquivos, confere que todos os caminhos são relativos (para funcionar em
`fernando-trajano.github.io/digita/`) e, depois que estiver no ar, abre o endereço real no
navegador para conferirem juntos.

**Sem token, sem senha no terminal:**

1. Baixar e instalar o **GitHub Desktop** (desktop.github.com).
2. Entrar na conta do GitHub pelo próprio aplicativo.
3. *File → Add Local Repository* e escolher esta pasta — os commits já feitos aparecem lá,
   com todo o histórico.
4. *Publish repository*, com o nome **`digita`** e a caixa "Keep this code private"
   **desmarcada** (o briefing pede repositório público).
5. Ligar o Pages em *Settings → Pages → branch `main`, pasta `/ (root)`*.

### Regra fixa: quem envia para o GitHub é o Fernando

Claude faz `git init`, `git add` e `git commit` normalmente na pasta. Claude **não** roda
`git push`, `git remote add`, `gh auth` nem qualquer comando que peça senha ou token —
todo envio para o GitHub sai do GitHub Desktop. Quando houver commits novos, avisar o
Fernando para clicar em "Push origin".

---

## Como testar (Claude faz, Fernando só olha)

```bash
cd /Users/fernando/Documents/ClaudeCode/Digita && python3 servidor.py
```

Sempre o `servidor.py`, nunca o `python3 -m http.server`: o servidor padrão deixa o
navegador guardar os módulos em cache e mostrar a versão antiga do código.

Abrir `http://localhost:8010` no painel de navegador do app e conferir, a cada passo:

1. **Teclado e mãos** — trocar entre ABNT2/US e Windows/Mac muda o desenho e as teclas
   certas mudam de cor.
2. **Detecção** — no Chrome, o botão detecta sozinho; simular o caminho do Safari
   (tecla destacada + um `keydown`) para conferir os dois.
3. **Acentos** — digitar `´` + `a` = `á` e `ç` conta como **uma** letra, não duas.
4. **Trava no erro** — o cursor não avança com tecla errada e ela pisca em vermelho.
5. **Métricas** — PPM e precisão batem com uma conta feita à mão numa lição curta.
6. **Salvamento** — concluir uma lição, recarregar a página e o progresso continuar lá;
   exportar e importar o arquivo de volta.
7. **Idioma e tema** — PT/EN e claro/escuro em todas as telas, sem texto vazando.
8. **Som** — nada toca antes do primeiro clique; mudo funciona.
9. **Acessibilidade** — navegar a tela de entrada só pelo teclado (Tab e Enter).
10. **Sem teclado físico** — simular um celular e conferir o aviso amigável, em PT e EN.
11. **Conteúdo × layout** — a conferência automática não acusa nenhuma lição da fileira
    base pedindo Ç, `;` ou acento.

Ao final, conferir também que o site funciona em subpasta (caminhos relativos), que é como
o GitHub Pages publica um repositório de projeto — isso já terá sido provado no endereço
real no passo 7.

---

## Estado dos passos

- [x] **Passo 1** — repositório, CLAUDE.md, READMEs, LICENSE, .gitignore, .nojekyll
- [x] **Passo 2** — `tema.css`, `base.css`, `componentes.css`, `telas.css`, `index.html`,
      `app.js` (botão de tema claro/escuro; a escolha ainda não é salva — isso é o passo 8)
- [x] **Passo 3** — `i18n.js` e traduções PT/EN (detecção pelo navegador, seletor no
      cabeçalho; a escolha ainda não é salva — isso é o passo 8)
- [x] **Passo 4** — layouts de teclado e teclado na tela (ABNT2 × US, Windows × Mac,
      cores por dedo, marcas em F e J, modo cinza com a tecla da vez acesa)
- [x] **Passo 5** — desenho das mãos (SVG, dedo aceso na cor do dedo, legenda em texto;
      inclui o `servidor.py`, que impede o cache do navegador durante o desenvolvimento)
- [x] **Passo 6** — detecção e tela de entrada · ✅ **testado no Safari pelo Fernando**:
      os dois caminhos de detecção funcionam no navegador de verdade
- [x] **Passo 7** — tela sem teclado físico e publicação no GitHub Pages ✅ **no ar em
      https://fernando-trajano.github.io/digita/** (conferido: as 5 folhas de estilo
      carregam, a detecção funciona no endereço real e o console fica limpo)
- [x] **Passo 8** — armazenamento e estado (idioma, formato, sistema e tema sobrevivem ao
      recarregar; funciona mesmo em navegador que proíbe salvar)
- [x] **Passo 9** — as 18 lições da fileira base ✅ **conteúdo revisado e aprovado pelo
      Fernando** (36 palavras reais, K só em sílabas por não existir palavra possível,
      frases mantidas apesar do sentido absurdo; as duas conferências passam)
- [ ] **Passo 10** — motor de digitação e métricas · 🛑 teste no Safari
- [ ] **Passo 11** — tela de lição · 🛑 teste no Safari
- [ ] **Passo 12** — tela de resultado e progresso
- [ ] **Passo 13** — trilha de fases
- [ ] **Passo 14** — nivelamento
- [ ] **Passo 15** — tela inicial
- [ ] **Passo 16** — sons
- [ ] **Passo 17** — exportar/importar, responsivo e polimento
