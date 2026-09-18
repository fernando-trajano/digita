/* ==========================================================================
   cobra.js — o jogo Cobra, modo Fuga (sem fim).

   A cobra avança da esquerda para a direita, em velocidade constante. Quem
   joga é um ponto à frente dela. Cada acerto afasta o ponto — quanto mais
   rápido o acerto, maior o salto —, cada erro o faz recuar. A cobra
   alcançar o ponto encerra a partida.

   Só o modo Fuga existe. Corrida, Reflexo e Desafio do dia ficaram para
   depois (ver CLAUDE.md, Parte 3).
   ========================================================================== */

import { t, traduzirPagina } from '../i18n.js';
import { config } from '../estado.js';
import { ppmMedio } from '../progresso.js';
import { teclaDaLetra } from '../teclado.js';
import { dedoDaTecla } from '../../dados/layouts/dedos.js';
import { PALAVRAS } from '../../dados/treino-livre.js';
import { tocarToqueDeJogo, tocarErroDeJogo, tocarFolego, tocarCaptura } from '../som.js';
import {
  criarRelogio,
  vigiarJanela,
  prepararTecla,
  soltarFoco,
  formatarTempo,
  montarInicio,
  montarFim,
  montarTopo,
} from './comum.js';

/* --------------------------------------------------------------------------
   AS REGRAS, em números. Tudo o que muda o equilíbrio do jogo está aqui.
   -------------------------------------------------------------------------- */

/**
 * O nível muda UMA coisa: a velocidade da cobra, como FRAÇÃO da média de
 * quem joga — nunca um PPM fixo. É isso que dá a mesma tensão para quem
 * digita a 15 e a 80 PPM: um valor absoluto seria impossível para quem
 * começa e fácil demais para quem já é rápido.
 *
 *   Fácil    80% do seu ritmo: no seu normal, você abre distância.
 *   Médio   110%: a cobra é mais rápida que você. Só os saltos dos acertos
 *           rápidos e o fôlego dos combos te mantêm à frente.
 *   Difícil 130%: é preciso digitar bem acima da sua média, e sem errar.
 */
const FRACAO_DO_NIVEL = { facil: 0.8, medio: 1.1, dificil: 1.3 };

/** Abaixo de 10 ou acima de 150 PPM, a conta da velocidade perde o sentido. */
const PPM_MINIMO = 10;
const PPM_MAXIMO = 150;

/** Quantos caracteres valem uma "palavra" na conta de PPM — como no site. */
const CARACTERES_POR_PALAVRA = 5;

/** Metros que o ponto avança num acerto feito exatamente no seu ritmo. */
const SALTO = 1;

/**
 * Quanto mais rápido o acerto, maior o salto. O salto é multiplicado pela
 * raiz de (seu ritmo ÷ o tempo que a tecla levou): no dobro da sua
 * velocidade, o salto é 1,4 vez maior; na metade, 0,7. Com piso e teto, para
 * uma hesitação ainda andar um pouco e uma rajada não disparar.
 */
const SALTO_MINIMO = 0.6;
const SALTO_MAXIMO = 1.6;

/** Metros que o ponto recua num erro. */
const RECUO = 2;

/** A cada tantos acertos seguidos, um avanço extra — o fôlego do combo. */
const COMBO_A_CADA = 10;
const FOLEGO_DO_COMBO = 2; // metros

/*
 * As distâncias entre a cobra e o ponto são medidas em SEGUNDOS DE COBRA:
 * quanto tempo ela levaria para chegar, na velocidade normal. É isso que dá
 * a mesma tensão para quem digita a 15 e a 60 PPM.
 */

/** A folga na largada. */
const FOLEGO_INICIAL = 5;

/**
 * A folga máxima. Mais longe que isso, a cobra vem junto: sem teto, quem
 * digita acima da própria média abriria distância para sempre, e a Fuga
 * perderia a tensão.
 */
const FOLEGO_MAXIMO = 8;

/** Abaixo desta folga, o traço da cobra começa a engrossar e escurecer. */
const FOLEGO_DO_ALERTA = 5;

/** Abaixo desta folga, a cobra acelera… */
const FOLEGO_DA_ACELERACAO = 2.5;

/** …até este tanto a mais, colada no ponto (0,6 = 60% mais rápida). */
const ACELERACAO_MAXIMA = 0.6;

/** O ciclo do pulso no traço: um segundo, o mesmo das teclas modificadoras. */
const CICLO_DO_PULSO = 1;

/** Quanto a cena da captura fica parada antes do resumo, em segundos. */
const ESPERA_NO_FIM = 0.9;

/* --------------------------------------------------------------------------
   A PISTA — as medidas do desenho, no sistema de coordenadas do SVG.
   -------------------------------------------------------------------------- */

const PISTA = {
  largura: 1000,
  altura: 150,
  eixo: 62, // a altura por onde a cobra e o ponto correm
  chao: 112, // a linha fina do chão
  xDoPonto: 780, // onde a câmera deixa o ponto, parado
  xDaCobraNoMaximo: 90, // onde fica a cabeça da cobra com a folga máxima
  xMaximoDoPonto: 960, // o ponto nunca sai pela direita
};

/** O corpo da cobra: comprimento, ondulação e altura das curvas. */
const CORPO = {
  comprimento: 340,
  passo: 5,
  onda: 120, // a distância entre duas curvas, em unidades do SVG
  altura: 18,
  pescoco: 60, // perto da cabeça a curva abre aos poucos: ela aponta para o ponto
};

/** Espessura do traço: longe e colada no ponto. */
const TRACO_LONGE = 1.6;
const TRACO_PERTO = 4.2;

/** Os tiques do chão: o primeiro destes que fique a 45 unidades do vizinho. */
const TIQUES = [1, 2, 5, 10, 20, 50, 100];

/* --------------------------------------------------------------------------
   A média e a velocidade
   -------------------------------------------------------------------------- */

/** A média usada na conta: a de quem joga, dentro dos limites. */
function mediaParaAConta() {
  return Math.min(PPM_MAXIMO, Math.max(PPM_MINIMO, ppmMedio().ppm));
}

/** A velocidade da cobra num nível, em PPM. */
function ppmDaCobra(nivel) {
  return Math.round(mediaParaAConta() * FRACAO_DO_NIVEL[nivel]);
}

/** "Sua média nas lições: 32 PPM." — diz também de onde a média veio. */
function fraseDaMedia() {
  const { ppm, origem } = ppmMedio();
  const chave = { licoes: 'mediaLicoes', teste: 'mediaTeste', padrao: 'mediaPadrao' }[origem];

  return t(`jogos.cobra.${chave}`).replace('{ppm}', `<strong>${ppm}</strong>`);
}

/** A cor do dedo de um caractere, sempre por variável: o tom forte. */
function corDoDedo(caractere) {
  const tecla = teclaDaLetra(caractere, config().layout);
  const dedo = tecla ? dedoDaTecla(tecla.codigo)?.dedo : null;

  // O polegar e as teclas sem dedo são cinza, como no teclado da lição.
  const cor = !dedo || dedo === 'polegar' ? 'neutro' : dedo;
  return `var(--dedo-${cor}-texto)`;
}

/* ==========================================================================
   TELA 1 — o começo
   ========================================================================== */

/**
 * @param {HTMLElement} destino
 * @param {{aoEscolher: (nivel: string) => void, aoVoltar: () => void}} opcoes
 */
export function mostrarInicio(destino, { aoEscolher, aoVoltar }) {
  montarInicio(destino, {
    jogo: 'cobra',
    ajuda: t('jogos.cobra.ajuda').replace('{combo}', COMBO_A_CADA),
    rodape: '<p class="ajuda cobra-conta" data-papel="conta"></p>',
    aoEscolher,
    aoVoltar,

    /* A linha da conta. A média fica SEMPRE à vista — sem mouse, é tudo o
       que ela mostra. Com o mouse (ou o foco do Tab) sobre um nível, ela se
       completa com a velocidade da cobra naquele nível. Nenhuma informação
       existe só no hover: a média, que é a informação de verdade, não
       depende dele. */
    aoApontar: escreverConta,
  });

  const conta = destino.querySelector('[data-papel="conta"]');

  function escreverConta(nivel = null) {
    const velocidade = nivel
      ? ` ${t('jogos.cobra.velocidade')
          .replace('{nivel}', t(`jogos.niveis.${nivel}`))
          .replace('{ppm}', `<strong>${ppmDaCobra(nivel)}</strong>`)}`
      : '';

    conta.innerHTML = fraseDaMedia() + velocidade;
  }

  escreverConta();
}

/* ==========================================================================
   TELA 2 — a partida
   ========================================================================== */

/**
 * @param {HTMLElement} destino
 * @param {{nivel: string, aoTerminar: (resultado: object) => void}} opcoes
 * @returns {{encerrar: () => void, retraduzir: () => void, espiar: () => object}}
 */
export function iniciar(destino, { nivel, aoTerminar }) {
  const media = ppmMedio().ppm;

  /** O ritmo médio de quem joga: segundos entre um caractere e o próximo. */
  const ritmo = 60 / (mediaParaAConta() * CARACTERES_POR_PALAVRA);

  /** A velocidade normal da cobra, em metros por segundo. */
  const velocidade = (FRACAO_DO_NIVEL[nivel] * SALTO) / ritmo;

  /** Quantas unidades do SVG vale um metro: a folga máxima ocupa a pista. */
  const escala = (PISTA.xDoPonto - PISTA.xDaCobraNoMaximo) / (FOLEGO_MAXIMO * velocidade);

  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    `
      <div class="jogo-partida cobra-jogo">
        ${montarTopo([
          { papel: 'tempo', valor: '0:00', chave: 'jogos.tempo' },
          { papel: 'distancia', valor: '0', chave: 'jogos.cobra.metros' },
          { papel: 'combo', valor: '0', chave: 'jogos.combo' },
        ])}

        <svg class="cobra-pista" viewBox="0 0 ${PISTA.largura} ${PISTA.altura}" aria-hidden="true">
          <line class="cobra-chao" x1="0" x2="${PISTA.largura}" y1="${PISTA.chao}" y2="${PISTA.chao}"></line>
          <g data-papel="marcas"></g>
          <path class="cobra-corpo" data-papel="cobra"></path>
          <circle class="cobra-jogador" data-papel="jogador" r="7.5" cx="${PISTA.xDoPonto}" cy="${PISTA.eixo}"></circle>
        </svg>

        <p class="cobra-aviso" data-papel="aviso" role="status"></p>

        <div class="cobra-texto">
          <p class="cobra-linha" data-papel="linha" aria-hidden="true"></p>
        </div>

        <p class="ajuda cobra-dica" data-papel="dica" data-i18n="jogos.cobra.espera">${t('jogos.cobra.espera')}</p>

        <p class="apenas-leitor-de-tela" data-papel="leitor" role="status"></p>
      </div>
    `
  );

  const partes = {
    tempo: destino.querySelector('[data-papel="tempo"]'),
    distancia: destino.querySelector('[data-papel="distancia"]'),
    combo: destino.querySelector('[data-papel="combo"]'),
    marcas: destino.querySelector('[data-papel="marcas"]'),
    cobra: destino.querySelector('[data-papel="cobra"]'),
    jogador: destino.querySelector('[data-papel="jogador"]'),
    aviso: destino.querySelector('[data-papel="aviso"]'),
    linha: destino.querySelector('[data-papel="linha"]'),
    dica: destino.querySelector('[data-papel="dica"]'),
    leitor: destino.querySelector('[data-papel="leitor"]'),
  };

  /* --- O texto: uma fita de palavras que nunca acaba ------------------- */

  let texto = '';
  const letras = []; // um <span> por caractere
  let posicao = 0;

  function acrescentarPalavras(quantas) {
    const pedaco = [];
    for (let i = 0; i < quantas; i += 1) {
      let palavra;
      do {
        palavra = PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)];
      } while (palavra === pedaco.at(-1));
      pedaco.push(palavra);
    }

    const novo = (texto ? ' ' : '') + pedaco.join(' ');
    const fragmento = document.createDocumentFragment();

    for (const caractere of novo) {
      const span = document.createElement('span');
      span.textContent = caractere;
      span.className = caractere === ' ' ? 'letra--falta letra--espaco' : 'letra--falta';
      letras.push(span);
      fragmento.append(span);
    }

    texto += novo;
    partes.linha.append(fragmento);
  }

  function marcarLetraDaVez() {
    const span = letras[posicao];
    span.classList.remove('letra--falta');
    span.classList.add('letra--atual');
    partes.linha.style.setProperty('--posicao', posicao);
    partes.jogador.style.fill = corDoDedo(texto[posicao]);
  }

  acrescentarPalavras(40);
  marcarLetraDaVez();

  /* --- O estado ------------------------------------------------------- */

  // Posições em metros, na pista. O ponto larga no zero.
  let jogador = 0;
  let cobra = -FOLEGO_INICIAL * velocidade;

  // O que aparece: o ponto desliza até a posição de verdade, e a câmera vem
  // atrás dele, um pouco mais devagar — é o que deixa ver o salto.
  let jogadorNaTela = jogador;
  let camera = jogador;

  let comecou = false;
  let pausado = false;
  let capturado = false;
  let relogio = 0; // segundos de jogo, desde a primeira tecla
  let tempoDeTela = 0; // segundos desde a abertura, para a ondulação e o pulso
  let fimDaCaptura = null;
  let ultimaTecla = null; // o instante do último toque, no relógio do jogo
  let fase = 0; // a fase da ondulação da cobra
  let multiplicador = 1; // a aceleração da cobra, agora
  let pertoAnunciado = false;
  let avisoAtual = null; // a chave do aviso na tela, para trocar de idioma

  let acertos = 0;
  let erros = 0;
  let combo = 0;
  let comboMaximo = 0;

  /** A folga de agora, em segundos de cobra. */
  const folego = () => (jogador - cobra) / velocidade;

  function avisar(chave) {
    avisoAtual = chave;
    partes.aviso.textContent = chave ? t(chave) : '';
  }

  /* --- O relógio --------------------------------------------------------

     Tudo o que anda é velocidade × tempo, e as suavizações são exponenciais
     no tempo: numa tela de 60 Hz e numa de 144 Hz, a cobra chega no mesmo
     segundo.
     ---------------------------------------------------------------------- */

  const relogioDoJogo = criarRelogio((passo) => {
    if (pausado) return;

    tempoDeTela += passo;

    if (capturado) {
      if (relogio + passo >= fimDaCaptura) {
        terminar(true);
        return false;
      }
      relogio += passo;
    } else if (comecou) {
      relogio += passo;
      moverCobra(passo);
    }

    // O ponto e a câmera, suavizados no tempo.
    jogadorNaTela += (jogador - jogadorNaTela) * (1 - Math.exp(-passo / 0.06));
    camera += (jogadorNaTela - camera) * (1 - Math.exp(-passo / 0.35));

    // A ondulação: devagar parada, mais rápida quando a cobra acelera.
    const ritmoDaOnda = !comecou ? 0.35 : capturado ? 0 : 1.1 * multiplicador;
    fase += 2 * Math.PI * ritmoDaOnda * passo;

    desenhar();
  });

  /** O instante de agora no relógio do jogo, entre um quadro e outro. */
  const agora = () => relogio + relogioDoJogo.desdeOUltimoQuadro();

  function moverCobra(passo) {
    // Perto do ponto, a cobra acelera — cada vez mais, quanto mais perto.
    const f = folego();
    multiplicador =
      f < FOLEGO_DA_ACELERACAO
        ? 1 + ACELERACAO_MAXIMA * (1 - Math.max(0, f) / FOLEGO_DA_ACELERACAO)
        : 1;

    cobra += velocidade * multiplicador * passo;

    if (folego() < FOLEGO_DA_ACELERACAO && !pertoAnunciado) {
      pertoAnunciado = true;
      partes.leitor.textContent = t('jogos.cobra.perto');
    } else if (folego() >= FOLEGO_DO_ALERTA) {
      pertoAnunciado = false;
    }

    if (cobra >= jogador) capturar();
  }

  /* --- O desenho --------------------------------------------------------

     A câmera segue o ponto: um metro de pista vira `escala` unidades do SVG,
     e o ponto fica perto do xDoPonto. Quem se move na tela é o mundo — o
     chão com as marcas e a cobra — e o ponto salta um pouco à frente a cada
     acerto, antes de a câmera alcançá-lo.
     ---------------------------------------------------------------------- */

  const naTela = (metros) => PISTA.xDoPonto + (metros - camera) * escala;
  const tique = TIQUES.find((m) => m * escala >= 45) ?? 100;
  const marcas = [];

  function desenhar() {
    partes.jogador.setAttribute(
      'cx',
      Math.min(PISTA.xMaximoDoPonto, naTela(jogadorNaTela)).toFixed(1)
    );

    desenharMarcas();
    desenharCobra();

    // Na cena da captura, o tempo para no instante em que ela alcançou — é
    // o mesmo número que o resumo vai mostrar.
    partes.tempo.textContent = formatarTempo(capturado ? fimDaCaptura - ESPERA_NO_FIM : relogio);
    partes.distancia.textContent = Math.max(0, Math.floor(jogador));
    partes.combo.textContent = combo;
  }

  /** O chão: um tique a cada tantos metros, e o número a cada cinco tiques. */
  function desenharMarcas() {
    const inicio = camera - PISTA.xDoPonto / escala;
    const fim = camera + (PISTA.largura - PISTA.xDoPonto) / escala;
    const primeiro = Math.ceil(inicio / tique) * tique;

    let i = 0;
    for (let m = primeiro; m <= fim; m += tique, i += 1) {
      if (!marcas[i]) {
        const grupo = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        grupo.innerHTML =
          '<line class="cobra-marca"></line><text class="cobra-rotulo-marca" text-anchor="middle"></text>';
        partes.marcas.append(grupo);
        marcas[i] = grupo;
      }

      const [linha, rotulo] = marcas[i].children;
      const x = naTela(m).toFixed(1);
      const grande = Math.round(m / tique) % 5 === 0;

      marcas[i].style.display = '';
      linha.setAttribute('x1', x);
      linha.setAttribute('x2', x);
      linha.setAttribute('y1', PISTA.chao);
      linha.setAttribute('y2', PISTA.chao + (grande ? 9 : 5));
      linha.classList.toggle('cobra-marca--grande', grande);

      rotulo.setAttribute('x', x);
      rotulo.setAttribute('y', PISTA.chao + 24);
      rotulo.textContent = grande && m >= 0 ? `${Math.round(m)} m` : '';
    }

    for (; i < marcas.length; i += 1) marcas[i].style.display = 'none';
  }

  /**
   * A cobra: um traço só, serpenteando atrás da cabeça.
   *
   * O ALERTA É SÓ PESO E OPACIDADE, SEM COR NOVA. No digita. a cor quer dizer
   * DEDO, e o ponto já está pintado pelo próximo dedo; uma cobra colorida
   * criaria um segundo significado para a cor na mesma tela. A proximidade
   * (de 0, longe, a 1, colada) engrossa o traço e mistura
   * --cor-texto-secundario com --cor-texto — as duas cores que o tema já
   * tem. Por cima, um pulso de um segundo na opacidade, tanto mais fundo
   * quanto mais perto.
   */
  function desenharCobra() {
    const cabeca = capturado ? naTela(jogadorNaTela) : naTela(cobra);

    let d = '';
    for (let s = 0; s <= CORPO.comprimento; s += CORPO.passo) {
      const abertura = Math.min(1, s / CORPO.pescoco);
      const x = cabeca - s;
      const y =
        PISTA.eixo + CORPO.altura * abertura * Math.sin((2 * Math.PI * s) / CORPO.onda - fase);
      d += `${s === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    partes.cobra.setAttribute('d', d);

    const proximidade = capturado
      ? 1
      : Math.min(1, Math.max(0, 1 - folego() / FOLEGO_DO_ALERTA));

    // 0 → 1 → 0, a cada segundo.
    const pulso = 0.5 - 0.5 * Math.cos((2 * Math.PI * tempoDeTela) / CICLO_DO_PULSO);

    partes.cobra.style.strokeWidth = (
      TRACO_LONGE +
      (TRACO_PERTO - TRACO_LONGE) * proximidade
    ).toFixed(2);
    partes.cobra.style.stroke = `color-mix(in srgb, var(--cor-texto) ${Math.round(
      proximidade * 100
    )}%, var(--cor-texto-secundario))`;
    partes.cobra.style.opacity = (1 - 0.45 * proximidade * (1 - pulso)).toFixed(3);
  }

  /* --- O teclado de quem joga ------------------------------------------- */

  function aoTeclar(evento) {
    if (prepararTecla(evento) || capturado) return;

    // Voltar da pausa: a tecla só tira da pausa, e não conta.
    if (pausado) {
      pausado = false;
      relogioDoJogo.zerarPasso();
      ultimaTecla = null;
      avisar(null);
      return;
    }

    if (evento.repeat) return;
    if ([...evento.key].length !== 1) return; // Shift, Enter, setas, acento solto…

    // Caps Lock, como na lição: aviso, som de erro, e a tecla não conta —
    // nem como acerto, nem como erro.
    if (evento.getModifierState?.('CapsLock')) {
      avisar('licao.capsLock');
      tocarErroDeJogo();
      return;
    }
    avisar(null);

    if (!comecou) {
      comecou = true;
      partes.dica.hidden = true;
      partes.leitor.textContent = t('jogos.cobra.saiu');
    }

    if (evento.key === texto[posicao]) acertar();
    else errar();
  }

  function aoSoltar(evento) {
    if (evento.key === 'CapsLock' && !evento.getModifierState?.('CapsLock')) avisar(null);
  }

  function acertar() {
    // Quanto mais rápido o acerto, maior o salto.
    const instante = agora();
    const intervalo = ultimaTecla === null ? ritmo : Math.max(0.02, instante - ultimaTecla);
    const fator = Math.min(SALTO_MAXIMO, Math.max(SALTO_MINIMO, Math.sqrt(ritmo / intervalo)));
    ultimaTecla = instante;

    acertos += 1;
    combo += 1;
    comboMaximo = Math.max(comboMaximo, combo);

    let avanco = SALTO * fator;
    const deuFolego = combo % COMBO_A_CADA === 0;
    if (deuFolego) avanco += FOLEGO_DO_COMBO;

    jogador += avanco;

    // Mais longe que a folga máxima, a cobra vem junto.
    cobra = Math.max(cobra, jogador - FOLEGO_MAXIMO * velocidade);

    if (deuFolego) tocarFolego();
    else tocarToqueDeJogo();

    // A letra da vez vira certa, e a fita anda.
    const span = letras[posicao];
    span.classList.remove('letra--atual', 'letra--errada');
    span.classList.add('letra--certa');

    posicao += 1;
    if (posicao > texto.length - 60) acrescentarPalavras(20);
    marcarLetraDaVez();
  }

  function errar() {
    erros += 1;
    combo = 0;
    ultimaTecla = agora();

    jogador -= RECUO;
    tocarErroDeJogo();

    // A letra da vez fica marcada de erro até sair a tecla certa — como na
    // lição, o cursor não anda no erro.
    letras[posicao].classList.add('letra--errada');

    if (cobra >= jogador) capturar();
  }

  /* --- A captura e o fim ------------------------------------------------ */

  function capturar() {
    if (capturado) return;

    capturado = true;
    cobra = jogador;
    jogadorNaTela = jogador;
    fimDaCaptura = relogio + ESPERA_NO_FIM;
    partes.leitor.textContent = t('jogos.cobra.fim');
    tocarCaptura();
  }

  function resumo() {
    // O tempo do fim é o da captura, sem a cena parada depois dela.
    const segundos = capturado ? fimDaCaptura - ESPERA_NO_FIM : relogio;
    const total = acertos + erros;

    return {
      capturado,
      nivel,
      media,
      distancia: Math.max(0, Math.floor(jogador)),
      ppm: segundos >= 1 ? Math.round(acertos / CARACTERES_POR_PALAVRA / (segundos / 60)) : 0,
      precisao: total ? Math.round((acertos / total) * 100) : 100,
      comboMaximo,
      segundos,
    };
  }

  function terminar(pelaCobra) {
    const resultado = { ...resumo(), capturado: pelaCobra };
    encerrar();
    aoTerminar(resultado);
  }

  /* --- Pausa: sair da janela para a cobra ------------------------------- */

  const pararDeVigiar = vigiarJanela({
    aoSair() {
      if (!comecou || capturado || pausado) return;

      pausado = true;
      avisar('jogos.pausado');
    },
  });

  destino.querySelector('[data-acao="encerrar"]').addEventListener('click', () => terminar(false));

  window.addEventListener('keydown', aoTeclar);
  window.addEventListener('keyup', aoSoltar);
  soltarFoco();

  function encerrar() {
    relogioDoJogo.parar();
    pararDeVigiar();
    window.removeEventListener('keydown', aoTeclar);
    window.removeEventListener('keyup', aoSoltar);
  }

  /** Troca os textos para o idioma novo, sem mexer em nada da partida. */
  function retraduzir() {
    traduzirPagina(destino);
    avisar(avisoAtual);
  }

  return {
    encerrar,
    retraduzir,
    // Só para inspecionar pelo console; o jogo não usa.
    espiar: () => ({
      comecou, pausado, capturado, relogio, jogador, cobra, folego: folego(), multiplicador,
      velocidade, escala, tique, posicao, letraDaVez: texto[posicao], acertos, erros, combo,
      comboMaximo, resumo: resumo(),
    }),
  };
}

/* ==========================================================================
   TELA 3 — o fim
   ========================================================================== */

/**
 * @param {HTMLElement} destino
 * @param {object} resultado  o que `iniciar` entregou ao terminar
 * @param {object} acoes  aoJogarDeNovo, aoTrocarNivel, aoVoltar
 */
export function mostrarFim(destino, resultado, acoes) {
  montarFim(destino, {
    ...acoes,
    titulo: resultado.capturado ? t('jogos.cobra.fim') : t('jogos.encerrada'),
    subtitulo: [
      t('jogos.cobra.nome'),
      t('jogos.cobra.modo'),
      t(`jogos.niveis.${resultado.nivel}`),
    ].join(' · '),
    numeros: [
      { valor: resultado.distancia, sufixo: ' m', rotulo: t('jogos.cobra.distancia') },
      {
        valor: resultado.ppm,
        rotulo: t('jogos.cobra.ppmESuaMedia').replace('{ppm}', resultado.media),
      },
      { valor: `${resultado.precisao}%`, rotulo: t('jogos.precisao') },
      { valor: resultado.comboMaximo, rotulo: t('jogos.comboMaximo') },
      { valor: formatarTempo(resultado.segundos), rotulo: t('jogos.cobra.sobrevivido') },
    ],
  });
}
