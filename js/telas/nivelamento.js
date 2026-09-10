/* ==========================================================================
   nivelamento.js — a pergunta que decide por onde começar.

   Quem nunca digitou sem olhar começa na lição 1, e ponto. Quem já digita
   não deveria ser obrigado a repetir "fff jjj" por dezoito lições — mas
   também não basta ele achar que digita bem. Daí o teste de um minuto: em
   vez de acreditar ou duvidar, o site mede.

   A tela tem três momentos, um de cada vez:
     pergunta → teste (1 minuto) → resultado
   ========================================================================== */

import { t } from '../i18n.js';
import { criarMotor, desenharTexto } from '../motor-digitacao.js';
import { registrarNivelamento } from '../progresso.js';
import { TRILHAS } from '../../dados/licoes/indice.js';
import { textoDeNivelamento, DURACAO_DO_TESTE } from '../../dados/licoes/nivelamento.js';

/** O teste em andamento, para poder ser desmontado ao sair da tela. */
let emAndamento = null;

/**
 * Desenha a tela de nivelamento.
 *
 * @param {HTMLElement} destino
 * @param {object} opcoes
 * @param {() => void} opcoes.aoComecarDoZero
 * @param {() => void} opcoes.aoTerminar  depois do teste, seja qual for o resultado
 */
export function mostrarNivelamento(destino, { aoComecarDoZero, aoTerminar }) {
  encerrarNivelamento();
  mostrarPergunta(destino, { aoComecarDoZero, aoTerminar });
}

/** Interrompe o teste, se houver um rodando. */
export function encerrarNivelamento() {
  emAndamento?.encerrar();
  emAndamento = null;
}

/* --------------------------------------------------------------------------
   1. A pergunta
   -------------------------------------------------------------------------- */

function mostrarPergunta(destino, acoes) {
  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    `
    <div class="nivelamento">
      <h1>${t('nivelamento.pergunta')}</h1>
      <p class="subtitulo">${t('nivelamento.explica')}</p>

      <div class="nivelamento-acoes">
        <button type="button" class="botao botao--principal" data-acao="zero">
          ${t('nivelamento.naoSei')}
        </button>
        <button type="button" class="botao" data-acao="teste">
          ${t('nivelamento.jaSei')}
        </button>
      </div>

      <p class="ajuda">${t('nivelamento.aviso')}</p>
    </div>
  `
  );

  destino.querySelector('[data-acao="zero"]').addEventListener('click', acoes.aoComecarDoZero);
  destino
    .querySelector('[data-acao="teste"]')
    .addEventListener('click', () => mostrarTeste(destino, acoes));
}

/* --------------------------------------------------------------------------
   2. O teste de um minuto
   -------------------------------------------------------------------------- */

function mostrarTeste(destino, acoes) {
  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    `
    <div class="nivelamento nivelamento--teste">
      <div class="licao-topo">
        <p class="licao-nome">${t('nivelamento.tituloTeste')}</p>
        <div class="medidas">
          <span class="medida"><strong data-papel="relogio">${DURACAO_DO_TESTE}</strong> ${t('nivelamento.segundos')}</span>
          <span class="medida"><strong data-papel="ppm">0</strong> ${t('licao.ppm')}</span>
          <span class="medida"><strong data-papel="precisao">100%</strong> ${t('licao.precisao')}</span>
        </div>
      </div>

      <div class="licao-corpo">
        <div class="licao-texto">
          <div data-papel="texto" data-rotulo="${t('nivelamento.tituloTeste')}"></div>
          <p class="licao-espera" data-papel="espera" hidden>${t('licao.clique')}</p>
        </div>
      </div>

      <p class="ajuda">${t('nivelamento.comoFunciona')}</p>
    </div>
  `
  );

  const partes = {
    texto: destino.querySelector('[data-papel="texto"]'),
    relogio: destino.querySelector('[data-papel="relogio"]'),
    ppm: destino.querySelector('[data-papel="ppm"]'),
    precisao: destino.querySelector('[data-papel="precisao"]'),
    espera: destino.querySelector('[data-papel="espera"]'),
  };

  // Estas três precisam existir ANTES do motor: ele avisa a tela assim que
  // monta, e o aviso já consulta o cronômetro.
  let comecou = false;
  let restam = DURACAO_DO_TESTE;
  let relogio = null;

  const motor = criarMotor({
    linhas: textoDeNivelamento,

    aoAtualizar(estado) {
      desenharTexto(partes.texto, estado);
      partes.ppm.textContent = estado.ppm;
      partes.precisao.textContent = `${estado.precisao}%`;

      // O relógio só começa a andar na primeira tecla: o tempo de ler a
      // tela antes de começar não é tempo de teste.
      if (!comecou && estado.feitos > 0) iniciarRelogio();
    },

    aoMudarFoco(temFoco) {
      partes.espera.hidden = temFoco;
    },

    // Quem chegar ao fim das 86 palavras antes do minuto acabar já mostrou
    // tudo o que precisava.
    aoConcluir: () => terminar(),
  });

  motor.montar(partes.texto);

  function iniciarRelogio() {
    comecou = true;

    relogio = setInterval(() => {
      restam -= 1;
      partes.relogio.textContent = Math.max(0, restam);

      if (restam <= 0) terminar();
    }, 1000);
  }

  function terminar() {
    const resultado = motor.resumo();
    encerrarNivelamento();
    mostrarResultadoDoTeste(destino, resultado, acoes);
  }

  emAndamento = {
    encerrar() {
      clearInterval(relogio);
      motor.destruir();
    },
  };
}

/* --------------------------------------------------------------------------
   3. O resultado
   -------------------------------------------------------------------------- */

function mostrarResultadoDoTeste(destino, resultado, acoes) {
  const idioma = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';
  const liberadas = registrarNivelamento(resultado);

  const nomes = TRILHAS.filter((trilha) => liberadas.includes(trilha.id)).map(
    (trilha) => trilha.nome[idioma]
  );

  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    `
    <div class="nivelamento">
      <p class="ajuda">${t('nivelamento.tituloTeste')}</p>
      <h1>${liberadas.length ? t('nivelamento.dispensado') : t('nivelamento.doComeco')}</h1>

      <div class="resultado-numeros">
        <span class="medida"><strong>${resultado.ppm}</strong> ${t('licao.ppm')}</span>
        <span class="medida"><strong>${resultado.precisao}%</strong> ${t('licao.precisao')}</span>
      </div>

      <p class="subtitulo">
        ${
          liberadas.length
            ? t('nivelamento.explicaDispensado').replace('{trilhas}', nomes.join(', '))
            : t('nivelamento.explicaDoComeco')
        }
      </p>

      <div class="nivelamento-acoes">
        <button type="button" class="botao botao--principal" data-acao="seguir">
          ${t('nivelamento.verTrilha')}
        </button>
      </div>
    </div>
  `
  );

  destino.querySelector('[data-acao="seguir"]').addEventListener('click', acoes.aoTerminar);
}
