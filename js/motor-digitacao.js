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
 */
export function criarMotor({ linhas, aoAtualizar, aoErrar, aoConcluir }) {
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

    destino.append(campo);
    focar();
    avisar();
  }

  function aoDigitar(evento) {
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

  /* ------------------------------------------------------------------------
     Controle
     ------------------------------------------------------------------------ */

  function focar() {
    campo?.focus({ preventScroll: true });
  }

  function destruir() {
    campo?.remove();
    campo = null;
    destino?.classList.remove('area-digitacao');
  }

  return { montar, focar, destruir, estado, processar };
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
 * @param {HTMLElement} destino
 * @param {object} estado  o que o motor devolve em estado()
 */
export function desenharTexto(destino, estado) {
  const { texto, posicao, errouAqui } = estado;

  destino.replaceChildren();

  let indice = 0;

  for (const linha of texto.split('\n')) {
    const elementoLinha = document.createElement('p');
    elementoLinha.className = 'linha-digitacao';

    for (const letra of linha) {
      elementoLinha.append(criarLetra(letra, indice, posicao, errouAqui));
      indice += 1;
    }

    // A quebra de linha também ocupa uma posição no texto.
    indice += 1;
    destino.append(elementoLinha);
  }
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
