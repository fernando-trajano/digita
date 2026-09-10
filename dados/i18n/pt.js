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

  // Mostruário provisório do passo 2. Sai quando a tela de entrada chegar.
  mostruario: {
    selo: 'Versão 1 em construção',
    titulo: 'Aprenda a digitar sem olhar para o teclado.',
    subtitulo:
      'Treino de digitação pensado para quem escreve em português: palavras de verdade, acentos, Ç e ajuda para quem usa teclado americano.',
    comecar: 'Começar do zero',
    jaSei: 'Já sei digitar',

    amostraTitulo: 'Amostra do texto de digitação',
    amostraAjuda:
      'É assim que a lição vai aparecer: o que você já digitou fica escuro, a letra da vez fica marcada, o que falta fica claro e o erro fica vermelho.',

    dedosTitulo: 'As cores dos dedos',
    dedosAjuda:
      'Cada dedo tem a sua cor, e ela é a mesma no teclado da tela e no desenho das mãos.',
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
