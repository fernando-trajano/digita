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
      sempre visível no cabeçalho.

   O que toca, e quando:
     clique      a cada tecla certa — DESLIGADO por padrão
     erro        a cada tecla errada — ligado, e bem discreto
     conclusão   ao terminar uma lição
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
  const volume = ganho * config().volume;

  const oscilador = ctx.createOscillator();
  oscilador.type = onda;
  oscilador.frequency.value = frequencia;

  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0.0001, agora);
  envelope.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0001), agora + 0.008);
  envelope.gain.exponentialRampToValueAtTime(0.0001, agora + duracao);

  oscilador.connect(envelope).connect(ctx.destination);
  oscilador.start(agora);
  oscilador.stop(agora + duracao + 0.02);
}

/** O som está ligado? */
function ligado() {
  return !config().mudo && config().volume > 0;
}

/* --------------------------------------------------------------------------
   Os três sons
   -------------------------------------------------------------------------- */

/**
 * A cada tecla certa. Desligado por padrão.
 * @param {boolean} [amostra]  true para tocar mesmo com o clique desligado —
 *        é o que deixa ajustar o volume sem ficar às cegas.
 */
export function tocarClique(amostra = false) {
  if (!ligado()) return;
  if (!amostra && !config().somDeClique) return;

  const estilo = ESTILOS_DE_CLIQUE[config().estiloDoClique] ?? ESTILOS_DE_CLIQUE.seco;
  tocarTom(estilo);
}

/** A cada tecla errada: grave, curto e discreto — um aviso, não um castigo. */
export function tocarErro() {
  if (!ligado() || !config().somDeErro) return;

  tocarTom({ onda: 'sine', frequencia: 180, duracao: 0.12, ganho: 0.09 });
}

/** Ao terminar uma lição: três notas subindo, bem curtas. */
export function tocarConclusao() {
  if (!ligado()) return;

  // Dó, mi e sol — um acorde maior, que soa como "deu certo".
  const notas = [523.25, 659.25, 783.99];

  notas.forEach((frequencia, indice) => {
    tocarTom({
      onda: 'sine',
      frequencia,
      duracao: 0.18,
      ganho: 0.09,
      atraso: indice * 0.09,
    });
  });
}
