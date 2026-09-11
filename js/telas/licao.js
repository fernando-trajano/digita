/* ==========================================================================
   licao.js — a tela onde se treina. É para ela que todo o resto existe.

   O que acontece ao mesmo tempo, a cada letra:
     - o texto mostra o que já foi feito, a letra da vez e o que falta;
     - o teclado (todo cinza) acende só a próxima tecla, na cor do dedo;
     - as mãos acendem o dedo daquela tecla;
     - a legenda escreve a mesma coisa em texto: "Próxima: F · indicador
       esquerdo" — é ela que serve a quem usa leitor de tela;
     - PPM, precisão e progresso vão subindo.

   Layout: uma coluna centralizada, sem nada nas laterais. Quem está
   treinando precisa olhar para uma coisa só.
   ========================================================================== */

import { t, nomeDoDedo } from '../i18n.js';
import { config, definirConfig, sistemaAtual } from '../estado.js';
import { criarMotor, desenharTexto } from '../motor-digitacao.js';
import {
  desenharTeclado,
  destacarTecla,
  limparDestaque,
  piscarErro,
  teclaDaLetra,
} from '../teclado.js';
import { desenharMaos, destacarDedo, limparDedos } from '../maos.js';
import { dedoDaTecla } from '../../dados/layouts/dedos.js';
import { conferirLayout } from '../deteccao.js';
import { tocarClique, tocarErro, tocarConclusao } from '../som.js';

/** A lição aberta agora, para poder desmontá-la ao sair. */
let sessao = null;

/**
 * Abre uma lição.
 *
 * @param {HTMLElement} destino
 * @param {object} opcoes
 * @param {object} opcoes.licao  a lição, vinda de dados/licoes
 * @param {(resumo: object) => void} [opcoes.aoConcluir]
 * @param {() => void} [opcoes.aoSair]
 */
export function mostrarLicao(destino, { licao, aoConcluir, aoSair }) {
  encerrarLicao();

  const layout = config().layout;

  destino.replaceChildren();
  destino.insertAdjacentHTML('beforeend', montarHtml(licao));

  const partes = {
    texto: destino.querySelector('[data-papel="texto"]'),
    legenda: destino.querySelector('[data-papel="legenda"]'),
    maos: destino.querySelector('[data-papel="maos"]'),
    teclado: destino.querySelector('[data-papel="teclado"]'),
    ppm: destino.querySelector('[data-papel="ppm"]'),
    precisao: destino.querySelector('[data-papel="precisao"]'),
    progresso: destino.querySelector('[data-papel="progresso"]'),
    barra: destino.querySelector('[data-papel="barra"]'),
    espera: destino.querySelector('[data-papel="espera"]'),
    caps: destino.querySelector('[data-papel="caps"]'),
    avisoLayout: destino.querySelector('[data-papel="aviso-layout"]'),
  };

  desenharMaos(partes.maos);
  desenharTeclado(partes.teclado, { layout, sistema: sistemaAtual(), modo: 'cinza' });


  // Quantas letras já estavam certas na última atualização. Comparando com
  // o número novo dá para saber que o cursor andou — e é isso que dispara o
  // clique, sem precisar de mais um gancho dentro do motor.
  let letrasFeitas = 0;

  const motor = criarMotor({
    linhas: licao.conteudo,

    aoAtualizar(estado) {
      desenharTexto(partes.texto, estado);
      apontarProximaTecla(partes, estado, layout);
      atualizarMedidas(partes, estado);

      if (estado.feitos > letrasFeitas) tocarClique();
      letrasFeitas = estado.feitos;
    },

    aoErrar(erro) {
      // Pisca a tecla que a pessoa apertou por engano; se aquela letra não
      // existe neste teclado, pisca a que ela deveria ter apertado.
      const errada = teclaDaLetra(erro.digitada, layout);
      const certa = teclaDaLetra(erro.esperada, layout);
      const paraPiscar = errada ?? certa;

      if (paraPiscar) piscarErro(partes.teclado, paraPiscar.codigo);

      tocarErro();
    },

    aoMudarFoco(temFoco) {
      partes.espera.hidden = temFoco;
    },

    aoConcluir(resumo) {
      tocarConclusao();
      aoConcluir?.(resumo);
    },
  });

  motor.montar(partes.texto);

  /* Duas vigias de teclado, as duas em fase de captura:

     - o Caps Lock, que precisa ser visto ANTES de a letra chegar ao motor,
       para as maiúsculas não contarem como erro;
     - a rede de segurança do layout, que sugere trocar de teclado quando a
       tecla física não bate com o que foi escolhido. */
  const vigia = (evento) => {
    vigiarCapsLock(evento, partes, motor);
    vigiarLayout(evento, partes, layout);
  };

  document.addEventListener('keydown', vigia, true);
  // Soltar a tecla também conta: é assim que o aviso some assim que o Caps
  // Lock é desligado, sem esperar a próxima letra.
  document.addEventListener('keyup', vigia, true);

  destino.querySelector('[data-acao="sair"]').addEventListener('click', () => {
    encerrarLicao();
    aoSair?.();
  });

  sessao = {
    encerrar() {
      motor.destruir();
      document.removeEventListener('keydown', vigia, true);
      document.removeEventListener('keyup', vigia, true);
    },
  };
}

/** Fecha a lição aberta, se houver. */
export function encerrarLicao() {
  sessao?.encerrar();
  sessao = null;
}

/* --------------------------------------------------------------------------
   HTML
   -------------------------------------------------------------------------- */

function montarHtml(licao) {
  const idioma = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';

  return `
    <div class="licao">
      <div class="licao-topo">
        <p class="licao-nome">${licao.titulo[idioma]}</p>

        <div class="medidas">
          <span class="medida"><strong data-papel="ppm">0</strong> ${t('licao.ppm')}</span>
          <span class="medida"><strong data-papel="precisao">100%</strong> ${t('licao.precisao')}</span>
          <span class="medida"><strong data-papel="progresso">0%</strong> ${t('licao.progresso')}</span>
        </div>

        <button type="button" class="botao botao--pequeno" data-acao="sair">${t('licao.sair')}</button>
      </div>

      <div class="barra"><span data-papel="barra"></span></div>

      <p class="aviso-caps" data-papel="caps" role="status" hidden>${t('licao.capsLock')}</p>

      <div class="licao-corpo">
        <div class="licao-texto">
          <div data-papel="texto" data-rotulo="${t('licao.campo')}"></div>
          <p class="licao-espera" data-papel="espera" hidden>${t('licao.clique')}</p>
        </div>
      </div>

      <p class="apenas-leitor-de-tela" data-papel="legenda" role="status"></p>

      <div class="licao-palco">
        <div data-papel="maos"></div>
        <div data-papel="teclado"></div>
      </div>

      <p class="aviso" data-papel="aviso-layout" role="status" hidden></p>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   A cada letra
   -------------------------------------------------------------------------- */

function apontarProximaTecla(partes, estado, layout) {
  const letra = estado.letraEsperada;

  if (!letra) {
    limparDestaque(partes.teclado);
    limparDedos(partes.maos);
    partes.legenda.textContent = '';
    return;
  }

  const onde = teclaDaLetra(letra, layout);

  if (!onde) {
    // Letra que não sai de uma tecla só (as acentuadas). O teclado fica
    // quieto em vez de acender a tecla errada.
    limparDestaque(partes.teclado);
    limparDedos(partes.maos);
    escreverLegenda(partes.legenda, nomeDaLetra(letra), null);
    return;
  }

  destacarTecla(partes.teclado, onde.codigo);

  const posicao = dedoDaTecla(onde.codigo);
  if (posicao) destacarDedo(partes.maos, posicao.mao, posicao.dedo);

  escreverLegenda(partes.legenda, nomeDaLetra(letra), posicao);
}

/**
 * A legenda não aparece na tela: o que se vê é a tecla acesa no teclado e a
 * bolinha no dedo certo. Ela existe inteira, em texto, para quem usa leitor
 * de tela — que não enxerga nenhum dos dois desenhos.
 */
function escreverLegenda(destino, letra, posicao) {
  destino.textContent = posicao
    ? `${t('licao.proxima')}: ${letra} · ${nomeDoDedo(posicao.mao, posicao.dedo)}`
    : `${t('licao.proxima')}: ${letra}`;
}

/** O espaço precisa ser dito por extenso; as outras letras falam por si. */
function nomeDaLetra(letra) {
  return letra === ' ' ? t('teclas.espaco') : letra.toUpperCase();
}

function atualizarMedidas(partes, estado) {
  const porcentagem = estado.total ? Math.round((estado.feitos / estado.total) * 100) : 0;

  partes.ppm.textContent = estado.ppm;
  partes.precisao.textContent = `${estado.precisao}%`;
  partes.progresso.textContent = `${porcentagem}%`;
  partes.barra.style.width = `${porcentagem}%`;
}

/* --------------------------------------------------------------------------
   Caps Lock

   Com o Caps Lock ligado, tudo o que se digita sai em maiúscula e o texto
   da lição é minúsculo. Sem tratar isso, a pessoa erraria letra após letra
   sem entender por quê — e ainda levaria a precisão para o chão.

   A saída: enquanto ele estiver ligado, a tecla NÃO chega ao motor. Não
   conta como erro, não avança o texto, e um aviso explica o que houve.
   -------------------------------------------------------------------------- */

function vigiarCapsLock(evento, partes, motor) {
  // getModifierState responde sobre o estado atual do Caps Lock, e não
  // sobre a tecla apertada — é o que permite avisar já na primeira letra.
  const ligado = evento.getModifierState?.('CapsLock') ?? false;

  partes.caps.hidden = !ligado;
  if (!ligado) return;

  // Só as teclas que escreveriam alguma coisa são bloqueadas: atalhos do
  // navegador e Tab continuam funcionando.
  const escreveLetra = evento.type === 'keydown' && [...evento.key].length === 1;
  if (!escreveLetra) return;

  evento.preventDefault();
  evento.stopPropagation();

  tocarErro();
  motor.focar();
}

/* --------------------------------------------------------------------------
   Rede de segurança do layout
   -------------------------------------------------------------------------- */

function vigiarLayout(evento, partes, layoutEscolhido) {
  const sugerido = conferirLayout(evento, layoutEscolhido);
  if (!sugerido) return;

  const nome = sugerido === 'abnt2' ? t('teclado.abnt2') : t('teclado.us');

  partes.avisoLayout.hidden = false;
  partes.avisoLayout.replaceChildren();
  partes.avisoLayout.append(
    document.createTextNode(t('licao.avisoLayout').replace('{formato}', nome) + ' ')
  );

  const trocar = document.createElement('button');
  trocar.type = 'button';
  trocar.className = 'botao';
  trocar.textContent = t('licao.trocarLayout');
  trocar.addEventListener('click', () => {
    definirConfig({ layout: sugerido });
    partes.avisoLayout.hidden = true;
  });

  partes.avisoLayout.append(trocar);
}
