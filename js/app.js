/* ==========================================================================
   app.js — ponto de entrada do site.

   Ele liga as três coisas que valem para o site inteiro (tema, idioma e a
   tela que está aparecendo) e sai da frente. Cada tela cuida de si.

   A cada passo do plano ganha mais responsabilidades: troca entre várias
   telas (passo 11) e sons (passo 16).
   ========================================================================== */

import { detectarIdioma, definirIdioma, ligarSeletorDeIdioma, idioma, t } from './i18n.js';
import { config, definirConfig, aoMudarConfig } from './estado.js';
import { mostrarEntrada } from './telas/entrada.js';
import { mostrarLicao, encerrarLicao, retraduzirLicao } from './telas/licao.js';
import { mostrarResultado } from './telas/resultado.js';
import { mostrarTrilha } from './telas/trilha.js';
import {
  mostrarTreinoLivre,
  encerrarTreinoLivre,
  retraduzirTreinoLivre,
} from './telas/treino-livre.js';
import { mostrarInicio } from './telas/inicio.js';
import { mostrarNivelamento, encerrarNivelamento } from './telas/nivelamento.js';
import { registrarResultado, licaoParaContinuar, nivelamento } from './progresso.js';
import { pareceSemTecladoFisico, mostrarAvisoSemTeclado } from './telas/sem-teclado.js';
import { conferirLicoes } from '../dados/licoes/conferencia.js';

const raiz = document.documentElement;
const botaoTema = document.querySelector('#botao-tema');
const tela = document.querySelector('#tela');
const preferenciaEscura = window.matchMedia('(prefers-color-scheme: dark)');

/* --------------------------------------------------------------------------
   Tema

   A regra, numa frase: a ÚLTIMA mudança vale, e o sistema é a referência.

     - primeira visita: segue o tema do sistema;
     - clique no botão: a escolha vale e fica salva;
     - o sistema muda com o site aberto: o site acompanha e a escolha manual
       é descartada, porque ela é a mudança mais antiga das duas;
     - ao voltar ao site: se o sistema continua como estava quando a escolha
       foi feita, a escolha vale; se mudou nesse meio-tempo, quem vale é o
       sistema, e a escolha é descartada.

   É por isso que a escolha manual é salva em DUAS partes: o tema escolhido e
   o tema que o sistema tinha naquele momento. Sem a segunda não há como
   saber, na volta, se o sistema mudou desde então.
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

/** Esquece a escolha manual: daqui em diante quem manda é o sistema. */
function esquecerEscolhaDeTema() {
  definirConfig({ tema: null, temaDoSistemaNaEscolha: null });
}

/** O tema que vale agora, com a regra inteira aplicada. */
function temaQueVale() {
  const { tema, temaDoSistemaNaEscolha } = config();
  const sistema = temaDoSistema();

  if (!tema) return sistema;

  // O sistema mudou desde a escolha: ela caducou.
  if (temaDoSistemaNaEscolha !== sistema) {
    esquecerEscolhaDeTema();
    return sistema;
  }

  return tema;
}

botaoTema.addEventListener('click', () => {
  const novo = raiz.dataset.tema === 'escuro' ? 'claro' : 'escuro';

  definirConfig({ tema: novo, temaDoSistemaNaEscolha: temaDoSistema() });
  aplicarTema(novo);
});

// O computador trocou de claro para escuro (ao anoitecer, por exemplo). Essa
// é agora a última mudança, então ela vale — e a escolha manual anterior,
// que era mais antiga, é descartada.
preferenciaEscura.addEventListener('change', () => {
  esquecerEscolhaDeTema();
  aplicarTema(temaDoSistema());
});

/* --------------------------------------------------------------------------
   Som

   Um botão só, sempre visível no cabeçalho: ligado ou mudo. Ligado, o som
   sai no volume cheio — quem quiser mais baixo usa o volume do computador,
   que é onde as pessoas já procuram.

   Nada toca antes da primeira interação: o próprio js/som.js só cria o
   contexto de áudio quando o primeiro som é pedido, e isso nunca acontece
   antes de um clique ou uma tecla.
   -------------------------------------------------------------------------- */

const botaoSom = document.querySelector('#botao-som');

function aplicarSom() {
  const { mudo } = config();

  botaoSom.querySelector('use').setAttribute('href', mudo ? '#icone-mudo' : '#icone-som');
  botaoSom.setAttribute('aria-pressed', String(mudo));
  botaoSom.setAttribute('aria-label', t(mudo ? 'som.ativar' : 'som.silenciar'));
}

botaoSom.addEventListener('click', () => definirConfig({ mudo: !config().mudo }));

// O cabeçalho segue o estado, e não o clique: assim ele fica certo mesmo
// quando a configuração muda por outro caminho — como a importação de
// progresso do passo 17.
aoMudarConfig(aplicarSom);

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
  // Sair de uma lição, de um teste ou de um treino precisa desligar os
  // ouvintes e o relógio deles; as outras telas não deixam nada para trás.
  encerrarLicao();
  encerrarNivelamento();
  encerrarTreinoLivre();

  telaAtual = desenhar;
  desenhar(tela);
}

/**
 * As seções que já existem. As outras aparecem no menu marcadas como
 * "em breve"; esta lista cresce a cada passo do plano.
 */
const SECOES_DISPONIVEIS = new Set(['inicio', 'trilha', 'treino']);

/** A tela de entrada, com o botão que leva ao treino. */
function telaDeEntrada(destino) {
  mostrarEntrada(destino, {
    // O nivelamento é uma pergunta que só se faz uma vez: quem já respondeu
    // volta para a tela inicial.
    aoContinuar: () => irPara(nivelamento() ? telaDeInicio : telaDeNivelamento),
  });
}

/** A pergunta "você já digita sem olhar?" e o teste de um minuto. */
function telaDeNivelamento(destino) {
  mostrarNivelamento(destino, {
    aoComecarDoZero: () => abrirLicao(licaoParaContinuar()),
    aoTerminar: () => irPara(telaDeInicio),
  });
}

/** A tela de quem volta: continuar de onde parou e os atalhos. */
function telaDeInicio(destino) {
  mostrarInicio(destino, {
    secoesDisponiveis: SECOES_DISPONIVEIS,
    aoContinuar: abrirLicao,
    aoNavegar: navegar,
    // A tela de entrada some do caminho depois da primeira visita, então é
    // daqui que se volta a ela para trocar de teclado.
    aoTrocarTeclado: () => irPara(telaDeEntrada),

    /* Depois de importar, a tela é desenhada de novo para mostrar o que
       entrou — UMA vez só. Trocar o idioma também redesenha (por conta do
       evento), então chamar as duas coisas desenharia duas vezes, e o
       segundo desenho apagaria o aviso de "importado" no mesmo instante em
       que ele aparece. */
    aoImportar: () => {
      const idiomaImportado = config().idioma;

      if (idiomaImportado && idiomaImportado !== idioma()) definirIdioma(idiomaImportado);
      else irPara(telaDeInicio);
    },
  });
}

/** O mapa do programa: as sete trilhas e as lições de cada uma. */
function telaDeTrilha(destino) {
  mostrarTrilha(destino, { aoAbrirLicao: abrirLicao });
}

/** Treino sem nota: nada daqui entra no progresso. */
function telaDeTreinoLivre(destino) {
  mostrarTreinoLivre(destino, { aoSair: () => irPara(telaDeInicio) });
}

/** Os atalhos da tela inicial. */
function navegar(secao) {
  if (secao === 'inicio') irPara(telaDeInicio);
  if (secao === 'trilha') irPara(telaDeTrilha);
  if (secao === 'treino') irPara(telaDeTreinoLivre);
}

/** Abre uma lição e cuida do que acontece quando ela termina. */
function abrirLicao(licao) {
  irPara((destino) =>
    mostrarLicao(destino, {
      licao,
      aoSair: () => irPara(telaDeInicio),

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
            aoSair: () => irPara(telaDeInicio),
          })
        );
      },
    })
  );
}

/* --------------------------------------------------------------------------
   Início
   -------------------------------------------------------------------------- */

// O script no <head> do index.html já aplicou esta mesma regra antes de a
// página aparecer. Repeti-la aqui acerta o ícone e, quando a escolha manual
// caducou, é o que apaga de fato o que estava salvo.
aplicarTema(temaQueVale());

// Idioma salvo, se houver; senão, o do navegador de quem chegou.
definirIdioma(config().idioma ?? detectarIdioma());

aplicarSom();

// Confere o conteúdo das lições: a ordem em que as teclas são ensinadas e
// se nada exige um acento solto. Só avisa no console — quem precisa ver
// isso é quem escreve as lições, não quem está treinando.
conferirLicoes();

// Quem chega de celular recebe o aviso primeiro, mas pode entrar assim mesmo:
// existe tablet com teclado acoplado, e o palpite do navegador pode errar.
/* Primeira visita começa pela entrada, para acertar o teclado. Quem já
   respondeu o nivelamento cai direto na tela inicial. */
const primeiraTela = nivelamento() ? telaDeInicio : telaDeEntrada;

if (pareceSemTecladoFisico()) {
  irPara((destino) => mostrarAvisoSemTeclado(destino, () => irPara(primeiraTela)));
} else {
  irPara(primeiraTela);
}

// A marca no cabeçalho é o caminho de volta: leva ao início, ou à entrada
// para quem ainda não passou por ela. Sem recarregar a página inteira.
document.querySelector('.marca').addEventListener('click', (evento) => {
  evento.preventDefault();
  irPara(nivelamento() ? telaDeInicio : telaDeEntrada);
});

// As telas são desenhadas em JavaScript, então trocar o idioma pede que a
// tela seja desenhada de novo.
document.addEventListener('idioma-mudou', () => {
  aplicarSom();

  // Menos as telas com relógio correndo: redesenhá-las recomeçaria o que
  // está em andamento. Elas trocam os próprios textos no lugar e devolvem
  // true para avisar que já se resolveram — posição no texto, erros, tempo e
  // métricas continuam intactos.
  if (retraduzirLicao()) return;
  if (retraduzirTreinoLivre()) return;

  telaAtual(tela);
});
