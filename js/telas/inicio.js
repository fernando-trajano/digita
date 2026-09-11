/* ==========================================================================
   inicio.js — a tela de quem volta.

   Ela responde uma pergunta só, e rápido: "o que eu faço agora?". Por isso
   o botão de continuar vem antes de tudo, já dizendo qual é a próxima lição
   — ninguém deveria precisar procurar onde parou.

   O resto da tela é mapa: os atalhos para as seções, e o que ainda está por
   vir marcado como "em breve".
   ========================================================================== */

import { t } from '../i18n.js';
import { config, sistemaAtual } from '../estado.js';
import { montarMoldura, ligarNavegacao } from './moldura.js';
import { TRILHAS } from '../../dados/licoes/indice.js';
import { licaoParaContinuar, progressoDaLicao, totalConcluidas } from '../progresso.js';

/** As seções que aparecem como atalho, na ordem. */
const ATALHOS = [
  { id: 'trilha', chave: 'nav.trilha', descricao: 'inicio.atalhoTrilha' },
  { id: 'treino', chave: 'nav.treino', descricao: 'inicio.atalhoTreino' },
  { id: 'jogos', chave: 'nav.jogos', descricao: 'inicio.atalhoJogos' },
  { id: 'estatisticas', chave: 'nav.estatisticas', descricao: 'inicio.atalhoEstatisticas' },
];

/**
 * Desenha a tela inicial.
 *
 * @param {HTMLElement} destino
 * @param {object} opcoes
 * @param {(licao: object) => void} opcoes.aoContinuar
 * @param {(secao: string) => void} opcoes.aoNavegar
 * @param {() => void} opcoes.aoTrocarTeclado
 * @param {Set<string>} opcoes.secoesDisponiveis
 */
export function mostrarInicio(destino, { aoContinuar, aoNavegar, aoTrocarTeclado, secoesDisponiveis }) {
  const idioma = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';
  const licao = licaoParaContinuar();
  const trilha = TRILHAS.find((t_) => t_.licoes.some((l) => l.id === licao.id));
  const comecou = totalConcluidas() > 0;

  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    montarMoldura({
      atual: 'inicio',
      disponiveis: secoesDisponiveis,
      conteudo: `
        <h1>${comecou ? t('inicio.deVolta') : t('inicio.primeiraVez')}</h1>

        <section class="secao inicio-continuar">
          <p class="ajuda">${comecou ? t('inicio.paradoEm') : t('inicio.comecarPor')}</p>
          <h2>${licao.titulo[idioma]}</h2>
          <p class="subtitulo">${trilha ? trilha.nome[idioma] : ''}${
            progressoDaLicao(licao.id) ? ` · ${t('inicio.jaTentada')}` : ''
          }</p>

          <button type="button" class="botao botao--principal" data-acao="continuar">
            ${comecou ? t('inicio.continuar') : t('inicio.comecar')}
          </button>
        </section>

        <section class="secao">
          <h2>${t('inicio.atalhos')}</h2>
          <ul class="atalhos">
            ${ATALHOS.map((atalho) => montarAtalho(atalho, secoesDisponiveis)).join('')}
          </ul>
        </section>

        <section class="secao">
          <h2>${t('inicio.seuTeclado')}</h2>
          <p class="subtitulo">${nomeDoTeclado()}</p>
          <button type="button" class="botao" data-acao="trocar-teclado">
            ${t('inicio.trocarTeclado')}
          </button>
        </section>
      `,
    })
  );

  ligarNavegacao(destino, aoNavegar);

  destino
    .querySelector('[data-acao="continuar"]')
    .addEventListener('click', () => aoContinuar(licao));

  destino
    .querySelector('[data-acao="trocar-teclado"]')
    .addEventListener('click', aoTrocarTeclado);

  destino.querySelectorAll('[data-atalho]').forEach((botao) => {
    botao.addEventListener('click', () => aoNavegar(botao.dataset.atalho));
  });
}

/* --------------------------------------------------------------------------
   Pedaços
   -------------------------------------------------------------------------- */

function montarAtalho(atalho, disponiveis) {
  const existe = disponiveis.has(atalho.id);

  if (!existe) {
    return `
      <li>
        <div class="atalho atalho--em-breve">
          <span class="atalho-nome">${t(atalho.chave)}</span>
          <span class="atalho-descricao">${t(atalho.descricao)}</span>
          <span class="selo-pequeno">${t('nav.emBreve')}</span>
        </div>
      </li>`;
  }

  return `
    <li>
      <button type="button" class="atalho" data-atalho="${atalho.id}">
        <span class="atalho-nome">${t(atalho.chave)}</span>
        <span class="atalho-descricao">${t(atalho.descricao)}</span>
      </button>
    </li>`;
}

/** "Americano US · Mac" — o que está valendo agora. */
function nomeDoTeclado() {
  const layout = config().layout === 'abnt2' ? t('teclado.abnt2') : t('teclado.us');
  const sistema = sistemaAtual() === 'mac' ? t('teclado.mac') : t('teclado.windows');

  return `${layout} · ${sistema}`;
}
