/* ==========================================================================
   app.js — ponto de entrada do site.

   Ele liga as três coisas que valem para o site inteiro (tema, idioma e a
   tela que está aparecendo) e sai da frente. Cada tela cuida de si.

   A cada passo do plano ganha mais responsabilidades: estado salvo
   (passo 8), troca entre várias telas (passo 11) e sons (passo 16).
   ========================================================================== */

import { detectarIdioma, definirIdioma, ligarSeletorDeIdioma } from './i18n.js';
import { mostrarEntrada } from './telas/entrada.js';
import { pareceSemTecladoFisico, mostrarAvisoSemTeclado } from './telas/sem-teclado.js';

const raiz = document.documentElement;
const botaoTema = document.querySelector('#botao-tema');
const tela = document.querySelector('#tela');
const preferenciaEscura = window.matchMedia('(prefers-color-scheme: dark)');

/* --------------------------------------------------------------------------
   Tema
   -------------------------------------------------------------------------- */

/* Enquanto o usuário não clicar no botão, o site segue o tema do sistema.
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

// Se o computador trocar de claro para escuro sozinho (ao anoitecer, por
// exemplo), o site acompanha — a não ser que já tenha havido escolha manual.
preferenciaEscura.addEventListener('change', () => {
  if (!escolhaManual) aplicarTema(temaDoSistema());
});

/* --------------------------------------------------------------------------
   Idioma
   -------------------------------------------------------------------------- */

ligarSeletorDeIdioma();

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

/* --------------------------------------------------------------------------
   Qual tela mostrar

   Guardar QUAL tela está aberta (e não só desenhá-la) é o que permite
   redesenhar quando o idioma muda. No passo 11, quando houver várias telas,
   isto vira o roteador.
   -------------------------------------------------------------------------- */

let telaAtual = mostrarEntrada;

function irPara(desenhar) {
  telaAtual = desenhar;
  desenhar(tela);
}

// Quem chega de celular recebe o aviso primeiro, mas pode entrar assim mesmo:
// existe tablet com teclado acoplado, e o palpite do navegador pode errar.
if (pareceSemTecladoFisico()) {
  irPara((destino) => mostrarAvisoSemTeclado(destino, () => irPara(mostrarEntrada)));
} else {
  irPara(mostrarEntrada);
}

// As telas são desenhadas em JavaScript, então trocar o idioma pede que a
// tela seja desenhada de novo. O que o usuário já escolheu não se perde: as
// escolhas moram no módulo da tela, não no HTML.
document.addEventListener('idioma-mudou', () => telaAtual(tela));
