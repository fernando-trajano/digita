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

> **Atenção:** esta seção foi **atualizada depois do briefing original**. A paleta clara
> bege foi substituída por uma paleta branca neutra, e a Georgia saiu. O modo escuro
> continua exatamente igual ao original. Não volte ao bege.

Minimalista e elegante, sem gradientes nem sombras. Crie um arquivo `tema.css` com todas
as cores em variáveis CSS e use apenas essas variáveis no resto do site.

Fontes (do sistema, sem baixar nada):

- Títulos: `system-ui, -apple-system, "Segoe UI", sans-serif`, **peso 600**,
  `letter-spacing: -0.02em`
- Texto: `system-ui, -apple-system, "Segoe UI", sans-serif`
- Texto de digitação e teclas: `ui-monospace, "SF Mono", Menlo, Consolas, monospace`

**Modo claro (branco neutro):**

| Elemento | Cor |
|---|---|
| Fundo da página | `#FFFFFF` |
| Superfícies secundárias (áreas destacadas, teclas neutras) | `#F4F4F5` |
| Bordas | `#E4E4E7` |
| Texto principal | `#18181B` |
| Texto secundário | `#52525B` |
| Texto discreto e legendas | `#71717A` |
| Letras ainda não digitadas | `#8E8E96` (só em fonte grande) |
| Botão principal | fundo `#18181B`, texto `#FFFFFF` |
| Botão secundário | borda `#D4D4D8`, texto `#18181B` |

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
| Mínimo (violeta) | `#EDE9FE` / `#5B21B6` | `#3C3489` / `#CECBF6` |
| Anelar (azul) | `#DBEAFE` / `#1E40AF` | `#0C447C` / `#B5D4F4` |
| Médio (verde-água) | `#CCFBF1` / `#115E59` | `#085041` / `#9FE1CB` |
| Indicador (verde) | `#DCFCE7` / `#166534` | `#27500A` / `#C0DD97` |
| Polegar e teclas neutras (cinza) | `#F4F4F5` / `#52525B` | `#444441` / `#D3D1C7` |

**Erro:** claro `#FEE2E2` / `#B91C1C` · escuro `#791F1F` / `#F7C1C1`

Use esta paleta como base. Se enxergar alguma melhoria de contraste ou legibilidade,
sugira antes de aplicar, mas não troque as cores por conta própria.

## LAYOUT

Regras válidas para o site inteiro:

- **Sem caixas com borda** envolvendo cada seção. Seções são separadas por espaço e,
  quando o corte precisa ficar claro, por uma **linha fina**.
- **Sem sombras e sem gradientes**, em nenhum lugar.
- Conteúdo **centralizado**, com largura máxima de cerca de **1100px**.
- **Nunca preencher as laterais com elementos decorativos.** Se não há conteúdo útil para
  a lateral, a lateral fica vazia.

### Por tela

| Tela | Layout |
|---|---|
| **Início** e **Trilha** | Três colunas em telas largas. **Esquerda:** navegação (Início, Trilha, Treino livre, Jogos, Estatísticas, Configurações — o que não existe na v1 aparece como "em breve"). **Centro:** conteúdo principal. **Direita:** painel de progresso com sequência de dias e meta diária, teclas mais lentas (de `digita:estatisticas`) e progresso geral (lições concluídas de 100). |
| **Entrada** | Duas colunas em telas largas: escolhas de um lado, prévia do teclado do outro. |
| **Lição** | Centralizada, **sem nada nas laterais**. Ver as regras detalhadas logo abaixo. |

### Tela de lição — regras detalhadas

1. **Tudo no mesmo eixo central da página.** O teclado é grande, ocupa a largura útil do
   conteúdo (até cerca de **960px**) e é ele que define a largura da área da lição.
2. **Texto da lição:** bloco centralizado horizontalmente, logo acima do teclado. Dentro
   do bloco, as linhas ficam **alinhadas à esquerda entre si** — centralizar linha a linha
   faria o começo de cada uma dançar. Fonte monoespaçada grande, proporcional ao teclado
   (~38px), com espaçamento folgado entre as linhas. No máximo **3 linhas visíveis**, numa
   janela que acompanha o cursor. A frase *"Clique no texto para continuar digitando"* fica
   logo abaixo do texto, discreta.
3. **Mãos:** pequenas, cerca de **165px de largura no total** (as duas juntas), no canto
   **direito**, acima da ponta direita do teclado, na mesma altura da última linha do
   texto. Nunca no centro da tela. O desenho é o de `js/maos.js` — **não trocar o estilo
   do desenho sem o Fernando pedir**; uma versão em line art chegou a ser feita e foi
   descartada por decisão dele.
4. **Legenda "Próxima: F · indicador esquerdo":** junto das mãos, logo acima delas e
   alinhada com elas. No mínimo 12px, na cor de texto secundário.
5. **Telas estreitas:** quando não há espaço ao lado do texto, as mãos descem para cima do
   teclado, centralizadas e pequenas. **Nunca sobrepor o texto da lição.**
6. **Métricas** (PPM, precisão, progresso) numa linha discreta no topo, com o nome da lição
   à esquerda e **"Sair"** à direita.
7. Botão **"Mostrar mãos"**, ligado por padrão e salvo em `digita:config`.
8. **Tudo visível sem rolar a página** numa tela de notebook (~800px de altura). Quem
   treina não pode rolar nem procurar informação fora do campo de visão.
9. O teclado desenhado segue **sempre** o formato e o sistema de `digita:config` — com a
   mesma regra de fallback em todas as telas (`sistemaAtual()`, em `js/estado.js`): o que
   o usuário escolheu ou, enquanto ele não escolheu, o que o navegador informou.

**Telas estreitas:** as colunas viram uma só, nesta ordem — **conteúdo principal,
progresso, navegação**. A navegação vira um menu no topo.

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
cd /Users/fernando/Documents/ClaudeCode/Digita && python3 servidor.py
```

Use **sempre o `servidor.py`**, nunca o `python3 -m http.server`. O servidor padrão deixa o
navegador guardar os módulos JavaScript em cache: depois de editar um arquivo, a página
continua rodando a versão antiga e o erro parece estar no código. O `servidor.py` manda
`Cache-Control: no-store` e acaba com isso. Ele só serve para desenvolver — no GitHub
Pages quem serve é o GitHub.

Se um navegador já tiver guardado a versão velha de um arquivo, trocar a porta
(`python3 servidor.py 8020`) cria endereços novos e resolve na hora.

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

A cor das letras ainda não digitadas (`--cor-letra-pendente`: `#8E8E96` no claro,
`#888780` no escuro) dá cerca de 3:1 contra o fundo — suficiente para texto grande, fraco
para texto pequeno. Regra:

- `--cor-letra-pendente` **só** nas letras ainda não digitadas, em fonte de **24px ou
  maior**.
- Em legendas e textos pequenos, usar `--cor-texto-discreto`; em texto de apoio,
  `--cor-texto-secundario`.

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
