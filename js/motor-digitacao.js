/* ==========================================================================
   motor-digitacao.js — o coração do site: capturar o que a pessoa digita.

   POR QUE NÃO ESCUTAR keydown NO DOCUMENTO

   O jeito ingênuo de fazer um treino de digitação é escutar keydown e olhar
   event.key. Isso funciona em inglês e quebra em português, porque acento é
   feito em duas etapas:

     no ABNT2:  a tecla ´  e depois  a   →  á
     no Mac US: ⌥ + e      e depois  e   →  é

   Entre as duas etapas o sistema operacional está "compondo" a letra. Se o
   site escutar keydown, ele vê duas teclas e nenhuma letra — e o aluno leva
   erro por ter digitado certo.

   A solução é a mesma que qualquer campo de texto usa: um <input> de
   verdade, invisível, e os eventos de composição. Aí o sistema faz o
   trabalho dele e nos entrega a letra pronta: "á", uma letra só.

   COMO O CAMPO INVISÍVEL FUNCIONA

   O <input> cobre a área do texto, transparente. Clicar em qualquer lugar
   do texto foca o campo, o teclado do sistema funciona normalmente (com
   acentos, com Caps Lock, com tudo) e nós lemos o que ele produziu.
   ========================================================================== */

import { criarMetricas } from './metricas.js';

/**
 * Cria o motor de uma lição.
 *
 * @param {object} opcoes
 * @param {string[]} opcoes.linhas  o conteúdo da lição, uma string por linha
 * @param {(estado: object) => void} [opcoes.aoAtualizar]  a cada mudança
 * @param {(erro: object) => void} [opcoes.aoErrar]  a cada tecla errada
 * @param {(resumo: object) => void} [opcoes.aoConcluir]  ao fim da lição
 * @param {(temFoco: boolean) => void} [opcoes.aoMudarFoco]  quando o campo
 *        ganha ou perde o foco — a lição fica em espera enquanto não o tem
 */
export function criarMotor({ linhas, aoAtualizar, aoErrar, aoConcluir, aoMudarFoco }) {
  /* O conteúdo vira UMA sequência contínua de palavras separadas por espaço.

     As linhas do arquivo da lição são só um jeito cômodo de escrever o
     conteúdo: aqui elas viram espaço, como qualquer outra separação entre
     palavras. Quem decide onde a linha quebra na tela é a largura da caixa,
     e mais nada — redimensionar a janela muda onde o texto dobra, nunca o
     que é preciso digitar.

     Antes as linhas eram guardadas com \n e o motor pulava a quebra
     sozinho: ao chegar no fim da linha, o cursor descia sem ninguém digitar
     nada. Era um separador invisível, que não existe em texto de verdade.

     É `let` por causa do Treino livre, que acrescenta texto enquanto a
     pessoa digita (ver `acrescentar`). Na lição, ele nunca muda. */
  let texto = linhas.join(' ');

  const metricas = criarMetricas();

  let posicao = 0;
  let errouAqui = false; // erro na letra da vez, para pintá-la de vermelho
  let concluido = false;
  let compondo = ''; // o acento pendente, enquanto o sistema compõe a letra

  let campo = null;
  let destino = null;

  /* ------------------------------------------------------------------------
     Estado — o que o motor sabe, para quem desenha a tela
     ------------------------------------------------------------------------ */

  function estado() {
    return {
      texto,
      posicao,
      errouAqui,
      compondo,
      concluido,
      letraEsperada: texto[posicao] ?? null,
      total: texto.length,
      feitos: posicao,
      ...metricas.aoVivo(),
    };
  }

  function avisar() {
    aoAtualizar?.(estado());
  }

  /* ------------------------------------------------------------------------
     A regra do jogo: uma letra de cada vez, e o cursor trava no erro
     ------------------------------------------------------------------------ */

  function processar(digitado) {
    if (concluido || !digitado) return;

    // Uma composição pode entregar mais de uma letra de uma vez (colar
    // texto, por exemplo). Cada uma é conferida na sua vez.
    for (const letra of digitado) {
      if (concluido) break;
      conferirLetra(letra);
    }

    avisar();

    if (concluido) {
      metricas.encerrar();
      aoConcluir?.(metricas.resumo());
    }
  }

  function conferirLetra(letra) {
    const esperada = texto[posicao];
    if (esperada === undefined) return;

    if (letra === esperada) {
      metricas.comecar();
      metricas.registrarAcerto(esperada);

      posicao += 1;
      errouAqui = false;

      if (posicao >= texto.length) concluido = true;
      return;
    }

    // Errou: o cursor NÃO anda. A pessoa continua na mesma letra até
    // acertar — é assim que se aprende a posição, e não a corrigir depois.
    metricas.comecar();
    metricas.registrarErro(esperada);
    errouAqui = true;

    aoErrar?.({ esperada, digitada: letra, posicao });
  }

  /* ------------------------------------------------------------------------
     O campo invisível
     ------------------------------------------------------------------------ */

  /**
   * Monta o campo dentro de um elemento e começa a escutar.
   * @param {HTMLElement} elemento  a área do texto da lição
   */
  function montar(elemento) {
    destino = elemento;
    destino.classList.add('area-digitacao');

    campo = document.createElement('input');
    campo.type = 'text';
    campo.className = 'campo-invisivel';

    // Sem ajudas do sistema: corretor, maiúscula automática e sugestões
    // atrapalhariam o treino.
    campo.autocomplete = 'off';
    campo.autocapitalize = 'off';
    campo.spellcheck = false;
    campo.setAttribute('autocorrect', 'off');
    campo.setAttribute('aria-label', destino.dataset.rotulo ?? '');

    campo.addEventListener('input', aoDigitar);
    campo.addEventListener('compositionstart', aoComporComeco);
    campo.addEventListener('compositionupdate', aoComporAndamento);
    campo.addEventListener('compositionend', aoComporFim);
    campo.addEventListener('keydown', aoTeclar);
    campo.addEventListener('paste', aoColar);
    campo.addEventListener('focus', () => aoMudarFoco?.(true));
    campo.addEventListener('blur', () => aoMudarFoco?.(false));

    // Clicar em qualquer lugar do texto volta o foco para o campo — é o que
    // faz a área inteira se comportar como um campo de texto.
    destino.addEventListener('pointerdown', (evento) => {
      if (evento.target !== campo) {
        evento.preventDefault();
        focar();
      }
    });

    destino.append(campo);
    focar();
    avisar();
  }

  function aoDigitar(evento) {
    // O campo pode já ter sido desmontado: ao terminar uma lição, a tela
    // troca, e uma tecla que estava a caminho ainda chega aqui.
    if (!campo) return;

    // Enquanto o sistema está compondo um acento, o texto ainda não está
    // pronto: quem termina o trabalho é o compositionend.
    if (evento.isComposing || compondo) return;

    processar(campo.value);
    campo.value = '';
  }

  function aoComporComeco() {
    compondo = ' ';
    avisar();
  }

  function aoComporAndamento(evento) {
    // O acento pendente (´, ~, ^) aparece aqui. Guardamos para a tela poder
    // mostrar que o sistema está esperando a segunda tecla.
    compondo = evento.data ?? '';
    avisar();
  }

  function aoComporFim(evento) {
    if (!campo) return;
    compondo = '';

    // Aqui chega a letra pronta: "á", e não "´" seguido de "a".
    processar(evento.data ?? '');
    campo.value = '';
  }

  function aoTeclar(evento) {
    // Tab tiraria o foco do campo no meio da lição.
    if (evento.key === 'Tab') evento.preventDefault();

    // Não há o que apagar: como o cursor trava no erro, nunca existe letra
    // errada escrita para trás.
    if (evento.key === 'Backspace') evento.preventDefault();

    // O separador entre palavras é sempre o espaço, mesmo na virada de
    // linha: o Enter não tem função nenhuma aqui.
    if (evento.key === 'Enter') evento.preventDefault();
  }

  /* Colar o texto da lição terminaria a lição sem ninguém ter digitado nada.
     Não é uma questão de segurança — é que treino colado não treina. */
  function aoColar(evento) {
    evento.preventDefault();
  }

  /* ------------------------------------------------------------------------
     Controle
     ------------------------------------------------------------------------ */

  function focar() {
    campo?.focus({ preventScroll: true });
  }

  /**
   * Os números de agora, como se a pessoa tivesse parado neste instante.
   * O teste de nivelamento usa isto ao acabar o minuto, já que ali o fim é
   * o relógio, e não o fim do texto.
   */
  function resumo() {
    metricas.encerrar();
    return metricas.resumo();
  }

  function destruir() {
    campo?.remove();
    campo = null;
    destino?.classList.remove('area-digitacao');
  }

  /**
   * Acrescenta linhas ao fim do texto, sem mexer em nada do que já foi
   * digitado.
   *
   * Existe para o Treino livre, onde o texto não acaba: quando o cursor
   * chega perto do fim, entra mais. A lição não usa isto — lá o texto é
   * fechado, e chegar ao fim dele é justamente o que conclui a lição.
   *
   * Quem chama precisa acrescentar ANTES de o cursor alcançar o fim: depois
   * de concluído, o motor já parou.
   *
   * @param {string[]} linhas
   */
  function acrescentar(linhas) {
    if (!linhas?.length) return;

    texto += ` ${linhas.join(' ')}`;
  }

  return { montar, focar, destruir, estado, processar, resumo, acrescentar };
}

/* ==========================================================================
   Desenho do texto da lição

   Fica aqui, junto do motor, porque as classes de cada letra são a tradução
   direta do estado dele. A tela de lição usa esta função e cuida do resto.
   ========================================================================== */

/**
 * Quantos caracteres desenhar à frente do cursor.
 *
 * O texto inteiro seria caro no Treino livre, onde ele cresce sem parar — e
 * desnecessário na lição, já que só três linhas aparecem.
 */
const DEPOIS_DO_CURSOR = 400;

/**
 * Em que linha o corte do começo acontece.
 *
 * Quanto mais alto, menos vezes o texto é podado; quanto mais baixo, menos
 * letras ficam desenhadas à toa. Doze linhas é folgado para a lição inteira
 * caber sem poda nenhuma.
 */
const LINHAS_ANTES_DE_PODAR = 12;

/**
 * Onde o desenho de cada área começa, no texto.
 *
 * Precisa ser lembrado entre um desenho e outro: se o começo mudasse a cada
 * letra, o texto acima do cursor quebraria num lugar diferente toda vez e
 * dançaria na tela. Ele só anda quando há linha sobrando, e quando anda é
 * para um COMEÇO DE LINHA VISUAL — aí o que fica quebra exatamente igual.
 */
const ancoras = new WeakMap();

/**
 * Desenha o texto com as letras coloridas conforme o andamento.
 *
 * O texto é uma sequência contínua de palavras, e a quebra de linha é só
 * VISUAL: quem decide onde ela cai é a largura da caixa. Por isso as letras
 * entram todas num parágrafo só, que dobra sozinho — e não em linhas
 * montadas à mão, como era antes.
 *
 * A janela de três linhas continua: a caixa tem altura de três linhas e
 * esconde o resto, e o bloco é deslocado para cima até a linha do cursor
 * ficar na segunda. Quem treina não pode rolar a página nem desviar os olhos
 * para longe — texto, mãos e teclado precisam caber juntos na tela.
 *
 * @param {HTMLElement} destino
 * @param {object} estado  o que o motor devolve em estado()
 * @param {number} [linhasVisiveis]  quantas linhas mostrar de uma vez
 */
export function desenharTexto(destino, estado, linhasVisiveis = 3) {
  const { texto, posicao, errouAqui } = estado;

  // O bloco é reaproveitado, e não recriado: o campo invisível mora no mesmo
  // elemento, e apagar tudo aqui deixaria a lição sem quem escute a
  // digitação.
  let bloco = destino.querySelector('.bloco-digitacao');

  if (!bloco) {
    bloco = document.createElement('p');
    bloco.className = 'bloco-digitacao';
    destino.prepend(bloco);
  }

  // Cursor atrás da âncora quer dizer texto novo no mesmo lugar: recomeça.
  let ancora = ancoras.get(destino) ?? 0;
  if (posicao < ancora) ancora = 0;

  desenharDe(bloco, texto, ancora, posicao, errouAqui);

  let linha = linhaDoCursor(bloco);

  // Passou do limite: poda o que já saiu de vista, cortando no começo de uma
  // linha para o resto quebrar exatamente como estava.
  if (linha >= LINHAS_ANTES_DE_PODAR) {
    const corte = comecoDaLinha(bloco, ancora, linha - 1);

    if (corte !== null) {
      ancora = corte;
      desenharDe(bloco, texto, ancora, posicao, errouAqui);
      linha = linhaDoCursor(bloco);
    }
  }

  ancoras.set(destino, ancora);

  destino.style.setProperty('--linhas-visiveis', linhasVisiveis);
  bloco.style.transform = `translateY(${-Math.max(0, linha - 1) * alturaDaLinha(bloco)}px)`;
}

function desenharDe(bloco, texto, inicio, posicao, errouAqui) {
  const fim = Math.min(texto.length, posicao + DEPOIS_DO_CURSOR);
  const letras = document.createDocumentFragment();

  for (let i = inicio; i < fim; i += 1) {
    letras.append(criarLetra(texto[i], i, posicao, errouAqui));
  }

  bloco.replaceChildren(letras);
}

function alturaDaLinha(bloco) {
  return parseFloat(getComputedStyle(bloco).lineHeight) || 1;
}

/**
 * Em que linha VISUAL o cursor foi parar.
 *
 * A conta sai do próprio desenho, e não de quantos caracteres cabem:
 * offsetTop diz onde a letra da vez caiu depois de o navegador quebrar o
 * texto. É isso que faz redimensionar a janela mudar só onde a linha dobra,
 * e nunca o que é preciso digitar.
 */
function linhaDoCursor(bloco) {
  const atual = bloco.querySelector('.letra--atual, .letra--errada');
  if (!atual) return 0;

  return Math.round((atual.offsetTop - bloco.offsetTop) / alturaDaLinha(bloco));
}

/** O índice, no texto, da primeira letra de uma linha visual. */
function comecoDaLinha(bloco, inicio, linha) {
  const altura = alturaDaLinha(bloco);
  const letras = bloco.children;

  for (let i = 0; i < letras.length; i += 1) {
    if (Math.round((letras[i].offsetTop - bloco.offsetTop) / altura) === linha) {
      return inicio + i;
    }
  }

  return null;
}

function criarLetra(letra, indice, posicao, errouAqui) {
  const elemento = document.createElement('span');
  elemento.textContent = letra;
  elemento.className = 'letra';

  if (indice < posicao) {
    elemento.classList.add('letra--certa');
  } else if (indice === posicao) {
    elemento.classList.add(errouAqui ? 'letra--errada' : 'letra--atual');
  } else {
    elemento.classList.add('letra--falta');
  }

  // O espaço precisa de ajuda para ser visível quando é a letra da vez.
  if (letra === ' ') elemento.classList.add('letra--espaco');

  return elemento;
}
