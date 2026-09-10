/* ==========================================================================
   resultado.js — a tela que aparece quando a lição termina.

   Ela responde três perguntas, nesta ordem de importância:
     1. Passei?  (a precisão mínima é o que decide, não a velocidade)
     2. Quão bem?  (as estrelas e os números)
     3. Em que eu tropecei?  (as teclas que mais deram erro)

   E oferece dois caminhos: repetir esta lição ou seguir para a próxima.
   ========================================================================== */

import { t } from '../i18n.js';

/**
 * Desenha a tela de resultado.
 *
 * @param {HTMLElement} destino
 * @param {object} opcoes
 * @param {object} opcoes.licao
 * @param {object} opcoes.resumo    o que o motor devolveu
 * @param {object} opcoes.registro  o que o progresso.js concluiu
 * @param {() => void} opcoes.aoRepetir
 * @param {() => void} opcoes.aoProxima
 * @param {() => void} opcoes.aoSair
 */
export function mostrarResultado(destino, { licao, resumo, registro, aoRepetir, aoProxima, aoSair }) {
  const idioma = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';

  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    `
    <div class="resultado">
      <p class="ajuda">${licao.titulo[idioma]}</p>
      <h1>${registro.passou ? t('resultado.parabens') : t('resultado.quase')}</h1>
      <p class="subtitulo">${mensagem(registro, resumo)}</p>

      ${estrelas(registro.estrelas)}

      <div class="resultado-numeros">
        ${numero(resumo.ppm, t('licao.ppm'))}
        ${numero(`${resumo.precisao}%`, t('licao.precisao'))}
        ${numero(`${resumo.segundos}s`, t('resultado.tempo'))}
      </div>

      <section class="secao">
        <h2>${t('resultado.errosTitulo')}</h2>
        ${listaDeErros(resumo)}
      </section>

      <div class="resultado-acoes">
        ${
          registro.proxima
            ? `<button type="button" class="botao botao--principal" data-acao="proxima">
                 ${t('resultado.proxima')}
               </button>`
            : ''
        }
        <button type="button" class="botao${registro.proxima ? '' : ' botao--principal'}" data-acao="repetir">
          ${t('resultado.repetir')}
        </button>
        <button type="button" class="botao" data-acao="sair">${t('resultado.sair')}</button>
      </div>
    </div>
  `
  );

  destino.querySelector('[data-acao="repetir"]').addEventListener('click', aoRepetir);
  destino.querySelector('[data-acao="sair"]').addEventListener('click', aoSair);
  destino.querySelector('[data-acao="proxima"]')?.addEventListener('click', aoProxima);
}

/** A frase que explica o resultado. */
function mensagem(registro, resumo) {
  if (!registro.passou) {
    return t('resultado.explicaReprovado').replace('{minima}', registro.metas.precisaoMinima);
  }

  if (registro.recorde) return t('resultado.recorde');

  const proximaEstrela = registro.metas.estrelas[registro.estrelas];

  return proximaEstrela
    ? t('resultado.faltaPara')
        .replace('{ppm}', proximaEstrela)
        .replace('{quantas}', registro.estrelas + 1)
    : t('resultado.tudoQueDava');
}

/** As três estrelas, acesas ou apagadas. */
function estrelas(quantas) {
  const total = 3;
  let html = `<div class="estrelas" role="img" aria-label="${t('resultado.estrelas')
    .replace('{quantas}', quantas)
    .replace('{total}', total)}">`;

  for (let i = 0; i < total; i += 1) {
    html += `<svg class="estrela${i < quantas ? ' estrela--acesa' : ''}" aria-hidden="true">
               <use href="#icone-estrela"></use>
             </svg>`;
  }

  return `${html}</div>`;
}

function numero(valor, rotulo) {
  return `<span class="medida"><strong>${valor}</strong> ${rotulo}</span>`;
}

/** As teclas que mais deram erro — no máximo cinco, para não virar lista. */
function listaDeErros(resumo) {
  if (resumo.errosPorTecla.length === 0) {
    return `<p class="ajuda">${t('resultado.semErros')}</p>`;
  }

  const piores = resumo.errosPorTecla.slice(0, 5);

  return `
    <ul class="erros">
      ${piores
        .map(
          ({ tecla, vezes }) => `
        <li class="erro">
          <span class="erro-tecla">${tecla === ' ' ? t('teclas.espaco') : tecla}</span>
          <span class="erro-vezes">${vezes}×</span>
        </li>`
        )
        .join('')}
    </ul>`;
}
