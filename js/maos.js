/* ==========================================================================
   maos.js — as duas mãos em desenho de linha, sobrepostas ao teclado.

   O desenho é original, feito em SVG por coordenadas — nenhuma imagem é
   baixada e nada foi copiado de lugar nenhum. São silhuetas de contorno
   fino e contínuo, sem preenchimento, para não esconder as letras das
   teclas por baixo.

   As mãos são vistas de cima, como quem olha para as próprias mãos pousadas
   no teclado: as pontas dos quatro dedos na fileira base, o polegar deitado
   em direção à barra de espaço, e o punho saindo pela borda de baixo do
   desenho, como se o braço continuasse fora do quadro.

   Dentro do SVG, o eixo x de 0 a 100 é o vão das quatro teclas de descanso,
   com as pontas dos dedos em 12,5 / 37,5 / 62,5 / 87,5 — os centros das
   quatro colunas. O y começa no topo da fileira base e cresce na direção do
   punho. Essas medidas vêm do teclado de verdade, e é isso que faz a mão ter
   proporção de mão.

   A mão esquerda é a direita espelhada: o mesmo desenho dentro de um
   transform, para não haver dois desenhos que possam discordar um do outro.
   ========================================================================== */

/**
 * Os quatro dedos, na ordem em que aparecem no desenho da MÃO DIREITA, da
 * esquerda para a direita: indicador no J, mínimo na tecla à direita do L.
 *
 *   cx        centro do dedo (também o centro da tecla embaixo dele)
 *   base      onde o dedo encontra a palma; o desenho entra um pouco na
 *             palma de propósito, e essa linha vira a dobra do nó do dedo
 *   larguras  os dedos afinam da base para a ponta, como os de verdade
 */
const DEDOS = [
  { dedo: 'indicador', cx: 12.5, cxBase: 16, topo: 5, base: 62, larguraBase: 17, larguraPonta: 14 },
  { dedo: 'medio', cx: 37.5, cxBase: 38, topo: 5, base: 70, larguraBase: 16.5, larguraPonta: 13.5 },
  { dedo: 'anelar', cx: 62.5, cxBase: 60, topo: 5, base: 67, larguraBase: 15.5, larguraPonta: 13 },
  { dedo: 'minimo', cx: 87.5, cxBase: 82, topo: 5, base: 59, larguraBase: 13, larguraPonta: 11 },
];

/**
 * A palma e o punho, num contorno só. O punho sai pela borda de baixo do
 * desenho, como se o braço continuasse fora do quadro — é assim que a mão
 * aparece quando se olha para o próprio teclado.
 */
const PALMA = `
  M 7 56
  C 4 70 8 86 20 95
  C 29 101 34 105 36 111
  L 37 118
  L 63 118
  L 64 111
  C 66 105 71 101 80 95
  C 92 86 96 70 92 52
  C 89 57 86 58 82 58
  C 74 60 68 63 60 64
  C 52 66 45 67 38 67
  C 30 66 22 62 16 60
  C 12 58 9 57 7 56
  Z`;

/**
 * O polegar, saindo da lateral da palma em direção à barra de espaço. Ele é
 * o único dedo que não fica na fileira base: descansa deitado sobre o espaço.
 */
const POLEGAR = `
  M 9 54
  C -1 56 -11 61 -18 68
  C -23 73 -16 80 -8 76
  C 1 71 10 63 14 57
  C 13 54 12 52 9 54
  Z`;

/** A dobra do punho, logo abaixo da palma. */
const PUNHO = ['M 37 110 C 45 113 55 113 63 110'];

/* --------------------------------------------------------------------------
   Desenho
   -------------------------------------------------------------------------- */

/**
 * Desenha as duas mãos dentro de um elemento.
 * @param {HTMLElement} destino
 */
export function desenharMaos(destino) {
  destino.replaceChildren();
  destino.classList.add('maos');

  // As mãos são um apoio visual: a informação de qual dedo usar vem escrita
  // na legenda, em texto. Também não recebem cliques — quem está embaixo
  // delas é o teclado.
  destino.setAttribute('aria-hidden', 'true');

  destino.append(criarMao('esquerda'), criarMao('direita'));
}

function criarMao(mao) {
  const svg = criar('svg', {
    class: `mao mao--${mao}`,
    'data-mao': mao,
    // A mão direita precisa de espaço à esquerda para o polegar; a esquerda,
    // à direita. Em ambas, o trecho de 0 a 100 é o das quatro teclas.
    viewBox: mao === 'direita' ? '-30 0 130 118' : '0 0 130 118',
    preserveAspectRatio: 'xMinYMin meet',
    fill: 'none',
  });

  const grupo = criar('g', {
    // O espelhamento acontece aqui dentro: o desenho é um só.
    transform: mao === 'esquerda' ? 'translate(100, 0) scale(-1, 1)' : null,
  });

  grupo.append(criar('path', { class: 'mao-palma', d: PALMA }));

  for (const { dedo, cx, cxBase, topo, base, larguraBase, larguraPonta } of DEDOS) {
    grupo.append(
      criar('path', {
        class: 'mao-dedo',
        'data-mao': mao,
        'data-dedo': dedo,
        d: caminhoDoDedo(cx, cxBase, topo, base, larguraBase, larguraPonta),
      })
    );

    // Duas dobras discretas em cada dedo, onde ficam as articulações.
    for (const altura of [0.36, 0.64]) {
      const y = topo + (base - topo) * altura;
      grupo.append(
        criar('path', {
          class: 'mao-dobra',
          d: dobra(cx + (cxBase - cx) * altura, larguraPonta, y),
        })
      );
    }
  }

  grupo.append(
    criar('path', {
      class: 'mao-dedo mao-polegar',
      'data-mao': mao,
      'data-dedo': 'polegar',
      d: POLEGAR,
    })
  );

  for (const traco of PUNHO) {
    grupo.append(criar('path', { class: 'mao-punho', d: traco }));
  }

  svg.append(grupo);
  return svg;
}

/**
 * O contorno de um dedo: dois lados que afinam da base para a ponta, e uma
 * ponta arredondada ligando os dois.
 *
 * A ponta e a base têm centros diferentes de propósito: as pontas ficam
 * abertas sobre as teclas e as bases se juntam na palma, o que dá o leque
 * natural da mão pousada no teclado.
 */
function caminhoDoDedo(cx, cxBase, topo, base, larguraBase, larguraPonta) {
  const b = larguraBase / 2;
  const p = larguraPonta / 2;
  const ombro = topo + p; // onde a curva da ponta termina

  return `
    M ${cxBase - b} ${base}
    C ${cxBase - b} ${base - 12} ${cx - p} ${ombro + 14} ${cx - p} ${ombro}
    A ${p} ${p} 0 0 1 ${cx + p} ${ombro}
    C ${cx + p} ${ombro + 14} ${cxBase + b} ${base - 12} ${cxBase + b} ${base}
    Z`;
}

/** Uma dobra de articulação: um arco curtinho atravessando o dedo. */
function dobra(cx, largura, y) {
  const l = (largura / 2) * 0.72;
  return `M ${cx - l} ${y} Q ${cx} ${y + 2.5} ${cx + l} ${y}`;
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
 * Acende um dedo, na cor daquele dedo.
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

  destino.querySelectorAll(seletor).forEach((parte) => {
    parte.classList.add('mao-dedo--ativo', `mao-dedo--${dedo}`);
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
