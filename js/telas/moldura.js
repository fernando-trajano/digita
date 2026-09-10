/* ==========================================================================
   moldura.js — a moldura de três colunas das telas de Início e Trilha.

     esquerda   navegação entre as seções do site
     centro     o conteúdo da tela
     direita    o painel de progresso

   Em telas estreitas vira uma coluna só, nesta ordem: conteúdo, progresso,
   navegação. A navegação vai para o fim porque, num celular, quem chegou já
   sabe onde está — o que ele quer ver primeiro é o conteúdo.

   As duas telas usam esta mesma moldura para que a navegação e o painel
   sejam literalmente o mesmo código, e não duas cópias que um dia divergem.
   ========================================================================== */

import { t } from '../i18n.js';
import { sequencia, estatisticas, totalConcluidas } from '../progresso.js';
import { TOTAL_PLANEJADO } from '../../dados/licoes/indice.js';

/**
 * As seções do site, na ordem do menu.
 * O que ainda não existe aparece marcado como "em breve" — é honesto com
 * quem está visitando e serve de mapa do que vem por aí.
 */
const SECOES = [
  { id: 'inicio', chave: 'nav.inicio' },
  { id: 'trilha', chave: 'nav.trilha' },
  { id: 'treino', chave: 'nav.treino' },
  { id: 'jogos', chave: 'nav.jogos' },
  { id: 'estatisticas', chave: 'nav.estatisticas' },
  { id: 'configuracoes', chave: 'nav.configuracoes' },
];

/**
 * Monta a página inteira de uma tela com moldura.
 *
 * @param {object} opcoes
 * @param {string} opcoes.atual  id da seção aberta
 * @param {Set<string>} opcoes.disponiveis  as seções que já existem
 * @param {string} opcoes.conteudo  o HTML do centro
 * @returns {string}
 */
export function montarMoldura({ atual, disponiveis, conteudo }) {
  return `
    <div class="moldura">
      <main class="moldura-centro">${conteudo}</main>
      <aside class="moldura-progresso">${montarPainel()}</aside>
      <nav class="moldura-navegacao" aria-label="${t('nav.secoes')}">
        ${montarNavegacao(atual, disponiveis)}
      </nav>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   Navegação
   -------------------------------------------------------------------------- */

function montarNavegacao(atual, disponiveis) {
  return `
    <ul class="navegacao">
      ${SECOES.map((secao) => item(secao, atual, disponiveis)).join('')}
    </ul>
  `;
}

function item(secao, atual, disponiveis) {
  const existe = disponiveis.has(secao.id);
  const aberta = secao.id === atual;

  if (!existe) {
    return `
      <li class="navegacao-item navegacao-item--em-breve">
        <span>${t(secao.chave)}</span>
        <span class="selo-pequeno">${t('nav.emBreve')}</span>
      </li>`;
  }

  return `
    <li class="navegacao-item">
      <button type="button" data-secao="${secao.id}"
              ${aberta ? 'aria-current="page"' : ''}>${t(secao.chave)}</button>
    </li>`;
}

/**
 * Liga os botões do menu.
 * @param {HTMLElement} destino
 * @param {(secao: string) => void} aoNavegar
 */
export function ligarNavegacao(destino, aoNavegar) {
  destino.querySelectorAll('[data-secao]').forEach((botao) => {
    botao.addEventListener('click', () => aoNavegar(botao.dataset.secao));
  });
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
