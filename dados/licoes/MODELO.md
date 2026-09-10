# Como escrever uma lição

Este é o molde para criar as próximas lições do `digita.`. Tudo aqui é **conteúdo**: dá
para mexer sem entender de programação, e sem tocar em nenhum arquivo da pasta `js/`.

## O molde

```js
{
  id: 'base-07',
  tipo: 'palavras',
  titulo: { pt: 'Sala, fala, fada', en: 'Sala, fala, fada' },
  teclasNovas: ['d', 'k'],
  conteudo: [
    'sala sala fala fala',
    'fada fada dada dada',
  ],
}
```

| Campo | O que é |
|---|---|
| `id` | Identificador único, no formato `trilha-número`: `base-07`, `cima-03`. Nunca repita um id, e não mude o id de uma lição já publicada — é por ele que o progresso de quem já treinou fica guardado. |
| `tipo` | Um destes cinco: `teclas-novas`, `palavras`, `frases`, `revisao`, `desafio`. Define as metas de velocidade (ver abaixo) e o ritmo da trilha. |
| `titulo` | O nome da lição, nos dois idiomas. Os dois são obrigatórios. |
| `teclasNovas` | As teclas que **esta** lição ensina, em minúsculas. Vazio (`[]`) quando a lição só revisa o que já veio. |
| `conteudo` | O que o aluno digita, uma linha por item do array. |
| `metas` | **Opcional.** Só use se esta lição precisar de metas diferentes das do tipo dela. |

## O ritmo de uma trilha

Toda trilha segue a mesma sequência, e a última lição é sempre o desafio que libera a
trilha seguinte:

**teclas novas → palavras → frases → revisão → desafio**

## As metas

Vêm do `tipo` da lição, definidas em `indice.js`:

| Tipo | Precisão mínima | 1 ⭐ | 2 ⭐ | 3 ⭐ |
|---|---|---|---|---|
| `teclas-novas` | 90% | 8 PPM | 14 | 20 |
| `palavras` | 90% | 10 PPM | 16 | 24 |
| `frases` | 90% | 12 PPM | 20 | 28 |
| `revisao` | 90% | 12 PPM | 20 | 28 |
| `desafio` | 90% | 15 PPM | 22 | 30 |

PPM é "palavras por minuto", contando uma palavra a cada 5 caracteres — é assim que todo
teste de digitação mede. A **precisão mínima de 90%** vale para todas: abaixo disso a
lição não é dada como concluída, por mais rápido que se digite.

Para fugir da tabela numa lição específica:

```js
metas: { precisaoMinima: 95, estrelas: [20, 28, 36] },
```

## O tamanho certo

Cada lição deve levar cerca de **5 minutos**. A conta: um iniciante digita perto de
**10 PPM**, e PPM conta uma palavra a cada 5 caracteres — ou seja, cerca de **50
caracteres por minuto**. Cinco minutos pedem, então, **250 caracteres**.

Na prática: **12 a 14 linhas** no `conteudo`, de 15 a 30 caracteres cada, somando algo
entre **210 e 290 caracteres**. As lições da fileira base estão todas nessa faixa.

## As duas regras que o site confere sozinho

Ao abrir o site, o `conferencia.js` percorre todas as lições e avisa no console do
navegador se encontrar:

1. **Letra ensinada fora de hora** — o conteúdo de uma lição só pode usar as letras de
   `teclasNovas` dela **somadas às de todas as lições anteriores da mesma trilha**.
2. **Tecla que não existe no teclado escolhido** — `ç`, `´`, `~`, `^` e `` ` `` só
   existem no teclado brasileiro. Uma lição que os use quebraria para quem tem teclado
   americano.

Se você escrever uma lição errada, o site não quebra: o aviso aparece no console
(no Safari: menu **Desenvolvedor → Mostrar console JavaScript**) e a lição continua lá.

## Regras de conteúdo

- **Só português do Brasil.** Nada de palavra de outro idioma que "pareça" portuguesa —
  *gafas* é espanhol, *sala* é português.
- **Nada de acento antes da trilha de acentos.** `á`, `ã`, `é` e `ç` são assunto da
  trilha 5.
- **Palavras de verdade sempre que possível.** Quando as letras disponíveis não
  formarem palavras (é o caso do K na fileira base), use exercícios de sílabas —
  `kjk`, `dkd` — em vez de inventar palavras.
