/* ==========================================================================
   fileira-de-baixo.js — as 14 lições da terceira trilha.

   Teclas: z x c v b n m — a fileira abaixo da posição de descanso.

   POR QUE ESTA TRILHA É DO JEITO QUE É

   É a trilha que completa o alfabeto. Com o C e o N, o português fica
   inteiro: casa, com, cada, não, nome, muito, também — as palavras mais
   comuns da língua estavam todas esperando por estas sete teclas.

   A ORDEM DAS TECLAS. Aqui a simetria muda: a mão direita só tem duas
   teclas nesta fileira (N e M), porque as outras posições dela são
   pontuação, que é assunto da trilha 6. Os pares ficam assim:

     V e N   os dois indicadores, na posição direta
     B e M   os dois indicadores esticando
     C       médio esquerdo, sozinho (o par dele seria a vírgula)
     X e Z   anelar e mínimo esquerdos

   O C ganha uma lição só para ele de propósito: é a letra mais frequente
   desta fileira em português, e a que mais destrava vocabulário.

   O QUE AINDA NÃO PODE APARECER: acentos e Ç são da trilha 5, e pontuação é
   da 6. Nenhuma palavra daqui usa nada disso — por isso "também", "não" e
   "cabeça" ainda ficam de fora, apesar de serem comuníssimas.
   ========================================================================== */

export const fileiraDeBaixo = [
  /* --- V e N: os indicadores descendo ----------------------------------- */

  {
    id: 'baixo-01',
    tipo: 'teclas-novas',
    titulo: { pt: 'V e N', en: 'V and N' },
    teclasNovas: ['v', 'n'],
    conteudo: [
      'fff jjj fvf jnj fvf jnj',
      'fv fv jn jn fv jn fv jn',
      'vvv nnn vvv nnn vvv',
      'vn vn nv nv vn nv vn',
      'fvf jnj fvf jnj fvf',
      'ava ana ava ana ava',
      'van ven vin von vun',
      'vida vida nova nova',
      'nada nada nave nave',
      'vento vento janela',
      'fvf jnj vida nova nada',
      'ava ana vento janela nave',
    ],
  },
  {
    id: 'baixo-02',
    tipo: 'palavras',
    titulo: { pt: 'Vida, nova, vento', en: 'Vida, nova, vento' },
    teclasNovas: [],
    conteudo: [
      'vida vidas nova novas',
      'novo novos nada nave',
      'vento ventos janela',
      'verde vinho ninho',
      'grande gente quente',
      'antes dentro andar',
      'vida nova nada nave',
      'vento janela verde',
      'vinho ninho grande',
      'gente quente antes',
      'dentro andar novos',
      'vidas novas ventos',
    ],
  },
  {
    id: 'baixo-03',
    tipo: 'palavras',
    titulo: { pt: 'Avenida, verdade, governo', en: 'Avenida, verdade, governo' },
    teclasNovas: [],
    conteudo: [
      'avenida avenidas novela',
      'unidade novidade verdade',
      'governo nervoso inverno',
      'navio navios vidro vinte',
      'pensar planta anel',
      'avenida novela unidade',
      'novidade verdade governo',
      'nervoso inverno navio',
      'vidro vinte pensar',
      'planta anel avenida',
      'novelas unidades navios',
      'verdade governo inverno',
    ],
  },

  /* --- B e M: os indicadores esticando ---------------------------------- */

  {
    id: 'baixo-04',
    tipo: 'teclas-novas',
    titulo: { pt: 'B e M', en: 'B and M' },
    teclasNovas: ['b', 'm'],
    conteudo: [
      'fff jjj fbf jmj fbf jmj',
      'fb fb jm jm fb jm fb jm',
      'bbb mmm bbb mmm bbb',
      'bm bm mb mb bm mb bm',
      'fbf jmj fbf jmj fbf',
      'aba ama aba ama aba',
      'bam bem bim bom bum',
      'boa boa bom bom bem bem',
      'mesa mesa amor amor',
      'muito muita meu minha',
      'fbf jmj boa bom mesa',
      'aba ama amor muito meu',
    ],
  },
  {
    id: 'baixo-05',
    tipo: 'palavras',
    titulo: { pt: 'Mesa, amor, tempo', en: 'Mesa, amor, tempo' },
    teclasNovas: [],
    conteudo: [
      'boa boas bom bem',
      'mesa mesas amor amores',
      'muito muita meu minha',
      'barato bonito humano',
      'momento membro tempo',
      'amigo amiga imagem',
      'boa bom bem mesa amor',
      'muito meu minha barato',
      'bonito humano momento',
      'membro tempo amigo',
      'imagem amiga bonito',
      'boas mesas amores bons',
    ],
  },
  {
    id: 'baixo-06',
    tipo: 'frases',
    titulo: { pt: 'Frases com a fileira de baixo', en: 'Bottom row sentences' },
    teclasNovas: [],
    conteudo: [
      'a vida de um amigo',
      'o tempo da novela',
      'a mesa da janela',
      'o amor de verdade',
      'o vento da avenida',
      'a imagem do vidro',
      'o nome do navio',
      'a boa gente da vida',
      'o momento do governo',
      'a minha ideia era boa',
      'o meu amigo bonito',
      'a novidade do inverno',
    ],
  },

  /* --- C: a letra que faltava para o português -------------------------- */

  {
    id: 'baixo-07',
    tipo: 'teclas-novas',
    titulo: { pt: 'C: a letra que faltava', en: 'C: the missing letter' },
    teclasNovas: ['c'],
    conteudo: [
      'ddd ccc dcd dcd dcd',
      'dc dc cd cd dc cd dc',
      'ccc ddd ccc ddd ccc',
      'aca ece ica oco ucu',
      'dcd dcd aca ece ica',
      'cad ced cid cod cud',
      'casa casa cada cada',
      'com com como como',
      'certo certa cidade',
      'dcd casa cada com como',
      'aca ece ica certo cidade',
      'casa cada como certo',
    ],
  },
  {
    id: 'baixo-08',
    tipo: 'palavras',
    titulo: { pt: 'Casa, cada, cidade', en: 'Casa, cada, cidade' },
    teclasNovas: [],
    conteudo: [
      'casa casas cada com',
      'como certo certa cidade',
      'conta comida caminho',
      'cores cor carro claro',
      'escola calma cheio',
      'cantar contar circo',
      'casa cada com como',
      'certo cidade conta',
      'comida caminho cores',
      'carro claro escola',
      'calma cheio cantar',
      'contar circo casas',
    ],
  },
  {
    id: 'baixo-09',
    tipo: 'palavras',
    titulo: { pt: 'Conhecer, coragem, companhia', en: 'Conhecer, coragem, companhia' },
    teclasNovas: [],
    conteudo: [
      'conhecer companhia',
      'crescer coragem costume',
      'cachorro cinema comercial',
      'conhecer crescer coragem',
      'companhia costume cachorro',
      'cinema comercial conhecer',
      'crescer companhia coragem',
      'costume cachorro cinema',
      'comercial conhecer crescer',
      'coragem companhia cinema',
      'cachorro costume comercial',
      'conhecer crescer coragem',
    ],
  },

  /* --- X e Z: o anelar e o mínimo --------------------------------------- */

  {
    id: 'baixo-10',
    tipo: 'teclas-novas',
    titulo: { pt: 'X e Z', en: 'X and Z' },
    teclasNovas: ['x', 'z'],
    conteudo: [
      'sss aaa sxs aza sxs aza',
      'sx sx az az sx az sx az',
      'xxx zzz xxx zzz xxx',
      'xz xz zx zx xz zx xz',
      'sxs aza sxs aza sxs',
      'axa aza axa aza axa',
      'xa xe xi xo xu za ze zi',
      'fazer fazer dizer dizer',
      'vez vezes zero azul',
      'texto texto caixa caixa',
      'sxs aza fazer dizer vez',
      'zero azul texto caixa',
    ],
  },
  {
    id: 'baixo-11',
    tipo: 'palavras',
    titulo: { pt: 'Fazer, dizer, beleza', en: 'Fazer, dizer, beleza' },
    teclasNovas: [],
    conteudo: [
      'fazer dizer vez vezes',
      'zero azul doze treze',
      'prazer natureza beleza',
      'riqueza zona exame exato',
      'texto taxa caixa baixo',
      'deixar peixe luxo mexer',
      'fixo exemplo explicar',
      'extra xadrez xarope',
      'fazer dizer vez zero',
      'azul prazer natureza',
      'beleza riqueza exame',
      'texto caixa peixe luxo',
    ],
  },
  {
    id: 'baixo-12',
    tipo: 'palavras',
    titulo: { pt: 'O alfabeto inteiro', en: 'The whole alphabet' },
    teclasNovas: [],
    conteudo: [
      'casa vida tempo amor',
      'cidade janela caminho',
      'natureza beleza riqueza',
      'momento governo inverno',
      'cachorro cinema companhia',
      'exemplo explicar exato',
      'bonito humano barato',
      'escola comida carro',
      'prazer coragem costume',
      'avenida novidade verdade',
      'imagem conhecer crescer',
      'xadrez peixe caixa texto',
    ],
  },
  {
    id: 'baixo-13',
    tipo: 'frases',
    titulo: { pt: 'Frases de verdade', en: 'Real sentences' },
    teclasNovas: [],
    conteudo: [
      'a casa da cidade',
      'o tempo do inverno',
      'a beleza da natureza',
      'o caminho da escola',
      'o exemplo do texto',
      'a comida da minha casa',
      'o cachorro do vizinho',
      'a coragem de fazer',
      'o prazer de dizer',
      'a caixa do quarto',
      'a imagem do cinema',
      'dcd sxs aza fvf jnj fbf jmj',
    ],
  },
  {
    id: 'baixo-14',
    tipo: 'desafio',
    titulo: { pt: 'Desafio da fileira de baixo', en: 'Bottom row challenge' },
    teclasNovas: [],
    conteudo: [
      'casa vida tempo amor gente',
      'cidade janela caminho carro',
      'natureza beleza riqueza',
      'cachorro cinema companhia',
      'exemplo explicar xadrez',
      'a casa da cidade',
      'a beleza da natureza',
      'o caminho da escola',
      'o cachorro do vizinho',
      'a coragem de fazer',
      'fvf jnj fbf jmj dcd sxs aza',
      'o exemplo do texto era exato',
    ],
  },
];
