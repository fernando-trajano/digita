/* ==========================================================================
   abnt2.js — o desenho do teclado brasileiro (ABNT2).

   Cada tecla tem:
     codigo    o código físico (KeyboardEvent.code) — a identidade da tecla
     rotulo    o que está escrito nela
     sup       o segundo símbolo, o que sai com Shift (fica menor, em cima)
     largura   quantas teclas normais ela ocupa (1 = tecla comum)
     especial  nome interno das teclas de comando (Tab, Enter…), cujo texto
               muda conforme o sistema ser Windows ou Mac
     alta      só o Enter do ABNT2: ele é aquele "L" deitado, de duas alturas

   A última fileira (Ctrl, Alt, espaço…) NÃO está aqui: ela muda conforme o
   sistema, não conforme o layout, e é montada pelo js/teclado.js.

   As diferenças que importam para quem escreve em português:
     - a tecla à direita do L é o Ç (no americano, é o ;)
     - existe uma tecla só para o acento agudo (´) e a crase (`)
     - existe uma tecla só para o til (~) e o circunflexo (^)
   ========================================================================== */

export const abnt2 = {
  id: 'abnt2',
  nome: 'Brasileiro ABNT2',

  fileiras: [
    // Fileira dos números
    [
      { codigo: 'Backquote', rotulo: "'", sup: '"' },
      { codigo: 'Digit1', rotulo: '1', sup: '!' },
      { codigo: 'Digit2', rotulo: '2', sup: '@' },
      { codigo: 'Digit3', rotulo: '3', sup: '#' },
      { codigo: 'Digit4', rotulo: '4', sup: '$' },
      { codigo: 'Digit5', rotulo: '5', sup: '%' },
      { codigo: 'Digit6', rotulo: '6', sup: '¨' },
      { codigo: 'Digit7', rotulo: '7', sup: '&' },
      { codigo: 'Digit8', rotulo: '8', sup: '*' },
      { codigo: 'Digit9', rotulo: '9', sup: '(' },
      { codigo: 'Digit0', rotulo: '0', sup: ')' },
      { codigo: 'Minus', rotulo: '-', sup: '_' },
      { codigo: 'Equal', rotulo: '=', sup: '+' },
      { codigo: 'Backspace', especial: 'backspace', largura: 2 },
    ],

    // Fileira de cima
    [
      { codigo: 'Tab', especial: 'tab', largura: 1.5 },
      { codigo: 'KeyQ', rotulo: 'Q' },
      { codigo: 'KeyW', rotulo: 'W' },
      { codigo: 'KeyE', rotulo: 'E' },
      { codigo: 'KeyR', rotulo: 'R' },
      { codigo: 'KeyT', rotulo: 'T' },
      { codigo: 'KeyY', rotulo: 'Y' },
      { codigo: 'KeyU', rotulo: 'U' },
      { codigo: 'KeyI', rotulo: 'I' },
      { codigo: 'KeyO', rotulo: 'O' },
      { codigo: 'KeyP', rotulo: 'P' },
      { codigo: 'BracketLeft', rotulo: '´', sup: '`' },
      { codigo: 'BracketRight', rotulo: '[', sup: '{' },
    ],

    // Fileira base — a posição de descanso das mãos
    [
      { codigo: 'CapsLock', especial: 'capsLock', largura: 1.75 },
      { codigo: 'KeyA', rotulo: 'A' },
      { codigo: 'KeyS', rotulo: 'S' },
      { codigo: 'KeyD', rotulo: 'D' },
      { codigo: 'KeyF', rotulo: 'F' },
      { codigo: 'KeyG', rotulo: 'G' },
      { codigo: 'KeyH', rotulo: 'H' },
      { codigo: 'KeyJ', rotulo: 'J' },
      { codigo: 'KeyK', rotulo: 'K' },
      { codigo: 'KeyL', rotulo: 'L' },
      { codigo: 'Semicolon', rotulo: 'Ç' },
      { codigo: 'Quote', rotulo: '~', sup: '^' },
      { codigo: 'Backslash', rotulo: ']', sup: '}' },
      { codigo: 'Enter', especial: 'enter', largura: 1.25, alta: true },
    ],

    // Fileira de baixo
    [
      { codigo: 'ShiftLeft', especial: 'shift', largura: 1.25 },
      { codigo: 'IntlBackslash', rotulo: '\\', sup: '|' },
      { codigo: 'KeyZ', rotulo: 'Z' },
      { codigo: 'KeyX', rotulo: 'X' },
      { codigo: 'KeyC', rotulo: 'C' },
      { codigo: 'KeyV', rotulo: 'V' },
      { codigo: 'KeyB', rotulo: 'B' },
      { codigo: 'KeyN', rotulo: 'N' },
      { codigo: 'KeyM', rotulo: 'M' },
      { codigo: 'Comma', rotulo: ',', sup: '<' },
      { codigo: 'Period', rotulo: '.', sup: '>' },
      { codigo: 'Slash', rotulo: ';', sup: ':' },
      { codigo: 'IntlRo', rotulo: '/', sup: '?' },
      { codigo: 'ShiftRight', especial: 'shift', largura: 1.75 },
    ],
  ],
};
