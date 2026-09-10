/* ==========================================================================
   sem-teclado.js — o aviso para quem abre o site no celular ou no tablet.

   O digita. ensina a digitar com os dez dedos num teclado físico. Num
   celular, nada do que ele mostra faz sentido: não há teclas para colorir
   nem dedos para posicionar.

   Em vez de deixar a pessoa se frustrar com uma tela quebrada, ela recebe um
   aviso claro — e um botão para entrar assim mesmo, porque existe tablet com
   teclado acoplado e o palpite do navegador pode errar. Quem decide é sempre
   o usuário.
   ========================================================================== */

import { t } from '../i18n.js';

/**
 * O aparelho parece não ter teclado físico?
 *
 * Não existe uma pergunta direta ("tem teclado?") que os navegadores saibam
 * responder. O que dá para saber é como a pessoa aponta as coisas:
 *   - (hover: none)      → não existe ponteiro pairando: não há mouse
 *   - (pointer: coarse)  → o "ponteiro" é grosso: é um dedo, não um mouse
 * Os dois juntos descrevem um aparelho de toque. É um palpite, não uma
 * certeza — daí o botão de entrar assim mesmo.
 *
 * @returns {boolean}
 */
export function pareceSemTecladoFisico() {
  const semMouse = window.matchMedia('(hover: none)').matches;
  const dedoGordo = window.matchMedia('(pointer: coarse)').matches;

  return semMouse && dedoGordo;
}

/**
 * Desenha o aviso.
 * @param {HTMLElement} destino
 * @param {() => void} aoContinuar  chamado se a pessoa insistir em entrar
 */
export function mostrarAvisoSemTeclado(destino, aoContinuar) {
  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    `
    <div class="sem-teclado">
      <h1>${t('semTeclado.titulo')}</h1>
      <p class="subtitulo">${t('semTeclado.texto')}</p>
      <p class="ajuda">${t('semTeclado.dica')}</p>

      <button type="button" class="botao" data-acao="continuar">
        ${t('semTeclado.continuar')}
      </button>
    </div>
  `
  );

  destino
    .querySelector('[data-acao="continuar"]')
    .addEventListener('click', aoContinuar);
}
