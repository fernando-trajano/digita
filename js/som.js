/* ==========================================================================
   som.js — os sons do site, gerados na hora.

   Nenhum arquivo de áudio é baixado: os sons são sintetizados pela Web
   Audio API, somando ondas simples. Um clique de tecla é só um tom curto
   com um envelope rápido — e isso ocupa zero byte de download.

   DUAS REGRAS QUE O NAVEGADOR IMPÕE, E QUE AQUI VIRAM BOA EDUCAÇÃO

   1. Nenhum som antes da primeira interação. Os navegadores bloqueiam áudio
      em página que o usuário ainda não tocou, e com razão: site que apita
      sozinho é desagradável. Por isso o contexto de áudio só é criado na
      primeira vez que um som é pedido — e a essa altura a pessoa já clicou
      ou digitou alguma coisa.

   2. Som é opcional e silenciável a qualquer momento. O botão de mudo fica
      sempre visível no cabeçalho. Não há controle de volume no site: ligado
      é volume cheio, e quem quiser mais baixo usa o volume do computador.

   O que toca, e quando:
     clique      a cada tecla certa — DESLIGADO por padrão
     erro        a cada tecla errada — ligado, e bem discreto
     conclusão   ao terminar uma lição

   Os jogos têm os sons deles, no fim do arquivo, feitos das mesmas receitas.
   ========================================================================== */

import { config } from './estado.js';

/** Criado só quando o primeiro som é pedido. Antes disso, fica null. */
let contexto = null;

/**
 * Os estilos de clique de tecla.
 * Cada um é uma receita: o formato da onda, a altura do tom e quanto tempo
 * ele leva para sumir.
 *
 * (A escolha do estilo ainda não tem tela: ela mora em digita:config e vai
 * para a tela de Configurações, que é pós-v1.)
 */
const ESTILOS_DE_CLIQUE = {
  seco: { onda: 'sine', frequencia: 1050, duracao: 0.035, ganho: 0.1 },
  suave: { onda: 'sine', frequencia: 680, duracao: 0.07, ganho: 0.08 },
  mecanico: { onda: 'square', frequencia: 1500, duracao: 0.028, ganho: 0.05 },
};

/**
 * Garante que existe um contexto de áudio, criando-o na primeira vez.
 * @returns {AudioContext|null}  null se o navegador não tiver Web Audio
 */
function garantirContexto() {
  if (contexto) return contexto;

  const Contexto = window.AudioContext ?? window.webkitAudioContext;
  if (!Contexto) return null;

  contexto = new Contexto();
  return contexto;
}

/**
 * Toca um tom.
 *
 * O envelope (o sobe-e-desce do volume) é o que faz o som parecer um clique
 * e não um apito: ele sobe quase instantaneamente e cai depressa. Sem isso,
 * ligar e desligar um oscilador estala.
 */
function tocarTom({ onda, frequencia, duracao, ganho, atraso = 0 }) {
  const ctx = garantirContexto();
  if (!ctx) return;

  // Alguns navegadores criam o contexto "suspenso" até a primeira interação.
  if (ctx.state === 'suspended') ctx.resume();

  const agora = ctx.currentTime + atraso;

  const oscilador = ctx.createOscillator();
  oscilador.type = onda;
  oscilador.frequency.value = frequencia;

  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0.0001, agora);
  envelope.gain.exponentialRampToValueAtTime(ganho, agora + 0.008);
  envelope.gain.exponentialRampToValueAtTime(0.0001, agora + duracao);

  oscilador.connect(envelope).connect(ctx.destination);
  oscilador.start(agora);
  oscilador.stop(agora + duracao + 0.02);
}

/** O som está ligado? */
function ligado() {
  return !config().mudo;
}

/* --------------------------------------------------------------------------
   Os três sons
   -------------------------------------------------------------------------- */

/** A cada tecla certa. Desligado por padrão. */
export function tocarClique() {
  if (!ligado() || !config().somDeClique) return;

  const estilo = ESTILOS_DE_CLIQUE[config().estiloDoClique] ?? ESTILOS_DE_CLIQUE.seco;
  tocarTom(estilo);
}

/** A cada tecla errada: grave, curto e discreto — um aviso, não um castigo. */
export function tocarErro() {
  if (!ligado() || !config().somDeErro) return;

  tocarTom({ onda: 'sine', frequencia: 180, duracao: 0.12, ganho: 0.09 });
}

/** Dó, mi e sol — um acorde maior, que soa como "deu certo". */
const ACORDE = [523.25, 659.25, 783.99];

/** Ao terminar uma lição: três notas subindo, bem curtas. */
export function tocarConclusao() {
  if (!ligado()) return;

  tocarNotas(ACORDE, { duracao: 0.18, ganho: 0.09, intervalo: 0.09 });
}

/** Toca notas em sequência, uma a cada `intervalo` segundos. */
function tocarNotas(notas, { duracao, ganho, intervalo, atraso = 0 }) {
  notas.forEach((frequencia, indice) => {
    tocarTom({ onda: 'sine', frequencia, duracao, ganho, atraso: atraso + indice * intervalo });
  });
}

/* --------------------------------------------------------------------------
   Os sons dos jogos

   Nos jogos o som nasce LIGADO, como pede o briefing. Por isso estes sons
   não olham as escolhas das lições (clique desligado, erro ligado): só o
   botão de mudo do cabeçalho os cala.
   -------------------------------------------------------------------------- */

/**
 * O toque de uma tecla: o clique seco.
 * @param {number} [semitons]  quantos semitons acima — a Fila sobe o tom
 *                             conforme o combo cresce
 */
export function tocarToqueDeJogo(semitons = 0) {
  if (!ligado()) return;

  const seco = ESTILOS_DE_CLIQUE.seco;
  tocarTom({ ...seco, frequencia: seco.frequencia * 2 ** (semitons / 12) });
}

/** O erro de sempre: grave, curto e baixo. */
export function tocarErroDeJogo(atraso = 0) {
  if (!ligado()) return;

  tocarTom({ onda: 'sine', frequencia: 180, duracao: 0.12, ganho: 0.09, atraso });
}

/** Deu certo: o acorde da conclusão de lição. */
export function tocarSucessoDeJogo(atraso = 0) {
  if (!ligado()) return;

  tocarNotas(ACORDE, { duracao: 0.18, ganho: 0.09, intervalo: 0.09, atraso });
}

/** O fôlego do combo na Cobra: as duas notas de cima do acorde, rápidas. */
export function tocarFolego() {
  if (!ligado()) return;

  tocarNotas(ACORDE.slice(1), { duracao: 0.12, ganho: 0.07, intervalo: 0.07, atraso: 0.04 });
}

/** A Cobra alcançou: o acorde ao contrário, mais grave. */
export function tocarCaptura() {
  if (!ligado()) return;

  tocarNotas([392.0, 329.63, 261.63], { duracao: 0.2, ganho: 0.08, intervalo: 0.12 });
}
