/* ==========================================================================
   estatisticas.js — o que as lições, o treino livre e os jogos contam sobre
   a digitação de quem treina.

   Três seções empilhadas, separadas por linha fina, e nada além delas:

     evolução          a curva de PPM e de precisão, sessão por sessão
                       (digita:historico — lições e treino livre)
     mapa de calor     o teclado das lições, cada tecla na cor do seu dedo,
                       mais forte quanto mais erro (digita:estatisticas,
                       porTecla — lições, treino livre e jogos)
     precisão por dedo uma barra por dedo, das mesmas contas

   E dois estados que não aparecem por acidente:

     vazio             nada ainda: uma frase e o caminho para treinar
     pouco             menos de 3 sessões: o mapa e os dedos aparecem, mas
                       no lugar da curva fica uma linha — dois pontos não
                       dizem nada
   ========================================================================== */

import { t, idioma, nomeDoDedo } from '../i18n.js';
import { config, sistemaAtual } from '../estado.js';
import { historico, estatisticas } from '../progresso.js';
import { desenharTeclado, passosDaLetra } from '../teclado.js';
import { dedoDaTecla } from '../../dados/layouts/dedos.js';
import { abnt2 } from '../../dados/layouts/abnt2.js';
import { us } from '../../dados/layouts/us.js';

/* --------------------------------------------------------------------------
   AS REGRAS DA TELA, em números.
   -------------------------------------------------------------------------- */

/** Abaixo disto, a curva de evolução não é desenhada: dois pontos não dizem nada. */
const SESSOES_PARA_A_CURVA = 3;

/**
 * A taxa de erro que deixa a tecla SÓLIDA no mapa de calor. Abaixo dela, a
 * cor sobe em linha reta a partir de quase transparente. É uma escala fixa,
 * e não relativa à pior tecla: quem erra pouco vê um teclado claro, e isso
 * é informação também.
 */
const TAXA_SOLIDA = 0.12;

/** A opacidade de uma tecla com dados e sem erro nenhum: quase transparente. */
const CALOR_MINIMO = 0.08;

/**
 * Com menos toques que isto, a taxa não é calculada: uma tecla apertada
 * duas vezes, com um erro, teria "50% de erro" — e não quer dizer nada.
 * Ela fica neutra, e a linha de baixo diz que ainda é pouco.
 */
const TOQUES_MINIMOS = 10;

/** Os períodos do gráfico, em dias. Zero é "tudo". */
const PERIODOS = [7, 30, 0];

/** O período escolhido. Fica guardado enquanto o site está aberto. */
let periodo = 30;

/** O redesenho do gráfico quando a janela muda de tamanho. */
let aoRedimensionar = null;

/* ==========================================================================
   Para o app.js
   ========================================================================== */

/** Desliga o que a tela deixa ligado ao sair dela: o vigia do tamanho. */
export function encerrarEstatisticas() {
  if (aoRedimensionar) window.removeEventListener('resize', aoRedimensionar);
  aoRedimensionar = null;
}

/**
 * Desenha a tela de estatísticas.
 *
 * @param {HTMLElement} destino
 * @param {{aoTreinar: () => void}} opcoes  o botão da tela vazia
 */
export function mostrarEstatisticas(destino, { aoTreinar }) {
  encerrarEstatisticas();

  const sessoes = historico();
  const { porTecla = {} } = estatisticas();
  const semNada = sessoes.length === 0 && Object.keys(porTecla).length === 0;

  destino.replaceChildren();

  if (semNada) {
    mostrarVazia(destino, aoTreinar);
    return;
  }

  destino.insertAdjacentHTML(
    'beforeend',
    `
      <div class="estat">
        <h1>${t('estatisticas.titulo')}</h1>
        <p class="subtitulo">${t('estatisticas.subtitulo')}</p>

        <section class="secao" data-papel="evolucao"></section>
        <section class="secao" data-papel="calor"></section>
        <section class="secao" data-papel="dedos"></section>
      </div>
    `
  );

  const teclas = teclasDoTeclado(porTecla);

  montarEvolucao(destino.querySelector('[data-papel="evolucao"]'), sessoes);
  montarCalor(destino.querySelector('[data-papel="calor"]'), teclas);
  montarDedos(destino.querySelector('[data-papel="dedos"]'), teclas);
}

/* --------------------------------------------------------------------------
   A tela vazia — de propósito, e não por acidente.

   Quem acabou de chegar não tem nada para ver. Nada de gráfico sem linha,
   eixo sem número ou teclado todo apagado: uma frase e o caminho para
   treinar.
   -------------------------------------------------------------------------- */

function mostrarVazia(destino, aoTreinar) {
  destino.insertAdjacentHTML(
    'beforeend',
    `
      <div class="estat">
        <h1>${t('estatisticas.titulo')}</h1>
        <div class="estat-vazia">
          <p>${t('estatisticas.vazio')}</p>
          <button type="button" class="botao botao--principal" data-acao="treinar">
            ${t('estatisticas.irTreinar')}
          </button>
        </div>
      </div>
    `
  );

  destino.querySelector('[data-acao="treinar"]').addEventListener('click', aoTreinar);
}

/* ==========================================================================
   Formatação
   ========================================================================== */

const localidade = () => (idioma() === 'pt' ? 'pt-BR' : 'en-US');

/** "18 set" / "Sep 18" — a ordem e os meses vêm das traduções. */
function formatarDia(data) {
  const mes = t('estatisticas.meses').split(',')[data.getMonth()];
  return t('estatisticas.dia').replace('{dia}', data.getDate()).replace('{mes}', mes);
}

/**
 * "12,5" — sempre com uma casa: numa coluna de porcentagens, "89" ao lado
 * de "96,4" parece erro.
 */
const formatarDecimal = (numero) =>
  numero.toLocaleString(localidade(), { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const formatarInteiro = (numero) => numero.toLocaleString(localidade());

/* ==========================================================================
   1. EVOLUÇÃO
   ========================================================================== */

function montarEvolucao(secao, sessoes) {
  secao.insertAdjacentHTML('beforeend', `<h2>${t('estatisticas.evolucao')}</h2>`);

  // Com poucas sessões, uma linha no lugar do gráfico — e mais nada.
  if (sessoes.length < SESSOES_PARA_A_CURVA) {
    const quantas = sessoes.length === 1 ? t('estatisticas.uma') : sessoes.length;

    secao.insertAdjacentHTML(
      'beforeend',
      `<p class="estat-aviso">${t('estatisticas.poucasSessoes')
        .replace('{minimo}', SESSOES_PARA_A_CURVA)
        .replace('{quantas}', quantas)}</p>`
    );
    return;
  }

  // Os três números valem para o histórico inteiro, e não para o período:
  // "melhor" e "no total" não mudam por olhar uma janela menor.
  const melhor = Math.max(...sessoes.map((s) => s.ppm));
  const ultimas = sessoes.slice(-10);
  const media = Math.round(ultimas.reduce((soma, s) => soma + s.ppm, 0) / ultimas.length);

  secao.insertAdjacentHTML(
    'beforeend',
    `
      <div class="estat-numeros">
        <span><strong>${melhor}</strong>${t('estatisticas.melhorPpm')}</span>
        <span><strong>${media}</strong>${t('estatisticas.mediaUltimas').replace('{quantas}', ultimas.length)}</span>
        <span><strong>${sessoes.length}</strong>${t(sessoes.length === 1 ? 'estatisticas.sessaoNoTotal' : 'estatisticas.sessoesNoTotal')}</span>
      </div>

      <div class="estat-controles">
        <div class="estat-periodos" role="group" aria-label="${t('estatisticas.periodo')}">
          ${PERIODOS.map(
            (dias) => `
            <button type="button" class="estat-periodo" data-periodo="${dias}"
                    aria-pressed="${dias === periodo}">${
                      dias ? t('estatisticas.dias').replace('{quantos}', dias) : t('estatisticas.tudo')
                    }</button>`
          ).join('')}
        </div>

        <div class="estat-legenda" aria-hidden="true">
          <span class="legenda-ppm">${t('estatisticas.ppm')}</span>
          <span class="legenda-precisao">${t('estatisticas.precisao')}</span>
        </div>
      </div>

      <div data-papel="grafico"></div>
    `
  );

  const lugar = secao.querySelector('[data-papel="grafico"]');

  for (const botao of secao.querySelectorAll('[data-periodo]')) {
    botao.addEventListener('click', () => {
      periodo = Number(botao.dataset.periodo);
      for (const outro of secao.querySelectorAll('[data-periodo]')) {
        outro.setAttribute('aria-pressed', String(outro === botao));
      }
      desenharGrafico(lugar, sessoes);
    });
  }

  desenharGrafico(lugar, sessoes);

  // O desenho tem o tamanho real da tela: se a janela muda, ele é refeito.
  aoRedimensionar = () => desenharGrafico(lugar, sessoes);
  window.addEventListener('resize', aoRedimensionar);
}

/**
 * O gráfico de linha, em SVG desenhado à mão.
 *
 * Duas linhas na mesma caixa, cada uma com a sua escala:
 *   PPM        o traço principal, com uma marquinha por sessão; escala à
 *              esquerda, de zero até um quarto acima do melhor
 *   precisão   um traço mais claro, sem marcas; escala à direita, de 50%
 *              a 100%
 *
 * As duas escalas foram escolhidas para as linhas NÃO se cruzarem: a
 * precisão de quem treina vive entre 85% e 100%, e na escala de 50 a 100 ela
 * corre no terço de cima da caixa; o PPM, com a folga de um quarto, fica
 * abaixo dela. Com as duas no mesmo andar, elas se enroscavam e nenhuma se
 * lia.
 *
 * O eixo do tempo é o tempo de verdade, e não a ordem das sessões: um
 * intervalo de uma semana sem treinar aparece como um vão na linha.
 */
function desenharGrafico(lugar, todas) {
  if (!lugar.isConnected) return;

  const agora = new Date();
  const fim = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1).getTime();
  const inicioDoPeriodo = periodo ? fim - periodo * 24 * 3600 * 1000 : null;

  const sessoes = todas.filter(
    (s) => !inicioDoPeriodo || new Date(s.data).getTime() >= inicioDoPeriodo
  );

  lugar.replaceChildren();

  if (sessoes.length < SESSOES_PARA_A_CURVA) {
    lugar.insertAdjacentHTML(
      'beforeend',
      `<p class="estat-aviso estat-aviso--periodo">${t('estatisticas.poucasNoPeriodo')
        .replace('{minimo}', SESSOES_PARA_A_CURVA)
        .replace('{dias}', periodo)}</p>`
    );
    return;
  }

  // A caixa: o tamanho real, medido. As margens guardam lugar para os
  // números dos eixos.
  const largura = Math.max(280, lugar.clientWidth);
  const altura = 220;
  const margem = { esquerda: 30, direita: 40, topo: 10, base: 26 };
  const area = {
    x0: margem.esquerda,
    x1: largura - margem.direita,
    y0: altura - margem.base,
    y1: margem.topo,
  };

  // As escalas.
  const t0 = inicioDoPeriodo ?? new Date(sessoes[0].data).setHours(0, 0, 0, 0);
  const t1 = fim;
  const tetoPpm = Math.max(10, Math.ceil((Math.max(...sessoes.map((s) => s.ppm)) * 1.25) / 10) * 10);
  const pisoPrecisao = Math.min(50, Math.floor(Math.min(...sessoes.map((s) => s.precisao)) / 10) * 10);

  const x = (s) => area.x0 + ((new Date(s.data).getTime() - t0) / (t1 - t0)) * (area.x1 - area.x0);
  const yPpm = (ppm) => area.y0 - (ppm / tetoPpm) * (area.y0 - area.y1);
  const yPrecisao = (p) =>
    area.y0 - ((p - pisoPrecisao) / (100 - pisoPrecisao)) * (area.y0 - area.y1);

  const caminho = (pontos) =>
    pontos.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join('');

  const linhaPpm = caminho(sessoes.map((s) => [x(s), yPpm(s.ppm)]));
  const linhaPrecisao = caminho(sessoes.map((s) => [x(s), yPrecisao(s.precisao)]));

  const primeira = sessoes[0];
  const ultima = sessoes.at(-1);
  const descricao = t('estatisticas.descricaoGrafico')
    .replace('{quantas}', sessoes.length)
    .replace('{ppmInicio}', primeira.ppm)
    .replace('{ppmFim}', ultima.ppm)
    .replace('{precisaoInicio}', primeira.precisao)
    .replace('{precisaoFim}', ultima.precisao);

  lugar.insertAdjacentHTML(
    'beforeend',
    `
      <svg class="estat-grafico" viewBox="0 0 ${largura} ${altura}" width="${largura}" height="${altura}"
           role="img" aria-label="${descricao}">

        <!-- Só a linha de base: o mínimo para o olho saber onde está o zero. -->
        <line class="grafico-base" x1="${area.x0}" x2="${area.x1}" y1="${area.y0}" y2="${area.y0}"></line>

        <!-- Escala do PPM, à esquerda: o zero e o teto. -->
        <text class="grafico-rotulo" x="${area.x0 - 8}" y="${area.y0}" text-anchor="end" dominant-baseline="middle">0</text>
        <text class="grafico-rotulo" x="${area.x0 - 8}" y="${area.y1}" text-anchor="end" dominant-baseline="middle">${tetoPpm}</text>

        <!-- Escala da precisão, à direita: o piso e os 100%. -->
        <text class="grafico-rotulo" x="${area.x1 + 8}" y="${area.y0}" dominant-baseline="middle">${pisoPrecisao}%</text>
        <text class="grafico-rotulo" x="${area.x1 + 8}" y="${area.y1}" dominant-baseline="middle">100%</text>

        <!-- O tempo: o primeiro e o último dia do período. -->
        <text class="grafico-rotulo" x="${area.x0}" y="${altura - 6}">${formatarDia(new Date(t0))}</text>
        <text class="grafico-rotulo" x="${area.x1}" y="${altura - 6}" text-anchor="end">${formatarDia(new Date(t1 - 1))}</text>

        <path class="grafico-precisao" d="${linhaPrecisao}"></path>
        <path class="grafico-ppm" d="${linhaPpm}"></path>

        ${sessoes
          .map(
            (s) =>
              `<circle class="grafico-marca" cx="${x(s).toFixed(1)}" cy="${yPpm(s.ppm).toFixed(1)}" r="2"></circle>`
          )
          .join('')}
      </svg>
    `
  );
}

/* ==========================================================================
   Das letras para as teclas

   A estatística é guardada por CARACTERE; o teclado é desenhado por TECLA.
   A ponte é o passosDaLetra do teclado.js, com o teclado de agora: "a" mora
   numa tecla, "á" em duas (o acento e a letra), "A" na tecla do A. Cada
   caractere soma os seus números em todas as teclas do seu gesto.
   ========================================================================== */

function teclasDoTeclado(porTecla) {
  const teclas = new Map();

  for (const [caractere, { acertos = 0, erros = 0 }] of Object.entries(porTecla)) {
    for (const passo of passosDaLetra(caractere, config().layout, sistemaAtual())) {
      const soma = teclas.get(passo.codigo) ?? { acertos: 0, erros: 0 };
      soma.acertos += acertos;
      soma.erros += erros;
      teclas.set(passo.codigo, soma);
    }
  }

  return teclas;
}

const toquesDe = (numeros) => numeros.acertos + numeros.erros;
const taxaDeErro = (numeros) => numeros.erros / toquesDe(numeros);

/**
 * O nome de uma tecla, como está escrito nela: "A", "1 e !", "Espaço".
 * Devolve null para as de comando (Shift, Tab, Ctrl…), que não escrevem
 * nada e não têm estatística.
 */
function nomeDaTecla(codigo) {
  if (codigo === 'Space') return t('estatisticas.espaco');

  const desenho = config().layout === 'us' ? us : abnt2;
  const tecla = desenho.fileiras.flat().find((t_) => t_.codigo === codigo);
  if (!tecla?.rotulo) return null;

  return tecla.sup
    ? t('estatisticas.duasLetras').replace('{a}', tecla.rotulo).replace('{b}', tecla.sup)
    : tecla.rotulo;
}

/* ==========================================================================
   2. MAPA DE CALOR
   ========================================================================== */

function montarCalor(secao, teclas) {
  secao.insertAdjacentHTML(
    'beforeend',
    `
      <h2>${t('estatisticas.mapa')}</h2>
      <p class="ajuda">${t('estatisticas.mapaAjuda')}</p>
      <div data-papel="teclado"></div>
      <p class="estat-linha-tecla" data-papel="linha" aria-hidden="true"></p>
      <p class="apenas-leitor-de-tela" data-papel="resumo-calor"></p>
    `
  );

  const teclado = secao.querySelector('[data-papel="teclado"]');
  const linha = secao.querySelector('[data-papel="linha"]');

  // O teclado é um desenho, e o leitor de tela não o enxerga: para quem usa
  // um, o mapa vira uma frase com as teclas que mais erram.
  const piores = [...teclas]
    .filter(([codigo, numeros]) => dedoDaTecla(codigo) && toquesDe(numeros) >= TOQUES_MINIMOS)
    .sort((a, b) => taxaDeErro(b[1]) - taxaDeErro(a[1]))
    .slice(0, 5)
    .map(([codigo, numeros]) => `${nomeDaTecla(codigo) ?? codigo}, ${formatarDecimal(taxaDeErro(numeros) * 100)}%`);

  secao.querySelector('[data-papel="resumo-calor"]').textContent = piores.length
    ? t('estatisticas.maisErros').replace('{lista}', piores.join('; '))
    : t('estatisticas.semTeclasSuficientes');

  // O teclado das lições, apagado ("cinza"), no formato e no sistema de
  // digita:config: as teclas sem dados ficam neutras, exatamente como no
  // teclado normal.
  desenharTeclado(teclado, { layout: config().layout, sistema: sistemaAtual(), modo: 'cinza' });
  teclado.classList.add('estat-teclado');

  for (const elemento of teclado.querySelectorAll('.tecla')) {
    const numeros = teclas.get(elemento.dataset.codigo);
    const posicao = dedoDaTecla(elemento.dataset.codigo);

    if (!numeros || !posicao || toquesDe(numeros) < TOQUES_MINIMOS) continue;

    const calor =
      CALOR_MINIMO + (1 - CALOR_MINIMO) * Math.min(1, taxaDeErro(numeros) / TAXA_SOLIDA);

    elemento.classList.remove('tecla--neutro');
    elemento.classList.add('tecla--calor', `tecla--calor-${posicao.dedo}`);
    elemento.style.setProperty('--calor', calor.toFixed(3));
  }

  /* A linha de baixo: fixa, e só o conteúdo muda. Sem balão, sem caixa. */
  const padrao = t('estatisticas.passeOMouse');
  linha.textContent = padrao;

  let apontada = null;

  teclado.addEventListener('mouseover', (evento) => {
    const elemento = evento.target.closest('.tecla');
    if (!elemento || elemento === apontada) return;

    apontada?.classList.remove('tecla--apontada');
    apontada = elemento;

    const conteudo = linhaDaTecla(elemento.dataset.codigo, teclas);
    if (!conteudo) {
      linha.textContent = padrao;
      return;
    }

    elemento.classList.add('tecla--apontada');
    linha.innerHTML = conteudo;
  });

  teclado.addEventListener('mouseleave', () => {
    apontada?.classList.remove('tecla--apontada');
    apontada = null;
    linha.textContent = padrao;
  });
}

/** O que a linha diz sobre uma tecla — ou null, para as de comando. */
function linhaDaTecla(codigo, teclas) {
  const nome = nomeDaTecla(codigo);
  if (!nome) return null;

  const numeros = teclas.get(codigo);
  const numero = (valor) => `<span class="num">${valor}</span>`;

  if (!numeros || toquesDe(numeros) === 0) {
    return `<strong>${nome}</strong> · ${t('estatisticas.nenhumToque')}`;
  }

  const toques = toquesDe(numeros);
  if (toques < TOQUES_MINIMOS) {
    const frase = t(toques === 1 ? 'estatisticas.umToque' : 'estatisticas.poucosToques');
    return `<strong>${nome}</strong> · ${frase.replace('{quantos}', numero(toques))}`;
  }

  return [
    `<strong>${nome}</strong>`,
    `${numero(formatarInteiro(numeros.acertos))} ${t('estatisticas.acertos')}`,
    `${numero(formatarInteiro(numeros.erros))} ${t('estatisticas.erros')}`,
    `${numero(`${formatarDecimal(taxaDeErro(numeros) * 100)}%`)} ${t('estatisticas.deErro')}`,
  ].join(' · ');
}

/* ==========================================================================
   3. PRECISÃO POR DEDO
   ========================================================================== */

const ORDEM_DOS_DEDOS = ['minimo', 'anelar', 'medio', 'indicador', 'polegar'];

function montarDedos(secao, teclas) {
  // Soma as teclas de cada dedo. A barra de espaço é dos dois polegares
  // (dedos.js diz "ambas"), e conta para os dois.
  const porDedo = new Map();

  for (const [codigo, numeros] of teclas) {
    const posicao = dedoDaTecla(codigo);
    if (!posicao) continue;

    const maos = posicao.mao === 'ambas' ? ['esquerda', 'direita'] : [posicao.mao];
    for (const mao of maos) {
      const chave = `${mao}-${posicao.dedo}`;
      const soma = porDedo.get(chave) ?? { acertos: 0, erros: 0 };
      soma.acertos += numeros.acertos;
      soma.erros += numeros.erros;
      porDedo.set(chave, soma);
    }
  }

  const linhas = ['esquerda', 'direita'].flatMap((mao) =>
    ORDEM_DOS_DEDOS.map((dedo, i) => {
      const numeros = porDedo.get(`${mao}-${dedo}`);
      const temDados = numeros && toquesDe(numeros) >= TOQUES_MINIMOS;
      const precisao = temDados ? (numeros.acertos / toquesDe(numeros)) * 100 : null;
      const classes = [
        'estat-dedo',
        `estat-dedo--${dedo}`,
        temDados ? '' : 'estat-dedo--sem-dados',
        mao === 'direita' && i === 0 ? 'estat-dedo--direita-primeiro' : '',
      ]
        .filter(Boolean)
        .join(' ');

      return `
        <li class="${classes}">
          <span class="estat-dedo-nome">${nomeDoDedo(mao, dedo)}</span>
          <span class="estat-dedo-trilho" aria-hidden="true">
            <span class="estat-dedo-barra" style="width: ${temDados ? precisao.toFixed(1) : 0}%"></span>
          </span>
          <span class="estat-dedo-valor">${temDados ? `${formatarDecimal(precisao)}%` : '—'}</span>
        </li>`;
    })
  );

  secao.insertAdjacentHTML(
    'beforeend',
    `
      <h2>${t('estatisticas.dedos')}</h2>
      <ul class="estat-dedos">${linhas.join('')}</ul>
      ${teclas.has('Space') ? `<p class="ajuda estat-nota">${t('estatisticas.notaPolegar')}</p>` : ''}
    `
  );
}
