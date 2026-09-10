/* ==========================================================================
   metricas.js — a conta de PPM, precisão e teclas erradas.

   PPM é "palavras por minuto". Como as palavras têm tamanhos diferentes,
   todo teste de digitação do mundo combina que **uma palavra são 5
   caracteres** — assim "asa" e "salgadas" contam proporcionalmente ao
   esforço de digitar cada uma.

   O relógio só começa a contar na PRIMEIRA tecla apertada — certa ou
   errada. Ninguém deve ser penalizado pelo tempo que levou lendo a tela
   antes de começar, mas errar também é ter começado.
   ========================================================================== */

/** Quantos caracteres valem uma "palavra" na conta de PPM. */
const CARACTERES_POR_PALAVRA = 5;

/**
 * Cria um contador para uma lição.
 * @returns {object}
 */
export function criarMetricas() {
  let inicio = null;
  let fim = null;
  let acertos = 0;
  let erros = 0;

  /** Quantas vezes cada letra foi errada — vira "teclas com mais erros". */
  const errosPorTecla = new Map();

  function segundos() {
    if (inicio === null) return 0;
    return ((fim ?? performance.now()) - inicio) / 1000;
  }

  function ppm() {
    const minutos = segundos() / 60;
    if (minutos <= 0) return 0;

    return (acertos / CARACTERES_POR_PALAVRA) / minutos;
  }

  function precisao() {
    const total = acertos + erros;
    if (total === 0) return 100;

    return (acertos / total) * 100;
  }

  return {
    /** Marca o começo, na primeira tecla apertada. */
    comecar() {
      if (inicio === null) inicio = performance.now();
    },

    /** Para o relógio ao terminar a lição. */
    encerrar() {
      if (inicio !== null && fim === null) fim = performance.now();
    },

    registrarAcerto() {
      acertos += 1;
    },

    /**
     * @param {string} esperada  a letra que deveria ter sido digitada
     */
    registrarErro(esperada) {
      erros += 1;
      errosPorTecla.set(esperada, (errosPorTecla.get(esperada) ?? 0) + 1);
    },

    /** Números para mostrar ao vivo, enquanto a pessoa digita. */
    aoVivo() {
      return {
        ppm: Math.round(ppm()),
        precisao: Math.round(precisao()),
        segundos: Math.round(segundos()),
      };
    },

    /** Números finais, para a tela de resultado. */
    resumo() {
      return {
        ppm: Math.round(ppm()),
        precisao: Math.round(precisao()),
        segundos: Math.round(segundos()),
        acertos,
        erros,
        // Da mais errada para a menos errada, para a tela mostrar as piores.
        errosPorTecla: [...errosPorTecla.entries()]
          .map(([tecla, vezes]) => ({ tecla, vezes }))
          .sort((a, b) => b.vezes - a.vezes),
      };
    },
  };
}

/**
 * Quantas estrelas o resultado merece, de 0 a 3.
 *
 * Precisão vem primeiro: quem não chegou ao mínimo não ganha estrela
 * nenhuma, por mais rápido que tenha digitado. Digitar rápido e errado não
 * é digitar bem.
 *
 * @param {{ppm: number, precisao: number}} resultado
 * @param {{precisaoMinima: number, estrelas: number[]}} metas
 * @returns {number}
 */
export function contarEstrelas(resultado, metas) {
  if (resultado.precisao < metas.precisaoMinima) return 0;

  return metas.estrelas.filter((alvo) => resultado.ppm >= alvo).length;
}
