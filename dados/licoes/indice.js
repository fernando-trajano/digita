/* ==========================================================================
   indice.js — as 7 trilhas do digita. e as regras que valem para todas.

   A meta é um programa de ~30 dias, com cerca de 100 lições de 5 minutos.
   As trilhas ainda sem conteúdo aparecem como "em breve", mas já estão
   declaradas aqui com o tamanho planejado, para o progresso geral
   ("12 de 100") fazer sentido desde o primeiro dia.
   ========================================================================== */

import { fileiraBase } from './fileira-base.js';
import { fileiraDeCima } from './fileira-de-cima.js';

/**
 * Metas de velocidade por tipo de lição, em PPM (palavras por minuto).
 * São os alvos de 1, 2 e 3 estrelas.
 *
 * Os números são baixos de propósito: quem está aprendendo a posição dos
 * dedos digita devagar, e meta impossível desanima. Exercício de sílabas é
 * mais lento que palavra de verdade, e palavra é mais lenta que frase — por
 * isso cada tipo tem o seu alvo.
 */
export const METAS_POR_TIPO = {
  'teclas-novas': { precisaoMinima: 90, estrelas: [8, 14, 20] },
  palavras: { precisaoMinima: 90, estrelas: [10, 16, 24] },
  frases: { precisaoMinima: 90, estrelas: [12, 20, 28] },
  revisao: { precisaoMinima: 90, estrelas: [12, 20, 28] },
  desafio: { precisaoMinima: 90, estrelas: [15, 22, 30] },
};

/**
 * As 7 trilhas, na ordem em que devem ser feitas.
 *   licoesPlanejadas  quantas lições a trilha terá quando estiver pronta
 *   licoes            as que já existem (vazio = "em breve")
 */
export const TRILHAS = [
  {
    id: 'fileira-base',
    nome: { pt: 'Fileira base', en: 'Home row' },
    descricao: {
      pt: 'A posição de descanso das mãos: a s d f g h j k l.',
      en: 'The resting position of your hands: a s d f g h j k l.',
    },
    licoesPlanejadas: 18,
    licoes: fileiraBase,
  },
  {
    id: 'fileira-de-cima',
    nome: { pt: 'Fileira de cima', en: 'Top row' },
    descricao: {
      pt: 'q w e r t y u i o p — e as primeiras vogais além do A.',
      en: 'q w e r t y u i o p — and the first vowels beyond A.',
    },
    licoesPlanejadas: 18,
    licoes: fileiraDeCima,
  },
  {
    id: 'fileira-de-baixo',
    nome: { pt: 'Fileira de baixo', en: 'Bottom row' },
    descricao: {
      pt: 'z x c v b n m — inclusive o C, que falta para muita palavra.',
      en: 'z x c v b n m — including the C that so many words need.',
    },
    licoesPlanejadas: 14,
    licoes: [],
  },
  {
    id: 'numeros',
    nome: { pt: 'Números', en: 'Numbers' },
    descricao: {
      pt: 'A fileira de cima do teclado, de 1 a 0.',
      en: 'The number row, 1 through 0.',
    },
    licoesPlanejadas: 10,
    licoes: [],
  },
  {
    id: 'acentos',
    nome: { pt: 'Acentos e Ç', en: 'Accents and Ç' },
    descricao: {
      pt: 'á é ã ç — com o caminho certo para o seu teclado.',
      en: 'á é ã ç — with the right method for your keyboard.',
    },
    licoesPlanejadas: 16,
    licoes: [],
  },
  {
    id: 'pontuacao',
    nome: { pt: 'Pontuação e maiúsculas', en: 'Punctuation and capitals' },
    descricao: {
      pt: 'Vírgula, ponto, Shift — escrever texto de verdade.',
      en: 'Comma, period, Shift — writing real text.',
    },
    licoesPlanejadas: 14,
    licoes: [],
  },
  {
    id: 'teclado-numerico',
    nome: { pt: 'Teclado numérico', en: 'Number pad' },
    descricao: {
      pt: 'O bloco de números à direita, para quem lida com planilhas.',
      en: 'The number pad on the right, for spreadsheet work.',
    },
    licoesPlanejadas: 10,
    licoes: [],
  },
];

/** Quantas lições o programa terá quando estiver completo. */
export const TOTAL_PLANEJADO = TRILHAS.reduce(
  (soma, trilha) => soma + trilha.licoesPlanejadas,
  0
);

/** Uma trilha está disponível quando tem pelo menos uma lição escrita. */
export function trilhaDisponivel(trilha) {
  return trilha.licoes.length > 0;
}

/** Todas as lições existentes, na ordem, com a trilha de cada uma. */
export function todasAsLicoes() {
  return TRILHAS.flatMap((trilha) =>
    trilha.licoes.map((licao) => ({ ...licao, trilha: trilha.id }))
  );
}

/**
 * Acha uma lição pelo id.
 * @param {string} id  ex.: 'base-07'
 */
export function licaoPorId(id) {
  return todasAsLicoes().find((licao) => licao.id === id) ?? null;
}

/** A lição seguinte, ou null se esta for a última que existe. */
export function proximaLicao(id) {
  const todas = todasAsLicoes();
  const posicao = todas.findIndex((licao) => licao.id === id);

  return posicao >= 0 ? (todas[posicao + 1] ?? null) : null;
}

/**
 * As metas de uma lição: as do tipo dela, a não ser que a própria lição
 * traga metas próprias.
 */
export function metasDaLicao(licao) {
  return licao.metas ?? METAS_POR_TIPO[licao.tipo] ?? METAS_POR_TIPO.palavras;
}

/**
 * Todo o texto que uma lição pede para digitar, numa string só.
 * Útil para contar caracteres e para as conferências.
 */
export function textoDaLicao(licao) {
  return licao.conteudo.join(' ');
}
