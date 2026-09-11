/* ==========================================================================
   fileira-de-cima.js — as 18 lições da segunda trilha.

   Teclas: q w e r t y u i o p — a fileira acima da posição de descanso.

   POR QUE ESTA TRILHA É DO JEITO QUE É

   É aqui que o português começa a existir. A fileira base só tinha a vogal
   A; esta traz E, I, O e U de uma vez, e com elas o vocabulário sai de 36
   palavras para mais de duzentas.

   A ORDEM DAS TECLAS. Os pares seguem dedos simétricos, mas começam pelos
   MÉDIOS (E e I), e não pelos indicadores como manda a tradição. O motivo é
   o português: o E é a letra mais frequente da língua, e começar por ele
   permite que a segunda lição já tenha palavras de verdade em vez de
   sílabas. Depois vêm R e U (indicadores), O e W (anelares), Q e P
   (mínimos) e T e Y (indicadores esticando).

   W E Y NÃO FORMAM PALAVRA nenhuma com as letras disponíveis — o mesmo caso
   do K na fileira base. Em português os dois só aparecem em nomes e
   estrangeirismos, que precisariam de letras de outras fileiras. Por isso
   aparecem só em exercícios de sílabas. É honesto: melhor treinar o dedo do
   que inventar palavra que não existe.

   O QUE AINDA NÃO PODE APARECER: B, C, M, N, V, X e Z são da fileira de
   baixo, e acentos e Ç são da trilha de acentos. Nenhuma palavra daqui usa
   nada disso — as duas conferências de dados/licoes/conferencia.js avisam
   no console se alguma escapar.
   ========================================================================== */

export const fileiraDeCima = [
  /* --- E e I: as vogais que faltavam ------------------------------------ */

  {
    id: 'cima-01',
    tipo: 'teclas-novas',
    titulo: { pt: 'E e I: as vogais que faltavam', en: 'E and I: the missing vowels' },
    teclasNovas: ['e', 'i'],
    conteudo: [
      'ddd kkk ddd kkk ded kik',
      'de de de ki ki ki de ki',
      'ded kik ded kik ded kik',
      'ede iki ede iki ede iki',
      'dei dei lei lei sei sei',
      'ei ei ie ie ei ie ei ie',
      'ela ela ele ele ela ele',
      'dia dia dia ela ele dia',
      'eis eis lei sei eis lei',
      'ela ele dia lei sei eis',
      'de ki ded kik ela ele',
      'ded kik ela ele dia sei',
    ],
  },
  {
    id: 'cima-02',
    tipo: 'palavras',
    titulo: { pt: 'As primeiras palavras com E', en: 'First words with E' },
    teclasNovas: [],
    conteudo: [
      'ela ele elas eles',
      'sede seda sede seda',
      'fila filas fila filas',
      'dia dias dia dias',
      'leia leis seja diga',
      'siga laje lajes leia',
      'ela ele elas eles dia',
      'sede fila leia seja',
      'seda dias lajes siga',
      'diga fila sede leia',
      'elas eles dias leis',
      'ela sede fila dia leia',
    ],
  },
  {
    id: 'cima-03',
    tipo: 'palavras',
    titulo: { pt: 'Ideia, idade, ideal', en: 'Ideia, idade, ideal' },
    teclasNovas: [],
    conteudo: [
      'ideia ideias idade',
      'ideal ideais gelada',
      'aldeia aldeias afiada',
      'desliga deseja delegada',
      'sigla siglas fadiga',
      'elegia ilha ilhas',
      'ideia idade ideal gelada',
      'aldeia afiada desliga',
      'deseja delegada sigla',
      'fadiga elegia ilha',
      'ideais ideias idade',
      'ilhas aldeias siglas',
    ],
  },
  {
    id: 'cima-04',
    tipo: 'revisao',
    titulo: { pt: 'Revisão: a base mais E e I', en: 'Review: home row plus E and I' },
    teclasNovas: [],
    conteudo: [
      'asdf jkl ded kik',
      'ela ele dia sede',
      'fala fada sala asa',
      'ideia idade ideal',
      'salada falsa alga',
      'fila leia seja diga',
      'aldeia gelada afiada',
      'ded kik fjf dkd sls',
      'ilha laje sigla elegia',
      'delas deles dias leis',
      'sede seda fila fada',
      'ela ele elas eles dia',
    ],
  },

  /* --- R e U: os indicadores esticando para cima ------------------------ */

  {
    id: 'cima-05',
    tipo: 'teclas-novas',
    titulo: { pt: 'R e U', en: 'R and U' },
    teclasNovas: ['r', 'u'],
    conteudo: [
      'fff jjj frf juj frf juj',
      'fr fr ju ju fr ju fr ju',
      'rrr uuu rrr uuu rrr uuu',
      'ru ru ur ur ru ur ru ur',
      'fru fru jur jur fru jur',
      'rua rua rua ruas ruas',
      'dura dura duras duras',
      'era era eras eras era',
      'sur dur fur jur sur dur',
      'frf juj rua dura era',
      'ru ur rua ruas dura eras',
      'rua dura era ruas duras',
    ],
  },
  {
    id: 'cima-06',
    tipo: 'palavras',
    titulo: { pt: 'Rua, feira, aula', en: 'Rua, feira, aula' },
    teclasNovas: [],
    conteudo: [
      'rua ruas dura duras',
      'feira feiras ferida',
      'aula aulas jaula',
      'era eras usar usada',
      'lugar lugares regra',
      'surda risada ligeira',
      'rua feira aula lugar',
      'dura usada regra era',
      'ferida jaula surda',
      'risada ligeira lugares',
      'ruas feiras aulas eras',
      'usar usada dura rua',
    ],
  },
  {
    id: 'cima-07',
    tipo: 'palavras',
    titulo: { pt: 'Figura, guarda, alegria', en: 'Figura, guarda, alegria' },
    teclasNovas: [],
    conteudo: [
      'figura figuras guarda',
      'agulha alegria seguida',
      'regular argila referida',
      'seguir duas iguais',
      'gralha figuras guarda',
      'alegria agulha seguida',
      'regular referida argila',
      'seguir iguais duas',
      'figura alegria guarda',
      'agulha regular seguida',
      'referida gralha argila',
      'iguais seguir figuras',
    ],
  },
  {
    id: 'cima-08',
    tipo: 'frases',
    titulo: { pt: 'Primeiras frases de verdade', en: 'First real sentences' },
    teclasNovas: [],
    conteudo: [
      'a feira da aldeia',
      'a regra da fila',
      'a figura da aula',
      'a ideia da idade',
      'a alegria da feira',
      'a guarda da rua',
      'a agulha e a argila',
      'a fadiga da aula',
      'a sigla da aldeia',
      'a risada ligeira',
      'a ideia era ideal',
      'a rua da feira',
    ],
  },
  {
    id: 'cima-09',
    tipo: 'revisao',
    titulo: { pt: 'Revisão: E I R U', en: 'Review: E I R U' },
    teclasNovas: [],
    conteudo: [
      'ded kik frf juj',
      'ela ele dia rua feira',
      'ideia idade ideal aula',
      'figura guarda agulha',
      'sede seda fila lugar',
      'alegria seguida regular',
      'a feira da aldeia',
      'a regra da fila',
      'dura duras era eras',
      'usar usada referida',
      'ilha laje sigla argila',
      'frf juj ded kik sls',
    ],
  },

  /* --- O e W: os anelares ----------------------------------------------- */

  {
    id: 'cima-10',
    tipo: 'teclas-novas',
    titulo: { pt: 'O e W', en: 'O and W' },
    teclasNovas: ['o', 'w'],
    conteudo: [
      'lll sss lol sws lol sws',
      'lo lo sw sw lo sw lo sw',
      'ooo www ooo www ooo',
      'ow ow wo wo ow wo ow',
      'lol sws lol sws lol sws',
      'owo wow owo wow owo',
      'awa swa awa swa awa',
      'dedo dedo logo logo',
      'roda roda rosa rosa',
      'sol sola solo gole',
      'lol sws dedo logo roda',
      'ow wo owo wow sol solo',
    ],
  },
  {
    id: 'cima-11',
    tipo: 'palavras',
    titulo: { pt: 'Dedo, jogo, roda', en: 'Dedo, jogo, roda' },
    teclasNovas: [],
    conteudo: [
      'dedo dedos logo gordo',
      'roda rodas rosa rosas',
      'sol sola solo gole goles',
      'lago lagos jogo jogos',
      'fogo fogos ouro odeia',
      'olhar olhos ousada',
      'dedo logo roda rosa sol',
      'lago jogo fogo ouro',
      'gordo goles olhos',
      'olhar ousada odeia solo',
      'rodas rosas lagos jogos',
      'dedos fogos sola ouro',
    ],
  },
  {
    id: 'cima-12',
    tipo: 'palavras',
    titulo: { pt: 'Palavras longas', en: 'Longer words' },
    teclasNovas: [],
    conteudo: [
      'orgulho grosso afogado',
      'delegado soldado seguro',
      'religioso ideologia',
      'adorada sossego seguro',
      'orgulho afogado delegado',
      'soldado religioso',
      'ideologia adorada',
      'grosso sossego orgulho',
      'afogado seguro soldado',
      'delegado religioso',
      'ideologia sossego',
      'adorada grosso afogado',
    ],
  },

  /* --- Q e P: os mínimos ------------------------------------------------ */

  {
    id: 'cima-13',
    tipo: 'teclas-novas',
    titulo: { pt: 'Q e P', en: 'Q and P' },
    teclasNovas: ['q', 'p'],
    conteudo: [
      'aaa qqq aaa qqq aqa aqa',
      'aq aq qa qa aq qa aq qa',
      'ppp aaa ppp aaa apa apa',
      'ap ap pa pa ap pa ap pa',
      'aqa apa aqa apa aqa apa',
      'qua qua que que qui qui',
      'pra pre pri pro pru',
      'papel papel pele peles',
      'quase quase aquela aquele',
      'grupo grupos pedra',
      'aqa apa qua que papel',
      'quase grupo pedra pele',
    ],
  },
  {
    id: 'cima-14',
    tipo: 'palavras',
    titulo: { pt: 'Papel, grupo, quadro', en: 'Papel, grupo, quadro' },
    teclasNovas: [],
    conteudo: [
      'papel pele peles pedra',
      'perigo perigosa pausa',
      'poder podia poesia',
      'quase aquela aquele',
      'quadro quadros querida',
      'querido esquerda porque',
      'aquilo pregar apagar',
      'espelho espada quadrado',
      'pesquisa papelada propor',
      'papel pedra grupo quase',
      'quadro esquerda poesia',
      'grupos pausa poder aquilo',
    ],
  },

  /* --- T e Y: os indicadores esticando ---------------------------------- */

  {
    id: 'cima-15',
    tipo: 'teclas-novas',
    titulo: { pt: 'T e Y', en: 'T and Y' },
    teclasNovas: ['t', 'y'],
    conteudo: [
      'fff jjj ftf jyj ftf jyj',
      'ft ft jy jy ft jy ft jy',
      'ttt yyy ttt yyy ttt',
      'ty ty yt yt ty yt ty',
      'ftf jyj ftf jyj ftf',
      'aya yay aya yay aya',
      'ayt tya ayt tya ayt',
      'tudo tudo data datas',
      'gato gatos pato patos',
      'porta portas teste',
      'ftf jyj tudo gato porta',
      'aya yay data teste pato',
    ],
  },
  {
    id: 'cima-16',
    tipo: 'palavras',
    titulo: { pt: 'Porta, teste, projeto', en: 'Porta, teste, projeto' },
    teclasNovas: [],
    conteudo: [
      'porta portas teste testes',
      'gato gatos pato patos',
      'rato ratos tarde tardes',
      'forte fortes teatro',
      'estrada estrela feita',
      'feito letra letras tudo',
      'data datas salto gosto',
      'gostar topo total atual',
      'lutar direito direita',
      'respeito perfeito projeto',
      'porta teste gato tarde',
      'estrada estrela projeto',
    ],
  },
  {
    id: 'cima-17',
    tipo: 'frases',
    titulo: { pt: 'Frases da fileira de cima', en: 'Top row sentences' },
    teclasNovas: [],
    conteudo: [
      'o gato gosta da porta',
      'a estrada da aldeia',
      'a figura do quadro',
      'o teste da tarde',
      'a letra do papel',
      'o jogo da rua',
      'a regra do grupo',
      'o dedo da esquerda',
      'a poesia do teatro',
      'o projeto da pesquisa',
      'ftf jyj aqa apa lol sws',
      'tudo era perfeito',
    ],
  },
  {
    id: 'cima-18',
    tipo: 'desafio',
    titulo: { pt: 'Desafio da fileira de cima', en: 'Top row challenge' },
    teclasNovas: [],
    conteudo: [
      'ela ele dia sede fila',
      'rua feira aula lugar',
      'dedo logo roda sol jogo',
      'papel grupo quase quadro',
      'porta teste gato tarde',
      'orgulho religioso ideologia',
      'esquerda pesquisa projeto',
      'o gato gosta da porta',
      'a figura do quadro',
      'o projeto da pesquisa',
      'a estrada era dura',
      'ftf jyj aqa apa lol sws',
      'ded kik frf juj tudo',
    ],
  },
];
