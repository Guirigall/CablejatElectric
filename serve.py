#!/usr/bin/env python3
"""Servidor local de Bord; reutilitza instàncies i evita conflictes de port."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from functools import partial
from urllib.request import build_opener, ProxyHandler
import argparse
import errno
import hashlib
import json
import webbrowser

ROOT = Path(__file__).resolve().parent / 'dist'
IDENTITY_PATH = '/__bord_instance'


def identity(root):
    return hashlib.sha256(str(Path(root).resolve()).encode()).hexdigest()


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map,
                      '.webmanifest': 'application/manifest+json',
                      '.js': 'text/javascript', '.md': 'text/markdown; charset=utf-8'}

    def do_GET(self):
        if self.path == IDENTITY_PATH:
            payload = json.dumps({'app': 'bord', 'project': identity(self.directory)}).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


def is_our_instance(port, root):
    try:
        # La comprovació local no passa per cap proxy configurat al sistema.
        opener = build_opener(ProxyHandler({}))
        with opener.open(f'http://127.0.0.1:{port}{IDENTITY_PATH}', timeout=.5) as response:
            data = json.loads(response.read(4096))
        return isinstance(data, dict) and data.get('app') == 'bord' and data.get('project') == identity(root)
    except (OSError, ValueError):
        return False


def get_server(port, root):
    """Retorna (servidor o None si es reutilitza, port efectiu). No atura processos."""
    handler = partial(Handler, directory=str(root))
    for candidate in range(port, min(port + 21, 65536)):
        try:
            server = ThreadingHTTPServer(('127.0.0.1', candidate), handler)
            return server, server.server_address[1]
        except OSError as error:
            if error.errno != errno.EADDRINUSE:
                raise
            if is_our_instance(candidate, root):
                return None, candidate
    raise OSError(errno.EADDRINUSE, 'No s’ha trobat cap port lliure en els 21 ports comprovats.')


def main():
    parser = argparse.ArgumentParser(description='Bord · servidor local de la PWA')
    parser.add_argument('--port', type=int, default=8082)
    parser.add_argument('--open', action='store_true', help='Obre el navegador')
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error('El port ha d’estar entre 1 i 65535.')
    try:
        server, port = get_server(args.port, ROOT)
    except OSError as error:
        if error.errno in (errno.EACCES, errno.EPERM):
            parser.exit(1, 'Aquest entorn no permet obrir un servidor local. Executa Obre-Bord.sh des del terminal de l’ordinador.\n')
        parser.exit(1, f'No s’ha pogut iniciar Bord: {error}\n')
    url = f'http://localhost:{port}'
    if server is None:
        print(f'Bord ja està obert: {url}', flush=True)
        if args.open:
            webbrowser.open(url)
        return
    print(f'Bord: {url} · Ctrl+C per aturar', flush=True)
    if port != args.port:
        print(f'El port {args.port} està ocupat; utilitzo el {port}. Les notes del navegador són pròpies de cada port.', flush=True)
    try:
        if args.open:
            webbrowser.open(url)
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
