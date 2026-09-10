/* ==========================================================================
   maos.js — o desenho das duas mãos, com o dedo certo aceso.

   As mãos são desenhadas em SVG, direto no código: nenhuma imagem é baixada.
   São vistas de cima, como se você olhasse para as suas próprias mãos sobre
   o teclado — a mão esquerda à esquerda, a direita à direita.

   Cada dedo é um caminho independente, marcado com data-mao e data-dedo, o
   que permite acender um dedo específico com a mesma cor que a tecla dele
   ganha no teclado da tela.

   O desenho é simples de propósito: a função dele é dizer QUAL dedo usar,
   não parecer uma foto de mão.
   ========================================================================== */

/**
 * Medidas de cada dedo da mão direita, em coordenadas do SVG.
 * A mão esquerda é a mesma coisa espelhada — por isso só um conjunto.
 *   x       posição horizontal do dedo
 *   topo    onde o dedo começa (quanto menor, mais comprido)
 *   largura espessura do dedo
 */
const DEDOS_DA_MAO = [
  { dedo: 'indicador', x: 22, topo: 30, largura: 14 },
  { dedo: 'medio', x: 40, topo: 16, largura: 14 },
  { dedo: 'anelar', x: 58, topo: 22, largura: 14 },
  { dedo: 'minimo', x: 76, topo: 40, largura: 12 },
];

/** Onde a palma começa, para os dedos nascerem dela. */
const PALMA_TOPO = 84;
const ALTURA = 150;
const LARGURA = 100;

/**
 * Desenha as duas mãos dentro de um elemento da página.
 * @param {HTMLElement} destino  onde desenhar (o conteúdo anterior é apagado)
 */
export function desenharMaos(destino) {
  destino.replaceChildren();
  destino.classList.add('maos');

  // Assim como o teclado, o desenho é um apoio visual: a informação de qual
  // dedo usar vem escrita na legenda da lição, em texto.
  destino.setAttribute('aria-hidden', 'true');

  destino.append(criarMao('esquerda'), criarMao('direita'));
}

/** Monta uma das mãos. */
function criarMao(mao) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${LARGURA} ${ALTURA}`);
  svg.setAttribute('class', `mao mao--${mao}`);
  svg.dataset.mao = mao;

  // A mão esquerda é a direita vista no espelho — o espelhamento acontece no
  // CSS (.mao--esquerda), para o desenho não sair da caixa dele.

  // A palma.
  svg.append(
    criarParte('path', {
      class: 'mao-palma',
      d: `M 18 ${PALMA_TOPO}
          Q 16 ${ALTURA - 22} 34 ${ALTURA - 6}
          L 76 ${ALTURA - 6}
          Q 92 ${ALTURA - 26} 90 ${PALMA_TOPO}
          Z`,
    })
  );

  // Os quatro dedos.
  for (const { dedo, x, topo, largura } of DEDOS_DA_MAO) {
    svg.append(
      criarParte('rect', {
        class: 'mao-dedo',
        'data-mao': mao,
        'data-dedo': dedo,
        x,
        y: topo,
        width: largura,
        height: PALMA_TOPO - topo + 14,
        rx: largura / 2,
      })
    );
  }

  // O polegar, deitado ao lado da palma.
  svg.append(
    criarParte('rect', {
      class: 'mao-dedo mao-polegar',
      'data-mao': mao,
      'data-dedo': 'polegar',
      x: -6,
      y: PALMA_TOPO + 18,
      width: 36,
      height: 13,
      rx: 6.5,
      transform: `rotate(30, 12, ${PALMA_TOPO + 24})`,
    })
  );

  return svg;
}

/** Cria um elemento SVG com os atributos já preenchidos. */
function criarParte(tipo, atributos) {
  const elemento = document.createElementNS('http://www.w3.org/2000/svg', tipo);

  for (const [nome, valor] of Object.entries(atributos)) {
    elemento.setAttribute(nome, valor);
  }

  return elemento;
}

/**
 * Acende um dedo, na cor daquele dedo.
 * @param {HTMLElement} destino  o desenho das mãos
 * @param {string} mao   'esquerda' | 'direita' | 'ambas' (polegar)
 * @param {string} dedo  'minimo' | 'anelar' | 'medio' | 'indicador' | 'polegar'
 */
export function destacarDedo(destino, mao, dedo) {
  limparDedos(destino);

  // O espaço pode ser apertado com qualquer polegar: nesse caso os dois
  // acendem, e o aluno usa o que preferir.
  const seletor =
    mao === 'ambas'
      ? `[data-dedo="${dedo}"]`
      : `[data-mao="${mao}"][data-dedo="${dedo}"]`;

  destino.querySelectorAll(seletor).forEach((parte) => {
    parte.classList.add('mao-dedo--ativo');
    parte.classList.add(`mao-dedo--${dedo}`);
  });
}

/** Apaga o dedo que estava aceso. */
export function limparDedos(destino) {
  destino.querySelectorAll('.mao-dedo--ativo').forEach((parte) => {
    parte.classList.remove(
      'mao-dedo--ativo',
      'mao-dedo--minimo',
      'mao-dedo--anelar',
      'mao-dedo--medio',
      'mao-dedo--indicador',
      'mao-dedo--polegar'
    );
  });
}
