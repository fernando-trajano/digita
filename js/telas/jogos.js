/* ==========================================================================
   jogos.js — o menu de Jogos, e quem manda nas telas de cada jogo.

   O menu é a tela de escolha do treino livre, com outros itens: a mesma
   lista em linhas finas, o mesmo ponto marcando o escolhido, a mesma
   ilustração com cross-fade na coluna da direita. Por isso ele usa as
   classes de lá (livre-escolha, livre-modo, ilustracoes…) — é o mesmo
   desenho, e uma mudança num vale para o outro.

   Cada jogo tem três telas, e este arquivo lembra em qual delas se está:

     menu      a escolha do jogo
     inicio    a escolha do nível — clicar nele já entra na partida
     partida   o jogo rodando
     fim       o resumo

   Lembrar é o que permite trocar o idioma sem perder o lugar: o resumo de
   uma partida é redesenhado em inglês, e não jogado fora.
   ========================================================================== */

import { t } from '../i18n.js';
import { CHAVES, ler, gravar } from '../armazenamento.js';
import { JOGOS } from '../../dados/jogos.js';
import * as cobra from '../jogos/cobra.js';
import * as fila from '../jogos/fila.js';
import * as cadeia from '../jogos/cadeia.js';

const MODULOS = { cobra, fila, cadeia };

/** Onde se está agora. */
let onde = { tela: 'menu' };

/** A partida rodando, se houver: { encerrar, retraduzir, espiar }. */
let partida = null;

/* --------------------------------------------------------------------------
   O que fica salvo: só o último jogo escolhido no menu. Os jogos não têm
   nota nem recorde — como o treino livre, eles não entram no progresso.
   -------------------------------------------------------------------------- */

function jogoEscolhido() {
  const { jogo } = ler(CHAVES.jogos, {});
  return JOGOS.some((j) => j.id === jogo) ? jogo : JOGOS[0].id;
}

function guardarJogo(jogo) {
  gravar(CHAVES.jogos, { ...ler(CHAVES.jogos, {}), jogo });
}

/* --------------------------------------------------------------------------
   Para o app.js
   -------------------------------------------------------------------------- */

/** Volta ao menu — é por onde se entra, vindo da tela inicial. */
export function abrirMenuDeJogos() {
  encerrarJogo();
  onde = { tela: 'menu' };
}

/** Para a partida que estiver rodando: o relógio e as teclas. */
export function encerrarJogo() {
  partida?.encerrar();
  partida = null;
}

/**
 * Troca o idioma da partida, se houver uma rodando.
 * @returns {boolean} true quando havia partida — e, nesse caso, quem chamou
 *                    NÃO deve redesenhar a tela.
 */
export function retraduzirJogo() {
  if (!partida) return false;

  partida.retraduzir();
  return true;
}

/** Só para inspecionar pelo console; o site não usa. */
export function espiarJogo() {
  return partida?.espiar() ?? null;
}

/**
 * Desenha a tela de jogos em que se está.
 * @param {HTMLElement} destino
 */
export function mostrarJogos(destino) {
  if (onde.tela === 'fim') mostrarResumo(destino, onde.jogo, onde.resultado);
  // Uma partida nunca recomeça sozinha: sem ela rodando, volta-se ao nível.
  else if (onde.tela === 'inicio' || onde.tela === 'partida') mostrarNivel(destino, onde.jogo);
  else mostrarMenu(destino);
}

/* ==========================================================================
   O menu
   ========================================================================== */

function mostrarMenu(destino) {
  encerrarJogo();
  onde = { tela: 'menu' };

  let escolhido = jogoEscolhido();

  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    `
      <div class="livre jogos">
        <h1>${t('jogos.titulo')}</h1>
        <p class="subtitulo">${t('jogos.subtitulo')}</p>

        <div class="livre-escolha">
          <div>
            <div class="livre-grupo">
              <p class="livre-rotulo">${t('jogos.oQueJogar')}</p>
              <div class="livre-modos">
                ${JOGOS.map(
                  (jogo) => `
                  <button type="button" class="livre-modo" data-jogo="${jogo.id}" aria-pressed="false">
                    <span class="livre-modo-marca"><span class="livre-modo-ponto"></span></span>
                    <span class="livre-modo-texto">
                      <span class="livre-modo-nome">${t(`jogos.${jogo.id}.nome`)}</span>
                      <span class="livre-modo-descricao">${t(`jogos.${jogo.id}.descricao`)}</span>
                    </span>
                  </button>`
                ).join('')}
              </div>
            </div>

            <button type="button" class="botao botao--principal" data-acao="jogar">${t('jogos.jogar')}</button>
          </div>

          <div>
            <div class="ilustracoes" data-papel="ilustracoes">
              ${JOGOS.map(
                (jogo) => `
                <svg class="ilustracao" data-ilustracao="${jogo.id}" viewBox="0 0 320 240" aria-hidden="true">
                  <use href="#${jogo.ilustracao}"></use>
                </svg>`
              ).join('')}
            </div>
          </div>
        </div>
      </div>
    `
  );

  const ilustracoes = destino.querySelector('[data-papel="ilustracoes"]');

  /* Atualizar NO LUGAR, e não redesenhar a tela a cada clique: redesenhar
     mataria o cross-fade — a ilustração antiga seria destruída e a nova
     nasceria já opaca. É o mesmo cuidado da tela do treino livre. */
  function atualizar() {
    for (const botao of destino.querySelectorAll('[data-jogo]')) {
      botao.setAttribute('aria-pressed', String(botao.dataset.jogo === escolhido));
    }
    mostrarIlustracao(escolhido);
  }

  /** Acende uma ilustração e apaga as outras. O fade é do CSS. */
  function mostrarIlustracao(id) {
    for (const desenho of ilustracoes.querySelectorAll('.ilustracao')) {
      desenho.classList.toggle('ilustracao--ativa', desenho.dataset.ilustracao === id);
    }
  }

  for (const botao of destino.querySelectorAll('[data-jogo]')) {
    botao.addEventListener('click', () => {
      escolhido = botao.dataset.jogo;
      guardarJogo(escolhido);
      atualizar();
    });

    // Prévia: o mouse mostra a ilustração daquele jogo; ao sair, volta para
    // a do jogo escolhido — nunca para o vazio.
    botao.addEventListener('mouseenter', () => mostrarIlustracao(botao.dataset.jogo));
    botao.addEventListener('mouseleave', () => mostrarIlustracao(escolhido));
  }

  destino
    .querySelector('[data-acao="jogar"]')
    .addEventListener('click', () => mostrarNivel(destino, escolhido));

  atualizar();
}

/* ==========================================================================
   As telas de cada jogo
   ========================================================================== */

function mostrarNivel(destino, jogo) {
  encerrarJogo();
  onde = { tela: 'inicio', jogo };

  MODULOS[jogo].mostrarInicio(destino, {
    aoEscolher: (nivel) => jogar(destino, jogo, nivel),
    aoVoltar: () => mostrarMenu(destino),
  });
}

function jogar(destino, jogo, nivel) {
  encerrarJogo();
  onde = { tela: 'partida', jogo, nivel };

  partida = MODULOS[jogo].iniciar(destino, {
    nivel,
    aoTerminar(resultado) {
      partida = null;
      mostrarResumo(destino, jogo, resultado);
    },
  });
}

function mostrarResumo(destino, jogo, resultado) {
  onde = { tela: 'fim', jogo, resultado };

  MODULOS[jogo].mostrarFim(destino, resultado, {
    aoJogarDeNovo: () => jogar(destino, jogo, resultado.nivel),
    aoTrocarNivel: () => mostrarNivel(destino, jogo),
    aoVoltar: () => mostrarMenu(destino),
  });
}
