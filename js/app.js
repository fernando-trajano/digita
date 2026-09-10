/* ==========================================================================
   app.js — ponto de entrada do site.

   Hoje ele cuida do tema (claro/escuro) e do idioma (PT/EN). A cada passo do
   plano ganha mais responsabilidades: telas (passo 6), estado salvo
   (passo 8) e sons (passo 16).
   ========================================================================== */

import { detectarIdioma, definirIdioma, ligarSeletorDeIdioma } from './i18n.js';
import { desenharTeclado, destacarTecla } from './teclado.js';

const raiz = document.documentElement;
const botaoTema = document.querySelector('#botao-tema');
const preferenciaEscura = window.matchMedia('(prefers-color-scheme: dark)');

/* Enquanto o Fernando não clicar no botão, o site segue o tema do sistema.
   Depois do primeiro clique, a escolha dele manda — igual à regra da tela de
   entrada: escolha manual é sempre a palavra final.
   (No passo 8 essa escolha passa a ser salva em digita:config.) */
let escolhaManual = false;

/**
 * Aplica um tema à página inteira.
 * Basta trocar o atributo data-tema no <html>: o tema.css cuida do resto.
 * @param {'claro'|'escuro'} tema
 */
function aplicarTema(tema) {
  raiz.dataset.tema = tema;

  // O ícone mostra para onde o clique leva: lua = "ir para o escuro".
  const icone = tema === 'escuro' ? '#icone-sol' : '#icone-lua';
  botaoTema.querySelector('use').setAttribute('href', icone);
}

function temaDoSistema() {
  return preferenciaEscura.matches ? 'escuro' : 'claro';
}

botaoTema.addEventListener('click', () => {
  escolhaManual = true;
  aplicarTema(raiz.dataset.tema === 'escuro' ? 'claro' : 'escuro');
});

// Se o Mac trocar de claro para escuro sozinho (ao anoitecer, por exemplo),
// o site acompanha — a não ser que já tenha havido uma escolha manual.
preferenciaEscura.addEventListener('change', () => {
  if (!escolhaManual) aplicarTema(temaDoSistema());
});

/* --------------------------------------------------------------------------
   Idioma
   -------------------------------------------------------------------------- */

ligarSeletorDeIdioma();

/* --------------------------------------------------------------------------
   Mostruário do teclado — PROVISÓRIO (passo 4)

   Serve para conferir o teclado nas quatro combinações (ABNT2/US ×
   Windows/Mac) e nos dois modos. Sai quando a tela de entrada chegar, no
   passo 6, que é onde essas escolhas passam a valer de verdade.
   -------------------------------------------------------------------------- */

const demo = { layout: 'abnt2', sistema: 'windows', modo: 'cores' };
const tecladoDemo = document.querySelector('#teclado-demo');

// Sequência que o destaque percorre no modo "como na lição", só para mostrar
// o efeito de acender uma tecla de cada vez.
const PASSEIO = ['KeyF', 'KeyJ', 'KeyD', 'KeyK', 'KeyS', 'KeyL', 'KeyA', 'Semicolon', 'Space'];
let passeio = null;

function desenharDemo() {
  desenharTeclado(tecladoDemo, demo);

  clearInterval(passeio);
  passeio = null;

  if (demo.modo === 'cinza') {
    let indice = 0;
    destacarTecla(tecladoDemo, PASSEIO[0]);

    passeio = setInterval(() => {
      indice = (indice + 1) % PASSEIO.length;
      destacarTecla(tecladoDemo, PASSEIO[indice]);
    }, 1200);
  }
}

// Os três seletores funcionam igual: o botão clicado vira o ativo e o
// teclado é redesenhado.
for (const chave of ['layout', 'sistema', 'modo']) {
  const botoes = document.querySelectorAll(`[data-demo-${chave}]`);

  botoes.forEach((botao) => {
    botao.addEventListener('click', () => {
      demo[chave] = botao.dataset[`demo${chave[0].toUpperCase()}${chave.slice(1)}`];

      botoes.forEach((outro) => {
        outro.setAttribute('aria-pressed', String(outro === botao));
      });

      desenharDemo();
    });
  });
}

// Quando o idioma muda, o teclado.js redesenha sozinho (por causa da barra
// de espaço) — e aí o destaque precisa voltar.
document.addEventListener('idioma-mudou', () => {
  if (demo.modo === 'cinza') desenharDemo();
});

/* --------------------------------------------------------------------------
   Início
   -------------------------------------------------------------------------- */

// O script no <head> do index.html já definiu o tema antes de a página
// aparecer; aqui só acertamos o ícone para combinar com ele.
aplicarTema(raiz.dataset.tema || temaDoSistema());

// O idioma vem do navegador do visitante. A partir do primeiro clique em
// PT/EN, a escolha dele é que manda.
// (No passo 8 essa escolha passa a ser lembrada em digita:config.)
definirIdioma(detectarIdioma());

desenharDemo();
