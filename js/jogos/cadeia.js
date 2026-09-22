/* ==========================================================================
   cadeia.js — o jogo Cadeia.

   Uma sequência curta de letras aparece por um instante e some. Quem joga
   digita de memória, no escuro: a tela fica vazia, sem as letras digitadas,
   sem correção e sem contador. Só no fim da sequência vem o resultado.

   Acertou a sequência inteira: a próxima tem um caractere a mais. Errou:
   volta ao tamanho anterior. Começa com dois.

   Não há teclado desenhado nem mãos: o jogo é digitar sem olhar, e um
   teclado na tela seria exatamente a muleta que ele quer tirar.
   ========================================================================== */

import { t, traduzirPagina } from '../i18n.js';
import { tocarToqueDeJogo, tocarSucessoDeJogo, tocarErroDeJogo } from '../som.js';
import {
  criarRelogio,
  criarContagemDeTeclas,
  vigiarJanela,
  prepararTecla,
  soltarFoco,
  montarInicio,
  montarFim,
  montarTopo,
} from './comum.js';

/* --------------------------------------------------------------------------
   AS REGRAS, em números.
   -------------------------------------------------------------------------- */

/** O tamanho da primeira sequência — e o mínimo, depois de errar. */
const TAMANHO_INICIAL = 2;

/**
 * Quanto tempo a sequência fica na tela, POR LETRA, em segundos.
 *
 * O tempo de exibição é proporcional ao tamanho: tempo × letras. É a única
 * coisa que o nível muda. No médio: 1,0s para duas letras, 2,5s para cinco,
 * 4,0s para oito.
 */
const POR_LETRA = { facil: 0.7, medio: 0.5, dificil: 0.35 };

/** O respiro antes de cada sequência aparecer, em segundos. */
const RESPIRO = 0.7;

/** Quanto o resultado fica na tela antes da próxima rodada, em segundos. */
const TEMPO_DO_RESULTADO = 1.6;

/**
 * Os sons do fim da sequência saem um instante depois do último toque,
 * para o ouvido separar um do outro.
 */
const ATRASO_DO_VEREDITO = 0.07;

const LETRAS = 'abcdefghijklmnopqrstuvwxyz';

/* ==========================================================================
   TELA 1 — o começo
   ========================================================================== */

/**
 * @param {HTMLElement} destino
 * @param {{aoEscolher: (nivel: string) => void, aoVoltar: () => void}} opcoes
 */
export function mostrarInicio(destino, { aoEscolher, aoVoltar }) {
  montarInicio(destino, { jogo: 'cadeia', ajuda: t('jogos.cadeia.ajuda'), aoEscolher, aoVoltar });
}

/* ==========================================================================
   TELA 2 — a partida

   Uma rodada tem quatro fases, e o relógio passa de uma para a outra:

     respiro     a tela vazia, antes da sequência
     mostrando   a sequência na tela, pelo tempo do nível × o tamanho
     digitando   a tela vazia de novo; termina quando o tamanho é atingido
     resultado   a sequência, a resposta e o veredito
   ========================================================================== */

/**
 * @param {HTMLElement} destino
 * @param {{nivel: string, aoTerminar: (resultado: object) => void}} opcoes
 * @returns {{encerrar: () => void, retraduzir: () => void, espiar: () => object}}
 */
export function iniciar(destino, { nivel, aoTerminar }) {
  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    `
      <div class="jogo-partida cadeia-jogo">
        ${montarTopo([
          { papel: 'tamanho', valor: TAMANHO_INICIAL, chave: 'jogos.cadeia.letras' },
          { papel: 'melhor', valor: '0', chave: 'jogos.cadeia.melhor' },
        ])}

        <div class="cadeia-palco">
          <p class="cadeia-sequencia" data-papel="sequencia" aria-hidden="true"></p>
          <p class="cadeia-resposta" data-papel="resposta" aria-hidden="true"></p>
          <p class="cadeia-veredito" data-papel="veredito"></p>
          <p class="cadeia-pausa" data-papel="pausa" data-i18n="jogos.cadeia.pausado" hidden>${t('jogos.cadeia.pausado')}</p>
        </div>

        <p class="apenas-leitor-de-tela" data-papel="leitor" role="status"></p>
      </div>
    `
  );

  const partes = {
    sequencia: destino.querySelector('[data-papel="sequencia"]'),
    resposta: destino.querySelector('[data-papel="resposta"]'),
    veredito: destino.querySelector('[data-papel="veredito"]'),
    pausa: destino.querySelector('[data-papel="pausa"]'),
    tamanho: destino.querySelector('[data-papel="tamanho"]'),
    melhor: destino.querySelector('[data-papel="melhor"]'),
    leitor: destino.querySelector('[data-papel="leitor"]'),
  };

  /* --- O estado ------------------------------------------------------- */

  let tamanho = TAMANHO_INICIAL; // o da rodada que está na tela
  let proximoTamanho = TAMANHO_INICIAL; // decidido no fim de cada rodada
  let sequencia = '';
  let digitado = '';

  let fase = 'respiro';
  let fimDaFase = null; // em segundos de relógio; null = espera a tecla
  let relogio = 0;
  let pausado = false;
  let ausente = false; // a janela perdeu o foco ou foi escondida

  let rodadas = 0;
  let maisLonga = 0; // a maior sequência digitada inteira
  let seguidas = 0;
  let melhorSeguidas = 0;

  // Acertos e erros de cada letra, para o mapa de calor das estatísticas.
  const contagem = criarContagemDeTeclas();

  /** Uma sequência nova — sem a mesma letra duas vezes seguidas. */
  function sortearSequencia(n) {
    let s = '';
    while (s.length < n) {
      const letra = LETRAS[Math.floor(Math.random() * LETRAS.length)];
      if (letra !== s.at(-1)) s += letra;
    }
    return s;
  }

  function entrarEm(novaFase, duracao) {
    fase = novaFase;
    fimDaFase = duracao === null ? null : relogio + duracao;
    desenhar();
  }

  function comecarRodada() {
    tamanho = proximoTamanho;
    sequencia = sortearSequencia(tamanho);
    digitado = '';
    entrarEm('respiro', RESPIRO);
  }

  /* --- O relógio ------------------------------------------------------ */

  const relogioDoJogo = criarRelogio((passo) => {
    // Quem está fora da janela não pode perder a sequência: se ela está (ou
    // vai estar) na tela, o jogo para e espera a volta.
    if (ausente && !pausado && (fase === 'respiro' || fase === 'mostrando')) pausar();

    if (pausado) return;

    relogio += passo;

    if (fimDaFase !== null && relogio >= fimDaFase) {
      if (fase === 'respiro') entrarEm('mostrando', POR_LETRA[nivel] * tamanho);
      else if (fase === 'mostrando') entrarEm('digitando', null);
      else if (fase === 'resultado') comecarRodada();
    }
  });

  /* --- O desenho --------------------------------------------------------

     Três estados de tela, e dois deles vazios de propósito.
     ---------------------------------------------------------------------- */

  /** Escreve uma letra por <span>; `errada(i)` marca as que não batem. */
  function escreverLetras(onde, letras, errada = () => false) {
    onde.replaceChildren(
      ...[...letras].map((letra, i) => {
        const span = document.createElement('span');
        span.textContent = letra;
        if (errada(i)) span.className = 'cadeia-letra--errada';
        return span;
      })
    );
  }

  const soletrar = (letras) => [...letras].join(' ');

  function desenhar() {
    partes.tamanho.textContent = tamanho;
    partes.melhor.textContent = maisLonga;

    partes.sequencia.replaceChildren();
    partes.resposta.replaceChildren();
    partes.veredito.textContent = '';

    if (fase === 'mostrando') {
      escreverLetras(partes.sequencia, sequencia);
      // O leitor de tela precisa ouvir a sequência, letra por letra.
      partes.leitor.textContent = t('jogos.cadeia.memorize').replace('{letras}', soletrar(sequencia));
      return;
    }

    if (fase === 'digitando') {
      partes.leitor.textContent = t('jogos.cadeia.digite').replace('{quantas}', tamanho);
      return;
    }

    if (fase === 'resultado') {
      const certa = digitado === sequencia;

      escreverLetras(partes.sequencia, sequencia);

      // A resposta só aparece se errou: acertando, ela seria só uma cópia.
      if (!certa) escreverLetras(partes.resposta, digitado, (i) => digitado[i] !== sequencia[i]);

      partes.veredito.textContent = t(certa ? 'jogos.cadeia.certo' : 'jogos.cadeia.errou');
      partes.leitor.textContent = certa
        ? t('jogos.cadeia.leitorCerto')
        : t('jogos.cadeia.leitorErrou')
            .replace('{certa}', soletrar(sequencia))
            .replace('{digitada}', soletrar(digitado));
    }
  }

  /* --- O teclado de quem joga ------------------------------------------- */

  function aoTeclar(evento) {
    if (prepararTecla(evento)) return;

    // Uma tecla é prova de que a pessoa está de volta.
    ausente = false;

    // Voltar da pausa: a tecla só tira da pausa, e não conta. A rodada
    // recomeça do respiro, e a sequência aparece de novo inteira.
    if (pausado) {
      pausado = false;
      partes.pausa.hidden = true;
      relogioDoJogo.zerarPasso();
      entrarEm('respiro', RESPIRO);
      return;
    }

    if (evento.repeat || fase !== 'digitando') return;

    // Só letras contam. Backspace não apaga — digitar às cegas é assumir
    // cada tecla — e Shift, acento, número e espaço são ignorados, sem som.
    const letra = [...evento.key].length === 1 ? evento.key.toLowerCase() : '';
    if (!letra || !LETRAS.includes(letra)) return;

    digitado += letra;

    /* O toque de CADA tecla é neutro, e exatamente o mesmo para a certa e a
       errada. É a regra mais importante do som deste jogo: se o acerto
       soasse diferente do erro, o ouvido entregaria a resposta antes do fim
       da sequência. Por isso o som é pedido ANTES de qualquer comparação —
       ele não tem como saber se a tecla estava certa. */
    tocarToqueDeJogo();

    if (digitado.length === tamanho) julgar();
  }

  function julgar() {
    rodadas += 1;

    // Cada posição conta para a letra que DEVIA estar ali.
    [...sequencia].forEach((letra, i) => {
      if (digitado[i] === letra) contagem.acerto(letra);
      else contagem.erro(letra);
    });

    if (digitado === sequencia) {
      maisLonga = Math.max(maisLonga, tamanho);
      seguidas += 1;
      melhorSeguidas = Math.max(melhorSeguidas, seguidas);
      proximoTamanho = tamanho + 1;
      tocarSucessoDeJogo(ATRASO_DO_VEREDITO);
    } else {
      seguidas = 0;
      proximoTamanho = Math.max(TAMANHO_INICIAL, tamanho - 1);
      tocarErroDeJogo(ATRASO_DO_VEREDITO);
    }

    entrarEm('resultado', TEMPO_DO_RESULTADO);
  }

  /* --- Pausa: só importa enquanto a sequência está à vista ---------------

     Sair da janela no meio da digitação não pausa nada: não há relógio
     correndo, e a pessoa continua de onde parou. Mas se a sequência está na
     tela (ou está para aparecer), ela some e o jogo espera uma tecla.
     ---------------------------------------------------------------------- */

  function pausar() {
    pausado = true;
    partes.pausa.hidden = false;
    partes.sequencia.replaceChildren();
  }

  const pararDeVigiar = vigiarJanela({
    aoSair() {
      ausente = true;
      if (!pausado && (fase === 'mostrando' || fase === 'respiro')) pausar();
    },
    aoVoltar() {
      ausente = false;
    },
  });

  /* --- O fim ------------------------------------------------------------ */

  destino.querySelector('[data-acao="encerrar"]').addEventListener('click', () => {
    encerrar();
    aoTerminar({ nivel, maisLonga, rodadas, melhorSeguidas });
  });

  window.addEventListener('keydown', aoTeclar);
  soltarFoco();

  comecarRodada();

  function encerrar() {
    contagem.gravar();
    relogioDoJogo.parar();
    pararDeVigiar();
    window.removeEventListener('keydown', aoTeclar);
  }

  /** Troca os textos para o idioma novo, sem mexer em nada da partida. */
  function retraduzir() {
    traduzirPagina(destino);
    if (!pausado) desenhar();
  }

  return {
    encerrar,
    retraduzir,
    // Só para inspecionar pelo console; o jogo não usa.
    espiar: () => ({
      fase, relogio, fimDaFase, pausado, tamanho, proximoTamanho, sequencia, digitado,
      rodadas, maisLonga, seguidas, melhorSeguidas,
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
    titulo: t('jogos.cadeia.fim'),
    subtitulo: `${t('jogos.cadeia.nome')} · ${t(`jogos.niveis.${resultado.nivel}`)}`,
    numeros: [
      { valor: resultado.maisLonga, rotulo: t('jogos.cadeia.maisLonga') },
      { valor: resultado.rodadas, rotulo: t('jogos.cadeia.rodadas') },
      { valor: resultado.melhorSeguidas, rotulo: t('jogos.cadeia.serie') },
    ],
  });
}
