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

   O DESENHO, em duas frases. No cabeçalho de cada trilha, o subtítulo em
   texto deu lugar às TECLAS que ela ensina, cada uma já na cor do dedo que a
   aperta — o mesmo código de cores do teclado da lição, que é onde ele vai
   ser usado. Dentro, as lições são linhas soltas, sem caixa e sem fundo: a
   única coluna à esquerda é o estado (bolinha na de agora, cadeado nas
   trancadas, nada nas feitas), e é ela que mantém todos os nomes alinhados.
   ========================================================================== */

import { t } from '../i18n.js';
import { montarMoldura } from './moldura.js';
import { TRILHAS, trilhaDisponivel, metasDaLicao } from '../../dados/licoes/indice.js';
import { progressoDaLicao, licaoLiberada, licaoParaContinuar } from '../progresso.js';
import { teclaDaLetra } from '../teclado.js';
import { dedoDaTecla } from '../../dados/layouts/dedos.js';

/**
 * Desenha a trilha.
 *
 * @param {HTMLElement} destino
 * @param {object} opcoes
 * @param {(licao: object) => void} opcoes.aoAbrirLicao
 */
export function mostrarTrilha(destino, { aoAbrirLicao }) {
  // A lição que o site ofereceria para continuar é a "de agora" — e a trilha
  // dona dela é a única que nasce aberta.
  const licaoDeAgora = licaoParaContinuar();

  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    montarMoldura({
      conteudo: `
        <h1>${t('trilha.titulo')}</h1>
        <p class="subtitulo">${t('trilha.subtitulo')}</p>

        <div class="trilhas">
          ${TRILHAS.map((trilha) => montarTrilha(trilha, licaoDeAgora)).join('')}
        </div>
      `,
    })
  );

  destino.querySelectorAll('[data-trilha]').forEach((gatilho) => {
    gatilho.addEventListener('click', () => alternar(gatilho));
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
 * Quem manda é o aria-expanded do botão; o data-aberta da seção existe só
 * porque o CSS precisa de um gancho ACIMA do painel, que não é irmão do
 * botão. Os dois são escritos juntos, aqui, para nunca discordarem.
 */
function alternar(gatilho) {
  const aberta = gatilho.getAttribute('aria-expanded') === 'true';

  gatilho.setAttribute('aria-expanded', String(!aberta));
  gatilho.closest('.trilha-bloco').dataset.aberta = String(!aberta);
}

/* --------------------------------------------------------------------------
   Os quatro estados de uma trilha
   -------------------------------------------------------------------------- */

/**
 * @returns {'em-breve'|'concluida'|'atual'|'bloqueada'|'aberta'}
 */
function estadoDaTrilha(trilha, licaoDeAgora) {
  if (!trilhaDisponivel(trilha)) return 'em-breve';
  if (trilha.id === licaoDeAgora?.trilha) return 'atual';

  if (trilha.licoes.every((licao) => progressoDaLicao(licao.id)?.concluida)) {
    return 'concluida';
  }

  // Nem a primeira lição abriu: a trilha inteira ainda está esperando.
  if (!licaoLiberada(trilha.licoes[0].id)) return 'bloqueada';

  return 'aberta';
}

/* --------------------------------------------------------------------------
   Uma trilha
   -------------------------------------------------------------------------- */

function montarTrilha(trilha, licaoDeAgora) {
  const idioma = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';
  const estado = estadoDaTrilha(trilha, licaoDeAgora);

  const cabecalho = `
    <span class="trilha-cabecalho">
      <span class="trilha-nome">${trilha.nome[idioma]}</span>
      ${montarTeclas(trilha)}
    </span>
  `;

  // A "em breve" não é um botão: seria um botão que não faz nada, e o Tab
  // pararia nele à toa.
  if (estado === 'em-breve') {
    return `
      <section class="trilha-bloco trilha-bloco--em-breve">
        <h2 class="trilha-titulo">
          <div class="trilha-gatilho">
            ${cabecalho}
            <span class="trilha-direita trilha-direita--selo">
              <span class="selo-pequeno">${t('nav.emBreve')}</span>
            </span>
          </div>
        </h2>
      </section>
    `;
  }

  const aberta = estado === 'atual';
  const painel = `licoes-${trilha.id}`;
  const concluidas = trilha.licoes.filter((l) => progressoDaLicao(l.id)?.concluida).length;
  const porcentagem = Math.round((concluidas / trilha.licoesPlanejadas) * 100);

  return `
    <section class="trilha-bloco trilha-bloco--${estado}" data-aberta="${aberta}">
      <h2 class="trilha-titulo">
        <button type="button" class="trilha-gatilho" data-trilha="${trilha.id}"
                aria-expanded="${aberta}" aria-controls="${painel}">
          ${cabecalho}

          <span class="trilha-direita">
            ${
              // A trilha concluída não mostra barra: "18 / 18" já diz tudo, e
              // uma barra cheia ao lado disso é repetição. A célula fica
              // vazia para os contadores continuarem numa coluna só.
              estado === 'concluida'
                ? '<span></span>'
                : `<span class="trilha-barra"><span style="width: ${porcentagem}%"></span></span>`
            }
            <span class="trilha-contagem">${concluidas} / ${trilha.licoesPlanejadas}</span>
            <svg class="trilha-seta" aria-hidden="true"><use href="#icone-seta"></use></svg>
          </span>
        </button>
      </h2>

      <div class="trilha-painel" id="${painel}">
        <div class="trilha-painel-interno">
          <ul class="trilha-licoes">
            ${trilha.licoes.map((licao) => montarLicao(licao, licaoDeAgora)).join('')}
          </ul>
        </div>
      </div>
    </section>
  `;
}

/**
 * As teclas da trilha, cada uma na cor do dedo que a aperta.
 *
 * A cor sai do layout brasileiro e do mapa de dedos, e não de uma lista
 * escrita à mão: se um dia a divisão dos dedos mudar, isto muda junto.
 */
function montarTeclas(trilha) {
  if (!trilha.teclas?.length) return '';

  const teclinhas = trilha.teclas
    .map((tecla) => {
      const onde = trilha.teclasSemCor ? null : teclaDaLetra(tecla, 'abnt2');
      const dedo = onde ? dedoDaTecla(onde.codigo)?.dedo : null;

      return `<span class="teclinha${dedo ? ` teclinha--${dedo}` : ''}">${tecla}</span>`;
    })
    .join('');

  // aria-hidden: para o leitor de tela isto seria uma sopa de letras soltas.
  // Quem já tem o nome da trilha não precisa dela.
  return `<span class="trilha-teclas" aria-hidden="true">${teclinhas}</span>`;
}

/* --------------------------------------------------------------------------
   Uma lição
   -------------------------------------------------------------------------- */

/**
 * @returns {'concluida'|'atual'|'bloqueada'|'aberta'}
 */
function estadoDaLicao(licao, licaoDeAgora) {
  if (progressoDaLicao(licao.id)?.concluida) return 'concluida';
  if (licao.id === licaoDeAgora?.id) return 'atual';
  if (!licaoLiberada(licao.id)) return 'bloqueada';

  return 'aberta';
}

function montarLicao(licao, licaoDeAgora) {
  const idioma = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';
  const estado = estadoDaLicao(licao, licaoDeAgora);

  const miolo = `
    ${montarMarca(estado)}
    ${montarEstadoEmTexto(estado)}
    <span class="trilha-licao-nome">${licao.titulo[idioma]}${montarEtiqueta(licao)}</span>
    <span class="trilha-licao-direita">${montarDireita(licao, estado)}</span>
  `;

  // Trancada não é um botão: não há o que clicar, e o cadeado já explica.
  if (estado === 'bloqueada') {
    return `<li><div class="trilha-licao trilha-licao--bloqueada">${miolo}</div></li>`;
  }

  return `
    <li>
      <button type="button" class="trilha-licao trilha-licao--${estado}" data-licao="${licao.id}">
        ${miolo}
      </button>
    </li>`;
}

/** A coluna da esquerda: bolinha, cadeado, ou nada — mas sempre a coluna. */
function montarMarca(estado) {
  if (estado === 'atual') {
    return '<span class="trilha-licao-marca"><span class="trilha-licao-ponto"></span></span>';
  }

  if (estado === 'bloqueada') {
    return `<span class="trilha-licao-marca">
              <svg class="trilha-licao-cadeado" aria-hidden="true"><use href="#icone-cadeado"></use></svg>
            </span>`;
  }

  return '<span class="trilha-licao-marca"></span>';
}

/**
 * A etiqueta das lições que mudam o ritmo da trilha.
 *
 * O desafio é sempre a última lição, e é ele que libera a trilha seguinte —
 * por isso a etiqueta dele vem em texto escuro. É todo o destaque de que
 * precisa: nada de bloco colorido.
 */
function montarEtiqueta(licao) {
  if (licao.tipo === 'revisao') {
    return ` <span class="trilha-licao-etiqueta">${t('trilha.revisao')}</span>`;
  }

  if (licao.tipo === 'desafio') {
    return ` <span class="trilha-licao-etiqueta trilha-licao-etiqueta--final">${t('trilha.desafioFinal')}</span>`;
  }

  return '';
}

/** A direita da linha: "Continuar" na lição de agora, estrelas nas outras. */
function montarDireita(licao, estado) {
  if (estado === 'bloqueada') return '';
  if (estado === 'atual') {
    return `<span class="trilha-licao-continuar">${t('trilha.continuar')}</span>`;
  }

  return montarEstrelas(licao);
}

/** As três estrelas da lição, pequenas. */
function montarEstrelas(licao) {
  const feito = progressoDaLicao(licao.id);
  const ganhas = feito?.estrelas ?? 0;
  const metas = metasDaLicao(licao);

  const rotulo = feito?.concluida
    ? t('resultado.estrelas').replace('{quantas}', ganhas).replace('{total}', 3)
    : t('trilha.aberta');

  let html = `<span class="trilha-licao-estrelas" role="img" aria-label="${rotulo}">`;

  for (let i = 0; i < 3; i += 1) {
    html += `<svg class="estrela estrela--pequena${i < ganhas ? ' estrela--acesa' : ''}" aria-hidden="true">
               <use href="#icone-estrela"></use>
             </svg>`;
  }

  // Guarda a meta de PPM da primeira estrela para quem quiser saber o alvo.
  return `${html}</span><span class="apenas-leitor-de-tela">${metas.estrelas[0]} PPM</span>`;
}

/**
 * O estado da lição em texto, só para quem usa leitor de tela.
 *
 * Na tela, quem conta o estado é o ícone da coluna da esquerda — e ele não
 * enxerga nenhum. A lição apenas aberta fica de fora: o rótulo das estrelas
 * já diz que ela está aberta e não foi concluída.
 */
function montarEstadoEmTexto(estado) {
  const chaves = {
    concluida: 'trilha.estadoConcluida',
    atual: 'trilha.estadoAtual',
    bloqueada: 'trilha.estadoBloqueada',
  };

  if (!chaves[estado]) return '';

  return `<span class="apenas-leitor-de-tela">${t(chaves[estado])}</span>`;
}
