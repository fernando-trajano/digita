/* ==========================================================================
   dedos.js — qual dedo aperta cada tecla.

   As teclas são identificadas pelo CÓDIGO FÍSICO (KeyboardEvent.code), não
   pela letra. "KeyA" é sempre a tecla à esquerda do S, em qualquer teclado do
   mundo — no ABNT2 ela escreve "a" e no francês AZERTY escreveria "q".
   É por isso que o mesmo mapa de dedos serve para os dois layouts.

   A divisão é a do método de datilografia tradicional: cada dedo cuida de
   uma coluna do teclado, e os dois polegares dividem a barra de espaço.
   ========================================================================== */

/** Nomes dos dedos, iguais aos usados nas cores do tema.css. */
export const DEDOS = ['minimo', 'anelar', 'medio', 'indicador', 'polegar'];

/**
 * Código físico da tecla → mão e dedo.
 * Teclas que não aparecem aqui (Alt, Command, setas…) são "neutras": ficam
 * cinza e nenhuma lição pede que sejam apertadas.
 */
const MAPA = {
  // --- Mão esquerda ------------------------------------------------------
  // Mínimo: a coluna do A, mais tudo que fica à esquerda dele.
  Backquote: ['esquerda', 'minimo'],
  Digit1: ['esquerda', 'minimo'],
  KeyQ: ['esquerda', 'minimo'],
  KeyA: ['esquerda', 'minimo'],
  KeyZ: ['esquerda', 'minimo'],
  Tab: ['esquerda', 'minimo'],
  CapsLock: ['esquerda', 'minimo'],
  ShiftLeft: ['esquerda', 'minimo'],
  ControlLeft: ['esquerda', 'minimo'],
  IntlBackslash: ['esquerda', 'minimo'], // tecla \ | à esquerda do Z (ABNT2)

  // Anelar: a coluna do S.
  Digit2: ['esquerda', 'anelar'],
  KeyW: ['esquerda', 'anelar'],
  KeyS: ['esquerda', 'anelar'],
  KeyX: ['esquerda', 'anelar'],

  // Médio: a coluna do D.
  Digit3: ['esquerda', 'medio'],
  KeyE: ['esquerda', 'medio'],
  KeyD: ['esquerda', 'medio'],
  KeyC: ['esquerda', 'medio'],

  // Indicador: duas colunas, a do F e a do G.
  Digit4: ['esquerda', 'indicador'],
  Digit5: ['esquerda', 'indicador'],
  KeyR: ['esquerda', 'indicador'],
  KeyT: ['esquerda', 'indicador'],
  KeyF: ['esquerda', 'indicador'],
  KeyG: ['esquerda', 'indicador'],
  KeyV: ['esquerda', 'indicador'],
  KeyB: ['esquerda', 'indicador'],

  // --- Mão direita -------------------------------------------------------
  // Indicador: as colunas do J e do H.
  Digit6: ['direita', 'indicador'],
  Digit7: ['direita', 'indicador'],
  KeyY: ['direita', 'indicador'],
  KeyU: ['direita', 'indicador'],
  KeyH: ['direita', 'indicador'],
  KeyJ: ['direita', 'indicador'],
  KeyN: ['direita', 'indicador'],
  KeyM: ['direita', 'indicador'],

  // Médio: a coluna do K.
  Digit8: ['direita', 'medio'],
  KeyI: ['direita', 'medio'],
  KeyK: ['direita', 'medio'],
  Comma: ['direita', 'medio'],

  // Anelar: a coluna do L.
  Digit9: ['direita', 'anelar'],
  KeyO: ['direita', 'anelar'],
  KeyL: ['direita', 'anelar'],
  Period: ['direita', 'anelar'],

  // Mínimo: a tecla à direita do L (Ç no ABNT2, ; no americano) e tudo que
  // vem depois dela.
  Digit0: ['direita', 'minimo'],
  Minus: ['direita', 'minimo'],
  Equal: ['direita', 'minimo'],
  KeyP: ['direita', 'minimo'],
  BracketLeft: ['direita', 'minimo'],
  BracketRight: ['direita', 'minimo'],
  Backslash: ['direita', 'minimo'],
  Semicolon: ['direita', 'minimo'],
  Quote: ['direita', 'minimo'],
  Slash: ['direita', 'minimo'],
  IntlRo: ['direita', 'minimo'], // tecla / ? à direita do ; (ABNT2)
  Enter: ['direita', 'minimo'],
  Backspace: ['direita', 'minimo'],
  ShiftRight: ['direita', 'minimo'],

  // --- Polegares ---------------------------------------------------------
  Space: ['ambas', 'polegar'],
};

/**
 * Descobre a mão e o dedo de uma tecla.
 * @param {string} codigo  ex.: 'KeyF'
 * @returns {{ mao: string, dedo: string } | null}  null = tecla neutra
 */
export function dedoDaTecla(codigo) {
  const encontrado = MAPA[codigo];
  if (!encontrado) return null;

  return { mao: encontrado[0], dedo: encontrado[1] };
}

/**
 * As teclas onde os indicadores descansam. Elas têm um risquinho em relevo no
 * teclado de verdade, para você achar a posição inicial sem olhar — e por isso
 * ganham uma marca também no teclado da tela.
 */
export const TECLAS_DE_REFERENCIA = ['KeyF', 'KeyJ'];
