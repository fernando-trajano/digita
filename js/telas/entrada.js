/* ==========================================================================
   entrada.js — a primeira tela do site.

   Aqui o usuário diz que teclado tem (brasileiro ou americano) e que sistema
   usa (Windows ou Mac). Tudo o mais no site depende dessas duas respostas:
   quais teclas aparecem, o que está escrito nelas e como se fazem os acentos.

   Regra de ouro: a escolha manual é sempre a palavra final. A detecção
   automática só marca a opção — nunca discute com o usuário.

   Layout: duas colunas em telas largas (escolhas de um lado, prévia do
   teclado do outro) e uma coluna só em telas estreitas.
   ========================================================================== */

import { t, nomeDoDedo } from '../i18n.js';
import { desenharTeclado } from '../teclado.js';
import { config, definirConfig, sistemaAtual } from '../estado.js';
import {
  detectarLayoutPeloNavegador,
  escutarTeclaDeTeste,
  TECLA_DE_TESTE,
} from '../deteccao.js';

/* O que vale agora. O formato vem do que estiver salvo (o padrão é o teclado
   brasileiro, como manda o briefing). O sistema vem do que o usuário
   escolheu antes; se ele nunca escolheu, do palpite do navegador. */
const escolha = {
  layout: config().layout,
  sistema: sistemaAtual(),
};

/** Cancela a espera pela tecla, quando há uma em andamento. */
let cancelarEscuta = null;

/**
 * Desenha a tela de entrada dentro de um elemento.
 * @param {HTMLElement} destino
 */
export function mostrarEntrada(destino, { aoContinuar } = {}) {
  pararDeteccao();

  destino.replaceChildren();
  destino.insertAdjacentHTML('beforeend', montarHtml());

  ligarEscolhas(destino, 'layout');
  ligarEscolhas(destino, 'sistema');
  ligarDeteccao(destino);

  destino
    .querySelector('[data-acao="continuar"]')
    .addEventListener('click', () => aoContinuar?.());

  atualizarPrevia(destino);
}

/* --------------------------------------------------------------------------
   O HTML da tela

   Os textos vêm todos das traduções (dados/i18n), escritas por nós — por
   isso dá para montar o HTML direto, sem risco.
   -------------------------------------------------------------------------- */

function montarHtml() {
  return `
    <div class="entrada">
      <div class="entrada-escolhas">
        <h1>${t('entrada.titulo')}</h1>
        <p class="subtitulo">${t('entrada.subtitulo')}</p>

        <section class="secao">
          <h2>${t('entrada.formatoTitulo')}</h2>
          <p class="ajuda">${t('entrada.formatoAjuda')}</p>

          <div class="opcoes" role="group" aria-label="${t('teclado.formato')}">
            ${montarOpcao('layout', 'abnt2', t('teclado.abnt2'), t('entrada.abnt2Descricao'))}
            ${montarOpcao('layout', 'us', t('teclado.us'), t('entrada.usDescricao'))}
          </div>

          <div class="entrada-deteccao">
            <button type="button" class="botao" data-acao="detectar">
              ${t('entrada.detectar')}
            </button>
            <p class="ajuda" data-papel="ajuda-deteccao">${t('entrada.detectarAjuda')}</p>
          </div>

          <p class="aviso" data-papel="aviso" role="status"></p>
        </section>

        <section class="secao">
          <h2>${t('entrada.sistemaTitulo')}</h2>
          <p class="ajuda">${t('entrada.sistemaAjuda')}</p>

          <div class="opcoes" role="group" aria-label="${t('teclado.sistema')}">
            ${montarOpcao('sistema', 'windows', t('teclado.windows'), t('entrada.windowsDescricao'))}
            ${montarOpcao('sistema', 'mac', t('teclado.mac'), t('entrada.macDescricao'))}
          </div>
        </section>

        <section class="secao">
          <h2>${t('entrada.acentosTitulo')}</h2>
          <p class="destaque" data-papel="dica-acentos"></p>
        </section>

        <section class="secao">
          <button type="button" class="botao botao--principal" data-acao="continuar">
            ${t('entrada.continuar')}
          </button>
        </section>
      </div>

      <aside class="entrada-previa">
        <h2>${t('entrada.previaTitulo')}</h2>
        <p class="ajuda">${t('entrada.previaAjuda')}</p>
        <div data-papel="previa"></div>
        <p class="ajuda entrada-dedo" data-papel="legenda"></p>
      </aside>
    </div>
  `;
}

/** Um cartão de escolha. */
function montarOpcao(grupo, valor, nome, descricao) {
  return `
    <button type="button" class="opcao" data-grupo="${grupo}" data-valor="${valor}"
            aria-pressed="${escolha[grupo] === valor}">
      <span class="opcao-nome">${nome}</span>
      <span class="opcao-descricao">${descricao}</span>
    </button>
  `;
}

/* --------------------------------------------------------------------------
   Comportamento
   -------------------------------------------------------------------------- */

/** Liga os cartões de um grupo (layout ou sistema). */
function ligarEscolhas(destino, grupo) {
  const botoes = destino.querySelectorAll(`[data-grupo="${grupo}"]`);

  botoes.forEach((botao) => {
    botao.addEventListener('click', () => {
      // Escolher na mão encerra qualquer detecção em andamento: a decisão
      // do usuário vale mais do que a da máquina.
      pararDeteccao(destino);
      aplicarEscolha(destino, grupo, botao.dataset.valor);
    });
  });
}

function aplicarEscolha(destino, grupo, valor) {
  escolha[grupo] = valor;

  // Fica salvo: na próxima visita o site já sabe qual é o seu teclado.
  definirConfig({ [grupo]: valor });

  destino.querySelectorAll(`[data-grupo="${grupo}"]`).forEach((botao) => {
    botao.setAttribute('aria-pressed', String(botao.dataset.valor === valor));
  });

  atualizarPrevia(destino);
}

/** Redesenha a prévia do teclado e a dica de acentuação. */
function atualizarPrevia(destino) {
  desenharTeclado(destino.querySelector('[data-papel="previa"]'), {
    layout: escolha.layout,
    sistema: escolha.sistema,
    modo: 'cores',
  });

  destino.querySelector('[data-papel="dica-acentos"]').textContent = dicaDeAcentos();
}

/** A dica muda conforme o teclado E o sistema. */
function dicaDeAcentos() {
  if (escolha.layout === 'abnt2') return t('entrada.acentosAbnt2');

  return escolha.sistema === 'mac'
    ? t('entrada.acentosUsMac')
    : t('entrada.acentosUsWindows');
}

/* --------------------------------------------------------------------------
   Detecção automática
   -------------------------------------------------------------------------- */

function ligarDeteccao(destino) {
  destino
    .querySelector('[data-acao="detectar"]')
    .addEventListener('click', () => detectar(destino));
}

async function detectar(destino) {
  // Se já estava esperando uma tecla, o segundo clique cancela.
  if (cancelarEscuta) {
    pararDeteccao(destino);
    return;
  }

  // Caminho 1: perguntar ao navegador (Chrome e Edge sabem responder).
  const pelaApi = await detectarLayoutPeloNavegador();

  if (pelaApi) {
    aplicarEscolha(destino, 'layout', pelaApi);
    avisar(destino, t('entrada.detectado').replace('{formato}', nomeDoLayout(pelaApi)));
    return;
  }

  // Caminho 2: pedir para o usuário apertar a tecla (Safari e Firefox).
  esperarTecla(destino);
}

function esperarTecla(destino) {
  const previa = destino.querySelector('[data-papel="previa"]');
  const botao = destino.querySelector('[data-acao="detectar"]');

  // A tecla à direita do L pulsa na prévia.
  previa.querySelector(`[data-codigo="${TECLA_DE_TESTE}"]`)?.classList.add('tecla--pulsando');

  botao.textContent = t('entrada.cancelar');
  avisar(destino, textoDoPedido());
  mostrarDedoDaTecla(destino);

  cancelarEscuta = escutarTeclaDeTeste((resultado) => {
    pararDeteccao(destino);

    if (resultado.layout) {
      aplicarEscolha(destino, 'layout', resultado.layout);
      avisar(destino, t('entrada.detectado').replace('{formato}', nomeDoLayout(resultado.layout)));
      return;
    }

    if (resultado.motivo === 'outraTecla') {
      avisar(destino, t('entrada.detectadoOutraTecla'));
      return;
    }

    if (resultado.motivo === 'cancelado') {
      avisar(destino, '');
      return;
    }

    avisar(destino, t('entrada.detectadoNadaFeito'));
  });
}

/** O pedido muda de texto conforme a prévia estar ao lado ou abaixo. */
function textoDoPedido() {
  const emDuasColunas = window.matchMedia('(min-width: 64rem)').matches;
  return emDuasColunas ? t('entrada.aperteATecla') : t('entrada.aperteATeclaEstreito');
}

/** Mostra que dedo aperta a tecla destacada, como as lições vão fazer. */
function mostrarDedoDaTecla(destino) {
  destino.querySelector('[data-papel="legenda"]').textContent = nomeDoDedo('direita', 'minimo');
}

/** Encerra a espera pela tecla e devolve a tela ao estado normal. */
function pararDeteccao(destino) {
  cancelarEscuta?.();
  cancelarEscuta = null;

  if (!destino) return;

  destino
    .querySelector('.tecla--pulsando')
    ?.classList.remove('tecla--pulsando');

  const botao = destino.querySelector('[data-acao="detectar"]');
  if (botao) botao.textContent = t('entrada.detectar');

  const legenda = destino.querySelector('[data-papel="legenda"]');
  if (legenda) legenda.textContent = '';
}

function avisar(destino, texto) {
  destino.querySelector('[data-papel="aviso"]').textContent = texto;
}

function nomeDoLayout(layout) {
  return layout === 'abnt2' ? t('teclado.abnt2') : t('teclado.us');
}

/** O que o usuário escolheu — usado pelas outras telas. */
export function escolhaAtual() {
  return { ...escolha };
}
