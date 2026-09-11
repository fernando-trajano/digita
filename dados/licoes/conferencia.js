/* ==========================================================================
   conferencia.js — a rede de segurança do conteúdo das lições.

   Escrever 100 lições à mão é convite para dois erros que passam batido:

     1. usar uma letra que o aluno ainda não aprendeu;
     2. usar uma tecla que não existe no teclado que ele escolheu
        (o caso clássico: o Ç, que no teclado americano é ponto e vírgula).

   Estas duas conferências rodam sobre todas as lições e avisam no console
   do navegador. Não quebram o site: a ideia é que o erro apareça para quem
   está escrevendo o conteúdo, e não para quem está treinando.
   ========================================================================== */

import { TRILHAS, textoDaLicao } from './indice.js';

/**
 * Caracteres que qualquer lição pode usar, sempre: o espaço e a quebra
 * entre um item e outro.
 */
const SEMPRE_PERMITIDOS = new Set([' ']);

/**
 * Os acentos SOLTOS, digitados sozinhos.
 *
 * Esta é a diferença que importa entre os dois teclados. Uma letra
 * acentuada — á, ç, ã — existe nos dois: no brasileiro sai da tecla de
 * acento seguida da vogal, e no americano sai de ⌥ + e no Mac ou do layout
 * US Internacional no Windows. O motor de digitação recebe a letra pronta
 * nos dois casos, então o conteúdo pode usá-las à vontade.
 *
 * O que NÃO existe nos dois é o acento sozinho, como caractere a digitar:
 * no teclado americano ele exige uma combinação seguida de espaço, e pedir
 * isso numa lição seria pedir um truque, não digitação.
 */
const ACENTOS_SOLTOS = new Set(['´', '~', '^', '`', '¨']);

/**
 * Conferência 1 — o aluno só vê letras que já aprendeu.
 *
 * Percorre o programa INTEIRO somando as teclasNovas lição a lição, na ordem
 * em que elas são feitas. O conteúdo de uma lição só pode usar letras desse
 * acumulado.
 *
 * O acumulado atravessa as trilhas de propósito: quem chega à fileira de
 * cima já passou pela fileira base, e continua sabendo a s d f g h j k l.
 * Zerar a conta a cada trilha acusaria como erro exatamente o que se espera
 * de uma trilha que vem depois da outra.
 *
 * @returns {string[]}  os problemas encontrados, em texto
 */
export function conferirLetrasJaEnsinadas() {
  const problemas = [];
  const jaEnsinadas = new Set(SEMPRE_PERMITIDOS);

  for (const trilha of TRILHAS) {
    for (const licao of trilha.licoes) {
      for (const tecla of licao.teclasNovas ?? []) {
        jaEnsinadas.add(tecla.toLowerCase());
      }

      const usadas = new Set(textoDaLicao(licao).toLowerCase());
      const nuncaEnsinadas = [...usadas].filter((letra) => !jaEnsinadas.has(letra));

      if (nuncaEnsinadas.length > 0) {
        problemas.push(
          `${licao.id}: usa "${nuncaEnsinadas.join('", "')}" antes de ensinar.`
        );
      }
    }
  }

  return problemas;
}

/**
 * Conferência 2 — o conteúdo cabe em qualquer teclado.
 *
 * Nenhuma lição pode pedir um acento solto, porque no teclado americano ele
 * exige uma combinação seguida de espaço. Letras acentuadas e o Ç estão
 * liberados: os dois teclados sabem produzi-los.
 *
 * @returns {string[]}  os problemas encontrados, em texto
 */
export function conferirLayout() {
  const problemas = [];

  for (const trilha of TRILHAS) {
    for (const licao of trilha.licoes) {
      const usadas = new Set(textoDaLicao(licao));
      const impossiveis = [...usadas].filter((letra) => ACENTOS_SOLTOS.has(letra));

      if (impossiveis.length > 0) {
        problemas.push(
          `${licao.id}: pede o acento "${impossiveis.join('", "')}" sozinho, que o teclado americano só produz com combinação e espaço.`
        );
      }
    }
  }

  return problemas;
}

/**
 * Roda as duas conferências e escreve o resultado no console.
 * Chamada uma vez quando o site abre.
 */
export function conferirLicoes() {
  const problemas = [...conferirLetrasJaEnsinadas(), ...conferirLayout()];

  if (problemas.length === 0) return true;

  console.warn(
    `[digita] Conferência das lições encontrou ${problemas.length} problema(s):\n` +
      problemas.map((p) => `  · ${p}`).join('\n')
  );

  return false;
}
