/* ==========================================================================
   comum.js — o que os três jogos dividem.

   Cada jogo tem três telas: o começo (onde se escolhe o nível), a partida e
   o fim. A primeira e a última têm o mesmo desenho nos três, e moram aqui,
   junto com o relógio e o vigia da janela, que os três usam igual.

   DUAS REGRAS DOS JOGOS

   - O relógio sai do performance.now() que o requestAnimationFrame entrega,
     e NUNCA da contagem de quadros nem de um setInterval: numa tela de 60 Hz
     e numa de 144 Hz o jogo anda exatamente igual.

   - Sair da janela no meio da partida não pode custar a partida. Cada jogo
     decide o que pausar, mas todos ficam sabendo pelo mesmo vigia.
   ========================================================================== */

import { t } from '../i18n.js';
import { juntarPorTecla } from '../metricas.js';
import { somarTeclas } from '../progresso.js';

/** Os três níveis, na ordem em que aparecem. */
export const NIVEIS = ['facil', 'medio', 'dificil'];

/* --------------------------------------------------------------------------
   As teclas, para as estatísticas
   -------------------------------------------------------------------------- */

/**
 * Conta acertos e erros de cada letra durante a partida.
 *
 * Os jogos entram no mapa de calor e na precisão por dedo — mas NÃO na curva
 * de evolução: na Fila o ritmo é do jogo, e na Cadeia se digita de memória.
 *
 * `gravar` soma tudo em digita:estatisticas uma vez só, por mais que seja
 * chamada: a partida pode acabar de três jeitos (a cobra alcança, o
 * "Encerrar", a saída pelo cabeçalho), e todos passam por ela.
 */
export function criarContagemDeTeclas() {
  const acertos = new Map();
  const erros = new Map();
  let gravada = false;

  const somar = (mapa, letra) => mapa.set(letra, (mapa.get(letra) ?? 0) + 1);

  return {
    acerto: (letra) => somar(acertos, letra),
    erro: (letra) => somar(erros, letra),

    gravar() {
      if (gravada) return;
      gravada = true;
      somarTeclas(juntarPorTecla(acertos, erros));
    },
  };
}

/* --------------------------------------------------------------------------
   O relógio
   -------------------------------------------------------------------------- */

/**
 * Roda uma função a cada quadro, entregando os segundos desde o anterior.
 *
 * O passo tem teto de 0,1s: sem isso, voltar para a aba depois de um minuto
 * faria o jogo andar um minuto de uma vez.
 *
 * @param {(passo: number) => (boolean|void)} aCadaQuadro  devolve false para
 *        parar o relógio
 */
export function criarRelogio(aCadaQuadro) {
  let ultimo = null;
  let pedido = null;
  let parado = false;

  function quadro(agora) {
    const passo = ultimo === null ? 0 : Math.min(0.1, (agora - ultimo) / 1000);
    ultimo = agora;

    if (aCadaQuadro(passo) === false || parado) return;
    pedido = requestAnimationFrame(quadro);
  }

  pedido = requestAnimationFrame(quadro);

  return {
    parar() {
      parado = true;
      cancelAnimationFrame(pedido);
    },

    /** Depois de uma pausa: o próximo passo começa do zero. */
    zerarPasso() {
      ultimo = null;
    },

    /**
     * Os segundos desde o último quadro. Uma tecla cai ENTRE dois quadros, e
     * é isto que dá o instante exato dela.
     */
    desdeOUltimoQuadro() {
      if (ultimo === null) return 0;
      return Math.min(0.1, Math.max(0, (performance.now() - ultimo) / 1000));
    },
  };
}

/* --------------------------------------------------------------------------
   O vigia da janela
   -------------------------------------------------------------------------- */

/**
 * Avisa quando a pessoa sai da janela (outra aba, outro programa) e quando
 * volta para ela.
 * @returns {() => void}  função para parar de vigiar
 */
export function vigiarJanela({ aoSair, aoVoltar = () => {} }) {
  const aoMudarVisibilidade = () => {
    if (document.visibilityState === 'hidden') aoSair();
  };

  window.addEventListener('blur', aoSair);
  window.addEventListener('focus', aoVoltar);
  document.addEventListener('visibilitychange', aoMudarVisibilidade);

  return () => {
    window.removeEventListener('blur', aoSair);
    window.removeEventListener('focus', aoVoltar);
    document.removeEventListener('visibilitychange', aoMudarVisibilidade);
  };
}

/* --------------------------------------------------------------------------
   O teclado de quem joga
   -------------------------------------------------------------------------- */

/**
 * Os jogos escutam as teclas na janela inteira, e não num campo. Por isso,
 * antes de tudo, duas cortesias:
 *
 *   - o espaço não pode rolar a página;
 *   - se algum botão ficou com o foco (o de mudo, clicado no meio da
 *     partida), o espaço e o Enter não podem apertá-lo.
 *
 * Devolve true quando a tecla é um atalho do sistema (⌘, Ctrl, Alt) — essas
 * o jogo deixa passar sem olhar.
 */
export function prepararTecla(evento) {
  if (evento.ctrlKey || evento.metaKey || evento.altKey) return true;

  if (evento.key === ' ' || evento.key === 'Enter') evento.preventDefault();

  return false;
}

/** Tira o foco de onde estiver: as teclas precisam chegar ao jogo. */
export function soltarFoco() {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
}

/** "1:05" */
export function formatarTempo(segundos) {
  const s = Math.floor(segundos);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/* --------------------------------------------------------------------------
   TELA 1 — o começo: o nível
   -------------------------------------------------------------------------- */

/**
 * Desenha a tela de começo de um jogo.
 *
 * Clicar no nível já entra na partida: não há botão de Começar. Por isso
 * nenhum nível fica marcado como escolhido — o sublinhado aparece só sob o
 * mouse ou o foco do Tab, e quer dizer "é aqui que se clica".
 *
 * @param {HTMLElement} destino
 * @param {object} opcoes
 * @param {string} opcoes.jogo  'cobra' | 'fila' | 'cadeia'
 * @param {string} opcoes.ajuda  a linha de ajuda, já traduzida
 * @param {string} [opcoes.rodape]  HTML a mais embaixo dos níveis
 * @param {(nivel: string) => void} opcoes.aoEscolher
 * @param {(nivel: string|null) => void} [opcoes.aoApontar]  o mouse (ou o
 *        foco) entrou num nível, ou saiu dele (null)
 * @param {() => void} opcoes.aoVoltar
 */
export function montarInicio(destino, { jogo, ajuda, rodape = '', aoEscolher, aoApontar, aoVoltar }) {
  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    `
      <div class="jogo-inicio">
        <h1>${t(`jogos.${jogo}.nome`)}</h1>
        <p class="subtitulo">${t(`jogos.${jogo}.descricao`)}</p>
        <p class="ajuda">${ajuda}</p>

        <div class="jogo-grupo">
          <p class="livre-rotulo">${t('jogos.nivel')}</p>
          <div class="jogo-niveis">
            ${NIVEIS.map(
              (nivel) => `<button type="button" class="jogo-nivel" data-nivel="${nivel}">${t(`jogos.niveis.${nivel}`)}</button>`
            ).join('')}
          </div>
          ${rodape}
        </div>

        <button type="button" class="jogo-voltar" data-acao="voltar">${t('jogos.voltar')}</button>
      </div>
    `
  );

  for (const botao of destino.querySelectorAll('[data-nivel]')) {
    const nivel = botao.dataset.nivel;

    botao.addEventListener('click', () => aoEscolher(nivel));

    if (aoApontar) {
      botao.addEventListener('mouseenter', () => aoApontar(nivel));
      botao.addEventListener('focus', () => aoApontar(nivel));
      botao.addEventListener('mouseleave', () => aoApontar(null));
      botao.addEventListener('blur', () => aoApontar(null));
    }
  }

  destino.querySelector('[data-acao="voltar"]').addEventListener('click', aoVoltar);
}

/* --------------------------------------------------------------------------
   TELA 3 — o fim: texto, e nada mais
   -------------------------------------------------------------------------- */

/**
 * Desenha o resumo de uma partida.
 *
 * @param {HTMLElement} destino
 * @param {object} opcoes
 * @param {string} opcoes.titulo
 * @param {string} opcoes.subtitulo
 * @param {Array<{valor: string|number, sufixo?: string, rotulo: string}>} opcoes.numeros
 * @param {() => void} opcoes.aoJogarDeNovo
 * @param {() => void} opcoes.aoTrocarNivel
 * @param {() => void} opcoes.aoVoltar
 */
export function montarFim(destino, { titulo, subtitulo, numeros, aoJogarDeNovo, aoTrocarNivel, aoVoltar }) {
  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    `
      <div class="jogo-fim">
        <h1>${titulo}</h1>
        <p class="subtitulo">${subtitulo}</p>

        <div class="jogo-numeros">
          ${numeros
            .map(
              ({ valor, sufixo, rotulo }) => `
              <div>
                <p class="jogo-numero">${valor}${sufixo ? `<small>${sufixo}</small>` : ''}</p>
                <p class="ajuda">${rotulo}</p>
              </div>`
            )
            .join('')}
        </div>

        <div class="jogo-acoes">
          <button type="button" class="botao botao--principal" data-acao="de-novo">${t('jogos.deNovo')}</button>
          <button type="button" class="botao" data-acao="trocar">${t('jogos.trocarNivel')}</button>
          <button type="button" class="jogo-voltar" data-acao="voltar">${t('jogos.voltar')}</button>
        </div>
      </div>
    `
  );

  destino.querySelector('[data-acao="de-novo"]').addEventListener('click', aoJogarDeNovo);
  destino.querySelector('[data-acao="trocar"]').addEventListener('click', aoTrocarNivel);
  destino.querySelector('[data-acao="voltar"]').addEventListener('click', aoVoltar);
}

/** A linha do topo da partida: as medidas à esquerda, "Encerrar" à direita. */
export function montarTopo(medidas) {
  return `
    <div class="jogo-topo">
      <div class="medidas">
        ${medidas
          .map(
            ({ papel, valor, chave }) =>
              `<span class="medida"><strong data-papel="${papel}">${valor}</strong> <span data-i18n="${chave}">${t(chave)}</span></span>`
          )
          .join('')}
      </div>
      <button type="button" class="jogo-encerrar" data-acao="encerrar" data-i18n="jogos.encerrar">${t('jogos.encerrar')}</button>
    </div>
  `;
}
