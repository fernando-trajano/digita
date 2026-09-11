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
 * O que cada teclado consegue escrever sem combinação de teclas.
 * O que importa aqui é a diferença entre os dois; letras comuns às duas
 * listas não precisam ser conferidas.
 */
const SO_NO_ABNT2 = new Set(['ç', '´', '~', '^', '`']);

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
 * Conferência 2 — o conteúdo cabe no teclado escolhido.
 *
 * @param {'abnt2'|'us'} layout
 * @returns {string[]}  os problemas encontrados, em texto
 */
export function conferirLayout(layout) {
  const problemas = [];
  if (layout === 'abnt2') return problemas; // o brasileiro escreve tudo

  for (const trilha of TRILHAS) {
    for (const licao of trilha.licoes) {
      const usadas = new Set(textoDaLicao(licao).toLowerCase());
      const impossiveis = [...usadas].filter((letra) => SO_NO_ABNT2.has(letra));

      if (impossiveis.length > 0) {
        problemas.push(
          `${licao.id}: usa "${impossiveis.join('", "')}", que não existe no teclado americano.`
        );
      }
    }
  }

  return problemas;
}

/**
 * Roda as duas conferências e escreve o resultado no console.
 * Chamada uma vez quando o site abre.
 *
 * @param {'abnt2'|'us'} layout  o teclado que o usuário escolheu
 */
export function conferirLicoes(layout) {
  const problemas = [...conferirLetrasJaEnsinadas(), ...conferirLayout(layout)];

  if (problemas.length === 0) return true;

  console.warn(
    `[digita] Conferência das lições encontrou ${problemas.length} problema(s):\n` +
      problemas.map((p) => `  · ${p}`).join('\n')
  );

  return false;
}
