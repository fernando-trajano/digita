/* ==========================================================================
   jogos.js — a lista dos jogos, na ordem em que aparecem no menu.

   Conteúdo separado da lógica, como as lições e o treino livre. Os nomes e
   as descrições moram nas traduções (jogos.<id>.nome e .descricao), e cada
   jogo tem o seu arquivo em js/jogos/.

   `ilustracao` é o id do símbolo SVG no index.html.

   A Cobra sorteia as palavras do modo Adaptativo do treino livre
   (dados/treino-livre.js): sem acento, pelo mesmo motivo que lá — num
   teclado americano sem o US Internacional, uma palavra acentuada trava o
   jogo.
   ========================================================================== */

export const JOGOS = [
  { id: 'cobra', ilustracao: 'ilustracao-jogo-cobra' },
  { id: 'fila', ilustracao: 'ilustracao-jogo-fila' },
  { id: 'cadeia', ilustracao: 'ilustracao-jogo-cadeia' },
];
