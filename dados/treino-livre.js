/* ==========================================================================
   treino-livre.js — o material do Treino livre.

   Conteúdo separado da lógica, como as lições: dá para acrescentar palavra
   aqui sem abrir um arquivo da pasta js/.

   AS REGRAS SÃO AS MESMAS DAS LIÇÕES (ver CLAUDE.md):

     - só português do Brasil, palavra por palavra conferida. Nada de
       estrangeirismo que "pareça" português;
     - onde as letras não formam palavra, entram exercícios de sílabas — é
       o que as lições já fazem com o W e o Y.

   POR QUE EXISTEM OS EXERCÍCIOS DE SÍLABAS. W, K e Y praticamente não
   aparecem em palavra portuguesa: elas vivem em siglas, nomes próprios e
   estrangeirismos. Se o Adaptativo descobrir que o seu W é fraco e não
   tiver o que sortear, ele não treina o W. Os vaivéns (`sws`, `owo`) são a
   mesma saída que a trilha usa, e resolvem isso sem inventar palavra.
   ========================================================================== */

/**
 * O vocabulário do modo Adaptativo.
 *
 * Sem acento de propósito: o Adaptativo é o modo do dia a dia, e num
 * teclado americano sem o US Internacional ligado uma palavra acentuada
 * trava o treino. Acento tem modo próprio.
 */
export const PALAVRAS = [
  // Fileira base e de cima
  'casa', 'vida', 'tempo', 'gente', 'dia', 'noite', 'porta', 'janela',
  'papel', 'grupo', 'projeto', 'quarto', 'parque', 'aula', 'ideia',
  'moeda', 'sala', 'fala', 'salada', 'gola', 'lago', 'jogo', 'jornal',
  'juiz', 'ajuda', 'hoje', 'morro', 'mundo', 'homem', 'garfo', 'grande',
  'guarda', 'figura', 'agora', 'digital', 'ganho', 'roda', 'rosa', 'solo',
  'teste', 'tudo', 'data', 'gato', 'pato', 'dedo', 'logo',

  // Fileira de baixo
  'quadro', 'bloco', 'bomba', 'banco', 'bairro', 'verbo', 'objeto',
  'quilo', 'queijo', 'quase', 'quinta', 'esquina', 'floresta', 'zebra',
  'zero', 'azul', 'prazer', 'beleza', 'natureza', 'dezena', 'caixa',
  'texto', 'exame', 'peixe', 'luxo', 'exato', 'baixo', 'taxa', 'vidro',
  'navio', 'vento', 'nome', 'novela', 'cinema', 'cidade', 'comida',
  'carro', 'escola', 'calma', 'vizinho', 'xadrez', 'xarope',
];

/**
 * Vaivéns para as teclas que não formam palavra em português.
 *
 * O mesmo desenho das lições: sai da tecla de descanso, passa pela letra e
 * volta. Cada linha repete a letra três vezes, então quando o Adaptativo
 * descobre que ela é fraca, o peso sobe sozinho.
 */
export const EXERCICIOS = {
  w: ['sws', 'owo', 'wow', 'awa'],
  y: ['jyj', 'aya', 'yay', 'tya'],
  k: ['kjk', 'dkd', 'aka', 'kak'],
};

/** Palavras com acento e Ç, para o modo dos acentos. */
export const PALAVRAS_ACENTUADAS = [
  // Ç
  'ação', 'coração', 'informação', 'começo', 'começar', 'alcançar',
  'dançar', 'moça', 'praça', 'força', 'taça', 'laço', 'poço', 'peça',
  'cabeça', 'criança', 'esperança', 'serviço', 'preço',

  // Agudo
  'café', 'até', 'pé', 'história', 'memória', 'após', 'só', 'nós', 'avó',
  'último', 'música', 'saída', 'país', 'raízes', 'aí', 'família', 'régua',

  // Til
  'não', 'mão', 'mãe', 'irmã', 'limões', 'razões', 'opções', 'manhã',
  'coroações', 'estação',

  // Circunflexo
  'você', 'vocês', 'três', 'mês', 'português', 'âmbito', 'ângulo', 'avô',
  'pôr', 'ônibus', 'êxito', 'lâmpada',

  // Crase
  'à', 'às', 'àquela', 'àquele',
];

/** Números e operadores do teclado numérico. */
export const NUMEROS = [
  '12', '45', '78', '90', '123', '456', '789', '100', '250', '1000',
  '3.14', '2.50', '0.75', '99', '365', '1024', '42', '2026', '15', '60',
];

export const OPERADORES = ['+', '-', '*', '/', '='];

/**
 * Os quatro modos, na ordem em que aparecem.
 * `ilustracao` é o id do símbolo SVG no index.html.
 */
export const MODOS = [
  { id: 'adaptativo', ilustracao: 'ilustracao-adaptativo' },
  { id: 'acentos', ilustracao: 'ilustracao-acentos' },
  { id: 'numerico', ilustracao: 'ilustracao-numerico' },
  { id: 'proprio', ilustracao: 'ilustracao-texto' },
];

/** As durações, em segundos. Zero é "sem fim". */
export const DURACOES = [60, 120, 300, 0];
