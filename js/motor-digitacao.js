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
  // O texto vira uma string só, com quebras de linha. As quebras são
  // puladas automaticamente: ninguém precisa apertar Enter no fim da linha.
  const texto = linhas.join('\n');

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
      total: contarDigitaveis(texto),
      feitos: contarDigitaveis(texto.slice(0, posicao)),
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
      metricas.registrarAcerto();

      posicao += 1;
      errouAqui = false;
      pularQuebrasDeLinha();

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

  /** Quebras de linha não se digitam: o motor passa por elas sozinho. */
  function pularQuebrasDeLinha() {
    while (texto[posicao] === '\n') posicao += 1;
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

  return { montar, focar, destruir, estado, processar, resumo };
}

/** Conta só o que a pessoa realmente digita (quebras de linha não contam). */
function contarDigitaveis(texto) {
  let total = 0;
  for (const letra of texto) if (letra !== '\n') total += 1;
  return total;
}

/* ==========================================================================
   Desenho do texto da lição

   Fica aqui, junto do motor, porque as classes de cada letra são a tradução
   direta do estado dele. A tela de lição usa esta função e cuida do resto.
   ========================================================================== */

/**
 * Desenha o texto com as letras coloridas conforme o andamento.
 *
 * Mostra só uma JANELA de linhas em volta da linha atual, e não a lição
 * inteira. O motivo é prático: quem treina não pode rolar a página nem
 * desviar os olhos para longe: texto, mãos e teclado precisam caber juntos
 * na tela. A barra de progresso é que conta o resto.
 *
 * @param {HTMLElement} destino
 * @param {object} estado  o que o motor devolve em estado()
 * @param {number} [linhasVisiveis]  quantas linhas mostrar de uma vez
 */
export function desenharTexto(destino, estado, linhasVisiveis = 3) {
  const { texto, posicao, errouAqui } = estado;

  // Apaga só as linhas de texto, e não tudo o que houver dentro: o campo
  // invisível costuma morar no mesmo elemento, e apagá-lo aqui deixaria a
  // lição sem quem escute a digitação.
  destino.querySelectorAll('.linha-digitacao').forEach((linha) => linha.remove());

  // Onde cada linha começa dentro do texto — é o que permite achar em qual
  // delas o cursor está.
  const linhas = [];
  let inicio = 0;

  for (const conteudo of texto.split('\n')) {
    linhas.push({ conteudo, inicio });
    inicio += conteudo.length + 1; // +1 pela quebra de linha
  }

  const atual = Math.max(
    0,
    linhas.findLastIndex((linha) => linha.inicio <= posicao)
  );

  // A janela acompanha o cursor, mas nunca passa do fim do texto.
  const primeira = Math.min(
    Math.max(0, atual - 1),
    Math.max(0, linhas.length - linhasVisiveis)
  );

  const linhasNovas = document.createDocumentFragment();

  for (const linha of linhas.slice(primeira, primeira + linhasVisiveis)) {
    const elementoLinha = document.createElement('p');
    elementoLinha.className = 'linha-digitacao';

    let indice = linha.inicio;
    for (const letra of linha.conteudo) {
      elementoLinha.append(criarLetra(letra, indice, posicao, errouAqui));
      indice += 1;
    }

    linhasNovas.append(elementoLinha);
  }

  // As linhas entram antes do campo invisível, que fica sempre por último.
  destino.prepend(linhasNovas);
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
