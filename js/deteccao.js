/* ==========================================================================
   deteccao.js — descobre o sistema e o formato do teclado de quem chegou.

   Nada aqui decide nada sozinho: estas funções apenas RESPONDEM, e a tela de
   entrada usa a resposta como sugestão. A escolha manual do usuário é sempre
   a palavra final.

   O truque para descobrir o formato do teclado é a tecla à direita do L —
   a que o navegador chama de "Semicolon", pelo lugar dela no teclado
   americano:
     - se ela escreve "ç", o teclado é brasileiro (ABNT2)
     - se ela escreve ";", o teclado é americano (US)

   Existem dois caminhos para ler essa tecla, e o site tenta nesta ordem:
     1. navigator.keyboard.getLayoutMap() — o navegador simplesmente conta.
        Funciona no Chrome e no Edge, sem o usuário fazer nada.
     2. Pedir para o usuário apertar a tecla. É o caminho do Safari e do
        Firefox, que não têm essa função.
   ========================================================================== */

/** A tecla à direita do L, no nome que o navegador usa. */
export const TECLA_DE_TESTE = 'Semicolon';

/**
 * Descobre o sistema pelo navegador.
 * Serve só para já deixar a opção certa marcada — o usuário pode trocar.
 * @returns {'mac'|'windows'}
 */
export function detectarSistema() {
  // userAgentData é o jeito novo e mais confiável; nem todo navegador tem.
  const plataforma = navigator.userAgentData?.platform ?? '';
  const agente = navigator.userAgent ?? '';

  if (/mac|ipad|iphone/i.test(plataforma) || /Macintosh|Mac OS X|iPhone|iPad/i.test(agente)) {
    return 'mac';
  }

  // Windows e Linux usam as mesmas teclas de comando (Ctrl, Alt), então
  // "windows" é um padrão seguro para todo o resto.
  return 'windows';
}

/**
 * Traduz o que a tecla de teste escreve para um formato de teclado.
 * @param {string} valor  o que saiu da tecla, ex.: 'ç'
 * @returns {'abnt2'|'us'|null}  null = não deu para saber
 */
export function interpretarTeclaDeTeste(valor) {
  const escrito = (valor ?? '').toLowerCase();

  if (escrito === 'ç') return 'abnt2';
  if (escrito === ';') return 'us';

  return null;
}

/**
 * Caminho 1: pergunta ao navegador, sem incomodar o usuário.
 * @returns {Promise<'abnt2'|'us'|null>}  null = este navegador não sabe responder
 */
export async function detectarLayoutPeloNavegador() {
  if (!navigator.keyboard?.getLayoutMap) return null;

  try {
    const mapa = await navigator.keyboard.getLayoutMap();
    return interpretarTeclaDeTeste(mapa.get(TECLA_DE_TESTE));
  } catch {
    // Alguns navegadores expõem a função mas negam a permissão.
    return null;
  }
}

/**
 * Caminho 2: espera o usuário apertar a tecla destacada.
 *
 * Escuta UMA tecla só e para. Comparar event.code (o lugar físico) com
 * event.key (a letra que saiu) é o que revela o formato: mesma posição,
 * letras diferentes.
 *
 * @param {(resultado: {layout: 'abnt2'|'us'|null, motivo: string}) => void} aoTerminar
 * @returns {() => void}  função para cancelar a espera
 */
export function escutarTeclaDeTeste(aoTerminar) {
  function aoTeclar(evento) {
    // Modificadores sozinhos não contam: quem aperta Shift ainda não
    // respondeu nada.
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(evento.key)) {
      return;
    }

    evento.preventDefault();
    parar();

    if (evento.key === 'Escape') {
      aoTerminar({ layout: null, motivo: 'cancelado' });
      return;
    }

    if (evento.code !== TECLA_DE_TESTE) {
      aoTerminar({ layout: null, motivo: 'outraTecla' });
      return;
    }

    aoTerminar({
      layout: interpretarTeclaDeTeste(evento.key),
      motivo: 'respondeu',
    });
  }

  function parar() {
    document.removeEventListener('keydown', aoTeclar, true);
  }

  // Escuta na fase de captura para receber a tecla antes de qualquer outra
  // parte da página.
  document.addEventListener('keydown', aoTeclar, true);

  return parar;
}

/**
 * Rede de segurança usada durante as lições: confere se a tecla que a pessoa
 * apertou combina com o formato que ela escolheu.
 *
 * @param {KeyboardEvent} evento
 * @param {'abnt2'|'us'} layoutEscolhido
 * @returns {'abnt2'|'us'|null}  o formato que a tecla sugere, se for diferente
 *                               do escolhido; null se estiver tudo certo
 */
export function conferirLayout(evento, layoutEscolhido) {
  if (evento.code !== TECLA_DE_TESTE) return null;

  const sugerido = interpretarTeclaDeTeste(evento.key);
  if (!sugerido || sugerido === layoutEscolhido) return null;

  return sugerido;
}
