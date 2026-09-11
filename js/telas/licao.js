/* ==========================================================================
   licao.js — a tela onde se treina. É para ela que todo o resto existe.

   O que acontece ao mesmo tempo, a cada letra:
     - o texto mostra o que já foi feito, a letra da vez e o que falta;
     - o teclado (todo cinza) acende só a próxima tecla, na cor do dedo;
     - as mãos acendem o dedo daquela tecla;
     - a legenda escreve a mesma coisa em texto: "Próxima: F · indicador
       esquerdo" — é ela que serve a quem usa leitor de tela;
     - PPM, precisão e progresso vão subindo.

   Layout: uma coluna centralizada, sem nada nas laterais. Quem está
   treinando precisa olhar para uma coisa só.
   ========================================================================== */

import { t, nomeDoDedo, traduzirPagina } from '../i18n.js';
import { config, definirConfig, sistemaAtual } from '../estado.js';
import { criarMotor, desenharTexto } from '../motor-digitacao.js';
import {
  desenharTeclado,
  destacarTecla,
  limparDestaque,
  piscarErro,
  teclaDaLetra,
  passosDaLetra,
} from '../teclado.js';
import { desenharMaos, destacarDedo, limparDedos } from '../maos.js';
import { dedoDaTecla } from '../../dados/layouts/dedos.js';
import { conferirLayout } from '../deteccao.js';
import { tocarClique, tocarErro, tocarConclusao } from '../som.js';

/** A lição aberta agora, para poder desmontá-la ao sair. */
let sessao = null;

/**
 * Abre uma lição.
 *
 * @param {HTMLElement} destino
 * @param {object} opcoes
 * @param {object} opcoes.licao  a lição, vinda de dados/licoes
 * @param {(resumo: object) => void} [opcoes.aoConcluir]
 * @param {() => void} [opcoes.aoSair]
 */
export function mostrarLicao(destino, { licao, aoConcluir, aoSair }) {
  encerrarLicao();

  /* O formato do teclado pode mudar NO MEIO da lição, pelo botão "Trocar"
     do aviso da rede de segurança. Por isso ele é lido a cada uso, e não
     guardado numa constante: guardá-lo deixaria a tela desenhando o teclado
     antigo depois da troca. */
  const layoutAtual = () => config().layout;

  destino.replaceChildren();
  destino.insertAdjacentHTML('beforeend', montarHtml(licao));

  const partes = {
    nome: destino.querySelector('[data-papel="nome"]'),
    dica: destino.querySelector('[data-papel="dica"]'),
    texto: destino.querySelector('[data-papel="texto"]'),
    legenda: destino.querySelector('[data-papel="legenda"]'),
    maos: destino.querySelector('[data-papel="maos"]'),
    teclado: destino.querySelector('[data-papel="teclado"]'),
    ppm: destino.querySelector('[data-papel="ppm"]'),
    precisao: destino.querySelector('[data-papel="precisao"]'),
    progresso: destino.querySelector('[data-papel="progresso"]'),
    barra: destino.querySelector('[data-papel="barra"]'),
    espera: destino.querySelector('[data-papel="espera"]'),
    caps: destino.querySelector('[data-papel="caps"]'),
    avisoLayout: destino.querySelector('[data-papel="aviso-layout"]'),
  };

  desenharMaos(partes.maos);
  desenharTeclado(partes.teclado, { layout: layoutAtual(), sistema: sistemaAtual(), modo: 'cinza' });


  // Quantas letras já estavam certas na última atualização. Comparando com
  // o número novo dá para saber que o cursor andou — e é isso que dispara o
  // clique, sem precisar de mais um gancho dentro do motor.
  let letrasFeitas = 0;

  // O último estado recebido do motor. Serve para redesenhar a tecla acesa e
  // a legenda sem mexer no motor — é o que permite trocar de idioma no meio
  // da lição sem recomeçar nada.
  let ultimoEstado = null;

  const motor = criarMotor({
    linhas: licao.conteudo,

    aoAtualizar(estado) {
      ultimoEstado = estado;

      if (estado.posicao > 0) esconderDica();

      desenharTexto(partes.texto, estado);
      apontarProximaTecla(partes, estado, layoutAtual());
      atualizarMedidas(partes, estado);

      if (estado.feitos > letrasFeitas) tocarClique();
      letrasFeitas = estado.feitos;
    },

    aoErrar(erro) {
      // Pisca a tecla que a pessoa apertou por engano; se aquela letra não
      // existe neste teclado, pisca a que ela deveria ter apertado.
      const errada = teclaDaLetra(erro.digitada, layoutAtual());
      const certa = teclaDaLetra(erro.esperada, layoutAtual());
      const paraPiscar = errada ?? certa;

      if (paraPiscar) piscarErro(partes.teclado, paraPiscar.codigo);

      // Errar também é começar a digitar.
      esconderDica();

      tocarErro();
    },

    aoMudarFoco(temFoco) {
      partes.espera.hidden = temFoco;
    },

    aoConcluir(resumo) {
      tocarConclusao();
      aoConcluir?.(resumo);
    },
  });

  motor.montar(partes.texto);

  /* Duas vigias de teclado, as duas em fase de captura:

     - o Caps Lock, que precisa ser visto ANTES de a letra chegar ao motor,
       para as maiúsculas não contarem como erro;
     - a rede de segurança do layout, que sugere trocar de teclado quando a
       tecla física não bate com o que foi escolhido. */
  const vigia = (evento) => {
    vigiarCapsLock(evento, partes, motor);
    vigiarLayout(evento);
  };

  document.addEventListener('keydown', vigia, true);
  // Soltar a tecla também conta: é assim que o aviso some assim que o Caps
  // Lock é desligado, sem esperar a próxima letra.
  document.addEventListener('keyup', vigia, true);

  destino.querySelector('[data-acao="sair"]').addEventListener('click', () => {
    encerrarLicao();
    aoSair?.();
  });

  /**
   * A dica orienta ANTES de começar. Da primeira tecla em diante ela só
   * ocuparia espaço logo acima do texto, que é onde os olhos precisam estar.
   */
  function esconderDica() {
    if (partes.dica) partes.dica.hidden = true;
  }

  /* ------------------------------------------------------------------------
     Rede de segurança do layout

     Escolher o teclado errado na entrada é fácil de fazer e difícil de
     perceber: as letras saem certas, e só o Ç e a pontuação denunciam. Por
     isso a lição vigia a tecla à direita do L e, quando o que ela produz não
     bate com o formato escolhido, oferece a troca.

     Trocar precisa acontecer INTEIRO e na hora: a configuração, o desenho do
     teclado, a dica (que muda de teclado para teclado) e a tecla acesa. E
     precisa devolver o foco ao campo invisível — sem isso, o clique no botão
     deixaria a lição sem receber o que se digita.
     ------------------------------------------------------------------------ */

  /** O formato sugerido pela última tecla, enquanto o aviso estiver na tela. */
  let sugestaoDeLayout = null;

  function vigiarLayout(evento) {
    const sugerido = conferirLayout(evento, layoutAtual());
    if (!sugerido) return;

    sugestaoDeLayout = sugerido;
    escreverAvisoDeLayout(sugerido);
  }

  function escreverAvisoDeLayout(sugerido) {
    const nome = sugerido === 'abnt2' ? t('teclado.abnt2') : t('teclado.us');

    partes.avisoLayout.hidden = false;
    partes.avisoLayout.replaceChildren();
    partes.avisoLayout.append(
      document.createTextNode(t('licao.avisoLayout').replace('{formato}', nome) + ' ')
    );

    const trocar = document.createElement('button');
    trocar.type = 'button';
    trocar.className = 'botao';
    trocar.textContent = t('licao.trocarLayout');

    /* Sem este preventDefault o botão não funciona — e o motivo é sutil:
       apertar o mouse tira o foco do campo invisível, aparece a linha
       "Clique no texto para continuar digitando", tudo o que está abaixo
       desce uns 20px e, quando o mouse é solto, o botão já não está mais sob
       o ponteiro. O navegador então não considera aquilo um clique, e nada
       acontece. Impedir o padrão do mousedown mantém o foco onde está: o
       aviso não aparece, nada se mexe, e o clique chega. O teclado (Tab e
       Enter) não passa por aqui e continua funcionando. */
    trocar.addEventListener('mousedown', (evento) => evento.preventDefault());
    trocar.addEventListener('click', () => trocarLayout(sugerido));

    partes.avisoLayout.append(trocar);
  }

  function trocarLayout(novo) {
    definirConfig({ layout: novo });

    desenharTeclado(partes.teclado, {
      layout: novo,
      sistema: sistemaAtual(),
      modo: 'cinza',
    });

    if (partes.dica) partes.dica.textContent = textoDaDica(licao);

    sugestaoDeLayout = null;
    partes.avisoLayout.hidden = true;

    // A lição fica exatamente onde estava: só o desenho do teclado muda.
    if (ultimoEstado) apontarProximaTecla(partes, ultimoEstado, novo);
    motor.focar();
  }

  /**
   * Troca os textos da tela para o idioma novo, SEM remontar nada.
   *
   * Remontar seria o caminho fácil — é o que todas as outras telas fazem —,
   * mas aqui ele apagaria a lição em andamento: posição no texto, erros,
   * tempo e métricas voltariam ao zero por causa de um clique em PT/EN.
   * Então a tela troca só as palavras, e o motor nem fica sabendo.
   */
  function retraduzir() {
    // Os textos fixos estão marcados com data-i18n e são trocados de uma vez.
    traduzirPagina(destino);

    const idioma = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';
    partes.nome.textContent = licao.titulo[idioma];

    partes.texto.dataset.rotulo = t('licao.campo');
    partes.texto.querySelector('.campo-invisivel')?.setAttribute('aria-label', t('licao.campo'));

    if (partes.dica) partes.dica.textContent = textoDaDica(licao);

    // Legenda e aviso de layout são reescritos a cada tecla; sem isto eles
    // ficariam no idioma antigo até a próxima letra.
    if (ultimoEstado) apontarProximaTecla(partes, ultimoEstado, layoutAtual());
    if (sugestaoDeLayout) escreverAvisoDeLayout(sugestaoDeLayout);
  }

  sessao = {
    retraduzir,

    encerrar() {
      motor.destruir();
      document.removeEventListener('keydown', vigia, true);
      document.removeEventListener('keyup', vigia, true);
    },
  };
}

/**
 * Troca o idioma da lição aberta, se houver uma.
 * @returns {boolean} true quando havia uma lição para retraduzir — e, nesse
 *                    caso, quem chamou NÃO deve redesenhar a tela.
 */
export function retraduzirLicao() {
  if (!sessao) return false;

  sessao.retraduzir();
  return true;
}

/** Fecha a lição aberta, se houver. */
export function encerrarLicao() {
  sessao?.encerrar();
  sessao = null;
}

/* --------------------------------------------------------------------------
   HTML
   -------------------------------------------------------------------------- */

function montarHtml(licao) {
  const idioma = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';

  return `
    <div class="licao">
      <div class="licao-topo">
        <p class="licao-nome" data-papel="nome">${licao.titulo[idioma]}</p>

        <div class="medidas">
          <span class="medida"><strong data-papel="ppm">0</strong> <span data-i18n="licao.ppm">${t('licao.ppm')}</span></span>
          <span class="medida"><strong data-papel="precisao">100%</strong> <span data-i18n="licao.precisao">${t('licao.precisao')}</span></span>
          <span class="medida"><strong data-papel="progresso">0%</strong> <span data-i18n="licao.progresso">${t('licao.progresso')}</span></span>
        </div>

        <button type="button" class="botao botao--pequeno" data-acao="sair" data-i18n="licao.sair">${t('licao.sair')}</button>
      </div>

      <div class="barra"><span data-papel="barra"></span></div>

      ${montarDica(licao)}

      <p class="aviso-caps" data-papel="caps" role="status" data-i18n="licao.capsLock" hidden>${t('licao.capsLock')}</p>

      <div class="licao-corpo">
        <div class="licao-texto">
          <div data-papel="texto" data-rotulo="${t('licao.campo')}"></div>
          <p class="licao-espera" data-papel="espera" data-i18n="licao.clique" hidden>${t('licao.clique')}</p>
        </div>
      </div>

      <p class="apenas-leitor-de-tela" data-papel="legenda" role="status"></p>

      <div class="licao-palco">
        <div data-papel="maos"></div>
        <div data-papel="teclado"></div>
      </div>

      <p class="aviso" data-papel="aviso-layout" role="status" hidden></p>
    </div>
  `;
}

/**
 * A dica de como fazer o que a lição pede, quando ela tem uma.
 *
 * É aqui que a trilha de acentos ganha sentido: a MESMA lição pede "ç", mas
 * o caminho muda conforme o teclado — tecla própria no brasileiro, ⌥ + c no
 * Mac americano, e a aspa simples seguida de c no US Internacional. O
 * conteúdo é um só; a instrução é que se adapta.
 */
function textoDaDica(licao) {
  if (!licao.dica) return '';

  const chave =
    config().layout === 'abnt2'
      ? 'abnt2'
      : sistemaAtual() === 'mac'
        ? 'usMac'
        : 'usWindows';

  const idioma = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';

  return licao.dica[chave]?.[idioma] ?? '';
}

/** A dica, já embrulhada — vazia quando a lição não tem nenhuma. */
function montarDica(licao) {
  const texto = textoDaDica(licao);

  return texto ? `<p class="licao-dica" data-papel="dica">${texto}</p>` : '';
}

/* --------------------------------------------------------------------------
   A cada letra
   -------------------------------------------------------------------------- */

function apontarProximaTecla(partes, estado, layout) {
  const letra = estado.letraEsperada;

  if (!letra) {
    limparDestaque(partes.teclado);
    limparDedos(partes.maos);
    partes.legenda.textContent = '';
    return;
  }

  // Uma letra acentuada sai de DUAS teclas: primeiro o acento, depois a
  // vogal. O motor avisa quando o acento já foi apertado (estado.compondo) —
  // e então o teclado deixa de acender o acento e acende a vogal.
  const etapas = passosDaLetra(letra, layout);
  const atual = etapas.length === 2 && !estado.compondo ? etapas[0] : etapas.at(-1);

  if (!atual) {
    // Letra que este teclado não produz com uma tecla nem com acento — é o
    // caso das acentuadas no teclado americano, onde o caminho é ⌥ ou o US
    // Internacional. O teclado fica quieto em vez de acender a tecla errada,
    // e quem orienta é a dica escrita da lição.
    limparDestaque(partes.teclado);
    limparDedos(partes.maos);
    escreverLegenda(partes.legenda, nomeDaLetra(letra), null);
    return;
  }

  const onde = atual;

  destacarTecla(partes.teclado, onde.codigo);

  const posicao = dedoDaTecla(onde.codigo);
  if (posicao) destacarDedo(partes.maos, posicao.mao, posicao.dedo);

  escreverLegenda(partes.legenda, nomeDaLetra(onde.letra ?? letra), posicao);
}

/**
 * A legenda não aparece na tela: o que se vê é a tecla acesa no teclado e a
 * bolinha no dedo certo. Ela existe inteira, em texto, para quem usa leitor
 * de tela — que não enxerga nenhum dos dois desenhos.
 */
function escreverLegenda(destino, letra, posicao) {
  destino.textContent = posicao
    ? `${t('licao.proxima')}: ${letra} · ${nomeDoDedo(posicao.mao, posicao.dedo)}`
    : `${t('licao.proxima')}: ${letra}`;
}

/** O espaço precisa ser dito por extenso; as outras letras falam por si. */
function nomeDaLetra(letra) {
  return letra === ' ' ? t('teclas.espaco') : letra.toUpperCase();
}

function atualizarMedidas(partes, estado) {
  const porcentagem = estado.total ? Math.round((estado.feitos / estado.total) * 100) : 0;

  partes.ppm.textContent = estado.ppm;
  partes.precisao.textContent = `${estado.precisao}%`;
  partes.progresso.textContent = `${porcentagem}%`;
  partes.barra.style.width = `${porcentagem}%`;
}

/* --------------------------------------------------------------------------
   Caps Lock

   Com o Caps Lock ligado, tudo o que se digita sai em maiúscula e o texto
   da lição é minúsculo. Sem tratar isso, a pessoa erraria letra após letra
   sem entender por quê — e ainda levaria a precisão para o chão.

   A saída: enquanto ele estiver ligado, a tecla NÃO chega ao motor. Não
   conta como erro, não avança o texto, e um aviso explica o que houve.
   -------------------------------------------------------------------------- */

function vigiarCapsLock(evento, partes, motor) {
  // getModifierState responde sobre o estado atual do Caps Lock, e não
  // sobre a tecla apertada — é o que permite avisar já na primeira letra.
  const ligado = evento.getModifierState?.('CapsLock') ?? false;

  partes.caps.hidden = !ligado;
  if (!ligado) return;

  // Só as teclas que escreveriam alguma coisa são bloqueadas: atalhos do
  // navegador e Tab continuam funcionando.
  const escreveLetra = evento.type === 'keydown' && [...evento.key].length === 1;
  if (!escreveLetra) return;

  evento.preventDefault();
  evento.stopPropagation();

  tocarErro();
  motor.focar();
}

