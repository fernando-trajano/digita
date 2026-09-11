/* ==========================================================================
   acentos.js — as 16 lições da trilha de acentos e Ç.

   É a razão de existir do digita. Nenhum treino de digitação feito para o
   inglês ensina isto, e é exatamente o que trava quem escreve em português:
   o Ç, os cinco acentos, e o fato de que o caminho para fazê-los muda
   conforme o teclado.

   A MESMA LIÇÃO, TRÊS CAMINHOS

   O conteúdo é um só — as palavras são as mesmas para todo mundo. O que
   muda é a INSTRUÇÃO, no campo `dica` de cada lição:

     teclado brasileiro   tecla própria de acento, e o Ç à direita do L
     teclado americano    ⌥ + letra no Mac
     no Windows           layout "Estados Unidos — Internacional"

   Isso funciona porque o motor de digitação recebe a letra PRONTA, e não as
   teclas: quem digita "ç" com ⌥ + c e quem digita com a tecla do Ç chegam
   ao mesmo lugar. Ver o cabeçalho de js/motor-digitacao.js.

   A ORDEM: o Ç primeiro, por ser o mais distintivo e o mais usado; depois o
   agudo (o acento mais frequente do português), o til, o circunflexo e por
   fim a crase, que é a mais rara.

   O QUE AINDA NÃO PODE APARECER: pontuação e maiúsculas são da trilha 6.
   ========================================================================== */

/* As três instruções para o Ç, reaproveitadas nas lições dele. */
const DICA_CEDILHA = {
  abnt2: {
    pt: 'No seu teclado o Ç tem tecla própria, logo à direita do L — mínimo direito.',
    en: 'On your keyboard Ç has its own key, just right of the L — right little finger.',
  },
  usMac: {
    pt: 'No Mac com teclado americano: segure ⌥ option e aperte C.',
    en: 'On a Mac with a US keyboard: hold ⌥ option and press C.',
  },
  usWindows: {
    pt: 'No Windows com o layout Estados Unidos — Internacional: aperte a aspa simples \' e depois C.',
    en: 'On Windows with the United States — International layout: press the apostrophe \' and then C.',
  },
};

/**
 * As três instruções de um acento.
 *
 * Cada teclado chega ao mesmo lugar por um caminho diferente, e os símbolos
 * não coincidem: o agudo é a tecla ´ no brasileiro, ⌥ + E no Mac e a ASPA
 * SIMPLES no US Internacional do Windows. Por isso cada caminho tem o seu
 * próprio símbolo e o seu próprio exemplo — dizer "aperte ´" para quem está
 * no US Internacional mandaria a pessoa procurar uma tecla que não existe.
 *
 * @param {string} teclaAbnt2    a tecla de acento do teclado brasileiro
 * @param {string} teclaMac      o que vem depois do ⌥ option, no Mac
 * @param {string} teclaWindows  como chamar o caractere do US Internacional
 * @param {string} simboloWindows  o símbolo dele, curto, para o exemplo
 * @param {string} vogal         a vogal do exemplo
 * @param {string} resultado     a letra que sai do exemplo
 */
const dicaDeAcento = (teclaAbnt2, teclaMac, teclaWindows, simboloWindows, vogal, resultado) => ({
  abnt2: {
    pt: `No seu teclado: aperte a tecla ${teclaAbnt2} e depois a vogal. ${teclaAbnt2} e depois ${vogal} = ${resultado}`,
    en: `On your keyboard: press the ${teclaAbnt2} key, then the vowel. ${teclaAbnt2} then ${vogal} = ${resultado}`,
  },
  usMac: {
    pt: `No Mac: segure ⌥ option e aperte ${teclaMac}, solte, e então aperte a vogal. ⌥${teclaMac} e depois ${vogal} = ${resultado}`,
    en: `On a Mac: hold ⌥ option and press ${teclaMac}, let go, then press the vowel. ⌥${teclaMac} then ${vogal} = ${resultado}`,
  },
  usWindows: {
    pt: `No Windows, com o layout Estados Unidos — Internacional: aperte ${teclaWindows} e depois a vogal. ${simboloWindows} e depois ${vogal} = ${resultado}`,
    en: `On Windows, with the United States — International layout: press ${teclaWindows} and then the vowel. ${simboloWindows} then ${vogal} = ${resultado}`,
  },
});

export const acentos = [
  /* --- O Ç: a letra mais brasileira do teclado -------------------------- */

  {
    id: 'acentos-01',
    tipo: 'teclas-novas',
    titulo: { pt: 'Ç: a cedilha', en: 'Ç: the cedilla' },
    teclasNovas: ['ç'],
    dica: DICA_CEDILHA,
    conteudo: [
      'ç ç ç ç ç ç ç ç',
      'aç aç eç eç iç iç oç oç',
      'ça ça ço ço çu çu ça ço',
      'aça aça eça eça oça oça',
      'aço aço oço oço uça uça',
      'aço aço laço laço',
      'peça peça poço poço',
      'taça taça moça moça',
      'força força praça praça',
      'aço laço peça poço',
      'taça moça força praça',
      'ça ço çu aço laço peça',
    ],
  },
  {
    id: 'acentos-02',
    tipo: 'palavras',
    titulo: { pt: 'Palavras com Ç', en: 'Words with Ç' },
    teclasNovas: [],
    dica: DICA_CEDILHA,
    conteudo: [
      'aço laço peça poço',
      'taça moça força praça',
      'dança criança mudança',
      'cabeça esperança licença',
      'abraço pescoço almoço',
      'serviço doçura caçar',
      'aço peça força dança',
      'cabeça abraço almoço',
      'criança esperança praça',
      'mudança licença serviço',
      'pescoço doçura moça',
      'laço poço taça caçar',
    ],
  },
  {
    id: 'acentos-03',
    tipo: 'palavras',
    titulo: { pt: 'Começar, alcançar, dançar', en: 'Começar, alcançar, dançar' },
    teclasNovas: [],
    dica: DICA_CEDILHA,
    conteudo: [
      'começo começar começou',
      'alcançar dançar caçar',
      'criança crianças cabeça',
      'esperança esperanças',
      'serviço serviços almoço',
      'começar alcançar dançar',
      'criança cabeça esperança',
      'serviço almoço abraço',
      'pescoço mudança licença',
      'doçura força praça dança',
      'começo criança serviço',
      'alcançar dançar caçar',
    ],
  },

  /* --- O acento agudo: o mais frequente do português -------------------- */

  {
    id: 'acentos-04',
    tipo: 'teclas-novas',
    titulo: { pt: 'Á e É: o acento agudo', en: 'Á and É: the acute accent' },
    teclasNovas: ['á', 'é'],
    dica: dicaDeAcento('´', 'E', 'a aspa simples', "'", 'a', 'á'),
    conteudo: [
      'á á á é é é á é á é',
      'aá aá eé eé aá eé',
      'já já lá lá cá cá',
      'pé pé até até café café',
      'água água fácil fácil',
      'sábado sábado árvore',
      'médico médico área área',
      'já lá pé até café',
      'água fácil sábado',
      'árvore médico área',
      'já é lá é cá é pé é',
      'café água fácil árvore',
    ],
  },
  {
    id: 'acentos-05',
    tipo: 'palavras',
    titulo: { pt: 'Já, café, água', en: 'Já, café, água' },
    teclasNovas: [],
    dica: dicaDeAcento('´', 'E', 'a aspa simples', "'", 'a', 'á'),
    conteudo: [
      'já lá cá pé até café',
      'água fácil sábado',
      'árvore médico área',
      'até lá até já até cá',
      'já está lá está cá',
      'café com água fácil',
      'sábado na área',
      'médico da árvore',
      'até já até lá',
      'água fácil café sábado',
      'está já lá até pé',
      'médico área árvore fácil',
    ],
  },
  {
    id: 'acentos-06',
    tipo: 'teclas-novas',
    titulo: { pt: 'Í, Ó e Ú', en: 'Í, Ó and Ú' },
    teclasNovas: ['í', 'ó', 'ú'],
    dica: dicaDeAcento('´', 'E', 'a aspa simples', "'", 'o', 'ó'),
    conteudo: [
      'í í í ó ó ó ú ú ú',
      'aí aí só só nó nó',
      'aí aí saí saí pó pó',
      'saída saída país país',
      'avó avó avós avós',
      'número número música',
      'público público última',
      'história história açúcar',
      'aí só nó pó saída país',
      'avó número música',
      'público última história',
      'açúcar saída país avó',
    ],
  },
  {
    id: 'acentos-07',
    tipo: 'palavras',
    titulo: { pt: 'Música, número, história', en: 'Música, número, história' },
    teclasNovas: [],
    dica: dicaDeAcento('´', 'E', 'a aspa simples', "'", 'u', 'ú'),
    conteudo: [
      'aí só nó pó saída',
      'país avó número música',
      'público última história',
      'açúcar árvore médico',
      'saída do país',
      'música da avó',
      'número público',
      'última história',
      'açúcar e café',
      'aí só saída país avó',
      'número música público',
      'última história açúcar',
    ],
  },
  {
    id: 'acentos-08',
    tipo: 'revisao',
    titulo: { pt: 'Revisão: agudo e cedilha', en: 'Review: acute and cedilla' },
    teclasNovas: [],
    conteudo: [
      'ç á é í ó ú',
      'aço peça força praça',
      'já lá até café água',
      'saída país avó música',
      'cabeça esperança serviço',
      'sábado médico árvore',
      'número público última',
      'começar dançar alcançar',
      'história açúcar fácil',
      'criança mudança licença',
      'ç á é í ó ú ça çó çú',
      'café com açúcar já',
    ],
  },

  /* --- O til: o acento mais brasileiro ---------------------------------- */

  {
    id: 'acentos-09',
    tipo: 'teclas-novas',
    titulo: { pt: 'Ã e Õ: o til', en: 'Ã and Õ: the tilde' },
    teclasNovas: ['ã', 'õ'],
    dica: dicaDeAcento('~', 'N', '~', '~', 'a', 'ã'),
    conteudo: [
      'ã ã ã õ õ õ ã õ ã õ',
      'aã aã oõ oõ aã oõ',
      'lã lã mãe mãe não não',
      'mão mão mãos mãos',
      'irmã irmã irmão irmão',
      'ação ação então então',
      'lições lições razões',
      'lã mãe não mão irmã',
      'ação então lições',
      'razões irmão mãos',
      'não mãe mão lã ação',
      'então lições razões irmã',
    ],
  },
  {
    id: 'acentos-10',
    tipo: 'palavras',
    titulo: { pt: 'Não, mão, coração', en: 'Não, mão, coração' },
    teclasNovas: [],
    dica: dicaDeAcento('~', 'N', '~', '~', 'o', 'õ'),
    conteudo: [
      'não mão mãos mãe lã',
      'irmã irmão irmãos',
      'ação ações então',
      'coração corações',
      'opinião opiniões',
      'questão questões',
      'lições razões canções',
      'amanhã manhã irmãs',
      'não mão coração ação',
      'opinião questão lições',
      'amanhã manhã então',
      'corações canções razões',
    ],
  },
  {
    id: 'acentos-11',
    tipo: 'palavras',
    titulo: { pt: 'Til e cedilha juntos', en: 'Tilde and cedilla together' },
    teclasNovas: [],
    conteudo: [
      'coração corações ação',
      'canção canções lição',
      'lições educação',
      'atenção informação',
      'criação população',
      'coração canção lição',
      'educação atenção',
      'informação criação',
      'população corações',
      'canções lições ações',
      'atenção e educação',
      'informação da população',
    ],
  },

  /* --- O circunflexo ---------------------------------------------------- */

  {
    id: 'acentos-12',
    tipo: 'teclas-novas',
    titulo: { pt: 'Â, Ê e Ô: o circunflexo', en: 'Â, Ê and Ô: the circumflex' },
    teclasNovas: ['â', 'ê', 'ô'],
    dica: dicaDeAcento('^', 'I', '^', '^', 'e', 'ê'),
    conteudo: [
      'â â â ê ê ê ô ô ô',
      'aâ aâ eê eê oô oô',
      'três três mês mês',
      'você você vocês vocês',
      'avô avô avós avós',
      'ônibus ônibus câmera',
      'inglês inglês português',
      'três mês você avô',
      'ônibus câmera inglês',
      'português vocês avós',
      'você e ela três mês',
      'ônibus inglês português',
    ],
  },
  {
    id: 'acentos-13',
    tipo: 'palavras',
    titulo: { pt: 'Você, três, português', en: 'Você, três, português' },
    teclasNovas: [],
    dica: dicaDeAcento('^', 'I', '^', '^', 'o', 'ô'),
    conteudo: [
      'você vocês três mês',
      'meses avô avós ônibus',
      'câmera inglês português',
      'pêssego âncora',
      'você fala português',
      'três meses de inglês',
      'o avô e a avó',
      'a câmera do ônibus',
      'você vocês três mês',
      'português inglês câmera',
      'ônibus avô pêssego',
      'âncora meses vocês',
    ],
  },

  /* --- A crase e o fechamento ------------------------------------------- */

  {
    id: 'acentos-14',
    tipo: 'teclas-novas',
    titulo: { pt: 'À: a crase', en: 'À: the grave accent' },
    teclasNovas: ['à'],
    dica: dicaDeAcento('`', '`', '`', '`', 'a', 'à'),
    conteudo: [
      'à à à à à à à à',
      'aà aà à à aà à',
      'às às às à à à às',
      'à casa à mesa à praça',
      'às vezes às vezes',
      'à noite à tarde',
      'à água à árvore',
      'às lições às ações',
      'à casa às vezes à noite',
      'à mesa à praça à tarde',
      'às vezes à água',
      'à à às às à casa',
    ],
  },
  {
    id: 'acentos-15',
    tipo: 'revisao',
    titulo: { pt: 'Revisão: os cinco acentos', en: 'Review: all five accents' },
    teclasNovas: [],
    conteudo: [
      'á é í ó ú ã õ â ê ô à ç',
      'café água sábado médico',
      'saída país avó música',
      'não mão coração ação',
      'você três mês português',
      'à casa às vezes à noite',
      'cabeça esperança serviço',
      'lições opinião questão',
      'ônibus câmera inglês',
      'número público história',
      'começar dançar alcançar',
      'açúcar amanhã atenção',
    ],
  },
  {
    id: 'acentos-16',
    tipo: 'desafio',
    titulo: { pt: 'Desafio dos acentos', en: 'Accents challenge' },
    teclasNovas: [],
    conteudo: [
      'á é í ó ú ã õ â ê ô à ç',
      'o coração da criança',
      'você fala português',
      'três meses de atenção',
      'a saída do país',
      'às vezes à noite',
      'a música da avó',
      'o número é público',
      'café com açúcar amanhã',
      'a informação da população',
      'começar é a parte fácil',
      'educação e esperança',
      'o serviço da praça',
    ],
  },
];
