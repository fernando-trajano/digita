# digita.

Treino de digitação em português do Brasil.

🇬🇧 [Read this in English](README.en.md)

---

## O que é

Um site para aprender a digitar sem olhar para o teclado, feito para quem escreve em
português. A maioria dos treinos de digitação é pensada para o inglês e ignora justamente
o que mais trava um brasileiro: o **Ç**, os **acentos** e as diferenças entre o teclado
**ABNT2** e o **americano**.

O `digita.` resolve isso com:

- **Palavras e frases reais em português**, escolhidas para o que já foi ensinado.
- **Trilha própria de acentos e Ç**, com o caminho certo para cada teclado.
- **Ajuda para teclado americano** — comum em MacBooks importados: como fazer `é`, `ã`
  e `ç` no Mac (`Option + E`, `Option + C`) e no Windows (US Internacional).
- **Teclado e mãos na tela**, com cada dedo em uma cor, mostrando qual dedo usar.

## Estado do projeto

Em construção. A **versão 1** entrega o fluxo completo com a trilha *fileira base*
(18 lições); as outras 6 trilhas aparecem como "em breve". A meta é um programa de 30 dias
com cerca de 100 lições de 5 minutos.

## Tecnologia

HTML, CSS e JavaScript puro — **sem frameworks, sem dependências e sem etapa de build**.
O progresso fica no `localStorage` do seu navegador: não há login e nada é enviado para
lugar nenhum.

## Como rodar na sua máquina

Como o projeto usa módulos ES, o navegador **não** aceita abrir o `index.html` com duplo
clique. É preciso servir a pasta. Com o Python que já vem no macOS:

```bash
python3 -m http.server 8000
```

Depois abra **http://localhost:8000** no navegador.

## Estrutura

```
css/     estilos — tema.css guarda todas as cores em variáveis
js/      lógica — telas, teclado, motor de digitação, métricas
dados/   conteúdo — lições, layouts de teclado e traduções (PT/EN)
assets/  ícones
```

Conteúdo e lógica ficam separados de propósito: dá para criar lições novas mexendo só em
`dados/licoes/`, sem tocar no código.

## Licença

[MIT](LICENSE) — © 2026 Fernando Rodrigo Trajano da Silva.
