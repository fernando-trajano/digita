/* ==========================================================================
   trilha.js — o mapa do programa: as 7 trilhas e as lições de cada uma.

   É aqui que se vê o caminho inteiro: o que já foi feito, o que está aberto
   agora e o que ainda vem. As trilhas sem conteúdo aparecem assim mesmo,
   marcadas como "em breve" — mostrar o programa completo desde o primeiro
   dia é o que dá sentido ao "12 de 100" do painel ao lado.
   ========================================================================== */

import { t } from '../i18n.js';
import { montarMoldura, ligarNavegacao } from './moldura.js';
import { TRILHAS, trilhaDisponivel, metasDaLicao } from '../../dados/licoes/indice.js';
import { progressoDaLicao, licaoLiberada } from '../progresso.js';

/**
 * Desenha a trilha.
 *
 * @param {HTMLElement} destino
 * @param {object} opcoes
 * @param {(licao: object) => void} opcoes.aoAbrirLicao
 * @param {(secao: string) => void} opcoes.aoNavegar
 * @param {Set<string>} opcoes.secoesDisponiveis
 */
export function mostrarTrilha(destino, { aoAbrirLicao, aoNavegar, secoesDisponiveis }) {
  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    montarMoldura({
      atual: 'trilha',
      disponiveis: secoesDisponiveis,
      conteudo: `
        <h1>${t('trilha.titulo')}</h1>
        <p class="subtitulo">${t('trilha.subtitulo')}</p>
        ${TRILHAS.map(montarTrilha).join('')}
      `,
    })
  );

  ligarNavegacao(destino, aoNavegar);

  destino.querySelectorAll('[data-licao]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const licao = TRILHAS.flatMap((trilha) => trilha.licoes).find(
        (l) => l.id === botao.dataset.licao
      );

      if (licao) aoAbrirLicao(licao);
    });
  });
}

/* --------------------------------------------------------------------------
   Uma trilha
   -------------------------------------------------------------------------- */

function montarTrilha(trilha) {
  const idioma = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';
  const disponivel = trilhaDisponivel(trilha);
  const concluidas = trilha.licoes.filter((licao) => progressoDaLicao(licao.id)?.concluida).length;

  return `
    <section class="secao trilha-bloco${disponivel ? '' : ' trilha-bloco--em-breve'}">
      <div class="trilha-cabecalho">
        <div>
          <h2>${trilha.nome[idioma]}</h2>
          <p class="ajuda">${trilha.descricao[idioma]}</p>
        </div>

        ${
          disponivel
            ? `<p class="trilha-contagem">${concluidas} / ${trilha.licoesPlanejadas}</p>`
            : `<span class="selo-pequeno">${t('nav.emBreve')}</span>`
        }
      </div>

      ${
        disponivel
          ? `<ul class="licoes">${trilha.licoes.map(montarLicao).join('')}</ul>`
          : `<p class="ajuda">${t('trilha.planejadas').replace('{quantas}', trilha.licoesPlanejadas)}</p>`
      }
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
