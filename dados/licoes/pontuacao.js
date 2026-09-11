/* ==========================================================================
   pontuacao.js — as 14 lições da trilha de pontuação e maiúsculas.

   É a trilha que transforma palavras soltas em texto. A partir daqui as
   frases têm ponto final, começam com maiúscula e podem fazer perguntas.

   AQUI AS POSIÇÕES MUDAM DE TECLADO

   Nas trilhas anteriores, as letras ficavam no mesmo lugar nos dois
   teclados. Na pontuação, não:

     ;  e  :    brasileiro: à direita do ponto, na fileira de baixo
                americano:  à direita do L, na fileira base
     ?          brasileiro: Shift na tecla à direita do ;
                americano:  Shift na tecla à direita do ponto
     '  e  "    brasileiro: no canto, à esquerda do 1
                americano:  à direita do ponto e vírgula, na fileira base

   A vírgula, o ponto, o hífen e a exclamação ficam no mesmo lugar nos dois.

   O teclado da tela já acende a tecla certa sozinho, porque ele lê o layout
   escolhido. O campo `dica` existe para as três que mudam de lugar — nelas,
   dizer "a tecla à direita do L" para quem tem teclado brasileiro mandaria
   a pessoa apertar o Ç.

   MAIÚSCULAS. O Shift se aperta com o dedo mínimo da mão CONTRÁRIA à da
   letra: Shift direito para as letras da mão esquerda, e vice-versa. É o
   que evita torcer a mão, e é o que as lições treinam.
   ========================================================================== */

/** As três instruções de uma tecla que muda de lugar. */
const dicaDeTecla = (nome, abnt2, us) => ({
  abnt2: {
    pt: `No teclado brasileiro, ${nome} fica ${abnt2}.`,
    en: `On the Brazilian keyboard, ${nome} is ${abnt2}.`,
  },
  usMac: {
    pt: `No teclado americano, ${nome} fica ${us}.`,
    en: `On the US keyboard, ${nome} is ${us}.`,
  },
  usWindows: {
    pt: `No teclado americano, ${nome} fica ${us}.`,
    en: `On the US keyboard, ${nome} is ${us}.`,
  },
});

const DICA_SHIFT = {
  abnt2: {
    pt: 'Shift com o mínimo da outra mão.',
    en: "Shift with the other hand's pinky.",
  },
  usMac: {
    pt: 'Shift com o mínimo da outra mão.',
    en: "Shift with the other hand's pinky.",
  },
  usWindows: {
    pt: 'Shift com o mínimo da outra mão.',
    en: "Shift with the other hand's pinky.",
  },
};

export const pontuacao = [
  /* --- Shift: as maiúsculas --------------------------------------------- */

  {
    id: 'pontuacao-01',
    tipo: 'teclas-novas',
    titulo: { pt: 'Shift: as maiúsculas', en: 'Shift: capital letters' },
    teclasNovas: [],
    dica: DICA_SHIFT,
    conteudo: [
      'Aa Bb Cc Dd Ee Ff',
      'Gg Hh Ii Jj Kk Ll',
      'Mm Nn Oo Pp Qq Rr',
      'Ss Tt Uu Vv Ww Xx',
      'Yy Zz Aa Bb Cc Dd',
      'Ana Ana Bia Bia',
      'Caio Caio Dora Dora',
      'Eva Eva Filipe Filipe',
      'Ana Bia Caio Dora Eva',
      'Gabriel Helena Igor',
      'Julia Karina Lucas',
      'Ana Bia Caio Dora Eva',
    ],
  },
  {
    id: 'pontuacao-02',
    tipo: 'palavras',
    titulo: { pt: 'Nomes e lugares', en: 'Names and places' },
    teclasNovas: [],
    dica: DICA_SHIFT,
    conteudo: [
      'Maria João Pedro Ana',
      'Brasil Portugal Angola',
      'Bahia Ceara Parana',
      'Recife Salvador Belem',
      'Maria e João',
      'Pedro e Ana',
      'Brasil e Portugal',
      'Recife e Salvador',
      'Maria João Pedro Ana',
      'Bahia Parana Ceara',
      'Angola Belem Recife',
      'Salvador Brasil Maria',
    ],
  },

  /* --- A vírgula e o ponto ---------------------------------------------- */

  {
    id: 'pontuacao-03',
    tipo: 'teclas-novas',
    titulo: { pt: 'A vírgula e o ponto', en: 'Comma and period' },
    teclasNovas: [',', '.'],
    conteudo: [
      ', , , . . . , . , .',
      'k, k, l. l. k, l.',
      'a, e, i, o, u.',
      'sim, sim, nao, nao.',
      'casa, mesa, porta.',
      'Ana, Bia, Caio.',
      'O gato dorme.',
      'Ela chegou cedo.',
      'Maria, João e Ana.',
      'A casa, a mesa, a porta.',
      'Ele veio. Ela foi.',
      'Sim, claro. Vamos.',
    ],
  },
  {
    id: 'pontuacao-04',
    tipo: 'frases',
    titulo: { pt: 'Frases com ponto final', en: 'Sentences with a full stop' },
    teclasNovas: [],
    conteudo: [
      'O gato dorme na casa.',
      'Ela chegou muito cedo.',
      'Maria, João e Ana vieram.',
      'A comida estava boa.',
      'Pedro comprou o carro.',
      'O tempo passou rápido.',
      'A criança dorme.',
      'Nós fomos ao cinema.',
      'Ele trabalha na cidade.',
      'A música estava alta.',
      'O projeto ficou pronto.',
      'Amanhã é sábado.',
    ],
  },
  {
    id: 'pontuacao-05',
    tipo: 'frases',
    titulo: { pt: 'Listas e pausas', en: 'Lists and pauses' },
    teclasNovas: [],
    conteudo: [
      'Comprei pão, café e leite.',
      'Ana, Bia e Caio chegaram.',
      'Hoje, amanhã e depois.',
      'Ele veio, viu e venceu.',
      'A casa, grande e clara.',
      'Maria, minha irmã, chegou.',
      'Pedro, o médico, saiu.',
      'Sim, claro, pode ser.',
      'Não, obrigado, já comi.',
      'Leve o livro, o caderno.',
      'A rua, a praça, a cidade.',
      'Depois, com calma, vamos.',
    ],
  },

  /* --- O ponto e vírgula e os dois pontos ------------------------------- */

  {
    id: 'pontuacao-06',
    tipo: 'teclas-novas',
    titulo: { pt: 'Ponto e vírgula, dois pontos', en: 'Semicolon and colon' },
    teclasNovas: [';', ':'],
    dica: dicaDeTecla(
      'o ponto e vírgula',
      'na fileira de baixo, à direita do ponto',
      'na fileira base, logo à direita do L'
    ),
    conteudo: [
      '; ; ; : : : ; : ; :',
      'a; a; e: e: i; i:',
      'sim; nao; claro;',
      'Ana: Bia: Caio:',
      'Ele veio; ela ficou.',
      'Comprei: pão e café.',
      'A lista: casa, mesa.',
      'Chegou cedo; saiu tarde.',
      'Olhe: o gato dorme.',
      'Falou; ninguém ouviu.',
      'A conta: dez reais.',
      'Veja: já é tarde.',
    ],
  },
  {
    id: 'pontuacao-07',
    tipo: 'frases',
    titulo: { pt: 'Usando os dois pontos', en: 'Using the colon' },
    teclasNovas: [],
    conteudo: [
      'A lista: pão, café e leite.',
      'Ele disse: vamos embora.',
      'O problema: falta tempo.',
      'A resposta: sim.',
      'Ana chegou; Bia ficou.',
      'Choveu; ninguém saiu.',
      'O time: Pedro, Ana, Caio.',
      'A regra: precisão primeiro.',
      'Ele pensou: já é tarde.',
      'A conta: quarenta reais.',
      'Falta pouco: quase lá.',
      'Só uma coisa: atenção.',
    ],
  },

  /* --- A interrogação e a exclamação ------------------------------------ */

  {
    id: 'pontuacao-08',
    tipo: 'teclas-novas',
    titulo: { pt: 'Interrogação e exclamação', en: 'Question and exclamation marks' },
    teclasNovas: ['?', '!'],
    dica: dicaDeTecla(
      'a interrogação',
      'no Shift da tecla à direita do ponto e vírgula',
      'no Shift da tecla à direita do ponto'
    ),
    conteudo: [
      '? ? ? ! ! ! ? ! ? !',
      'a? a? e! e! i? i!',
      'Quem? Quando? Onde?',
      'Vamos! Claro! Agora!',
      'Você viu o carro?',
      'Que beleza!',
      'Quem chegou?',
      'Muito bem!',
      'Onde ela foi?',
      'Vamos embora!',
      'Quando começa?',
      'Que ideia boa!',
      'Por que você foi?',
      'Cuidado! Olhe a rua!',
      'Quem? Quando? Onde?',
      'Vamos! Agora! Corra!',
    ],
  },
  {
    id: 'pontuacao-09',
    tipo: 'frases',
    titulo: { pt: 'Perguntas e espantos', en: 'Questions and exclamations' },
    teclasNovas: [],
    conteudo: [
      'Você viu o carro novo?',
      'Quem chegou primeiro?',
      'Onde ela foi ontem?',
      'Quando começa a aula?',
      'Que beleza de lugar!',
      'Muito bem, Maria!',
      'Vamos embora agora!',
      'Como assim?',
      'Já terminou o projeto?',
      'Que dia bonito!',
      'Quantos anos você tem?',
      'Nossa, que susto!',
    ],
  },

  /* --- O hífen e as aspas ----------------------------------------------- */

  {
    id: 'pontuacao-10',
    tipo: 'teclas-novas',
    titulo: { pt: 'O hífen', en: 'The hyphen' },
    teclasNovas: ['-'],
    conteudo: [
      '- - - - - - - -',
      'a- a- e- e- o- o-',
      'bem- bem- mal- mal-',
      'guarda-chuva',
      'segunda-feira',
      'bem-vindo bem-vinda',
      'couve-flor beija-flor',
      'guarda-chuva bem-vindo',
      'segunda-feira terça-feira',
      'mal-humorado beija-flor',
      'couve-flor guarda-roupa',
      'bem-vindo, Pedro!',
    ],
  },
  {
    id: 'pontuacao-11',
    tipo: 'palavras',
    titulo: { pt: 'Palavras com hífen', en: 'Hyphenated words' },
    teclasNovas: [],
    conteudo: [
      'guarda-chuva guarda-roupa',
      'segunda-feira terça-feira',
      'quarta-feira quinta-feira',
      'sexta-feira fim-de-semana',
      'bem-vindo bem-vinda',
      'couve-flor beija-flor',
      'mal-humorado meio-dia',
      'Na segunda-feira, vamos.',
      'Bem-vindo à sua casa!',
      'O guarda-chuva ficou lá.',
      'Meio-dia já passou.',
      'A quarta-feira é hoje.',
    ],
  },
  {
    id: 'pontuacao-12',
    tipo: 'teclas-novas',
    titulo: { pt: 'As aspas', en: 'Quotation marks' },
    teclasNovas: ['"'],
    dica: dicaDeTecla(
      'a tecla das aspas',
      'no canto de cima à esquerda, antes do número 1',
      'na fileira base, à direita do ponto e vírgula'
    ),
    conteudo: [
      '" " " " " " " "',
      'a" a" e" e" o" o"',
      '"sim" "não" "claro"',
      '"Bom dia", disse ela.',
      '"Vamos", falou Pedro.',
      'Ele leu "a casa".',
      '"Quem chegou?", perguntou.',
      'A palavra "casa".',
      '"Obrigado", respondeu Ana.',
      'O livro "O gato".',
      '"Já terminei", disse ele.',
      '"Muito bem!", gritou.',
    ],
  },

  /* --- Fechamento -------------------------------------------------------- */

  {
    id: 'pontuacao-13',
    tipo: 'revisao',
    titulo: { pt: 'Revisão: texto de verdade', en: 'Review: real text' },
    teclasNovas: [],
    conteudo: [
      'Maria chegou cedo.',
      'Você viu o carro?',
      'Que dia bonito!',
      'A lista: pão, café.',
      'Ele veio; ela ficou.',
      '"Bom dia", disse ela.',
      'Na segunda-feira, vamos.',
      'Ana, Bia e Caio saíram.',
      'Quem terminou o projeto?',
      'Bem-vindo à cidade!',
      'O médico, meu irmão, veio.',
      'Amanhã é sábado.',
    ],
  },
  {
    id: 'pontuacao-14',
    tipo: 'desafio',
    titulo: { pt: 'Desafio da pontuação', en: 'Punctuation challenge' },
    teclasNovas: [],
    conteudo: [
      'Maria, minha irmã, chegou cedo.',
      'Você viu o carro novo do Pedro?',
      'Que dia bonito para sair!',
      'A lista: pão, café e leite.',
      'Ele veio; ela ficou em casa.',
      '"Bom dia", disse ela na porta.',
      'Na segunda-feira, vamos à praça.',
      'Quem terminou o projeto?',
      'Bem-vindo à nossa cidade!',
      'Ana, Bia e Caio já saíram.',
    ],
  },
];
