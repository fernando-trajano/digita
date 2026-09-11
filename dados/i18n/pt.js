/* ==========================================================================
   pt.js — todos os textos do site em português.

   Este arquivo é CONTEÚDO, não código: dá para corrigir uma frase aqui sem
   entender nada de JavaScript. A única regra é manter as aspas e a vírgula
   no fim de cada linha.

   O en.js precisa ter exatamente as mesmas chaves. Se faltar alguma, o site
   avisa no console do navegador em vez de mostrar a tela quebrada.
   ========================================================================== */

export const pt = {
  // Código que vai para o atributo lang do <html>. Serve para o navegador
  // saber hifenizar, corrigir ortografia e ler em voz alta no idioma certo.
  codigoHtml: 'pt-BR',

  documento: {
    titulo: 'digita. — treino de digitação em português',
    descricao:
      'Treino de digitação em português do Brasil, com foco em acentos, Ç e nas diferenças entre o teclado ABNT2 e o americano.',
  },

  cabecalho: {
    idioma: 'Idioma da interface',
    alternarTema: 'Alternar entre modo claro e escuro',
  },

  rodape: {
    texto: 'Feito em português, sem depender de nada externo.',
  },


  teclado: {
    formato: 'Formato do teclado',
    sistema: 'Sistema',
    abnt2: 'Brasileiro ABNT2',
    us: 'Americano US',
    windows: 'Windows',
    mac: 'Mac',
  },

  semTeclado: {
    titulo: 'O digita. foi feito para computador com teclado.',
    texto:
      'Ele ensina a digitar com os dez dedos, mostrando qual dedo usar em cada tecla. Num celular ou tablet sem teclado, não há o que treinar.',
    dica: 'Abra este endereço no seu computador para começar.',
    continuar: 'Tenho um teclado conectado — quero entrar assim mesmo',
  },

  entrada: {
    titulo: 'Antes de começar, vamos acertar o seu teclado.',
    subtitulo:
      'O digita. mostra qual dedo usar em cada tecla. Para isso acertar, ele precisa saber que teclado está na sua frente.',

    formatoTitulo: 'Qual é o formato do seu teclado?',
    formatoAjuda:
      'Olhe a tecla à direita do L. Se ela tem um Ç, o seu teclado é brasileiro. Se tem um ponto e vírgula, é americano.',
    abnt2Descricao: 'Tem tecla de Ç e teclas próprias de acento (´ ~ ^).',
    usDescricao: 'À direita do L fica o ponto e vírgula. Não tem tecla de acento.',

    sistemaTitulo: 'Qual sistema você usa?',
    sistemaAjuda: 'Já deixamos marcado o que o seu navegador informou. Se estiver errado, troque.',
    windowsDescricao: 'Teclas Ctrl, Alt e AltGr.',
    macDescricao: 'Teclas ⌘ command, ⌥ option e ⌃ control.',

    detectar: 'Detectar automaticamente',
    detectarAjuda: 'Se preferir, o site descobre o formato para você.',
    aperteATecla: 'Aperte a tecla destacada na prévia do teclado, à direita.',
    aperteATeclaEstreito: 'Aperte a tecla destacada na prévia do teclado, abaixo.',
    cancelar: 'Cancelar',
    detectado: 'Detectado: {formato}.',
    detectadoOutraTecla: 'Essa não é a tecla destacada. Tente de novo, ou escolha na mão.',
    detectadoNadaFeito: 'Não deu para identificar. Escolha na mão, olhando a tecla à direita do L.',

    previaTitulo: 'Prévia do seu teclado',
    previaAjuda: 'É este o teclado que vai aparecer nas lições, com uma cor para cada dedo.',

    acentosTitulo: 'Como fazer acentos e Ç',
    acentosAbnt2:
      'Seu teclado resolve tudo sozinho: aperte a tecla ´ e depois a vogal (´ e depois a = á). O til fica na tecla ~ e o Ç tem tecla própria, à direita do L.',
    acentosUsMac:
      'No Mac, os acentos saem com a tecla ⌥ option: ⌥ + e e depois e = é · ⌥ + n e depois a = ã · ⌥ + c = ç · ⌥ + ` e depois a = à.',
    acentosUsWindows:
      'No Windows, ative o layout "Estados Unidos — Internacional" nas configurações de idioma. Com ele, digite \' e depois a vogal (\' e depois a = á), ~ e depois a = ã, e \' e depois c = ç.',

    continuar: 'Começar a treinar',
  },

  inicio: {
    deVolta: 'Bom te ver de volta.',
    primeiraVez: 'Vamos começar.',
    paradoEm: 'Você parou aqui',
    comecarPor: 'Sua primeira lição',
    jaTentada: 'já tentada antes',
    continuar: 'Continuar de onde parei',
    comecar: 'Começar a primeira lição',

    atalhos: 'Ir para',
    atalhoTrilha: 'O programa inteiro, lição por lição.',
    atalhoTreino: 'Treinar texto livre e as teclas que mais escapam.',
    atalhoJogos: 'Praticar sem parecer treino.',
    atalhoEstatisticas: 'Sua evolução, dedo por dedo.',

    progresso: 'Seu progresso',
    progressoAjuda:
      'Tudo fica guardado só neste navegador. Leve o progresso para outro computador, ou guarde uma cópia antes de limpar os dados do navegador.',
    exportar: 'Exportar para um arquivo',
    importar: 'Importar de um arquivo',
    confirmarImportacao:
      'Importar vai substituir todo o progresso guardado neste navegador. Quer continuar?',
    exportado: 'Arquivo salvo. Guarde-o em algum lugar seguro.',
    erro_ilegivel: 'Não consegui ler esse arquivo. Ele parece estar corrompido.',
    erro_outroArquivo: 'Esse arquivo não é um progresso do digita.',
    erro_versaoNova: 'Esse arquivo foi feito por uma versão mais nova do digita.',

    seuTeclado: 'Seu teclado',
    trocarTeclado: 'Trocar de teclado',
  },

  nivelamento: {
    pergunta: 'Você já digita sem olhar para o teclado?',
    explica:
      'Se já digita, não faz sentido recomeçar do "fff jjj". Um teste de um minuto mostra por onde você deve entrar.',
    naoSei: 'Não, quero começar do zero',
    jaSei: 'Sim, quero fazer o teste',
    aviso: 'Você pode refazer o teste depois, ou ignorar o resultado e treinar tudo mesmo assim.',

    tituloTeste: 'Teste de um minuto',
    segundos: 'segundos',
    comoFunciona:
      'Digite normalmente. O relógio começa na primeira tecla e o teste acaba sozinho. Não há acentos nem Ç neste texto, para o resultado medir você, e não o seu teclado.',

    dispensado: 'Você já domina esta parte.',
    doComeco: 'Vamos começar do começo.',
    explicaDispensado:
      'Com esse resultado, a trilha {trilhas} fica liberada — você pode ir direto para ela ou fazer as lições assim mesmo, se quiser treinar.',
    explicaDoComeco:
      'Para pular a fileira base é preciso pelo menos 90% de precisão e 25 PPM. Não é ruim ter ficado abaixo disso: é exatamente para isso que as lições existem.',
    verTrilha: 'Ver a trilha',
  },

  som: {
    silenciar: 'Silenciar os sons',
    ativar: 'Ativar os sons',
  },

  nav: {
    trilha: 'Trilha',
    treino: 'Treino livre',
    jogos: 'Jogos',
    estatisticas: 'Estatísticas',
    emBreve: 'em breve',
  },

  painel: {
    titulo: 'Seu progresso',
    dia: 'dia seguido praticando',
    dias: 'dias seguidos praticando',
    licoesConcluidas: 'lições concluídas',
    errosTitulo: 'Teclas que mais escapam',
    semErros: 'Ainda não há erros para mostrar.',
  },

  trilha: {
    titulo: 'A trilha',
    subtitulo:
      'Um programa de sete trilhas e cerca de cem lições de cinco minutos. Cada lição abre quando a anterior é concluída.',
    trancada: 'Conclua a anterior',
    aberta: 'Lição aberta, ainda não concluída',
    planejadas: '{quantas} lições planejadas.',
  },

  resultado: {
    parabens: 'Lição concluída!',
    quase: 'Quase lá.',
    explicaReprovado:
      'Para concluir a lição, é preciso {minima}% de precisão. Velocidade vem depois — primeiro os dedos aprendem o caminho.',
    recorde: 'É a sua melhor velocidade nesta lição até agora.',
    faltaPara: 'Chegue a {ppm} PPM mantendo a precisão para ganhar a {quantas}ª estrela.',
    tudoQueDava: 'Três estrelas: não dá para ir melhor nesta lição.',
    tempo: 'tempo',
    estrelas: '{quantas} de {total} estrelas',
    errosTitulo: 'Teclas em que você mais tropeçou',
    semErros: 'Nenhum erro. Limpo do começo ao fim.',
    repetir: 'Repetir a lição',
    proxima: 'Próxima lição',
    sair: 'Sair',
  },

  licao: {
    proxima: 'Próxima',
    licao: 'Lição',
    sair: 'Sair',
    ppm: 'PPM',
    precisao: 'precisão',
    progresso: 'progresso',
    erros: 'erros',
    capsLock: 'Caps Lock ligado',
    campo: 'Área de digitação da lição',
    clique: 'Clique no texto para continuar digitando.',
    concluida: 'Lição concluída!',
    tenteDeNovo: 'Quase! A precisão mínima é 90%.',
    avisoLayout:
      'A tecla que você apertou parece ser de um teclado {formato}. Quer trocar?',
    trocarLayout: 'Trocar',
    // Em português o dedo vem antes da mão ("indicador esquerdo"); em inglês
    // é o contrário ("left index"). Por isso a ordem é uma tradução também.
    ordemDoDedo: '{dedo} {mao}',
    qualquerPolegar: 'qualquer polegar',
  },

  maos: {
    esquerda: 'esquerdo',
    direita: 'direito',
  },

  dedos: {
    minimo: 'mínimo',
    anelar: 'anelar',
    medio: 'médio',
    indicador: 'indicador',
    polegar: 'polegar',
    erro: 'erro',
  },

  teclas: {
    espaco: 'espaço',
  },
};
