/* ==========================================================================
   progresso.js — o que a pessoa já conquistou.

   Guarda quatro coisas, cada uma na sua gaveta do localStorage:

     digita:progresso     como foi em cada lição (melhor PPM, estrelas…)
     digita:sequencia     quantos dias seguidos praticando
     digita:estatisticas  as teclas: quais mais deram erro (errosPorTecla,
                          só das lições) e acertos e erros de cada uma
                          (porTecla, de lições, treino livre e jogos)
     digita:historico     uma linha por sessão de lição ou treino livre:
                          é a curva de evolução da tela de estatísticas

   A regra de liberação é simples e vale para o programa inteiro: uma lição
   abre quando a anterior foi concluída. Concluir exige a precisão mínima —
   digitar rápido e errado não conta como aprender.
   ========================================================================== */

import { CHAVES, ler, gravar } from './armazenamento.js';
import { contarEstrelas } from './metricas.js';
import {
  TRILHAS,
  todasAsLicoes,
  licaoPorId,
  proximaLicao,
  metasDaLicao,
} from '../dados/licoes/indice.js';

/* --------------------------------------------------------------------------
   Leitura
   -------------------------------------------------------------------------- */

/** Como foi em cada lição, por id. */
export function progresso() {
  return ler(CHAVES.progresso, {});
}

/** O que já se sabe sobre uma lição específica. */
export function progressoDaLicao(id) {
  return progresso()[id] ?? null;
}

/** Quantos dias seguidos de prática. */
export function sequencia() {
  return ler(CHAVES.sequencia, { dias: 0, ultimaData: null });
}

/**
 * As teclas, somando tudo.
 *
 *   errosPorTecla  quantas vezes cada letra foi errada, só nas lições — é
 *                  o que pesa o modo Adaptativo e o painel "teclas que mais
 *                  escapam"
 *   porTecla       acertos e erros de cada letra, de lições, treino livre
 *                  e jogos — é o que dá a TAXA de erro do mapa de calor
 *
 * O porTecla começou a ser gravado depois do errosPorTecla, e não o
 * completa: os erros antigos não têm os acertos que os acompanharam, e
 * misturá-los daria uma taxa de erro inventada.
 *
 * As duas contam o CARACTERE ("á", " ", "A"), e não a tecla física: assim a
 * estatística sobrevive a uma troca de teclado.
 */
export function estatisticas() {
  return ler(CHAVES.estatisticas, { errosPorTecla: {}, porTecla: {} });
}

/** As sessões de lição e de treino livre, da mais antiga para a mais nova. */
export function historico() {
  const { sessoes } = ler(CHAVES.historico, { sessoes: [] });
  return Array.isArray(sessoes) ? sessoes : [];
}

/** O resultado do teste de nivelamento, se ele já foi feito. */
export function nivelamento() {
  return ler(CHAVES.nivelamento, null);
}

/** As trilhas que o teste de nivelamento liberou de uma vez. */
function trilhasLiberadasPeloTeste() {
  return new Set(nivelamento()?.trilhasLiberadas ?? []);
}

/**
 * Uma lição está liberada?
 *
 * Três caminhos levam a sim:
 *   - é a primeira de todas;
 *   - a lição anterior foi concluída;
 *   - o teste de nivelamento liberou a trilha inteira dela.
 *
 * @param {string} id
 */
export function licaoLiberada(id) {
  const todas = todasAsLicoes();
  const posicao = todas.findIndex((licao) => licao.id === id);

  if (posicao < 0) return false;
  if (posicao === 0) return true;

  if (trilhasLiberadasPeloTeste().has(todas[posicao].trilha)) return true;

  return Boolean(progressoDaLicao(todas[posicao - 1].id)?.concluida);
}

/**
 * Guarda a resposta do nivelamento.
 *
 * Vale tanto para quem fez o teste quanto para quem disse "quero começar do
 * zero": as duas são respostas, e ambas precisam ficar registradas — senão
 * o site repetiria a pergunta a cada visita.
 *
 * @param {{ppm: number, precisao: number}|null} resultado  null = pulou o teste
 * @returns {string[]}  os ids das trilhas liberadas
 */
export function registrarNivelamento(resultado) {
  const trilhasLiberadas = resultado ? trilhasDominadas(resultado) : [];

  gravar(CHAVES.nivelamento, {
    fezTeste: Boolean(resultado),
    ppm: resultado?.ppm ?? null,
    precisao: resultado?.precisao ?? null,
    trilhasLiberadas,
    data: new Date().toISOString(),
  });

  return trilhasLiberadas;
}

/**
 * Que trilhas o resultado do teste dispensa.
 *
 * A precisão vem primeiro, como em todo o resto do site: quem digita rápido
 * e errado não domina a fileira base — está justamente na hora de aprendê-la
 * direito. Passando disso, 25 PPM é o patamar de quem já tem as mãos na
 * posição certa e não precisa começar do "fff jjj".
 *
 * Só a fileira base entra na conta porque é a única trilha com conteúdo. As
 * outras vão entrando aqui conforme forem escritas.
 */
function trilhasDominadas({ ppm, precisao }) {
  if (precisao < 90 || ppm < 25) return [];

  return [TRILHAS[0].id];
}

/**
 * Onde continuar: a primeira lição ainda não concluída.
 * É o que o botão "Continuar de onde parei" vai usar (passo 15).
 */
export function licaoParaContinuar() {
  const todas = todasAsLicoes();
  const dispensadas = trilhasLiberadasPeloTeste();

  // Quem passou no nivelamento não deve ser mandado de volta para a trilha
  // que o teste já dispensou.
  const proxima = todas.find(
    (licao) => !progressoDaLicao(licao.id)?.concluida && !dispensadas.has(licao.trilha)
  );

  return proxima ?? todas.find((licao) => !progressoDaLicao(licao.id)?.concluida) ?? todas[0];
}

/** Quantas lições já foram concluídas. */
export function totalConcluidas() {
  return Object.values(progresso()).filter((licao) => licao.concluida).length;
}

/**
 * A média de quem ainda não tem média. Vinte palavras por minuto é o ritmo
 * de quem já sabe onde ficam as teclas mas ainda procura algumas.
 */
const PPM_DE_PARTIDA = 20;

/**
 * A média de PPM de quem joga — é por ela que a Cobra acerta a velocidade.
 *
 * Vem da melhor marca de cada lição concluída: é o ritmo que a pessoa já
 * mostrou que tem, lição por lição. Quem ainda não concluiu nenhuma mas fez
 * o teste de nivelamento usa o resultado dele. Quem não tem nenhum dos dois
 * recebe um valor de partida, dito com todas as letras na tela — nunca um
 * número inventado como se fosse dele.
 *
 * @returns {{ppm: number, origem: 'licoes'|'teste'|'padrao'}}
 */
export function ppmMedio() {
  const marcas = Object.values(progresso())
    .filter((licao) => licao.concluida && licao.melhorPpm > 0)
    .map((licao) => licao.melhorPpm);

  if (marcas.length) {
    const soma = marcas.reduce((total, ppm) => total + ppm, 0);
    return { ppm: Math.round(soma / marcas.length), origem: 'licoes' };
  }

  const teste = nivelamento();
  if (teste?.fezTeste && teste.ppm > 0) return { ppm: Math.round(teste.ppm), origem: 'teste' };

  return { ppm: PPM_DE_PARTIDA, origem: 'padrao' };
}

/* --------------------------------------------------------------------------
   Escrita
   -------------------------------------------------------------------------- */

/**
 * Guarda o resultado de uma lição e devolve o que ele significa.
 *
 * @param {object} licao
 * @param {object} resumo  o que o motor devolveu ao terminar
 * @returns {{estrelas: number, passou: boolean, recorde: boolean,
 *            metas: object, proxima: object|null}}
 */
export function registrarResultado(licao, resumo) {
  const metas = metasDaLicao(licao);
  const estrelas = contarEstrelas(resumo, metas);
  const passou = resumo.precisao >= metas.precisaoMinima;

  const tudo = progresso();
  const antes = tudo[licao.id] ?? {
    tentativas: 0,
    melhorPpm: 0,
    melhorPrecisao: 0,
    estrelas: 0,
    concluida: false,
  };

  const recorde = resumo.ppm > antes.melhorPpm;

  tudo[licao.id] = {
    tentativas: antes.tentativas + 1,
    // O melhor resultado nunca piora: uma tentativa ruim não apaga uma boa.
    melhorPpm: Math.max(antes.melhorPpm, resumo.ppm),
    melhorPrecisao: Math.max(antes.melhorPrecisao, resumo.precisao),
    estrelas: Math.max(antes.estrelas, estrelas),
    concluida: antes.concluida || passou,
    ultimaVez: new Date().toISOString(),
  };

  gravar(CHAVES.progresso, tudo);
  somarEstatisticas(resumo);
  somarTeclas(resumo.porTecla);
  registrarSessao({
    ppm: resumo.ppm,
    precisao: resumo.precisao,
    origem: 'licao',
    id: licao.id,
    segundos: resumo.segundos,
  });

  // Só treino que valeu conta para a sequência de dias.
  if (passou) registrarDiaDePratica();

  return {
    estrelas,
    passou,
    recorde: recorde && passou,
    metas,
    proxima: passou ? proximaLicao(licao.id) : null,
  };
}

/** Soma os erros desta lição ao total de sempre. */
function somarEstatisticas(resumo) {
  const dados = estatisticas();
  const erros = { ...dados.errosPorTecla };

  for (const { tecla, vezes } of resumo.errosPorTecla) {
    erros[tecla] = (erros[tecla] ?? 0) + vezes;
  }

  gravar(CHAVES.estatisticas, { ...dados, errosPorTecla: erros });
}

/**
 * Soma acertos e erros de cada letra ao total de sempre (porTecla).
 *
 * Lições, treino livre e jogos chamam esta função: todos contam para o mapa
 * de calor e para a precisão por dedo, mesmo quem não entra na curva de
 * evolução.
 *
 * @param {Object<string, {acertos: number, erros: number}>} [novas]
 */
export function somarTeclas(novas = {}) {
  const letras = Object.entries(novas);
  if (!letras.length) return;

  const dados = estatisticas();
  const porTecla = { ...dados.porTecla };

  for (const [letra, { acertos = 0, erros = 0 }] of letras) {
    const antes = porTecla[letra] ?? { acertos: 0, erros: 0 };
    porTecla[letra] = { acertos: antes.acertos + acertos, erros: antes.erros + erros };
  }

  gravar(CHAVES.estatisticas, { ...dados, porTecla });
}

/** Quantas sessões o histórico guarda. Da 201ª em diante, a mais antiga sai. */
const SESSOES_NO_HISTORICO = 200;

/**
 * Uma sessão mais curta que isto não entra na curva: quem abre o treino
 * livre e encerra em cinco segundos não fez uma sessão, e o PPM de cinco
 * segundos não quer dizer nada.
 */
const SEGUNDOS_PARA_VALER = 15;

/**
 * Guarda uma sessão no histórico — um ponto na curva de evolução.
 *
 * Só lição e treino livre. Os jogos ficam de fora: na Fila o ritmo é do
 * jogo, e na Cadeia se digita de memória — nenhum dos dois diz qual é a
 * velocidade de quem digita.
 *
 * @param {{ppm: number, precisao: number, origem: 'licao'|'livre',
 *          id: string, segundos: number}} sessao
 */
export function registrarSessao({ ppm, precisao, origem, id, segundos }) {
  if (!(segundos >= SEGUNDOS_PARA_VALER) || !(ppm > 0)) return;

  const sessoes = [
    ...historico(),
    { data: new Date().toISOString(), ppm, precisao, origem, id, segundos },
  ];

  gravar(CHAVES.historico, { sessoes: sessoes.slice(-SESSOES_NO_HISTORICO) });
}

/**
 * Atualiza a sequência de dias.
 *
 * Praticar duas vezes no mesmo dia não conta duas vezes. Praticar ontem e
 * hoje soma. Ter pulado um dia recomeça do 1 — a sequência é sobre
 * constância, não sobre volume.
 */
function registrarDiaDePratica() {
  const atual = sequencia();
  const hoje = dataDeHoje();

  if (atual.ultimaData === hoje) return;

  const dias = atual.ultimaData === dataDeOntem() ? atual.dias + 1 : 1;

  gravar(CHAVES.sequencia, { dias, ultimaData: hoje });
}

/* --------------------------------------------------------------------------
   Datas

   Usamos a data LOCAL, e não a universal (UTC): para quem treina às 22h no
   Brasil, "hoje" precisa ser o dia que está no relógio dele.
   -------------------------------------------------------------------------- */

function comoTexto(data) {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return `${data.getFullYear()}-${mes}-${dia}`;
}

function dataDeHoje() {
  return comoTexto(new Date());
}

function dataDeOntem() {
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);

  return comoTexto(ontem);
}

/** Exportado só para os testes de mesa e para a tela de início (passo 15). */
export { dataDeHoje, licaoPorId };
