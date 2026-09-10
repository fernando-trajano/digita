/* ==========================================================================
   us.js — o desenho do teclado americano (US, padrão ANSI).

   Mesmas regras do abnt2.js. As diferenças que mais importam:
     - a tecla à direita do L é o ; (no brasileiro, é o Ç)
     - NÃO existe tecla de acento: acentos saem por combinações
       (Mac: Option + E depois E = é · Windows: layout US Internacional)
     - o Enter é uma barra deitada, de uma altura só
     - tem uma tecla a menos em cada fileira de letras
   ========================================================================== */

export const us = {
  id: 'us',
  nome: 'Americano US',

  fileiras: [
    // Fileira dos números
    [
      { codigo: 'Backquote', rotulo: '`', sup: '~' },
      { codigo: 'Digit1', rotulo: '1', sup: '!' },
      { codigo: 'Digit2', rotulo: '2', sup: '@' },
      { codigo: 'Digit3', rotulo: '3', sup: '#' },
      { codigo: 'Digit4', rotulo: '4', sup: '$' },
      { codigo: 'Digit5', rotulo: '5', sup: '%' },
      { codigo: 'Digit6', rotulo: '6', sup: '^' },
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
      { codigo: 'BracketLeft', rotulo: '[', sup: '{' },
      { codigo: 'BracketRight', rotulo: ']', sup: '}' },
      { codigo: 'Backslash', rotulo: '\\', sup: '|', largura: 1.5 },
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
      { codigo: 'Semicolon', rotulo: ';', sup: ':' },
      { codigo: 'Quote', rotulo: "'", sup: '"' },
      { codigo: 'Enter', especial: 'enter', largura: 2.25 },
    ],

    // Fileira de baixo
    [
      { codigo: 'ShiftLeft', especial: 'shift', largura: 2.25 },
      { codigo: 'KeyZ', rotulo: 'Z' },
      { codigo: 'KeyX', rotulo: 'X' },
      { codigo: 'KeyC', rotulo: 'C' },
      { codigo: 'KeyV', rotulo: 'V' },
      { codigo: 'KeyB', rotulo: 'B' },
      { codigo: 'KeyN', rotulo: 'N' },
      { codigo: 'KeyM', rotulo: 'M' },
      { codigo: 'Comma', rotulo: ',', sup: '<' },
      { codigo: 'Period', rotulo: '.', sup: '>' },
      { codigo: 'Slash', rotulo: '/', sup: '?' },
      { codigo: 'ShiftRight', especial: 'shift', largura: 2.75 },
    ],
  ],
};
