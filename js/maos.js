/* ==========================================================================
   maos.js — as duas mãos ao lado do teclado.

   O contorno é um único caminho SVG, fornecido pelo Fernando: uma mão
   ESQUERDA aberta, vista de cima, quatro dedos esticados e o polegar aberto
   para o lado. As coordenadas dele não devem ser alteradas — a mão direita
   é o mesmo caminho espelhado num <g>, e é por isso que as bolinhas têm as
   mesmas coordenadas nas duas mãos.

   O contorno nunca muda de cor: quem indica o dedo é uma bolinha na ponta
   dele, pintada com a cor forte daquele dedo — a mesma que o texto da tecla
   correspondente usa no teclado da tela. É essa repetição de cor que liga os
   dois desenhos na cabeça de quem está aprendendo.
   ========================================================================== */

/** O contorno da mão esquerda. Coordenadas originais, não mexer. */
const CONTORNO =
  'M22 150 L22 138 C14 128 10 116 10 100 L10 56 A8 8 0 0 1 26 56 L26 76 ' +
  'A1.5 1.5 0 0 0 29 76 L29 34 A8 8 0 0 1 45 34 L45 70 A1.5 1.5 0 0 0 48 70 ' +
  'L48 26 A8 8 0 0 1 64 26 L64 70 A1.5 1.5 0 0 0 67 70 L67 34 A8 8 0 0 1 83 34 ' +
  'L83 90 Q83.5 95.5 86 92.6 L100.3 78.3 A8 8 0 0 1 111.7 89.7 L91.7 109.7 ' +
  'C86 116 78 126 76 138 L76 150';

/**
 * Onde fica a bolinha de cada dedo, um pouco à frente da ponta.
 * Valem para as duas mãos: a direita é a esquerda espelhada, então o
 * espelhamento leva as bolinhas junto.
 */
const BOLINHAS = [
  { dedo: 'minimo', cx: 18, cy: 40 },
  { dedo: 'anelar', cx: 37, cy: 18 },
  { dedo: 'medio', cx: 56, cy: 10 },
  { dedo: 'indicador', cx: 75, cy: 18 },
  { dedo: 'polegar', cx: 117.4, cy: 72.6 },
];

/* Raio 7, e não 5: com a mão pequena ao lado do teclado, o desenho fica
   reduzido a cerca de metade do tamanho do viewBox, e uma bolinha de raio 5
   apareceria com 5px de diâmetro na tela. Sete é o maior raio que ainda
   deixa um respiro entre a bolinha e a ponta do dedo. */
const RAIO_DA_BOLINHA = 7;
const CAIXA = { x: -5, y: 0, largura: 130, altura: 150 };

/**
 * Desenha as duas mãos dentro de um elemento da página.
 * @param {HTMLElement} destino
 */
export function desenharMaos(destino) {
  destino.replaceChildren();
  destino.classList.add('maos');

  // O desenho é um apoio visual. Para quem usa leitor de tela, a informação
  // de qual dedo usar vem em texto, na legenda oculta da lição.
  destino.setAttribute('aria-hidden', 'true');

  destino.append(criarMao('esquerda'), criarMao('direita'));
}

function criarMao(mao) {
  const svg = criar('svg', {
    viewBox: `${CAIXA.x} ${CAIXA.y} ${CAIXA.largura} ${CAIXA.altura}`,
    class: `mao mao--${mao}`,
    'data-mao': mao,
    fill: 'none',
    'aria-hidden': 'true',
  });

  // A mão direita é a esquerda espelhada. O espelhamento é feito aqui, num
  // grupo dentro do SVG, para o contorno e as bolinhas virarem juntos.
  const grupo = criar('g', {
    transform: mao === 'direita' ? 'translate(120, 0) scale(-1, 1)' : null,
  });

  grupo.append(
    criar('path', {
      class: 'mao-contorno',
      d: CONTORNO,
      fill: 'none',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'vector-effect': 'non-scaling-stroke',
    })
  );

  for (const { dedo, cx, cy } of BOLINHAS) {
    grupo.append(
      criar('circle', {
        class: 'mao-bolinha',
        'data-mao': mao,
        'data-dedo': dedo,
        cx,
        cy,
        r: RAIO_DA_BOLINHA,
      })
    );
  }

  svg.append(grupo);
  return svg;
}

/** Cria um elemento SVG com os atributos já preenchidos. */
function criar(tipo, atributos) {
  const elemento = document.createElementNS('http://www.w3.org/2000/svg', tipo);

  for (const [nome, valor] of Object.entries(atributos)) {
    if (valor !== null && valor !== undefined) elemento.setAttribute(nome, valor);
  }

  return elemento;
}

/* --------------------------------------------------------------------------
   Acender um dedo
   -------------------------------------------------------------------------- */

/**
 * Acende a bolinha de um dedo.
 * @param {HTMLElement} destino
 * @param {string} mao   'esquerda' | 'direita' | 'ambas' (polegar)
 * @param {string} dedo
 */
export function destacarDedo(destino, mao, dedo) {
  limparDedos(destino);

  // O espaço pode ser apertado com qualquer polegar: nesse caso os dois
  // acendem, e a pessoa usa o que preferir.
  const seletor =
    mao === 'ambas'
      ? `[data-dedo="${dedo}"]`
      : `[data-mao="${mao}"][data-dedo="${dedo}"]`;

  destino.querySelectorAll(seletor).forEach((bolinha) => {
    bolinha.classList.add('mao-bolinha--acesa', `mao-bolinha--${dedo}`);
  });
}

/**
 * Acende a bolinha de um dedo PULSANDO, sem apagar a que já estava acesa.
 *
 * É o dedo que segura a modificadora numa combinação. Ficam duas bolinhas ao
 * mesmo tempo, e é a diferença entre elas que ensina o gesto: a fixa é a
 * tecla que se aperta, a que pulsa é a que se segura.
 *
 * @param {HTMLElement} destino
 * @param {string} mao   'esquerda' | 'direita'
 * @param {string} dedo
 */
export function pulsarDedo(destino, mao, dedo) {
  destino
    .querySelectorAll(`[data-mao="${mao}"][data-dedo="${dedo}"]`)
    .forEach((bolinha) => {
      bolinha.classList.add(
        'mao-bolinha--acesa',
        'mao-bolinha--pulsando',
        `mao-bolinha--${dedo}`
      );
    });
}

/** Apaga as bolinhas que estavam acesas. */
export function limparDedos(destino) {
  destino.querySelectorAll('.mao-bolinha--acesa').forEach((bolinha) => {
    bolinha.classList.remove(
      'mao-bolinha--acesa',
      'mao-bolinha--pulsando',
      'mao-bolinha--minimo',
      'mao-bolinha--anelar',
      'mao-bolinha--medio',
      'mao-bolinha--indicador',
      'mao-bolinha--polegar'
    );
  });
}
