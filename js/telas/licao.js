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
import { metasDaLicao } from '../../dados/licoes/indice.js';

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
    avisoLayout: destino.querySelector('[data-papel="aviso-layout"]'),
    fim: destino.querySelector('[data-papel="fim"]'),
  };

  desenharMaos(partes.maos);
  desenharTeclado(partes.teclado, { layout, sistema: sistemaAtual(), modo: 'cinza' });


  const motor = criarMotor({
    linhas: licao.conteudo,

    aoAtualizar(estado) {
      desenharTexto(partes.texto, estado);
      apontarProximaTecla(partes, estado, layout);
      atualizarMedidas(partes, estado);
    },

    aoErrar(erro) {
      // Pisca a tecla que a pessoa apertou por engano; se aquela letra não
      // existe neste teclado, pisca a que ela deveria ter apertado.
      const errada = teclaDaLetra(erro.digitada, layout);
      const certa = teclaDaLetra(erro.esperada, layout);
      const paraPiscar = errada ?? certa;

      if (paraPiscar) piscarErro(partes.teclado, paraPiscar.codigo);
    },

    aoMudarFoco(temFoco) {
      partes.espera.hidden = temFoco;
    },

    aoConcluir(resumo) {
      mostrarFim(partes, licao, resumo);
      aoConcluir?.(resumo);
    },
  });

  motor.montar(partes.texto);

  // Rede de segurança do briefing: se a tecla física não bater com o layout
  // escolhido, sugerir a troca com um aviso discreto.
  const vigia = (evento) => vigiarLayout(evento, partes, layout);
  document.addEventListener('keydown', vigia, true);

  destino.querySelector('[data-acao="sair"]').addEventListener('click', () => {
    encerrarLicao();
    aoSair?.();
  });

  sessao = {
    encerrar() {
      motor.destruir();
      document.removeEventListener('keydown', vigia, true);
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

      <div class="licao-corpo">
        <div class="licao-texto">
          <div data-papel="texto" data-rotulo="${t('licao.campo')}"></div>
          <p class="licao-espera" data-papel="espera" hidden>${t('licao.clique')}</p>
        </div>

        <div class="licao-lado">
          <p class="legenda-dedo" data-papel="legenda"></p>
          <div data-papel="maos"></div>
        </div>
      </div>

      <div class="licao-teclado">
        <div data-papel="teclado"></div>
      </div>

      <p class="aviso" data-papel="aviso-layout" role="status" hidden></p>
      <div class="licao-fim" data-papel="fim" hidden></div>
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
 * A legenda mostra só a letra — "Próxima: J". Qual dedo usar é o que o
 * desenho das mãos e a cor da tecla já dizem, e repetir isso em texto polui
 * a tela.
 *
 * Mas o teclado e as mãos são desenhos, invisíveis para quem usa leitor de
 * tela. Por isso o nome do dedo continua aqui, escondido dos olhos e
 * disponível para quem ouve a página.
 */
function escreverLegenda(destino, letra, posicao) {
  destino.replaceChildren();
  destino.append(`${t('licao.proxima')}: ${letra}`);

  if (!posicao) return;

  const paraLeitorDeTela = document.createElement('span');
  paraLeitorDeTela.className = 'apenas-leitor-de-tela';
  paraLeitorDeTela.textContent = ` · ${nomeDoDedo(posicao.mao, posicao.dedo)}`;
  destino.append(paraLeitorDeTela);
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

/* --------------------------------------------------------------------------
   Fim da lição

   Um resumo curto, aqui mesmo. A tela de resultado completa — com estrelas,
   teclas mais erradas e o botão de próxima fase — é o passo 12.
   -------------------------------------------------------------------------- */

function mostrarFim(partes, licao, resumo) {
  const metas = metasDaLicao(licao);
  const passou = resumo.precisao >= metas.precisaoMinima;

  partes.fim.hidden = false;
  partes.fim.textContent =
    `${passou ? t('licao.concluida') : t('licao.tenteDeNovo')} ` +
    `${resumo.ppm} ${t('licao.ppm')} · ${resumo.precisao}% · ` +
    `${resumo.erros} ${t('licao.erros')}`;
}
