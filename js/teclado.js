/* ==========================================================================
   teclado.js — desenha o teclado na tela e acende a próxima tecla.

   Este arquivo é usado em dois lugares diferentes:
     - na tela de entrada, como PRÉVIA: todas as teclas coloridas pelo dedo,
       para você reconhecer o seu teclado e ver as cores do método;
     - na tela de lição, em modo CINZA: tudo apagado, só a próxima tecla
       acesa na cor do dedo certo.

   Ele não decide nada sozinho: recebe o layout (abnt2/us) e o sistema
   (windows/mac) e desenha. Quem decide é a tela que o chamou.
   ========================================================================== */

import { abnt2 } from '../dados/layouts/abnt2.js';
import { us } from '../dados/layouts/us.js';
import { dedoDaTecla, TECLAS_DE_REFERENCIA } from '../dados/layouts/dedos.js';
import { t } from './i18n.js';

const LAYOUTS = { abnt2, us };

/* --------------------------------------------------------------------------
   A última fileira muda conforme o SISTEMA, não conforme o layout: é a única
   diferença entre um teclado de Windows e um de Mac.
   -------------------------------------------------------------------------- */

const ULTIMA_FILEIRA = {
  windows: [
    { codigo: 'ControlLeft', especial: 'ctrl', largura: 1.5 },
    { codigo: 'MetaLeft', especial: 'win', largura: 1.25 },
    { codigo: 'AltLeft', especial: 'alt', largura: 1.25 },
    { codigo: 'Space', especial: 'espaco', largura: 7 },
    { codigo: 'AltRight', especial: 'altGr', largura: 1.25 },
    { codigo: 'MetaRight', especial: 'win', largura: 1.25 },
    { codigo: 'ControlRight', especial: 'ctrl', largura: 1.5 },
  ],
  mac: [
    { codigo: 'ControlLeft', especial: 'control', largura: 1.25 },
    { codigo: 'AltLeft', especial: 'option', largura: 1.25 },
    { codigo: 'MetaLeft', especial: 'command', largura: 1.75 },
    { codigo: 'Space', especial: 'espaco', largura: 6.5 },
    { codigo: 'MetaRight', especial: 'command', largura: 1.75 },
    { codigo: 'AltRight', especial: 'option', largura: 1.25 },
    { codigo: 'ControlRight', especial: 'control', largura: 1.25 },
  ],
};

/**
 * O que vem escrito nas teclas de comando.
 * O Mac usa símbolos (⌘ ⌥ ⌃); o Windows usa palavras. Nenhuma delas muda
 * entre português e inglês — a única exceção é a barra de espaço, que vem
 * das traduções.
 */
const ROTULOS_ESPECIAIS = {
  windows: {
    tab: 'Tab',
    capsLock: 'Caps',
    shift: 'Shift',
    enter: 'Enter',
    backspace: '⌫',
    ctrl: 'Ctrl',
    alt: 'Alt',
    altGr: 'AltGr',
    win: '⊞',
  },
  mac: {
    tab: '⇥',
    capsLock: '⇪',
    shift: '⇧',
    enter: '⏎',
    backspace: '⌫',
    control: '⌃',
    option: '⌥',
    command: '⌘',
  },
};

/* --------------------------------------------------------------------------
   Desenho
   -------------------------------------------------------------------------- */

/** Guarda o que cada teclado da página está mostrando, para poder redesenhar. */
const teclados = new Map();

/**
 * Desenha um teclado dentro de um elemento da página.
 * @param {HTMLElement} destino  onde desenhar (o conteúdo anterior é apagado)
 * @param {object} opcoes
 * @param {'abnt2'|'us'} opcoes.layout
 * @param {'windows'|'mac'} opcoes.sistema
 * @param {'cores'|'cinza'} [opcoes.modo]  'cores' pinta tudo; 'cinza' apaga tudo
 */
export function desenharTeclado(destino, opcoes) {
  const { layout = 'abnt2', sistema = 'windows', modo = 'cores' } = opcoes;
  const desenho = LAYOUTS[layout] ?? LAYOUTS.abnt2;

  teclados.set(destino, { layout, sistema, modo });

  destino.replaceChildren();
  destino.classList.add('teclado');
  destino.dataset.modo = modo;

  // O teclado é um apoio visual. Para quem usa leitor de tela, ouvir 70
  // letras soltas atrapalha mais do que ajuda: a informação de qual tecla
  // apertar vem escrita na legenda da lição, em texto.
  destino.setAttribute('aria-hidden', 'true');

  const fileiras = [...desenho.fileiras, ULTIMA_FILEIRA[sistema] ?? ULTIMA_FILEIRA.windows];

  for (const teclas of fileiras) {
    const fileira = document.createElement('div');
    fileira.className = 'teclado-fileira';

    for (const tecla of teclas) {
      fileira.append(criarTecla(tecla, sistema, modo));
    }

    destino.append(fileira);
  }
}

/** Monta uma tecla. */
function criarTecla(tecla, sistema, modo) {
  const elemento = document.createElement('div');
  elemento.className = 'tecla';
  elemento.dataset.codigo = tecla.codigo;
  elemento.style.setProperty('--largura', tecla.largura ?? 1);

  // Cor do dedo: no modo "cores" todas as teclas já nascem pintadas; no modo
  // "cinza" ficam neutras e só a tecla da vez acende (ver destacarTecla).
  const posicao = dedoDaTecla(tecla.codigo);
  if (modo === 'cores' && posicao) {
    elemento.classList.add(`tecla--${posicao.dedo}`);
  } else {
    elemento.classList.add('tecla--neutro');
  }

  // O risquinho em relevo do F e do J.
  if (TECLAS_DE_REFERENCIA.includes(tecla.codigo)) {
    elemento.classList.add('tecla--referencia');
  }

  if (tecla.alta) elemento.classList.add('tecla--alta');

  // O segundo símbolo da tecla (o que sai com Shift) fica menor, em cima.
  if (tecla.sup) {
    const sup = document.createElement('span');
    sup.className = 'tecla-sup';
    sup.textContent = tecla.sup;
    elemento.append(sup);
  }

  const rotulo = document.createElement('span');
  rotulo.className = 'tecla-rotulo';
  rotulo.textContent = textoDaTecla(tecla, sistema);
  elemento.append(rotulo);

  if (tecla.especial) elemento.classList.add('tecla--comando');

  return elemento;
}

/** O texto que aparece na tecla. */
function textoDaTecla(tecla, sistema) {
  if (!tecla.especial) return tecla.rotulo;
  if (tecla.especial === 'espaco') return t('teclas.espaco');

  return ROTULOS_ESPECIAIS[sistema]?.[tecla.especial] ?? tecla.especial;
}

/* --------------------------------------------------------------------------
   De uma letra para uma tecla

   A lição sabe qual LETRA vem agora ("a", "ç", " "). Para acender a tecla
   certa é preciso saber em que TECLA aquela letra mora — e isso depende do
   layout: o ç fica numa tecla própria no brasileiro e não existe no
   americano.

   A resposta sai dos próprios arquivos de layout, e não de uma segunda
   lista escrita à mão: assim nunca há duas verdades sobre o mesmo teclado.
   -------------------------------------------------------------------------- */

/** Um mapa "letra → tecla" por layout, montado na primeira vez que se pede. */
const mapasDeLetras = new Map();

function mapaDeLetras(layout) {
  if (mapasDeLetras.has(layout)) return mapasDeLetras.get(layout);

  const mapa = new Map();
  const desenho = LAYOUTS[layout] ?? LAYOUTS.abnt2;

  for (const fileira of desenho.fileiras) {
    for (const tecla of fileira) {
      // O símbolo de baixo sai direto; o de cima precisa de Shift.
      if (tecla.rotulo) mapa.set(tecla.rotulo.toLowerCase(), {
        codigo: tecla.codigo,
        comShift: false,
      });

      if (tecla.sup) mapa.set(tecla.sup.toLowerCase(), {
        codigo: tecla.codigo,
        comShift: true,
      });
    }
  }

  // Letras maiúsculas moram na mesma tecla, com Shift.
  for (const [letra, onde] of [...mapa]) {
    const maiuscula = letra.toUpperCase();
    if (maiuscula !== letra) mapa.set(maiuscula, { ...onde, comShift: true });
  }

  mapa.set(' ', { codigo: 'Space', comShift: false });

  mapasDeLetras.set(layout, mapa);
  return mapa;
}

/**
 * Em que tecla mora uma letra.
 * @param {string} letra
 * @param {'abnt2'|'us'} layout
 * @returns {{codigo: string, comShift: boolean} | null}  null quando a letra
 *          não sai de uma tecla só (é o caso das letras acentuadas, que
 *          precisam do acento antes)
 */
export function teclaDaLetra(letra, layout) {
  if (!letra) return null;
  return mapaDeLetras(layout).get(letra) ?? null;
}

/**
 * Os acentos, pelo código que o Unicode usa para cada um.
 *
 * Uma letra acentuada é, por dentro, duas coisas: a vogal e o acento. Isto
 * traduz o segundo para a tecla que o produz no teclado brasileiro.
 */
const TECLA_DO_ACENTO = {
  '\u0301': '´', // agudo
  '\u0300': '`', // grave
  '\u0302': '^', // circunflexo
  '\u0303': '~', // til
  '\u0308': '¨', // trema
};

/**
 * Os PASSOS para produzir uma letra: uma tecla, ou duas.
 *
 * A maioria das letras sai de uma tecla só. As acentuadas saem de duas, na
 * ordem em que se aperta: primeiro o acento, depois a vogal. É por isso que
 * a lição consegue acender a tecla certa em cada momento — enquanto o acento
 * está pendente, o teclado já mostra a vogal que vem a seguir.
 *
 * No teclado americano não há teclas de acento: lá o caminho é ⌥ + letra no
 * Mac ou o layout US Internacional no Windows, que o desenho do teclado não
 * representa. Nesse caso a lista volta vazia, e quem orienta é a dica
 * escrita da lição.
 *
 * @param {string} letra
 * @param {'abnt2'|'us'} layout
 * @returns {Array<{codigo: string, comShift: boolean}>}
 */
export function passosDaLetra(letra, layout) {
  const direta = teclaDaLetra(letra, layout);
  if (direta) return [{ ...direta, letra }];

  // Só o teclado brasileiro tem teclas de acento de verdade. No americano
  // os símbolos ~ ^ ` existem, mas como caracteres comuns: acender aquelas
  // teclas ensinaria o caminho errado — no Mac o acento sai de ⌥ + letra, e
  // no Windows só funciona com o layout US Internacional ligado.
  if (layout !== 'abnt2') return [];

  // Separa a letra nas partes dela: "á" vira "a" mais o sinal do agudo.
  const partes = letra.normalize('NFD');
  if (partes.length < 2) return [];

  const acento = TECLA_DO_ACENTO[partes[1]];
  if (!acento) return [];

  const teclaAcento = teclaDaLetra(acento, layout);
  const teclaVogal = teclaDaLetra(partes[0], layout);

  if (!teclaAcento || !teclaVogal) return [];

  return [
    { ...teclaAcento, letra: acento },
    { ...teclaVogal, letra: partes[0] },
  ];
}

/* --------------------------------------------------------------------------
   Destaque da próxima tecla
   -------------------------------------------------------------------------- */

/**
 * Acende uma tecla na cor do dedo que deve apertá-la.
 * @param {HTMLElement} destino  o teclado desenhado
 * @param {string} codigo  ex.: 'KeyF'
 */
export function destacarTecla(destino, codigo) {
  limparDestaque(destino);

  const tecla = destino.querySelector(`[data-codigo="${codigo}"]`);
  if (!tecla) return;

  const posicao = dedoDaTecla(codigo);
  tecla.classList.add('tecla--ativa');
  if (posicao) tecla.classList.add(`tecla--${posicao.dedo}`);
}

/** Apaga o destaque anterior. */
export function limparDestaque(destino) {
  destino.querySelectorAll('.tecla--ativa').forEach((tecla) => {
    tecla.classList.remove('tecla--ativa');

    // No modo cinza a cor do dedo é emprestada só enquanto a tecla está
    // acesa; no modo cores ela é permanente e não pode ser removida.
    if (destino.dataset.modo === 'cinza') {
      const posicao = dedoDaTecla(tecla.dataset.codigo);
      if (posicao) tecla.classList.remove(`tecla--${posicao.dedo}`);
    }
  });
}

/**
 * Faz uma tecla piscar em vermelho — usado quando o aluno erra.
 * @param {HTMLElement} destino
 * @param {string} codigo
 */
export function piscarErro(destino, codigo) {
  const tecla = destino.querySelector(`[data-codigo="${codigo}"]`);
  if (!tecla) return;

  tecla.classList.remove('tecla--erro');
  // Forçar o navegador a recalcular reinicia a animação, caso o aluno erre
  // duas vezes seguidas na mesma tecla.
  void tecla.offsetWidth;
  tecla.classList.add('tecla--erro');
}

/* --------------------------------------------------------------------------
   Manutenção
   -------------------------------------------------------------------------- */

// A barra de espaço é a única tecla com texto traduzido. Quando o idioma
// muda, todos os teclados da página são redesenhados.
document.addEventListener('idioma-mudou', () => {
  for (const [destino, opcoes] of teclados) {
    if (destino.isConnected) desenharTeclado(destino, opcoes);
    else teclados.delete(destino);
  }
});
