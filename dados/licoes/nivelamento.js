/* ==========================================================================
   nivelamento.js — o texto do teste de um minuto.

   Este teste não ensina nada: ele só mede quem já sabe digitar, para não
   obrigar essa pessoa a repetir a fileira base do zero.

   Regras do conteúdo, e o motivo de cada uma:

   - Palavras comuns do português, e não sílabas soltas: o que se quer medir
     é a digitação de verdade, com o ritmo das palavras.
   - SEM acentos e SEM Ç. Quem tem teclado americano ainda não aprendeu a
     fazê-los, e o teste mediria o teclado, não a pessoa.
   - Palavras curtas e médias, das três fileiras de letras: é o vocabulário
     que qualquer pessoa que "já digita" consegue escrever.

   São 86 palavras. Em um minuto quase ninguém chega ao fim — e quem chegar
   terá feito um teste ótimo de qualquer jeito.
   ========================================================================== */

/** Quanto tempo dura o teste, em segundos. */
export const DURACAO_DO_TESTE = 60;

export const textoDeNivelamento = [
  'casa mesa livro porta tempo verde gato rato',
  'dedo mundo campo ponte festa carta grupo forte',
  'banco pedra folha marca bolso punho salto turma',
  'vidro prato longe calma sorte tarde noite vento',
  'terra corpo ombro letra ritmo texto aluno prova',
  'escola palavra momento pessoa cidade semana minuto',
  'projeto caminho trabalho medida imagem futuro',
  'sistema exemplo aberto mesmo grande pequeno branco',
  'preto verdade certeza leitura escrita janela pergunta',
  'resposta viagem estrada floresta cadeira caderno',
  'telefone quadro domingo segunda quarta sexta',
  'primeiro segundo terceiro quase sempre nunca tudo',
];
