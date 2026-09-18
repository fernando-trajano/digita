/* ==========================================================================
   fila.js — o jogo Fila.

   As letras nascem no topo numa taxa que acelera com o tempo e descem até
   encostar na pilha. Você digita sempre a de BAIXO: é uma fila única, nunca
   há dúvida sobre qual é a próxima. A pilha encostar no topo acaba a
   partida. Não existe ganhar — existe sobreviver.

   A partida espera parada até a primeira letra: as três primeiras já estão
   na pilha, para quem vai jogar ver o que vem, e o relógio só anda depois
   do primeiro toque.
   ========================================================================== */

import { t, nomeDoDedo, traduzirPagina } from '../i18n.js';
import { destacarTecla, limparDestaque, piscarErro } from '../teclado.js';
import { desenharMaos, destacarDedo, limparDedos } from '../maos.js';
import { dedoDaTecla } from '../../dados/layouts/dedos.js';
import { tocarToqueDeJogo, tocarErroDeJogo } from '../som.js';
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
 * Posições da pilha. As duas de cima são o limite, marcadas de leve.
 * O CSS usa o mesmo número (procure "8 *" nas regras .fila- do jogos.css):
 * mudando aqui, mude lá também.
 */
const CAPACIDADE = 8;

/** Nunca menos que isto na tela: quem joga nunca fica sem o que digitar. */
const MINIMO_VISIVEL = 3;

/** Velocidade da queda e do degrau, em posições por segundo. */
const VELOCIDADE_DE_QUEDA = 16;

/** Quanto dura o voo da tecla até o teclado, no acerto, em segundos. */
const DURACAO_DO_VOO = 0.16;

/** O intervalo entre nascimentos nunca desce abaixo disto, em segundos. */
const INTERVALO_MINIMO = 0.28;

/** Quanto a pilha cheia fica na tela antes do resumo, em segundos. */
const ESPERA_NO_FIM = 0.7;

/**
 * Os níveis mudam DUAS coisas, e só elas:
 *
 *   inicial    o intervalo entre uma letra e a próxima no começo, em s
 *   meiaVida   em quantos segundos esse intervalo cai pela metade — é a
 *              rapidez da aceleração
 *
 * A conta é intervalo(t) = inicial × 0,5^(t / meiaVida), com o piso acima.
 * No médio, por exemplo: 1,0s no começo, 0,5s com um minuto, 0,25s... até o
 * piso de 0,28s, perto dos dois minutos.
 */
const NIVEIS = {
  facil: { inicial: 1.4, meiaVida: 90 },
  medio: { inicial: 1.0, meiaVida: 60 },
  dificil: { inicial: 0.75, meiaVida: 40 },
};

/** Só letras minúsculas: sem maiúscula, sem acento, sem pontuação, sem número. */
const LETRAS = 'abcdefghijklmnopqrstuvwxyz';

/* --------------------------------------------------------------------------
   O TECLADO ILUSTRADO — só as três fileiras de letras. Sem a barra de
   espaço: nesta versão o espaço não cai como letra, e apertá-lo não faz
   nada.

   As posições estão em PASSOS (lado de uma tecla mais o vão). O
   deslocamento de cada fileira é o de um teclado de verdade: a fileira do A
   começa um quarto de tecla à direita da do Q, e a do Z, três quartos.

   As letras de A a Z ficam no mesmo lugar no ABNT2 e no americano, então
   este desenho vale para os dois.
   -------------------------------------------------------------------------- */

const FILEIRAS = [
  { deslocamento: 0, teclas: 'qwertyuiop' },
  { deslocamento: 0.25, teclas: 'asdfghjkl' },
  { deslocamento: 0.75, teclas: 'zxcvbnm' },
];

/** O código físico da tecla de uma letra: "f" → "KeyF". */
const codigoDaLetra = (letra) => `Key${letra.toUpperCase()}`;

/* --------------------------------------------------------------------------
   AS PISTAS

   Cada dedo tem uma pista horizontal, e a letra cai na pista do dedo que a
   digita: a posição lateral dela já diz qual dedo usar. As pistas ficam em
   cima da tecla de descanso de cada dedo, na fileira do meio.

   O indicador cuida de DUAS colunas (F e G; H e J), então a pista dele fica
   no meio das duas. Isso o afasta um passo e meio da pista do médio, e três
   e meio da do mínimo — não há como confundir as três.

   O mínimo direito não tem tecla de descanso desenhada (o Ç e o ; ficam de
   fora, porque só caem letras). A pista dele fica onde ela estaria, um passo
   depois do L: a mesma distância que separa as outras pistas vizinhas.
   -------------------------------------------------------------------------- */

const PISTAS = {
  'esquerda-minimo': 0.25 + 0,
  'esquerda-anelar': 0.25 + 1,
  'esquerda-medio': 0.25 + 2,
  'esquerda-indicador': 0.25 + 3.5,
  'direita-indicador': 0.25 + 5.5,
  'direita-medio': 0.25 + 7,
  'direita-anelar': 0.25 + 8,
  'direita-minimo': 0.25 + 9,
};

/* ==========================================================================
   TELA 1 — o começo
   ========================================================================== */

/**
 * @param {HTMLElement} destino
 * @param {{aoEscolher: (nivel: string) => void, aoVoltar: () => void}} opcoes
 */
export function mostrarInicio(destino, { aoEscolher, aoVoltar }) {
  montarInicio(destino, { jogo: 'fila', ajuda: t('jogos.fila.ajuda'), aoEscolher, aoVoltar });
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
  const regras = NIVEIS[nivel];

  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    `
      <div class="jogo-partida fila-jogo">
        ${montarTopo([
          { papel: 'tempo', valor: '0:00', chave: 'jogos.tempo' },
          { papel: 'acertos', valor: '0', chave: 'jogos.acertos' },
          { papel: 'combo', valor: '0', chave: 'jogos.combo' },
        ])}

        <div class="fila-palco" data-papel="palco">
          <div class="fila-campo">
            <div class="fila-limite" aria-hidden="true"></div>
            <div class="fila-linha-acerto" aria-hidden="true"></div>
            <p class="fila-espera" data-papel="espera" data-i18n="jogos.fila.espera">${t('jogos.fila.espera')}</p>
            <p class="fila-pausa" data-papel="pausa" data-i18n="jogos.pausado" hidden>${t('jogos.pausado')}</p>
          </div>
          <div class="fila-teclado" data-papel="teclado" data-modo="cinza" aria-hidden="true"></div>
          <div data-papel="maos"></div>
        </div>

        <p class="apenas-leitor-de-tela" data-papel="legenda" role="status"></p>
      </div>
    `
  );

  const partes = {
    palco: destino.querySelector('[data-papel="palco"]'),
    teclado: destino.querySelector('[data-papel="teclado"]'),
    maos: destino.querySelector('[data-papel="maos"]'),
    pausa: destino.querySelector('[data-papel="pausa"]'),
    espera: destino.querySelector('[data-papel="espera"]'),
    tempo: destino.querySelector('[data-papel="tempo"]'),
    acertos: destino.querySelector('[data-papel="acertos"]'),
    combo: destino.querySelector('[data-papel="combo"]'),
    legenda: destino.querySelector('[data-papel="legenda"]'),
  };

  desenharTecladoDaFila(partes.teclado);
  desenharMaos(partes.maos);

  /* ------------------------------------------------------------------------
     A MEDIDA — em pixels, lida do próprio desenho.

     Tudo no CSS está em --u, uma unidade que acompanha a altura da tela.
     Aqui ela é convertida em pixels uma vez, e de novo quando a janela muda
     de tamanho, para as teclas que caem usarem exatamente a mesma conta.
     ------------------------------------------------------------------------ */

  let m = medir();

  function medir() {
    const u = partes.teclado.querySelector('.tecla').getBoundingClientRect().width;
    const vao = u * 0.12;

    return {
      u,
      passo: u + vao,
      degrau: u * 1.15,
      alturaDoCampo: CAPACIDADE * u * 1.15,
      topoDoTeclado: CAPACIDADE * u * 1.15 + u * 0.6,
    };
  }

  const aoRedimensionar = () => {
    m = medir();
  };

  /** O x (canto esquerdo, em px) da pista de um dedo. */
  const xDaPista = (pista) => PISTAS[pista] * m.passo;

  /** O y (topo, em px) de uma posição da pilha; 0 é a de baixo. */
  const yDaPosicao = (posicao) => m.alturaDoCampo - (posicao + 1) * m.degrau;

  /** Onde fica a tecla de uma letra no teclado desenhado. */
  function lugarNoTeclado(letra) {
    const fileira = FILEIRAS.findIndex((f) => f.teclas.includes(letra));
    const coluna = FILEIRAS[fileira].teclas.indexOf(letra);

    return {
      x: (FILEIRAS[fileira].deslocamento + coluna) * m.passo,
      y: m.topoDoTeclado + fileira * m.passo,
    };
  }

  /* ------------------------------------------------------------------------
     O ESTADO DA PARTIDA
     ------------------------------------------------------------------------ */

  const fila = []; // da de baixo para a de cima; a [0] é a da vez
  const voando = []; // as que acabaram de ser acertadas, a caminho do teclado

  let relogio = 0; // o tempo de JOGO, em segundos, desde o primeiro toque
  let proximoNascimento = regras.inicial;
  let comecou = false; // a partida espera parada até a primeira letra
  let pausado = false;
  let terminou = false;
  let esperaDoFim = 0; // quanto ainda mostrar a pilha cheia, em segundos
  let resultado = null;

  let acertos = 0;
  let erros = 0;
  let nascidas = 0;
  let combo = 0;
  let comboMaximo = 0;

  let ultimaLetra = '';
  let vezAnterior = null;

  function intervalo() {
    return Math.max(INTERVALO_MINIMO, regras.inicial * 0.5 ** (relogio / regras.meiaVida));
  }

  /** Uma letra nova, no topo — nunca a mesma duas vezes seguidas. */
  function nascer() {
    let letra;
    do {
      letra = LETRAS[Math.floor(Math.random() * LETRAS.length)];
    } while (letra === ultimaLetra);
    ultimaLetra = letra;

    const { mao, dedo } = dedoDaTecla(codigoDaLetra(letra));

    const elemento = document.createElement('div');
    elemento.className = `fila-peca fila-peca--${dedo}`;
    elemento.textContent = letra;
    partes.palco.append(elemento);

    // Nasce acima do topo, e acima da anterior se ela ainda estiver lá em
    // cima: as que nascem juntas não caem uma por cima da outra.
    const acimaDaAnterior = fila.length ? fila.at(-1).y + 1 : -Infinity;

    fila.push({
      letra,
      pista: `${mao}-${dedo}`,
      mao,
      dedo,
      y: Math.max(CAPACIDADE + 0.3, acimaDaAnterior),
      elemento,
    });

    nascidas += 1;
  }

  // As primeiras letras já nascem apoiadas na pilha, cada uma no seu lugar:
  // quem vai jogar vê o que vem antes de começar, e nada cai enquanto a
  // partida espera o primeiro toque.
  while (fila.length < MINIMO_VISIVEL) nascer();
  fila.forEach((peca, posicao) => {
    peca.y = posicao;
  });

  /* ------------------------------------------------------------------------
     O QUADRO
     ------------------------------------------------------------------------ */

  const relogioDoJogo = criarRelogio((passo) => {
    // Antes do primeiro toque, nada anda: nem o relógio, nem as letras, e
    // nenhuma nasce.
    if (comecou && !pausado && !terminou) {
      relogio += passo;
      alimentar();
      mover(passo);
      conferirFim();
    }

    avancarVoos(passo);
    desenhar();

    // Terminada a partida, a pilha cheia fica um instante na tela antes do
    // resumo. A espera é medida pelo mesmo relógio, e não por um timer.
    if (terminou) {
      esperaDoFim -= passo;

      if (esperaDoFim <= 0) {
        encerrar();
        aoTerminar(resultado);
        return false;
      }
    }

    return true;
  });

  function alimentar() {
    // Quem joga nunca fica sem o que digitar.
    while (fila.length < MINIMO_VISIVEL) nascer();

    if (relogio >= proximoNascimento) {
      if (fila.length < CAPACIDADE) nascer();
      proximoNascimento = relogio + intervalo();
    }
  }

  /** Cada letra desce até a posição que é dela na fila. */
  function mover(passo) {
    fila.forEach((peca, posicao) => {
      peca.y = Math.max(posicao, peca.y - VELOCIDADE_DE_QUEDA * passo);
    });
  }

  /** A pilha encostou no topo: a última posição está ocupada e parada. */
  function conferirFim() {
    const topo = fila[CAPACIDADE - 1];
    if (topo && topo.y <= CAPACIDADE - 1 + 0.001) terminar(true);
  }

  function avancarVoos(passo) {
    for (const voo of [...voando]) {
      voo.t += passo / DURACAO_DO_VOO;

      if (voo.t >= 1) {
        voo.elemento.remove();
        voando.splice(voando.indexOf(voo), 1);
      }
    }
  }

  /* ------------------------------------------------------------------------
     O DESENHO
     ------------------------------------------------------------------------ */

  function desenhar() {
    fila.forEach((peca, posicao) => {
      const x = xDaPista(peca.pista);
      const y = yDaPosicao(peca.y);

      peca.elemento.style.transform = `translate(${x}px, ${y}px)`;
      // Acima do topo ela ainda não apareceu.
      peca.elemento.style.opacity = peca.y > CAPACIDADE - 0.1 ? '0' : '1';
      peca.elemento.classList.toggle('fila-peca--vez', posicao === 0);
    });

    // O voo até o teclado: sai da linha de acerto e encaixa na tecla,
    // apagando no último terço.
    for (const voo of voando) {
      const t_ = 1 - (1 - voo.t) ** 3; // desacelera ao chegar
      const x = voo.de.x + (voo.para.x - voo.de.x) * t_;
      const y = voo.de.y + (voo.para.y - voo.de.y) * t_;

      voo.elemento.style.transform = `translate(${x}px, ${y}px)`;
      voo.elemento.style.opacity = String(Math.min(1, (1 - voo.t) * 3));
    }

    partes.tempo.textContent = formatarTempo(relogio);
    partes.acertos.textContent = acertos;
    partes.combo.textContent = combo;

    apontarVez();
  }

  /** A tecla da vez acesa no teclado, e a bolinha no dedo — como na lição. */
  function apontarVez(forcar = false) {
    const vez = fila[0] ?? null;
    if (vez === vezAnterior && !forcar) return;
    vezAnterior = vez;

    limparDestaque(partes.teclado);
    limparDedos(partes.maos);

    if (!vez) {
      partes.legenda.textContent = '';
      return;
    }

    destacarTecla(partes.teclado, codigoDaLetra(vez.letra));
    destacarDedo(partes.maos, vez.mao, vez.dedo);

    // A legenda existe só para leitores de tela, que não enxergam nem a
    // tecla acesa nem a bolinha no dedo.
    partes.legenda.textContent =
      `${t('licao.proxima')}: ${vez.letra.toUpperCase()} · ${nomeDoDedo(vez.mao, vez.dedo)}`;
  }

  /* ------------------------------------------------------------------------
     O TECLADO DE QUEM JOGA
     ------------------------------------------------------------------------ */

  function aoTeclar(evento) {
    if (prepararTecla(evento) || terminou) return;

    if (pausado) {
      continuar();
      return;
    }

    if (evento.repeat) return;

    // O espaço não faz nada: não há espaço nesta versão.
    const letra = [...evento.key].length === 1 ? evento.key.toLowerCase() : '';
    if (!letra || !LETRAS.includes(letra)) return;

    const vez = fila[0];
    if (!vez) return;

    // O primeiro toque de letra dá a largada — e já conta, certo ou errado.
    // O relógio começa daqui, e não da abertura da tela.
    if (!comecou) {
      comecou = true;
      relogioDoJogo.zerarPasso();
      partes.espera.hidden = true;
    }

    if (letra === vez.letra) acertar();
    else errar(letra);
  }

  function acertar() {
    const peca = fila.shift();

    acertos += 1;
    combo += 1;
    comboMaximo = Math.max(comboMaximo, combo);

    // A tecla sai da linha de acerto e encaixa na tecla do teclado. As de
    // cima descem um degrau sozinhas, porque a posição de cada uma é o lugar
    // dela na fila.
    voando.push({
      elemento: peca.elemento,
      de: { x: xDaPista(peca.pista), y: yDaPosicao(peca.y) },
      para: lugarNoTeclado(peca.letra),
      t: 0,
    });

    peca.elemento.classList.remove('fila-peca--vez');

    // Um tom que sobe conforme o combo cresce: meio tom a cada dois
    // acertos, até sete.
    tocarToqueDeJogo(Math.min(7, Math.floor(combo / 2)));
  }

  /** O erro custa só o tempo perdido: a letra fica, e nada é tirado. */
  function errar(letraApertada) {
    erros += 1;
    combo = 0;

    const vez = fila[0];
    vez.elemento.classList.remove('fila-peca--erro');
    void vez.elemento.offsetWidth; // reinicia a animação
    vez.elemento.classList.add('fila-peca--erro');

    piscarErro(partes.teclado, codigoDaLetra(letraApertada));
    tocarErroDeJogo();
  }

  /* ------------------------------------------------------------------------
     PAUSA — sair da janela no meio da partida não pode custar a partida.
     ------------------------------------------------------------------------ */

  const pararDeVigiar = vigiarJanela({
    aoSair() {
      // Antes da largada não há o que pausar: nada está andando.
      if (!comecou || terminou) return;

      pausado = true;
      partes.pausa.hidden = false;
    },
  });

  function continuar() {
    pausado = false;
    partes.pausa.hidden = true;
    relogioDoJogo.zerarPasso();
  }

  /* ------------------------------------------------------------------------
     O FIM
     ------------------------------------------------------------------------ */

  function terminar(pelaPilha) {
    if (terminou) return;
    terminou = true;
    esperaDoFim = ESPERA_NO_FIM;

    resultado = {
      nivel,
      pelaPilha,
      acertos,
      total: nascidas,
      precisao: acertos + erros ? Math.round((acertos / (acertos + erros)) * 100) : 100,
      comboMaximo,
      tempo: relogio,
    };

    partes.pausa.hidden = true;
  }

  // "Encerrar" não espera: vai direto para o resumo.
  destino.querySelector('[data-acao="encerrar"]').addEventListener('click', () => {
    terminar(false);
    encerrar();
    aoTerminar(resultado);
  });

  window.addEventListener('keydown', aoTeclar);
  window.addEventListener('resize', aoRedimensionar);
  soltarFoco();

  // O primeiro desenho sai já, sem esperar o primeiro quadro: as três letras
  // aparecem nos lugares delas, e não amontoadas no canto por um instante.
  desenhar();

  function encerrar() {
    relogioDoJogo.parar();
    pararDeVigiar();
    window.removeEventListener('keydown', aoTeclar);
    window.removeEventListener('resize', aoRedimensionar);
  }

  /** Troca os textos para o idioma novo, sem mexer em nada da partida. */
  function retraduzir() {
    traduzirPagina(destino);
    apontarVez(true);
  }

  return {
    encerrar,
    retraduzir,
    // Só para inspecionar pelo console; o jogo não usa.
    espiar: () => ({
      comecou, relogio, intervalo: intervalo(), fila: fila.map((p) => p.letra).join(''),
      alturas: fila.map((p) => +p.y.toFixed(2)), acertos, erros, nascidas, u: m.u,
    }),
  };
}

/** As três fileiras de letras, no mesmo desenho de tecla da lição. */
function desenharTecladoDaFila(destino) {
  destino.replaceChildren();

  FILEIRAS.forEach((fileira, f) => {
    [...fileira.teclas].forEach((letra, c) => {
      const tecla = document.createElement('div');
      tecla.className = 'tecla tecla--neutro';
      tecla.dataset.codigo = codigoDaLetra(letra);
      tecla.textContent = letra.toUpperCase();
      tecla.style.left = `calc(${fileira.deslocamento + c} * var(--passo))`;
      tecla.style.top = `calc(${f} * var(--passo))`;

      // O risquinho em relevo do F e do J.
      if (letra === 'f' || letra === 'j') tecla.classList.add('tecla--referencia');

      destino.append(tecla);
    });
  });
}

/* ==========================================================================
   TELA 3 — o fim. Sem PPM: o ritmo de chegada é do jogo, não de quem joga.
   ========================================================================== */

/**
 * @param {HTMLElement} destino
 * @param {object} resultado  o que `iniciar` entregou ao terminar
 * @param {object} acoes  aoJogarDeNovo, aoTrocarNivel, aoVoltar
 */
export function mostrarFim(destino, resultado, acoes) {
  montarFim(destino, {
    ...acoes,
    titulo: resultado.pelaPilha ? t('jogos.fila.fim') : t('jogos.encerrada'),
    subtitulo: `${t('jogos.fila.nome')} · ${t(`jogos.niveis.${resultado.nivel}`)}`,
    numeros: [
      { valor: resultado.acertos, sufixo: ` / ${resultado.total}`, rotulo: t('jogos.fila.acertadas') },
      { valor: `${resultado.precisao}%`, rotulo: t('jogos.precisao') },
      { valor: resultado.comboMaximo, rotulo: t('jogos.comboMaximo') },
      { valor: formatarTempo(resultado.tempo), rotulo: t('jogos.fila.sobrevivido') },
    ],
  });
}
