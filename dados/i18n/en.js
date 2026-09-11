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
  },
};
