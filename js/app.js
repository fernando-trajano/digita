/* ==========================================================================
   app.js — ponto de entrada do site.

   Ele liga as três coisas que valem para o site inteiro (tema, idioma e a
   tela que está aparecendo) e sai da frente. Cada tela cuida de si.

   A cada passo do plano ganha mais responsabilidades: troca entre várias
   telas (passo 11) e sons (passo 16).
   ========================================================================== */

import { detectarIdioma, definirIdioma, ligarSeletorDeIdioma } from './i18n.js';
import { config, definirConfig } from './estado.js';
import { mostrarEntrada } from './telas/entrada.js';
import { mostrarLicao, encerrarLicao } from './telas/licao.js';
import { mostrarResultado } from './telas/resultado.js';
import { mostrarTrilha } from './telas/trilha.js';
import { registrarResultado } from './progresso.js';
import { pareceSemTecladoFisico, mostrarAvisoSemTeclado } from './telas/sem-teclado.js';
import { conferirLicoes } from '../dados/licoes/conferencia.js';

const raiz = document.documentElement;
const botaoTema = document.querySelector('#botao-tema');
const tela = document.querySelector('#tela');
const preferenciaEscura = window.matchMedia('(prefers-color-scheme: dark)');

/* --------------------------------------------------------------------------
   Tema

   Enquanto o usuário não clicar no botão, o site segue o tema do sistema.
   Depois do primeiro clique, a escolha dele fica salva e manda — a mesma
   regra da tela de entrada.
   -------------------------------------------------------------------------- */

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
  const novo = raiz.dataset.tema === 'escuro' ? 'claro' : 'escuro';
  definirConfig({ tema: novo });
  aplicarTema(novo);
});

// Se o computador trocar de claro para escuro sozinho (ao anoitecer, por
// exemplo), o site acompanha — a não ser que já tenha havido escolha manual.
preferenciaEscura.addEventListener('change', () => {
  if (!config().tema) aplicarTema(temaDoSistema());
});

/* --------------------------------------------------------------------------
   Idioma
   -------------------------------------------------------------------------- */

ligarSeletorDeIdioma();

// Só o que veio de um clique é salvo: a detecção sugere, não decide.
document.addEventListener('idioma-mudou', (evento) => {
  if (evento.detail.manual) definirConfig({ idioma: evento.detail.idioma });
});

/* --------------------------------------------------------------------------
   Qual tela mostrar

   Guardar QUAL tela está aberta (e não só desenhá-la) é o que permite
   redesenhar quando o idioma muda. No passo 11, quando houver várias telas,
   isto vira o roteador.
   -------------------------------------------------------------------------- */

let telaAtual = telaDeEntrada;

function irPara(desenhar) {
  // Sair de uma lição precisa desligar os ouvintes dela; as outras telas não
  // deixam nada para trás.
  encerrarLicao();

  telaAtual = desenhar;
  desenhar(tela);
}

/**
 * As seções que já existem. As outras aparecem no menu marcadas como
 * "em breve"; esta lista cresce a cada passo do plano.
 */
const SECOES_DISPONIVEIS = new Set(['trilha']);

/** A tela de entrada, com o botão que leva ao treino. */
function telaDeEntrada(destino) {
  mostrarEntrada(destino, { aoContinuar: () => irPara(telaDeTrilha) });
}

/** O mapa do programa: as sete trilhas e as lições de cada uma. */
function telaDeTrilha(destino) {
  mostrarTrilha(destino, {
    secoesDisponiveis: SECOES_DISPONIVEIS,
    aoAbrirLicao: abrirLicao,
    aoNavegar: (secao) => {
      if (secao === 'trilha') irPara(telaDeTrilha);
    },
  });
}

/** Abre uma lição e cuida do que acontece quando ela termina. */
function abrirLicao(licao) {
  irPara((destino) =>
    mostrarLicao(destino, {
      licao,
      aoSair: () => irPara(telaDeTrilha),

      aoConcluir(resumo) {
        // O progresso é gravado ANTES de a tela de resultado aparecer: o que
        // ela mostra é o que ficou salvo, e não uma promessa.
        const registro = registrarResultado(licao, resumo);

        irPara((tela) =>
          mostrarResultado(tela, {
            licao,
            resumo,
            registro,
            aoRepetir: () => abrirLicao(licao),
            aoProxima: () => abrirLicao(registro.proxima),
            aoSair: () => irPara(telaDeTrilha),
          })
        );
      },
    })
  );
}

/* --------------------------------------------------------------------------
   Início
   -------------------------------------------------------------------------- */

// O script no <head> do index.html já definiu o tema antes de a página
// aparecer; aqui só acertamos o ícone para combinar com ele.
aplicarTema(config().tema ?? raiz.dataset.tema ?? temaDoSistema());

// Idioma salvo, se houver; senão, o do navegador de quem chegou.
definirIdioma(config().idioma ?? detectarIdioma());

// Confere o conteúdo das lições contra o teclado escolhido e contra a ordem
// em que as teclas são ensinadas. Só avisa no console — quem precisa ver
// isso é quem escreve as lições, não quem está treinando.
conferirLicoes(config().layout);

// Quem chega de celular recebe o aviso primeiro, mas pode entrar assim mesmo:
// existe tablet com teclado acoplado, e o palpite do navegador pode errar.
if (pareceSemTecladoFisico()) {
  irPara((destino) => mostrarAvisoSemTeclado(destino, () => irPara(telaDeEntrada)));
} else {
  irPara(telaDeEntrada);
}

// As telas são desenhadas em JavaScript, então trocar o idioma pede que a
// tela seja desenhada de novo.
document.addEventListener('idioma-mudou', () => telaAtual(tela));
