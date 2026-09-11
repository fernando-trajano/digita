/* ==========================================================================
   numeros.js — as 10 lições da quarta trilha.

   Teclas: 1 2 3 4 5 6 7 8 9 0 — a fileira acima das letras.

   POR QUE ESTA TRILHA É DO JEITO QUE É

   Os números são a fileira mais longe da posição de descanso: o dedo sobe
   duas fileiras e precisa voltar. É por isso que quase todo exercício aqui
   é um vaivém — `f4f`, `j7j`, `q1q` — em vez de sequências soltas de
   algarismos. O que se treina não é o número: é o caminho de ida e volta.

   A ORDEM DAS TECLAS. Vai do dedo mais forte para o mais fraco, e do
   caminho mais curto para o mais longo:

     4 e 7   indicadores, direto acima do R e do U
     5 e 6   indicadores esticando para o meio do teclado
     3 e 8   médios
     2 e 9   anelares
     1 e 0   mínimos, o caminho mais longo de todos

   O ANCORAMENTO DOS MÍNIMOS. Nas outras lições o vaivém começa na tecla de
   descanso do dedo. Com o mínimo direito isso não dá: a tecla de descanso
   dele é o Ç no teclado brasileiro e o ponto e vírgula no americano, e
   nenhum dos dois foi ensinado ainda. Por isso a lição 7 ancora nos vizinhos
   de cima, Q e P, que já vieram na fileira de cima e são iguais nos dois
   teclados.

   OS DOIS TECLADOS SÃO IGUAIS AQUI. De 1 a 0, brasileiro e americano têm a
   mesma fileira, nas mesmas posições — esta é a única trilha, depois das
   letras, que não precisa de instrução diferente para cada teclado.

   O QUE AINDA NÃO PODE APARECER: acentos, Ç e pontuação vêm depois. Nada de
   "número", "três" ou "14:30" — por isso as frases falam de "anos", "gols" e
   "andares", e as datas aparecem como anos inteiros: 1998, 2020.
   ========================================================================== */

/** A mesma instrução nos três teclados — aqui eles não têm diferença. */
const dicaIgual = (pt, en) => ({
  abnt2: { pt, en },
  usMac: { pt, en },
  usWindows: { pt, en },
});

export const numeros = [
  /* --- 4 e 7: os indicadores subindo -------------------------------------- */

  {
    id: 'numeros-01',
    tipo: 'teclas-novas',
    titulo: { pt: '4 e 7', en: '4 and 7' },
    teclasNovas: ['4', '7'],
    dica: dicaIgual(
      'Depois de cada número, traga o dedo de volta para F ou J. É a volta que se treina aqui, não a ida.',
      'After each number, bring your finger back to F or J. What you are training is the way back, not the way up.'
    ),
    conteudo: [
      'fff jjj f4f j7j f4f j7j',
      'f4 f4 j7 j7 f4 j7 f4 j7',
      '444 777 444 777 444',
      '47 47 74 74 47 74 47',
      'f4f j7j f4f j7j f4f',
      'r4r u7u r4r u7u r4r',
      '44 77 44 77 44 77 44',
      '474 747 474 747 474',
      '4477 7744 4477 7744',
      'f4f j7j 44 77 47 74',
      'r4r u7u 444 777 474',
      '47 74 4477 7744 f4f j7j',
    ],
  },
  {
    id: 'numeros-02',
    tipo: 'teclas-novas',
    titulo: { pt: '5 e 6', en: '5 and 6' },
    teclasNovas: ['5', '6'],
    conteudo: [
      'f4f f5f j7j j6j f5f j6j',
      'f5 f5 j6 j6 f5 j6 f5 j6',
      '555 666 555 666 555',
      '56 56 65 65 56 65 56',
      '45 45 76 76 45 76 45',
      'f4f f5f j7j j6j f5f',
      'r5r u6u r5r u6u r5r',
      '55 66 55 66 55 66 55',
      '456 654 456 654 456',
      '4567 7654 4567 7654',
      'f5f j6j 45 76 56 65',
      '4455 6677 4455 6677',
    ],
  },
  {
    id: 'numeros-03',
    tipo: 'palavras',
    titulo: { pt: 'Números no meio do texto', en: 'Numbers inside text' },
    teclasNovas: [],
    conteudo: [
      '44 anos 55 anos 66 anos',
      'sala 4 sala 5 sala 6',
      'quarto 7 quarto 4 andar 5',
      '5 metros 6 metros 7 metros',
      'casa 44 casa 55 casa 66',
      '54 anos 65 anos 76 anos',
      'o time fez 4 gols',
      'o time fez 5 gols',
      '456 gramas 567 gramas',
      '4 dias 5 dias 6 dias 7 dias',
      'mesa 4 mesa 5 mesa 6 mesa 7',
      '45 67 54 76 456 765',
    ],
  },

  /* --- 3 e 8: os médios --------------------------------------------------- */

  {
    id: 'numeros-04',
    tipo: 'teclas-novas',
    titulo: { pt: '3 e 8', en: '3 and 8' },
    teclasNovas: ['3', '8'],
    conteudo: [
      'ddd kkk d3d k8k d3d k8k',
      'd3 d3 k8 k8 d3 k8 d3 k8',
      '333 888 333 888 333',
      '38 38 83 83 38 83 38',
      'e3e i8i e3e i8i e3e',
      'd3d k8k 33 88 38 83',
      '34 35 87 86 34 87 35',
      '338 883 338 883 338',
      '3456 8765 3456 8765',
      '38 anos 83 anos 34 anos',
      'sala 3 sala 8 andar 3',
      'd3d k8k 345 876 38 83',
    ],
  },

  /* --- 2 e 9: os anelares ------------------------------------------------- */

  {
    id: 'numeros-05',
    tipo: 'teclas-novas',
    titulo: { pt: '2 e 9', en: '2 and 9' },
    teclasNovas: ['2', '9'],
    conteudo: [
      'sss lll s2s l9l s2s l9l',
      's2 s2 l9 l9 s2 l9 s2 l9',
      '222 999 222 999 222',
      '29 29 92 92 29 92 29',
      'w2w o9o w2w o9o w2w',
      's2s l9l 22 99 29 92',
      '23 24 98 97 23 98 24',
      '229 992 229 992 229',
      '2345 9876 2345 9876',
      '29 anos 92 anos 23 anos',
      'casa 2 casa 9 quarto 2',
      's2s l9l 234 987 29 92',
    ],
  },
  {
    id: 'numeros-06',
    tipo: 'palavras',
    titulo: { pt: 'De 2 a 9', en: 'From 2 to 9' },
    teclasNovas: [],
    conteudo: [
      '23 anos 45 anos 67 anos',
      '89 anos 98 anos 76 anos',
      'sala 23 sala 45 sala 67',
      'quarto 28 quarto 39 andar 4',
      '2345 6789 9876 5432',
      'mesa 3 mesa 6 mesa 9',
      'o carro tem 4 rodas',
      'a casa tem 5 quartos',
      '234 gramas 567 gramas',
      '789 metros 456 metros',
      '23 45 67 89 98 76 54 32',
      'sala 9 sala 8 sala 7 sala 6',
    ],
  },

  /* --- 1 e 0: os mínimos, o caminho mais longo ---------------------------- */

  {
    id: 'numeros-07',
    tipo: 'teclas-novas',
    titulo: { pt: '1 e 0', en: '1 and 0' },
    teclasNovas: ['1', '0'],
    dica: dicaIgual(
      'O vaivém aqui parte do Q e do P, e não da posição de descanso: as teclas de descanso dos mínimos ainda não foram ensinadas.',
      'Here the round trip starts from Q and P, not from the home position: the little fingers’ home keys have not been taught yet.'
    ),
    conteudo: [
      'qqq ppp q1q p0p q1q p0p',
      'q1 q1 p0 p0 q1 p0 q1 p0',
      '111 000 111 000 111',
      '10 10 01 01 10 01 10',
      'a1a q1q a1a q1q a1a',
      'q1q p0p 11 00 10 01',
      '12 19 10 01 12 19 10',
      '100 101 110 011 100',
      '1234 0987 1234 0987',
      '10 anos 100 anos 1000',
      'sala 10 sala 100 andar 1',
      'q1q p0p 123 098 10 01',
    ],
  },
  {
    id: 'numeros-08',
    tipo: 'palavras',
    titulo: { pt: 'Os dez algarismos', en: 'All ten digits' },
    teclasNovas: [],
    conteudo: [
      '1234567890 0987654321',
      '10 20 30 40 50 60 70',
      '80 90 100 200 300 400',
      '1990 1995 2000 2010 2020',
      'sala 101 sala 202 sala 303',
      'quarto 1 quarto 10 andar 12',
      '15 anos 30 anos 60 anos',
      'o ano de 1998',
      '250 gramas 500 gramas',
      '1500 metros 2500 metros',
      '12 34 56 78 90 09 87 65',
      '100 200 300 400 500 600',
    ],
  },

  /* --- Frases e desafio --------------------------------------------------- */

  {
    id: 'numeros-09',
    tipo: 'frases',
    titulo: { pt: 'Frases com números', en: 'Sentences with numbers' },
    teclasNovas: [],
    conteudo: [
      'a casa tem 3 quartos',
      'o carro custou 40 mil',
      'o time fez 2 gols hoje',
      'a sala 12 fica no andar 3',
      'o livro tem 250 folhas',
      'ele tem 25 anos de idade',
      'a aula dura 2 horas',
      'o hotel tem 10 andares',
      'a viagem durou 5 dias',
      'o quarto 402 fica no 4 andar',
      'o time ganhou de 3 a 1',
      'ela mora no bloco 78',
    ],
  },
  {
    id: 'numeros-10',
    tipo: 'desafio',
    titulo: { pt: 'Desafio dos números', en: 'Numbers challenge' },
    teclasNovas: [],
    conteudo: [
      '1234567890 0987654321',
      'q1q s2s d3d f4f f5f',
      'j6j j7j k8k l9l p0p',
      'a casa tem 3 quartos',
      'o carro custou 40 mil',
      'a sala 12 fica no andar 3',
      'ele tem 25 anos de idade',
      'o hotel tem 10 andares',
      '1990 1995 2000 2010 2020',
      '100 250 500 750 1000',
      '12 34 56 78 90 09 87 65',
      'o quarto 402 fica no 4 andar',
    ],
  },
];
