/* ==========================================================================
   en.js — every text of the site, in English.

   Must have exactly the same keys as pt.js. When a key is missing here, the
   site falls back to the Portuguese text and warns in the browser console.
   ========================================================================== */

export const en = {
  codigoHtml: 'en',

  documento: {
    titulo: 'digita. — typing practice in Portuguese',
    descricao:
      'Touch-typing practice for Brazilian Portuguese, focused on accents, Ç and the differences between the ABNT2 and US keyboard layouts.',
  },

  cabecalho: {
    idioma: 'Interface language',
    alternarTema: 'Switch between light and dark mode',
  },

  rodape: {
    texto: 'Built in Portuguese, with no external dependencies.',
  },


  teclado: {
    formato: 'Keyboard layout',
    sistema: 'System',
    abnt2: 'Brazilian ABNT2',
    us: 'US',
    windows: 'Windows',
    mac: 'Mac',
  },

  semTeclado: {
    titulo: 'digita. was made for a computer with a keyboard.',
    texto:
      'It teaches touch typing by showing which finger to use for each key. On a phone or a tablet without a keyboard, there is nothing to practise.',
    dica: 'Open this address on your computer to get started.',
    continuar: 'I have a keyboard attached — let me in anyway',
  },

  entrada: {
    titulo: 'First, let us get your keyboard right.',
    subtitulo:
      'digita. shows which finger to use for each key. To get that right, it needs to know which keyboard is in front of you.',

    formatoTitulo: 'Which keyboard layout do you have?',
    formatoAjuda:
      'Look at the key to the right of the L. If it has a Ç, your keyboard is Brazilian. If it has a semicolon, it is a US one.',
    abnt2Descricao: 'Has a Ç key and dedicated accent keys (´ ~ ^).',
    usDescricao: 'The key right of the L is a semicolon. No accent keys.',

    sistemaTitulo: 'Which system do you use?',
    sistemaAjuda: 'We preselected what your browser reported. Change it if it is wrong.',
    windowsDescricao: 'Ctrl, Alt and AltGr keys.',
    macDescricao: '⌘ command, ⌥ option and ⌃ control keys.',

    detectar: 'Detect automatically',
    detectarAjuda: 'Or let the site figure the layout out for you.',
    aperteATecla: 'Press the highlighted key on the keyboard preview, to the right.',
    aperteATeclaEstreito: 'Press the highlighted key on the keyboard preview, below.',
    cancelar: 'Cancel',
    detectado: 'Detected: {formato}.',
    detectadoOutraTecla: 'That is not the highlighted key. Try again, or pick it yourself.',
    detectadoNadaFeito:
      'Could not tell. Please pick it yourself, looking at the key to the right of the L.',

    previaTitulo: 'Preview of your keyboard',
    previaAjuda: 'This is the keyboard the lessons will show, with one color per finger.',

    acentosTitulo: 'How to type accents and Ç',
    acentosAbnt2:
      'Your keyboard handles it on its own: press the ´ key and then the vowel (´ then a = á). The tilde is on the ~ key, and Ç has its own key, right of the L.',
    acentosUsMac:
      'On a Mac, accents come from the ⌥ option key: ⌥ + e then e = é · ⌥ + n then a = ã · ⌥ + c = ç · ⌥ + ` then a = à.',
    acentosUsWindows:
      'On Windows, turn on the "United States — International" layout in the language settings. With it, type \' then the vowel (\' then a = á), ~ then a = ã, and \' then c = ç.',

    continuar: 'Start practising',
  },

  inicio: {
    deVolta: 'Good to see you back.',
    primeiraVez: 'Let us begin.',
    paradoEm: 'You stopped here',
    comecarPor: 'Your first lesson',
    jaTentada: 'attempted before',
    continuar: 'Continue where I left off',
    comecar: 'Start the first lesson',

    atalhos: 'Go to',
    atalhoTrilha: 'The whole programme, lesson by lesson.',
    atalhoTreino: 'Practise free text and the keys that slip most.',
    atalhoJogos: 'Practise without it feeling like practice.',
    atalhoEstatisticas: 'Your progress, finger by finger.',

    progresso: 'Your progress',
    progressoAjuda:
      'Everything is kept in this browser alone. Take your progress to another computer, or keep a copy before clearing your browser data. Importing replaces your lessons, day streak and statistics — this device\'s keyboard and language stay as they are.',
    exportar: 'Export to a file',
    importar: 'Import from a file',
    confirmarImportacao:
      'Importing will replace all the progress stored in this browser. Continue?',
    importado: 'Progress imported. The screen is already showing the file data.',
    importacaoCancelada: 'Import cancelled. Nothing was changed.',
    exportado: 'File saved. Keep it somewhere safe.',
    erro_ilegivel: 'I could not read that file. It looks corrupted.',
    erro_outroArquivo: 'That file is not a digita. progress file.',
    erro_versaoNova: 'That file was made by a newer version of digita.',

    seuTeclado: 'Your keyboard',
    trocarTeclado: 'Change keyboard',
  },

  nivelamento: {
    pergunta: 'Can you already type without looking at the keyboard?',
    explica:
      'If you already type, a one-minute test shows your level and where to start.',
    naoSei: 'No, I want to start from scratch',
    jaSei: 'Yes, let me take the test',
    aviso: 'You can retake the test later, or ignore the result and practise everything anyway.',

    tituloTeste: 'One-minute test',
    segundos: 'seconds',
    comoFunciona:
      'Just type. The clock starts on your first key and the test ends on its own. This text has no accents or Ç, so the result measures you and not your keyboard.',

    dispensado: 'You already have this part down.',
    doComeco: 'Let us start from the beginning.',
    explicaDispensado:
      'With that result, the {trilhas} track is unlocked — go straight to it, or take the lessons anyway if you want the practice.',
    explicaDoComeco:
      'Skipping the home row takes at least 90% accuracy and 25 WPM. Falling short is not bad news: it is exactly what the lessons are for.',
    verTrilha: 'See the track',
  },

  som: {
    silenciar: 'Mute sounds',
    ativar: 'Unmute sounds',
  },

  nav: {
    trilha: 'Track',
    treino: 'Free practice',
    jogos: 'Games',
    estatisticas: 'Statistics',
    emBreve: 'coming soon',
  },

  treinoLivre: {
    titulo: 'Free practice',
    subtitulo: 'Practice without a score: no stars, and no minimum accuracy.',

    oQueTreinar: 'What to practise',
    porQuantoTempo: 'For how long',
    comecar: 'Start',
    minutos: '{quantos} min',
    semFim: 'Endless',

    colar: 'Paste here the text you want to practise.',
    textoProprio: 'Your own text',

    avisoUsInternacional:
      'On Windows, typing accents on a US keyboard needs the {layout} layout switched on in the language settings.',
    usInternacional: 'US International',
    avisoNumerico: 'MacBooks and compact keyboards have no number pad.',

    restam: 'left',
    decorrido: 'elapsed',
    encerrar: 'Finish',
    campo: 'Free practice typing area',

    fim: 'Practice over.',
    ppmLongo: 'words per minute',
    precisaoLonga: 'accuracy',
    deTreino: 'of practice',
    teclasQueEscaparam: 'Keys that slipped most',
    semErros: 'None: you did not miss a single key.',
    deNovo: 'Practise again',
    voltar: 'Back to free practice',

    modos: {
      adaptativo: {
        nome: 'Adaptive',
        descricao: 'Draws more of the keys you miss most, based on your statistics.',
      },
      acentos: {
        nome: 'Accents and Ç',
        descricao: 'Words with á, é, í, ó, ú, â, ê, ô, ã, õ, à and ç.',
      },
      numerico: {
        nome: 'Number pad',
        descricao: 'Numbers and operators from the number pad.',
      },
      proprio: {
        nome: 'Your own text',
        descricao: 'Paste any text and practise with it.',
      },
    },
  },

  jogos: {
    titulo: 'Games',
    subtitulo: 'Practise while having fun, without the lesson feel.',
    oQueJogar: 'What to play',
    jogar: 'Play',

    nivel: 'Level',
    niveis: {
      facil: 'Easy',
      medio: 'Medium',
      dificil: 'Hard',
    },
    voltar: 'Back to games',
    encerrar: 'Finish',
    pausado: 'Paused. Press any key to carry on.',
    encerrada: 'Game over.',
    deNovo: 'Play again',
    trocarNivel: 'Change level',
    tempo: 'time',
    acertos: 'hits',
    combo: 'combo',
    precisao: 'accuracy',
    comboMaximo: 'best combo',

    cobra: {
      nome: 'Snake',
      descricao: 'The snake follows at a steady speed. Every hit pulls you away, every miss brings it closer.',
      ajuda:
        'Escape mode, endless. The faster the hit, the bigger the jump; every {combo} hits in a row give you extra room. When the snake gets close, it speeds up.',
      mediaLicoes: 'Your average in the lessons: {ppm} WPM.',
      mediaTeste: 'Your average in the placement test: {ppm} WPM.',
      mediaPadrao: 'You have no lesson average yet: the game uses {ppm} WPM.',
      velocidade: 'On {nivel}, the snake runs at {ppm} WPM.',
      espera: 'The snake starts moving when you type the first letter.',
      metros: 'metres',
      campo: 'Snake text',
      saiu: 'The snake is off.',
      perto: 'The snake is close.',
      fim: 'The snake caught you.',
      modo: 'Escape',
      distancia: 'distance covered',
      ppmESuaMedia: 'WPM · your average is {ppm}',
      sobrevivido: 'time survived',
    },

    fila: {
      nome: 'Queue',
      descricao: 'Letters keep coming. Type fast so the stack never reaches the top.',
      ajuda: 'Always type the bottom letter. Its position on screen is the one of the finger that types it.',
      espera: 'The queue starts when you type the first letter.',
      fim: 'The stack reached the top.',
      acertadas: 'letters hit',
      sobrevivido: 'survived',
    },

    cadeia: {
      nome: 'Chain',
      descricao: 'The sequence shows up for an instant and vanishes. Type it from memory.',
      ajuda: 'While you type, the screen stays empty: the result only shows at the end of the sequence.',
      letras: 'letters',
      melhor: 'best',
      certo: 'Right',
      errou: 'Missed',
      pausado: 'Paused. Press any key to carry on — the sequence will show again.',
      memorize: 'Memorise: {letras}',
      digite: 'Type the {quantas} letters.',
      leitorCerto: 'Right.',
      leitorErrou: 'Missed. It was {certa}; you typed {digitada}.',
      fim: 'End of the chain.',
      maisLonga: 'longest sequence',
      rodadas: 'rounds',
      serie: 'longest run of hits',
    },
  },

  painel: {
    titulo: 'Your progress',
    dia: 'day in a row',
    dias: 'days in a row',
    licoesConcluidas: 'lessons completed',
    errosTitulo: 'Keys that slip most',
    semErros: 'No mistakes to show yet.',
  },

  trilha: {
    titulo: 'The track',
    subtitulo:
      'A program of seven tracks and about a hundred lessons. Each lesson unlocks when the previous one is completed.',
    trancada: 'Finish the previous one',
    aberta: 'Lesson open, not completed yet',
    planejadas: '{quantas} lessons planned.',
    continuar: 'Continue',

    revisao: 'Review',
    desafioFinal: 'Final challenge',

    estadoConcluida: 'Completed.',
    estadoAtual: 'Current lesson.',
    estadoBloqueada: 'Locked.',
  },

  resultado: {
    parabens: 'Lesson complete!',
    quase: 'Almost there.',
    explicaReprovado:
      'Finishing a lesson takes {minima}% accuracy. Speed comes later — first your fingers learn the way.',
    recorde: 'That is your best speed on this lesson so far.',
    faltaPara: 'Reach {ppm} WPM while keeping your accuracy to earn star {quantas}.',
    tudoQueDava: 'Three stars: this lesson cannot go any better.',
    tempo: 'time',
    estrelas: '{quantas} of {total} stars',
    errosTitulo: 'Keys you stumbled on most',
    semErros: 'No mistakes. Clean from start to finish.',
    repetir: 'Repeat the lesson',
    proxima: 'Next lesson',
    sair: 'Leave',
  },

  licao: {
    proxima: 'Next',
    licao: 'Lesson',
    sair: 'Leave',
    ppm: 'WPM',
    precisao: 'accuracy',
    progresso: 'progress',
    erros: 'mistakes',
    capsLock: 'Caps Lock is on',
    campo: 'Lesson typing area',
    clique: 'Click the text to keep typing.',
    concluida: 'Lesson complete!',
    tenteDeNovo: 'Almost! The minimum accuracy is 90%.',
    avisoLayout: 'The key you pressed looks like a {formato} keyboard. Switch?',
    trocarLayout: 'Switch',
    ordemDoDedo: '{mao} {dedo}',
    qualquerPolegar: 'either thumb',
    segure: 'hold {tecla} with the {dedo}',
  },

  maos: {
    esquerda: 'left',
    direita: 'right',
  },

  dedos: {
    minimo: 'little',
    anelar: 'ring',
    medio: 'middle',
    indicador: 'index',
    polegar: 'thumb',
    erro: 'error',
  },

  teclas: {
    espaco: 'space',
    shift: 'Shift',
    option: 'Option',
    altgr: 'AltGr',
  },
};
