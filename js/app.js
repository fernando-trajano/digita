/* ==========================================================================
   app.js — ponto de entrada do site.

   Por enquanto ele só cuida do botão de tema (claro/escuro). A cada passo do
   plano ele vai ganhar mais responsabilidades: idioma (passo 3), telas
   (passo 6), estado salvo (passo 8) e sons (passo 16).
   ========================================================================== */

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

// O script no <head> do index.html já definiu o tema antes de a página
// aparecer; aqui só acertamos o ícone para combinar com ele.
aplicarTema(raiz.dataset.tema || temaDoSistema());
