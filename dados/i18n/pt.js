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
    emBreve: 'As lições estão sendo construídas — esta parte chega em breve.',
  },

  licao: {
    proxima: 'Próxima',
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
