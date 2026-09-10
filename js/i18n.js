/* ==========================================================================
   i18n.js — o tradutor do site.

   "i18n" é como se abrevia "internationalization": i + 18 letras + n.

   Como funciona, em uma frase: no HTML você marca um elemento com
   data-i18n="mostruario.titulo", e este arquivo troca o texto dele pelo
   texto do idioma escolhido.

   Marcadores aceitos no HTML:
     data-i18n="chave"         → troca o texto de dentro do elemento
     data-i18n-aria="chave"    → troca o atributo aria-label (leitores de tela)
     data-i18n-titulo="chave"  → troca o atributo title (a dica ao passar o mouse)
   ========================================================================== */

import { pt } from '../dados/i18n/pt.js';
import { en } from '../dados/i18n/en.js';

const idiomas = { pt, en };

/** Idioma usado quando não dá para detectar, e também o de reserva. */
export const IDIOMA_PADRAO = 'pt';

let idiomaAtual = IDIOMA_PADRAO;

/**
 * Descobre o idioma pelo navegador do visitante.
 * navigator.languages traz a lista de idiomas na ordem de preferência dele
 * (ex.: ['pt-BR', 'pt', 'en-US']). Português ganha; qualquer outro vira inglês.
 * @returns {'pt'|'en'}
 */
export function detectarIdioma() {
  const preferidos = navigator.languages?.length
    ? navigator.languages
    : [navigator.language || ''];

  for (const codigo of preferidos) {
    if (codigo.toLowerCase().startsWith('pt')) return 'pt';
    if (codigo.toLowerCase().startsWith('en')) return 'en';
  }

  return IDIOMA_PADRAO;
}

/** @returns {'pt'|'en'} o idioma que está valendo agora. */
export function idioma() {
  return idiomaAtual;
}

/**
 * Busca um texto pela chave, no formato "secao.chave".
 * Se faltar no idioma atual, cai no português e avisa no console — assim um
 * texto esquecido aparece durante o desenvolvimento, e nunca some para quem
 * está usando o site.
 * @param {string} chave  ex.: 'mostruario.titulo'
 * @returns {string}
 */
export function t(chave) {
  const texto = buscar(idiomas[idiomaAtual], chave);
  if (typeof texto === 'string') return texto;

  console.warn(`[i18n] Falta a chave "${chave}" em ${idiomaAtual}.js`);

  const reserva = buscar(idiomas[IDIOMA_PADRAO], chave);
  return typeof reserva === 'string' ? reserva : chave;
}

/**
 * Escreve o nome de um dedo do jeito certo em cada idioma.
 * Em português o dedo vem antes da mão ("indicador esquerdo"); em inglês é o
 * contrário ("left index"). A ordem vem das traduções, não do código.
 * @param {string} mao   'esquerda' | 'direita' | 'ambas'
 * @param {string} dedo  'minimo' | 'anelar' | 'medio' | 'indicador' | 'polegar'
 * @returns {string}  ex.: 'indicador esquerdo'
 */
export function nomeDoDedo(mao, dedo) {
  // A barra de espaço pode ser apertada com qualquer polegar.
  if (mao === 'ambas') return t('licao.qualquerPolegar');

  return t('licao.ordemDoDedo')
    .replace('{dedo}', t(`dedos.${dedo}`))
    .replace('{mao}', t(`maos.${mao}`));
}

/** Caminha pelo objeto seguindo os pontos da chave: 'a.b' → objeto.a.b */
function buscar(objeto, chave) {
  return chave.split('.').reduce((atual, parte) => atual?.[parte], objeto);
}

/**
 * Troca o idioma do site inteiro.
 * @param {'pt'|'en'} codigo
 */
export function definirIdioma(codigo) {
  idiomaAtual = idiomas[codigo] ? codigo : IDIOMA_PADRAO;

  // Avisa o navegador em que idioma a página está.
  document.documentElement.lang = t('codigoHtml');

  traduzirPagina();
  marcarBotaoDoIdioma();

  // As telas que forem construídas depois escutam este aviso para se
  // redesenharem no idioma novo.
  document.dispatchEvent(
    new CustomEvent('idioma-mudou', { detail: { idioma: idiomaAtual } })
  );
}

/**
 * Percorre a página (ou um pedaço dela) e traduz tudo que estiver marcado.
 * @param {ParentNode} raiz  onde procurar; a página inteira, por padrão
 */
export function traduzirPagina(raiz = document) {
  raiz.querySelectorAll('[data-i18n]').forEach((elemento) => {
    elemento.textContent = t(elemento.dataset.i18n);
  });

  raiz.querySelectorAll('[data-i18n-aria]').forEach((elemento) => {
    elemento.setAttribute('aria-label', t(elemento.dataset.i18nAria));
  });

  raiz.querySelectorAll('[data-i18n-titulo]').forEach((elemento) => {
    elemento.setAttribute('title', t(elemento.dataset.i18nTitulo));
  });

  // O título da aba e a descrição para buscadores também mudam de idioma.
  if (raiz === document) {
    document.title = t('documento.titulo');
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('documento.descricao'));
  }
}

/** Deixa PT ou EN marcado como opção ativa no cabeçalho. */
function marcarBotaoDoIdioma() {
  document.querySelectorAll('[data-idioma]').forEach((botao) => {
    botao.setAttribute(
      'aria-pressed',
      String(botao.dataset.idioma === idiomaAtual)
    );
  });
}

/**
 * Liga os botões PT/EN do cabeçalho.
 * (No passo 8 a escolha passa a ser salva em digita:config.)
 */
export function ligarSeletorDeIdioma() {
  document.querySelectorAll('[data-idioma]').forEach((botao) => {
    botao.addEventListener('click', () => definirIdioma(botao.dataset.idioma));
  });
}
