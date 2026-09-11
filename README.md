# digita.

Treino de digitação em português do Brasil.

**▶ [fernando-trajano.github.io/digita](https://fernando-trajano.github.io/digita/)**

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

**Versão 1 completa.** O fluxo inteiro funciona: escolher o teclado, o teste de
nivelamento, as 18 lições da fileira base, o resultado com estrelas, a trilha e a tela
inicial. As outras 6 trilhas aparecem como "em breve" — a meta é um programa de 30 dias
com cerca de 100 lições de 5 minutos.

### O que já funciona

- Detecção do teclado (ABNT2 ou americano) e do sistema, com escolha manual sempre acima
  do palpite automático
- Teste de nivelamento de um minuto, que dispensa quem já digita
- 18 lições com teclado e mãos na tela, cursor que trava no erro e métricas ao vivo
- Estrelas por velocidade, com precisão mínima de 90% para concluir
- Progresso, sequência de dias e teclas que mais escapam, tudo no seu navegador
- Exportar e importar o progresso em arquivo
- Português e inglês, modo claro e escuro, sons opcionais

## Tecnologia

HTML, CSS e JavaScript puro — **sem frameworks, sem dependências e sem etapa de build**.
O progresso fica no `localStorage` do seu navegador: não há login e nada é enviado para
lugar nenhum.

## Como rodar na sua máquina

Como o projeto usa módulos ES, o navegador **não** aceita abrir o `index.html` com duplo
clique. É preciso servir a pasta. Com o Python que já vem no macOS:

```bash
python3 servidor.py
```

Depois abra **http://localhost:8010** no navegador.

O `servidor.py` é um servidor local de 40 linhas, sem dependências, que manda o navegador
não guardar nada em cache — assim uma alteração no código aparece assim que a página é
recarregada.

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
