#!/usr/bin/env python3
"""
servidor.py — servidor local para desenvolvimento.

Por que existe: o `python3 -m http.server` deixa o navegador guardar os
arquivos em cache. Como o site é feito de módulos JavaScript, isso faz o
navegador continuar rodando a versão ANTIGA de um arquivo depois de você
editá-lo — e você fica olhando para uma tela que não mudou, achando que o
código está errado.

Este servidor manda o navegador nunca guardar nada, então recarregar a
página sempre mostra a versão de agora.

Como usar:

    python3 servidor.py          # abre em http://localhost:8010
    python3 servidor.py 8020     # ou em outra porta, se a 8010 estiver ocupada

Só serve para desenvolver na sua máquina. No GitHub Pages o site é servido
pelo GitHub, e este arquivo não faz diferença nenhuma.
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PORTA_PADRAO = 8010


class SemCache(SimpleHTTPRequestHandler):
    """Igual ao servidor padrão, mas proibindo o cache do navegador."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()


def main():
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else PORTA_PADRAO
    raiz = Path(__file__).parent
    manipulador = partial(SemCache, directory=str(raiz))

    with ThreadingHTTPServer(("127.0.0.1", porta), manipulador) as servidor:
        print(f"digita. rodando em http://localhost:{porta}")
        print("Para parar: Ctrl+C")
        try:
            servidor.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor parado.")


if __name__ == "__main__":
    main()
