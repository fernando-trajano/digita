/* ==========================================================================
   trilha.js — o mapa do programa: as 7 trilhas e as lições de cada uma.

   É aqui que se vê o caminho inteiro: o que já foi feito, o que está aberto
   agora e o que ainda vem. As trilhas sem conteúdo aparecem assim mesmo,
   marcadas como "em breve" — mostrar o programa completo desde o primeiro
   dia é o que dá sentido ao "12 de 100" do painel ao lado.

   As trilhas abrem e fecham, como a lista de episódios de uma temporada.
   Com cem lições, deixar todas abertas daria uma página que ninguém rola até
   o fim; fechadas, o programa inteiro cabe numa tela e a trilha de agora
   está logo ali, já aberta.
   ========================================================================== */

import { t } from '../i18n.js';
import { montarMoldura } from './moldura.js';
import { TRILHAS, trilhaDisponivel, metasDaLicao } from '../../dados/licoes/indice.js';
import { progressoDaLicao, licaoLiberada, licaoParaContinuar } from '../progresso.js';

/**
 * Desenha a trilha.
 *
 * @param {HTMLElement} destino
 * @param {object} opcoes
 * @param {(licao: object) => void} opcoes.aoAbrirLicao
 */
export function mostrarTrilha(destino, { aoAbrirLicao }) {
  // A trilha de agora é a dona da lição que o site ofereceria para continuar.
  // É a única que nasce aberta: as concluídas e as que ainda vêm ficam
  // fechadas, à espera de um clique.
  const trilhaDeAgora = licaoParaContinuar()?.trilha ?? null;

  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    montarMoldura({
      conteudo: `
        <h1>${t('trilha.titulo')}</h1>
        <p class="subtitulo">${t('trilha.subtitulo')}</p>
        ${TRILHAS.map((trilha) => montarTrilha(trilha, trilhaDeAgora)).join('')}
      `,
    })
  );

  destino.querySelectorAll('[data-trilha]').forEach((gatilho) => {
    gatilho.addEventListener('click', () => alternar(destino, gatilho));
  });

  destino.querySelectorAll('[data-licao]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const licao = TRILHAS.flatMap((trilha) => trilha.licoes).find(
        (l) => l.id === botao.dataset.licao
      );

      if (licao) aoAbrirLicao(licao);
    });
  });
}

/**
 * Abre ou fecha uma trilha.
 *
 * Quem manda é o aria-expanded do botão, e não uma variável à parte: o que o
 * leitor de tela anuncia e o que se vê na tela saem do mesmo lugar, e não há
 * como um ficar dizendo "aberta" enquanto o outro está fechado.
 */
function alternar(destino, gatilho) {
  const aberta = gatilho.getAttribute('aria-expanded') === 'true';

  gatilho.setAttribute('aria-expanded', String(!aberta));
  destino.querySelector(`#${gatilho.getAttribute('aria-controls')}`).hidden = aberta;
}

/* --------------------------------------------------------------------------
   Uma trilha
   -------------------------------------------------------------------------- */

function montarTrilha(trilha, trilhaDeAgora) {
  const idioma = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';
  const disponivel = trilhaDisponivel(trilha);
  const concluidas = trilha.licoes.filter((licao) => progressoDaLicao(licao.id)?.concluida).length;

  // Uma trilha "em breve" não abre porque não há o que mostrar dentro dela.
  // Ela não é um botão: seria um botão que não faz nada, e o teclado pararia
  // nele à toa.
  if (!disponivel) {
    return `
      <section class="secao trilha-bloco trilha-bloco--em-breve">
        <div class="trilha-cabecalho">
          <div>
            <h2>${trilha.nome[idioma]}</h2>
            <p class="ajuda">${trilha.descricao[idioma]}</p>
          </div>

          <span class="selo-pequeno">${t('nav.emBreve')}</span>
        </div>

        <p class="ajuda">${t('trilha.planejadas').replace('{quantas}', trilha.licoesPlanejadas)}</p>
      </section>
    `;
  }

  const aberta = trilha.id === trilhaDeAgora;
  const painel = `licoes-${trilha.id}`;

  return `
    <section class="secao trilha-bloco">
      <h2 class="trilha-titulo">
        <button type="button" class="trilha-gatilho" data-trilha="${trilha.id}"
                aria-expanded="${aberta}" aria-controls="${painel}">
          <span class="trilha-cabecalho">
            <span>
              <span class="trilha-nome">${trilha.nome[idioma]}</span>
              <span class="ajuda">${trilha.descricao[idioma]}</span>
            </span>

            <span class="trilha-contagem">${concluidas} / ${trilha.licoesPlanejadas}</span>
          </span>

          <svg class="trilha-seta" aria-hidden="true"><use href="#icone-seta"></use></svg>
        </button>
      </h2>

      <div id="${painel}"${aberta ? '' : ' hidden'}>
        <ul class="licoes">${trilha.licoes.map(montarLicao).join('')}</ul>
      </div>
    </section>
  `;
}

/* --------------------------------------------------------------------------
   Uma lição
   -------------------------------------------------------------------------- */

function montarLicao(licao, indice) {
  const idioma = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';
  const feito = progressoDaLicao(licao.id);
  const liberada = licaoLiberada(licao.id);
  const numero = String(indice + 1).padStart(2, '0');

  // Trancada: não é um botão, porque não há o que clicar. O cadeado explica
  // o motivo sem precisar de um aviso.
  if (!liberada) {
    return `
      <li>
        <div class="licao-cartao licao-cartao--trancada">
          <span class="licao-numero">${numero}</span>
          <span class="licao-titulo">${licao.titulo[idioma]}</span>
          <span class="licao-estado">${t('trilha.trancada')}</span>
        </div>
      </li>`;
  }

  return `
    <li>
      <button type="button" class="licao-cartao${feito?.concluida ? ' licao-cartao--concluida' : ''}"
              data-licao="${licao.id}">
        <span class="licao-numero">${numero}</span>
        <span class="licao-titulo">${licao.titulo[idioma]}</span>
        ${montarEstrelas(licao, feito)}
      </button>
    </li>`;
}

/** As três estrelas da lição, pequenas. */
function montarEstrelas(licao, feito) {
  const ganhas = feito?.estrelas ?? 0;
  const metas = metasDaLicao(licao);

  const rotulo = feito?.concluida
    ? t('resultado.estrelas').replace('{quantas}', ganhas).replace('{total}', 3)
    : t('trilha.aberta');

  let html = `<span class="licao-estrelas" role="img" aria-label="${rotulo}">`;

  for (let i = 0; i < 3; i += 1) {
    html += `<svg class="estrela estrela--pequena${i < ganhas ? ' estrela--acesa' : ''}" aria-hidden="true">
               <use href="#icone-estrela"></use>
             </svg>`;
  }

  // Guarda a meta de PPM da primeira estrela para quem quiser saber o alvo.
  return `${html}</span><span class="apenas-leitor-de-tela">${metas.estrelas[0]} PPM</span>`;
}
