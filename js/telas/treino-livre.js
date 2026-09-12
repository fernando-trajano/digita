/* ==========================================================================
   treino-livre.js — treinar sem nota.

   A trilha é um programa: tem ordem, tem meta e tem estrela. O treino livre
   é o contrário disso — serve para soltar os dedos, insistir numa tecla que
   escapa ou passar um texto qualquer a limpo. Nada do que acontece aqui
   entra no progresso: sem estrelas, sem precisão mínima, sem liberar lição.

   A tela tem três estados:

     seleção   duas colunas, como a tela de entrada: o que treinar e por
               quanto tempo de um lado; do outro, as teclas que mais escapam
               e a ilustração do modo;
     sessão    igual à tela de lição, e de propósito: quem treina já conhece
               aquele lugar, e não deve ter de aprender outro;
     resumo    os números em texto, e mais nada.

   O TEXTO NÃO ACABA. Quem manda no fim da sessão é o relógio, não o texto:
   quando o cursor chega perto do fim do que existe, entram mais linhas e a
   digitação segue sem piscar.
   ========================================================================== */

import { t, nomeDoDedo, traduzirPagina } from '../i18n.js';
import { config, sistemaAtual } from '../estado.js';
import { CHAVES, ler, gravar } from '../armazenamento.js';
import { estatisticas } from '../progresso.js';
import { criarMotor, desenharTexto } from '../motor-digitacao.js';
import {
  desenharTeclado,
  destacarTecla,
  limparDestaque,
  piscarErro,
  teclaDaLetra,
  passosDaLetra,
  destacarModificadora,
  teclaDaModificadora,
} from '../teclado.js';
import { desenharMaos, destacarDedo, pulsarDedo, limparDedos } from '../maos.js';
import { dedoDaTecla } from '../../dados/layouts/dedos.js';
import { tocarClique, tocarErro } from '../som.js';
import {
  PALAVRAS,
  EXERCICIOS,
  PALAVRAS_ACENTUADAS,
  NUMEROS,
  OPERADORES,
  MODOS,
  DURACOES,
} from '../../dados/treino-livre.js';

/**
 * Quantos caracteres cabem numa linha.
 *
 * O número não é solto: a caixa do texto tem a largura do teclado, e nessa
 * largura cabem cerca de 32 caracteres da fonte monoespaçada da lição — em
 * qualquer tamanho de tela, porque texto e teclado encolhem juntos. Trinta
 * deixa a folga que impede uma palavra comprida de empurrar a linha para uma
 * segunda fileira e bagunçar a janela de três linhas.
 */
const LARGURA_DA_LINHA = 30;

/** A sessão aberta agora, para poder desmontá-la ao sair. */
let sessao = null;

/* --------------------------------------------------------------------------
   O que fica salvo: só a escolha. O resultado não, porque treino livre não
   tem resultado para guardar.
   -------------------------------------------------------------------------- */

const ESCOLHA_PADRAO = { modo: 'adaptativo', duracao: 120, textoProprio: '' };

function lerEscolha() {
  const salva = ler(CHAVES.livre, ESCOLHA_PADRAO);

  return {
    modo: MODOS.some((m) => m.id === salva.modo) ? salva.modo : ESCOLHA_PADRAO.modo,
    duracao: DURACOES.includes(salva.duracao) ? salva.duracao : ESCOLHA_PADRAO.duracao,
    textoProprio: typeof salva.textoProprio === 'string' ? salva.textoProprio : '',
  };
}

let escolha = lerEscolha();

function guardarEscolha(mudancas) {
  escolha = { ...escolha, ...mudancas };
  gravar(CHAVES.livre, escolha);
}

/* ==========================================================================
   O modo Adaptativo

   A regra, numa frase: cada tecla ganha um PESO pelos erros que acumulou, e
   as palavras que a usam passam a ser sorteadas mais vezes.

   O peso vem de digita:estatisticas, que as lições preenchem. Quem nunca
   errou nada recebe um sorteio parelho — que é o certo: não há fraqueza
   conhecida para perseguir.
   ========================================================================== */

function pesosPorTecla() {
  const { errosPorTecla = {} } = estatisticas();
  const pesos = {};

  for (const [tecla, vezes] of Object.entries(errosPorTecla)) {
    pesos[tecla.toLowerCase()] = vezes;
  }

  return pesos;
}

/**
 * As teclas mais fracas, da pior para a menos pior.
 * @param {number} quantas
 */
export function teclasMaisFracas(quantas = 8) {
  return Object.entries(pesosPorTecla())
    .sort((a, b) => b[1] - a[1])
    .slice(0, quantas)
    .map(([tecla, vezes]) => ({ tecla, vezes }));
}

/**
 * Tudo o que o Adaptativo pode sortear.
 *
 * As palavras, mais os vaivéns das teclas que não formam palavra em
 * português. Os vaivéns repetem a letra três vezes, então eles só ganham
 * peso de verdade quando aquela letra é a fraca — e ficam quietos quando não
 * é. Não precisa de regra à parte para isso.
 */
function candidatasDoAdaptativo() {
  return [...PALAVRAS, ...Object.values(EXERCICIOS).flat()];
}

/** Sorteio com peso: quanto mais tecla fraca a palavra tem, mais chance. */
function sortearAdaptativa(pesos) {
  const candidatas = candidatasDoAdaptativo().map((palavra) => {
    // Toda palavra tem alguma chance, senão o treino vira monólogo das três
    // ou quatro piores teclas.
    let peso = 1;
    for (const letra of palavra) peso += pesos[letra] ?? 0;

    return { palavra, peso };
  });

  const total = candidatas.reduce((soma, c) => soma + c.peso, 0);
  let sorte = Math.random() * total;

  for (const candidata of candidatas) {
    sorte -= candidata.peso;
    if (sorte <= 0) return candidata.palavra;
  }

  return candidatas.at(-1).palavra;
}

/* --------------------------------------------------------------------------
   Geração do texto
   -------------------------------------------------------------------------- */

function sortear(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function proximoPedaco(modo, pesos) {
  if (modo === 'adaptativo') return sortearAdaptativa(pesos);
  if (modo === 'acentos') return sortear(PALAVRAS_ACENTUADAS);

  if (modo === 'numerico') {
    // Uma conta a cada três pedaços: o operador aparece sem virar o
    // exercício inteiro.
    return Math.random() < 0.33
      ? `${sortear(NUMEROS)} ${sortear(OPERADORES)} ${sortear(NUMEROS)}`
      : sortear(NUMEROS);
  }

  return sortear(PALAVRAS);
}

/**
 * Gera linhas novas.
 *
 * No "Texto próprio" o conteúdo é fixo: quando ele acaba, recomeça. É o
 * mesmo texto, treinado de novo, e não um texto inventado por cima do dele.
 */
function gerarLinhas(quantas) {
  if (escolha.modo === 'proprio') return quebrarEmLinhas(escolha.textoProprio, quantas);

  const pesos = pesosPorTecla();
  const linhas = [];

  for (let i = 0; i < quantas; i += 1) {
    let linha = '';

    // Para na palavra que NÃO cabe, e não depois dela.
    for (;;) {
      const pedaco = proximoPedaco(escolha.modo, pesos);
      const candidata = linha ? `${linha} ${pedaco}` : pedaco;

      if (linha && candidata.length > LARGURA_DA_LINHA) break;
      linha = candidata;
    }

    linhas.push(linha);
  }

  return linhas;
}

function quebrarEmLinhas(texto, quantas) {
  const palavras = texto.trim().split(/\s+/).filter(Boolean);
  if (!palavras.length) return [];

  const linhas = [];
  let linha = '';

  for (const palavra of palavras) {
    if (linha && `${linha} ${palavra}`.length > LARGURA_DA_LINHA) {
      linhas.push(linha);
      linha = palavra;
    } else {
      linha = linha ? `${linha} ${palavra}` : palavra;
    }
  }

  if (linha) linhas.push(linha);

  const saida = [];
  while (saida.length < quantas) saida.push(...linhas);

  return saida.slice(0, quantas);
}

/* ==========================================================================
   TELA 1 — a escolha
   ========================================================================== */

/**
 * Mostra a tela de escolha do treino livre.
 *
 * @param {HTMLElement} destino
 * @param {object} opcoes
 * @param {() => void} [opcoes.aoSair]  para onde voltar ao encerrar
 */
export function mostrarTreinoLivre(destino, { aoSair } = {}) {
  encerrarTreinoLivre();

  /* Sem a moldura de duas colunas do início e da trilha: o painel de
     progresso dela mostraria as teclas que mais escapam uma segunda vez, e
     elas já são metade do assunto desta tela. */
  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    `
      <div class="livre">
        <h1>${t('treinoLivre.titulo')}</h1>
        <p class="subtitulo">${t('treinoLivre.subtitulo')}</p>

        <div class="livre-escolha">
          <div>
            <div class="livre-grupo">
              <p class="livre-rotulo">${t('treinoLivre.oQueTreinar')}</p>
              <div class="livre-modos">${MODOS.map(montarModo).join('')}</div>

              <textarea class="livre-texto-proprio" data-papel="texto-proprio"
                        placeholder="${t('treinoLivre.colar')}"
                        aria-label="${t('treinoLivre.textoProprio')}" hidden></textarea>

              <p class="livre-recado" data-papel="recado" hidden></p>
            </div>

            <div class="livre-grupo">
              <p class="livre-rotulo">${t('treinoLivre.porQuantoTempo')}</p>
              <div class="livre-duracoes">${DURACOES.map(montarDuracao).join('')}</div>
            </div>

            <button type="button" class="botao botao--principal" data-acao="comecar">
              ${t('treinoLivre.comecar')}
            </button>
          </div>

          <div>
            <p class="livre-rotulo">${t('painel.errosTitulo')}</p>
            ${montarTeclasFracas()}

            <div class="ilustracoes" data-papel="ilustracoes">
              ${MODOS.map(
                (modo) => `
                <svg class="ilustracao" data-ilustracao="${modo.id}"
                     viewBox="0 0 320 240" aria-hidden="true">
                  <use href="#${modo.ilustracao}"></use>
                </svg>`
              ).join('')}
            </div>
          </div>
        </div>
      </div>
    `
  );

  const area = destino.querySelector('[data-papel="texto-proprio"]');
  const recado = destino.querySelector('[data-papel="recado"]');
  const ilustracoes = destino.querySelector('[data-papel="ilustracoes"]');

  area.value = escolha.textoProprio;

  /* ------------------------------------------------------------------------
     Atualizar NO LUGAR, em vez de redesenhar a tela

     Redesenhar seria o caminho curto, mas mataria duas coisas: o cross-fade
     das ilustrações — o elemento antigo morre e o novo nasce já opaco — e o
     que estivesse escrito na área de texto. Então só muda o que muda.
     ------------------------------------------------------------------------ */

  function atualizarModo() {
    for (const botao of destino.querySelectorAll('[data-modo]')) {
      botao.setAttribute('aria-pressed', String(botao.dataset.modo === escolha.modo));
    }

    // A área de texto só some da vista: escondê-la, em vez de removê-la, é o
    // que preserva o que já foi digitado.
    area.hidden = escolha.modo !== 'proprio';

    escreverRecado();
    mostrarIlustracao(escolha.modo);
  }

  function atualizarDuracao() {
    for (const botao of destino.querySelectorAll('[data-duracao]')) {
      const igual = Number(botao.dataset.duracao) === escolha.duracao;
      botao.setAttribute('aria-pressed', String(igual));
    }
  }

  /** O aviso do modo. Montado em nós, porque o parágrafo já está na tela. */
  function escreverRecado() {
    recado.replaceChildren();

    /* O aviso do US Internacional pede as DUAS condições: Windows E teclado
       americano. Só o sistema não basta — quem usa ABNT2 no Windows tem
       tecla de acento própria, e mandá-lo mexer no idioma seria à toa. */
    if (escolha.modo === 'acentos' && sistemaAtual() === 'windows' && config().layout === 'us') {
      const forte = document.createElement('strong');
      forte.textContent = t('treinoLivre.usInternacional');

      const [antes, depois] = t('treinoLivre.avisoUsInternacional').split('{layout}');
      recado.append(antes, forte, depois ?? '');
      recado.hidden = false;
      return;
    }

    if (escolha.modo === 'numerico') {
      recado.textContent = t('treinoLivre.avisoNumerico');
      recado.hidden = false;
      return;
    }

    recado.hidden = true;
  }

  /** Acende uma ilustração e apaga as outras três. O fade é do CSS. */
  function mostrarIlustracao(modo) {
    for (const desenho of ilustracoes.querySelectorAll('.ilustracao')) {
      desenho.classList.toggle('ilustracao--ativa', desenho.dataset.ilustracao === modo);
    }
  }

  for (const botao of destino.querySelectorAll('[data-modo]')) {
    botao.addEventListener('click', () => {
      guardarEscolha({ modo: botao.dataset.modo });
      atualizarModo();
    });

    // Prévia: passar o mouse mostra a ilustração daquele modo; ao sair, ela
    // volta para a do modo escolhido — nunca para o vazio.
    botao.addEventListener('mouseenter', () => mostrarIlustracao(botao.dataset.modo));
    botao.addEventListener('mouseleave', () => mostrarIlustracao(escolha.modo));
  }

  for (const botao of destino.querySelectorAll('[data-duracao]')) {
    botao.addEventListener('click', () => {
      guardarEscolha({ duracao: Number(botao.dataset.duracao) });
      atualizarDuracao();
    });
  }

  area.addEventListener('input', () => guardarEscolha({ textoProprio: area.value }));

  destino.querySelector('[data-acao="comecar"]').addEventListener('click', () => {
    if (escolha.modo === 'proprio' && !escolha.textoProprio.trim()) {
      area.focus();
      return;
    }

    mostrarSessao(destino, { aoSair });
  });

  atualizarModo();
}

function montarModo(modo) {
  return `
    <button type="button" class="livre-modo" data-modo="${modo.id}" aria-pressed="false">
      <span class="livre-modo-marca"><span class="livre-modo-ponto"></span></span>
      <span class="livre-modo-texto">
        <span class="livre-modo-nome">${t(`treinoLivre.modos.${modo.id}.nome`)}</span>
        <span class="livre-modo-descricao">${t(`treinoLivre.modos.${modo.id}.descricao`)}</span>
      </span>
    </button>`;
}

function montarDuracao(segundos) {
  const rotulo = segundos
    ? t('treinoLivre.minutos').replace('{quantos}', segundos / 60)
    : t('treinoLivre.semFim');

  return `<button type="button" class="livre-duracao" data-duracao="${segundos}"
                  aria-pressed="false">${rotulo}</button>`;
}

/** As teclas que mais escapam, cada uma na cor do dedo que a aperta. */
function montarTeclasFracas(lista = teclasMaisFracas(8)) {
  if (!lista.length) return `<p class="ajuda">${t('painel.semErros')}</p>`;

  const itens = lista
    .map(({ tecla, vezes }) => {
      const onde = teclaDaLetra(tecla, config().layout);
      const dedo = onde ? dedoDaTecla(onde.codigo)?.dedo : null;
      const nome = tecla === ' ' ? t('teclas.espaco') : tecla;

      return `<span class="tecla-fraca${dedo ? ` tecla-fraca--${dedo}` : ''}">
                ${nome}<span class="tecla-fraca-conta">${vezes}×</span>
              </span>`;
    })
    .join('');

  return `<div class="teclas-fracas">${itens}</div>`;
}

/* ==========================================================================
   TELA 2 — a sessão
   ========================================================================== */

/** Fecha a sessão aberta, se houver. */
export function encerrarTreinoLivre() {
  sessao?.encerrar();
  sessao = null;
}

/**
 * Troca o idioma da sessão aberta, se houver uma.
 * @returns {boolean} true quando havia sessão — e, nesse caso, quem chamou
 *                    NÃO deve redesenhar a tela.
 */
export function retraduzirTreinoLivre() {
  if (!sessao) return false;

  sessao.retraduzir();
  return true;
}

function mostrarSessao(destino, { aoSair }) {
  encerrarTreinoLivre();

  /* Teclado e sistema são lidos a cada uso, e não guardados numa constante:
     se o formato mudar no meio da sessão, o desenho precisa acompanhar sem
     recomeçar nada. */
  const layoutAtual = () => config().layout;

  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    `
    <div class="licao livre-sessao">
      <div class="livre-topo">
        <div class="medidas">
          <span class="medida">
            <strong data-papel="tempo">0:00</strong>
            <span data-papel="rotulo-tempo">${t(escolha.duracao ? 'treinoLivre.restam' : 'treinoLivre.decorrido')}</span>
          </span>
          <span class="medida"><strong data-papel="ppm">0</strong> <span data-i18n="licao.ppm">${t('licao.ppm')}</span></span>
          <span class="medida"><strong data-papel="precisao">100%</strong> <span data-i18n="licao.precisao">${t('licao.precisao')}</span></span>
        </div>

        <button type="button" class="livre-encerrar" data-acao="encerrar" data-i18n="treinoLivre.encerrar">
          ${t('treinoLivre.encerrar')}
        </button>
      </div>

      <p class="aviso-caps" data-papel="caps" role="status" data-i18n="licao.capsLock" hidden>${t('licao.capsLock')}</p>

      <div class="licao-corpo">
        <div class="licao-texto">
          <div data-papel="texto" data-rotulo="${t('treinoLivre.campo')}"></div>
          <p class="licao-espera" data-papel="espera" data-i18n="licao.clique" hidden>${t('licao.clique')}</p>
        </div>
      </div>

      <p class="apenas-leitor-de-tela" data-papel="legenda" role="status"></p>

      <div class="licao-palco">
        <div data-papel="maos"></div>
        <div data-papel="teclado"></div>
      </div>
    </div>
  `
  );

  const partes = {
    texto: destino.querySelector('[data-papel="texto"]'),
    legenda: destino.querySelector('[data-papel="legenda"]'),
    maos: destino.querySelector('[data-papel="maos"]'),
    teclado: destino.querySelector('[data-papel="teclado"]'),
    tempo: destino.querySelector('[data-papel="tempo"]'),
    ppm: destino.querySelector('[data-papel="ppm"]'),
    precisao: destino.querySelector('[data-papel="precisao"]'),
    espera: destino.querySelector('[data-papel="espera"]'),
    caps: destino.querySelector('[data-papel="caps"]'),
  };

  desenharMaos(partes.maos);
  desenharTeclado(partes.teclado, {
    layout: layoutAtual(),
    sistema: sistemaAtual(),
    modo: 'cinza',
  });

  let letrasFeitas = 0;

  const motor = criarMotor({
    linhas: gerarLinhas(12),

    aoAtualizar(estado) {
      desenharTexto(partes.texto, estado);
      apontarProximaTecla(partes, estado, layoutAtual());

      partes.ppm.textContent = estado.ppm;
      partes.precisao.textContent = `${estado.precisao}%`;

      if (estado.feitos > letrasFeitas) tocarClique();
      letrasFeitas = estado.feitos;

      alimentar(estado);
    },

    aoErrar(erro) {
      const errada = teclaDaLetra(erro.digitada, layoutAtual());
      const certa = teclaDaLetra(erro.esperada, layoutAtual());
      const paraPiscar = errada ?? certa;

      if (paraPiscar) piscarErro(partes.teclado, paraPiscar.codigo);
      tocarErro();
    },

    aoMudarFoco(temFoco) {
      partes.espera.hidden = temFoco;
    },
  });

  /**
   * Mais texto, sempre com folga à frente.
   *
   * Esperar o fim chegar para pedir mais faria a sessão terminar sozinha —
   * e aqui quem termina é o relógio.
   */
  function alimentar(estado) {
    if (estado.texto.length - estado.posicao > LARGURA_DA_LINHA * 4) return;

    motor.acrescentar(gerarLinhas(8));
  }

  motor.montar(partes.texto);

  const vigia = (evento) => vigiarCapsLock(evento, partes, motor);
  document.addEventListener('keydown', vigia, true);
  document.addEventListener('keyup', vigia, true);

  /* O relógio. Conta para trás quando há duração, e para frente no Sem fim. */
  const comecouEm = Date.now();

  const relogio = setInterval(() => {
    const decorrido = Math.floor((Date.now() - comecouEm) / 1000);

    if (!escolha.duracao) {
      partes.tempo.textContent = formatarTempo(decorrido);
      return;
    }

    const restam = escolha.duracao - decorrido;
    partes.tempo.textContent = formatarTempo(Math.max(0, restam));

    if (restam <= 0) terminar();
  }, 250);

  partes.tempo.textContent = formatarTempo(escolha.duracao || 0);

  function terminar() {
    const resumo = motor.resumo();
    const tempoTotal = Math.floor((Date.now() - comecouEm) / 1000);

    encerrarTreinoLivre();
    mostrarResumo(destino, { ...resumo, tempoTotal }, { aoSair });
  }

  destino.querySelector('[data-acao="encerrar"]').addEventListener('click', terminar);

  /**
   * Troca os textos da sessão para o idioma novo, SEM remontar nada.
   *
   * Redesenhar a tela jogaria a pessoa de volta à escolha no meio do treino,
   * por causa de um clique em PT/EN — o mesmo cuidado que a tela de lição já
   * toma. Os textos fixos estão marcados com data-i18n; o resto é reescrito
   * à mão aqui.
   */
  function retraduzir() {
    traduzirPagina(destino);

    destino.querySelector('[data-papel="rotulo-tempo"]').textContent = t(
      escolha.duracao ? 'treinoLivre.restam' : 'treinoLivre.decorrido'
    );

    partes.texto.dataset.rotulo = t('treinoLivre.campo');
    partes.texto
      .querySelector('.campo-invisivel')
      ?.setAttribute('aria-label', t('treinoLivre.campo'));

    apontarProximaTecla(partes, motor.estado(), layoutAtual());
  }

  sessao = {
    retraduzir,

    encerrar() {
      motor.destruir();
      clearInterval(relogio);
      document.removeEventListener('keydown', vigia, true);
      document.removeEventListener('keyup', vigia, true);
    },
  };
}

/* --------------------------------------------------------------------------
   A cada letra — o mesmo desenho da tela de lição
   -------------------------------------------------------------------------- */

function apontarProximaTecla(partes, estado, layout) {
  const letra = estado.letraEsperada;

  if (!letra) {
    limparDestaque(partes.teclado);
    limparDedos(partes.maos);
    partes.legenda.textContent = '';
    return;
  }

  const etapas = passosDaLetra(letra, layout, sistemaAtual());
  const atual = etapas.length === 2 && !estado.compondo ? etapas[0] : etapas.at(-1);

  if (!atual) {
    limparDestaque(partes.teclado);
    limparDedos(partes.maos);
    partes.legenda.textContent = `${t('licao.proxima')}: ${nomeDaLetra(letra)}`;
    return;
  }

  destacarTecla(partes.teclado, atual.codigo);

  const posicao = dedoDaTecla(atual.codigo);
  if (posicao) destacarDedo(partes.maos, posicao.mao, posicao.dedo);

  const modificadora =
    atual.modificador && posicao
      ? teclaDaModificadora(atual.modificador, posicao.mao)
      : null;

  if (modificadora) {
    destacarModificadora(partes.teclado, modificadora.codigo);
    pulsarDedo(partes.maos, modificadora.mao, modificadora.dedo);
  }

  escreverLegenda(partes.legenda, nomeDaLetra(atual.letra ?? letra), posicao, modificadora);
}

function escreverLegenda(destino, letra, posicao, modificadora) {
  const pedacos = [`${t('licao.proxima')}: ${letra}`];

  if (posicao) pedacos.push(nomeDoDedo(posicao.mao, posicao.dedo));

  if (modificadora) {
    pedacos.push(
      t('licao.segure')
        .replace('{tecla}', t(`teclas.${modificadora.modificador}`))
        .replace('{dedo}', nomeDoDedo(modificadora.mao, modificadora.dedo))
    );
  }

  destino.textContent = pedacos.join(' · ');
}

function nomeDaLetra(letra) {
  return letra === ' ' ? t('teclas.espaco') : letra.toUpperCase();
}

/** O mesmo bloqueio da lição: com Caps Lock ligado, a tecla não chega ao motor. */
function vigiarCapsLock(evento, partes, motor) {
  const ligado = evento.getModifierState?.('CapsLock') ?? false;

  partes.caps.hidden = !ligado;
  if (!ligado) return;

  const escreveLetra = evento.type === 'keydown' && [...evento.key].length === 1;
  if (!escreveLetra) return;

  evento.preventDefault();
  evento.stopPropagation();

  tocarErro();
  motor.focar();
}

function formatarTempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  return `${minutos}:${String(segundos % 60).padStart(2, '0')}`;
}

/* ==========================================================================
   TELA 3 — o resumo

   Sem estrelas, sem aprovado nem reprovado, sem liberar nada. O treino livre
   não tem nota: o resumo é o retrato do que acabou de acontecer, e só.
   ========================================================================== */

function mostrarResumo(destino, resultado, { aoSair }) {
  const duracao = escolha.duracao
    ? t('treinoLivre.minutos').replace('{quantos}', escolha.duracao / 60)
    : t('treinoLivre.semFim');

  const piores = resultado.errosPorTecla.slice(0, 5);

  destino.replaceChildren();
  destino.insertAdjacentHTML(
    'beforeend',
    `
      <div class="livre">
        <div class="livre-resumo">
          <h1>${t('treinoLivre.fim')}</h1>
          <p class="subtitulo">${t(`treinoLivre.modos.${escolha.modo}.nome`)} · ${duracao}</p>

          <div class="livre-numeros">
            <div>
              <p class="livre-numero">${resultado.ppm}</p>
              <p class="ajuda">${t('treinoLivre.ppmLongo')}</p>
            </div>
            <div>
              <p class="livre-numero">${resultado.precisao}%</p>
              <p class="ajuda">${t('treinoLivre.precisaoLonga')}</p>
            </div>
            <div>
              <p class="livre-numero">${formatarTempo(resultado.tempoTotal)}</p>
              <p class="ajuda">${t('treinoLivre.deTreino')}</p>
            </div>
          </div>

          <p class="livre-rotulo">${t('treinoLivre.teclasQueEscaparam')}</p>
          ${
            piores.length
              ? montarTeclasFracas(piores.map(({ tecla, vezes }) => ({ tecla, vezes })))
              : `<p class="ajuda">${t('treinoLivre.semErros')}</p>`
          }

          <div class="livre-acoes">
            <button type="button" class="botao botao--principal" data-acao="de-novo">
              ${t('treinoLivre.deNovo')}
            </button>
            <button type="button" class="botao" data-acao="voltar">
              ${t('treinoLivre.voltar')}
            </button>
          </div>
        </div>
      </div>
    `
  );

  destino
    .querySelector('[data-acao="de-novo"]')
    .addEventListener('click', () => mostrarSessao(destino, { aoSair }));

  destino
    .querySelector('[data-acao="voltar"]')
    .addEventListener('click', () => mostrarTreinoLivre(destino, { aoSair }));
}
