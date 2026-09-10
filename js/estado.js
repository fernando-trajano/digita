/* ==========================================================================
   estado.js — as configurações do usuário, em memória e salvas.

   Guarda o que o site precisa lembrar de uma visita para a outra: idioma,
   formato do teclado, sistema, tema e som. Quem quiser saber de alguma
   dessas coisas pergunta aqui; quem mudar alguma, avisa aqui.

   Uma ideia importante: o valor `null` significa "o usuário ainda não
   escolheu". Enquanto for null, o site usa o palpite da detecção; assim que
   ele escolhe, o valor é gravado e a detecção nunca mais discute com ele.
   É a regra do briefing — a escolha manual é sempre a palavra final.
   ========================================================================== */

import { CHAVES, ler, gravar } from './armazenamento.js';
import { detectarSistema } from './deteccao.js';

/** Como o site começa, para quem nunca esteve aqui. */
const PADRAO = {
  idioma: null, // null = usar o idioma do navegador
  layout: 'abnt2', // o briefing manda começar no teclado brasileiro
  sistema: null, // null = usar o sistema que o navegador informou
  tema: null, // null = acompanhar o modo claro/escuro do sistema
  som: false, // o clique de tecla nasce desligado
  volume: 0.5,
};

let configuracao = ler(CHAVES.config, PADRAO);

/** Quem quer ser avisado quando algo muda. */
const ouvintes = new Set();

/**
 * As configurações de agora.
 * Devolve uma cópia: ninguém muda o estado por acidente, só por definirConfig.
 * @returns {typeof PADRAO}
 */
export function config() {
  return { ...configuracao };
}

/**
 * O sistema que vale AGORA: o escolhido pelo usuário ou, enquanto ele não
 * escolheu, o que o navegador informou.
 *
 * Existe para que todas as telas respondam a mesma coisa. Antes, a tela de
 * entrada usava a detecção e a tela de lição caía num "windows" fixo — o
 * teclado da lição aparecia com Ctrl e AltGr para quem estava num Mac.
 *
 * @returns {'windows'|'mac'}
 */
export function sistemaAtual() {
  return config().sistema ?? detectarSistema();
}

/**
 * Muda uma ou mais configurações, salva e avisa quem depende delas.
 * @param {Partial<typeof PADRAO>} mudancas  ex.: { layout: 'us' }
 */
export function definirConfig(mudancas) {
  const antes = configuracao;
  configuracao = { ...configuracao, ...mudancas };

  // Nada mudou de fato? Então não salva nem avisa ninguém.
  const mudouAlgo = Object.keys(mudancas).some(
    (chave) => antes[chave] !== configuracao[chave]
  );
  if (!mudouAlgo) return;

  gravar(CHAVES.config, configuracao);

  for (const ouvinte of ouvintes) ouvinte(config(), mudancas);
}

/**
 * Pede para ser avisado sempre que a configuração mudar.
 * @param {(config: typeof PADRAO, mudancas: object) => void} ouvinte
 * @returns {() => void}  função para parar de ouvir
 */
export function aoMudarConfig(ouvinte) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

/**
 * Volta tudo ao estado de fábrica — usado pela importação de progresso
 * (passo 17) e por uma futura tela de configurações.
 */
export function reiniciarConfig() {
  configuracao = { ...PADRAO };
  gravar(CHAVES.config, configuracao);

  for (const ouvinte of ouvintes) ouvinte(config(), configuracao);
}
