/* ==========================================================================
   moldura.js — a moldura de duas colunas das telas de Início e Trilha.

     centro   o conteúdo da tela
     direita  o painel de progresso

   Em telas estreitas vira uma coluna só: conteúdo e, abaixo, progresso.

   Não há menu lateral: a navegação acontece pelos atalhos no meio da tela
   inicial e pela marca "digita." no cabeçalho, que sempre volta para o
   início. Um menu repetindo esses mesmos caminhos só ocuparia espaço.

   As duas telas usam esta mesma moldura para o painel ser literalmente o
   mesmo código, e não duas cópias que um dia divergem.
   ========================================================================== */

import { t } from '../i18n.js';
import { sequencia, estatisticas, totalConcluidas } from '../progresso.js';
import { TOTAL_PLANEJADO } from '../../dados/licoes/indice.js';

/**
 * Monta a página inteira de uma tela com moldura.
 *
 * @param {object} opcoes
 * @param {string} opcoes.conteudo  o HTML do centro
 * @returns {string}
 */
export function montarMoldura({ conteudo }) {
  return `
    <div class="moldura">
      <main class="moldura-centro">${conteudo}</main>
      <aside class="moldura-progresso">${montarPainel()}</aside>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   Painel de progresso
   -------------------------------------------------------------------------- */

function montarPainel() {
  const dias = sequencia().dias;
  const concluidas = totalConcluidas();
  const porcentagem = Math.round((concluidas / TOTAL_PLANEJADO) * 100);

  return `
    <h2 class="painel-titulo">${t('painel.titulo')}</h2>

    <div class="painel-bloco">
      <p class="painel-numero">${dias}</p>
      <p class="ajuda">${dias === 1 ? t('painel.dia') : t('painel.dias')}</p>
    </div>

    <div class="painel-bloco">
      <p class="painel-numero">${concluidas}<span class="painel-de"> / ${TOTAL_PLANEJADO}</span></p>
      <p class="ajuda">${t('painel.licoesConcluidas')}</p>
      <div class="barra"><span style="width: ${porcentagem}%"></span></div>
    </div>

    <div class="painel-bloco">
      <h3 class="painel-subtitulo">${t('painel.errosTitulo')}</h3>
      ${montarTeclasErradas()}
    </div>
  `;
}

/** As teclas que mais deram erro, somando todas as lições já feitas. */
function montarTeclasErradas() {
  const erros = Object.entries(estatisticas().errosPorTecla)
    .map(([tecla, vezes]) => ({ tecla, vezes }))
    .sort((a, b) => b.vezes - a.vezes)
    .slice(0, 5);

  if (erros.length === 0) return `<p class="ajuda">${t('painel.semErros')}</p>`;

  return `
    <ul class="erros">
      ${erros
        .map(
          ({ tecla, vezes }) => `
        <li class="erro">
          <span class="erro-tecla">${tecla === ' ' ? t('teclas.espaco') : tecla}</span>
          <span class="erro-vezes">${vezes}×</span>
        </li>`
        )
        .join('')}
    </ul>`;
}
