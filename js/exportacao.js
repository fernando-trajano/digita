/* ==========================================================================
   exportacao.js — levar o progresso embora, e trazê-lo de volta.

   O digita. não tem login: tudo mora no navegador de quem usa. Isso é bom
   (nada sai do computador dele) e tem um preço — trocar de computador,
   limpar os dados do navegador ou usar outro navegador começa do zero.

   O arquivo de progresso é a resposta: um JSON pequeno, legível, que a
   pessoa guarda onde quiser e importa quando precisar.

   O arquivo tem um número de VERSÃO. Hoje é 1. Se um dia o formato mudar,
   é ele que vai permitir ler um arquivo antigo em vez de recusá-lo.
   ========================================================================== */

import { CHAVES, lerTudo, gravar, apagar } from './armazenamento.js';
import { recarregarConfig } from './estado.js';

const VERSAO_DO_ARQUIVO = 1;

/* --------------------------------------------------------------------------
   Exportar
   -------------------------------------------------------------------------- */

/** O que vai dentro do arquivo. */
function montarConteudo() {
  return {
    formato: 'digita',
    versao: VERSAO_DO_ARQUIVO,
    exportadoEm: new Date().toISOString(),
    dados: lerTudo(),
  };
}

/** Um nome de arquivo com a data: digita-progresso-2026-09-10.json */
function nomeDoArquivo() {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `digita-progresso-${hoje.getFullYear()}-${mes}-${dia}.json`;
}

/**
 * Baixa o progresso como arquivo.
 *
 * O truque é o de sempre na web: cria-se um link invisível para os dados,
 * clica-se nele por código e joga-se fora. O `download` no link é o que faz
 * o navegador salvar em vez de abrir.
 */
export function exportarProgresso() {
  const conteudo = JSON.stringify(montarConteudo(), null, 2);
  const endereco = URL.createObjectURL(new Blob([conteudo], { type: 'application/json' }));

  const link = document.createElement('a');
  link.href = endereco;
  link.download = nomeDoArquivo();
  link.click();

  // Sem isto o navegador segura o arquivo na memória até fechar a aba.
  URL.revokeObjectURL(endereco);
}

/* --------------------------------------------------------------------------
   Importar
   -------------------------------------------------------------------------- */

/**
 * Lê um arquivo escolhido pela pessoa e substitui o progresso por ele.
 *
 * Um arquivo pode vir de qualquer lugar — inclusive de um erro de clique —
 * então nada é gravado antes de o conteúdo ser conferido.
 *
 * @param {File} arquivo
 * @returns {Promise<{ok: boolean, motivo?: string}>}
 */
export async function importarProgresso(arquivo) {
  let conteudo;

  try {
    conteudo = JSON.parse(await arquivo.text());
  } catch {
    return { ok: false, motivo: 'ilegivel' };
  }

  if (conteudo?.formato !== 'digita' || !conteudo?.dados) {
    return { ok: false, motivo: 'outroArquivo' };
  }

  if (conteudo.versao > VERSAO_DO_ARQUIVO) {
    return { ok: false, motivo: 'versaoNova' };
  }

  /* Importar SUBSTITUI, não mistura: o arquivo é uma fotografia completa do
     progresso, e uma gaveta que não está nele precisa sair. Misturar daria
     um estado que nunca existiu — o progresso do arquivo convivendo com o
     que já estava na máquina.

     Só as gavetas que o site conhece são tocadas; um campo a mais no
     arquivo é ignorado em silêncio, em vez de virar lixo no localStorage. */
  for (const [nome, chave] of Object.entries(CHAVES)) {
    const valor = conteudo.dados[nome];

    if (valor && typeof valor === 'object') gravar(chave, valor);
    else apagar(chave);
  }

  // A configuração fica em memória enquanto o site roda: sem isto, o idioma
  // e o teclado importados só valeriam depois de recarregar a página.
  recarregarConfig();

  return { ok: true };
}
