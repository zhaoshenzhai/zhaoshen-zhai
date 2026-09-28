#!/usr/bin/env python3
"""Check that data.json parses and every local link and asset path resolves.

Run from anywhere: python3 .github/check.py. The pull-request workflow and
.githooks/pre-push run it. It lives under .github/ so Pages does not publish it.
"""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent
TYPES = {'research', 'talk', 'exposition'}
errors = []


class Links(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.ids, self.refs = set(), []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        self.refs += [attrs[k] for k in ('href', 'src') if attrs.get(k)]


def check(ref, base, where, ids=()):
    """Report ref if it is local and names a missing file or anchor."""
    url = urlsplit(ref)
    if url.scheme or url.netloc:
        return
    if not url.path:
        if url.fragment and url.fragment not in ids:
            errors.append(f'{where}: no element with id "{url.fragment}"')
        return
    if not (base / url.path).resolve().is_file():
        errors.append(f'{where}: missing {ref}')


index = Links((ROOT / 'index.html').read_text())
for ref in index.refs:
    check(ref, ROOT, 'index.html', index.ids)

for css in ROOT.glob('css/*.css'):
    for ref in re.findall(r"url\(['\"]?([^'\")]+)", css.read_text()):
        check(ref, css.parent, css.relative_to(ROOT))

for js in ROOT.glob('js/*.js'):
    for ref in re.findall(r"['\"](\.?/?[\w/.-]+\.(?:json|svg|pdf|css|js))['\"]", js.read_text()):
        check(ref, ROOT, js.relative_to(ROOT))

try:
    entries = json.loads((ROOT / 'data.json').read_text())
except json.JSONDecodeError as e:
    sys.exit(f'data.json: {e}')
for n, entry in enumerate(entries):
    where = f'data.json entry {n}'
    if not entry.get('title'):
        errors.append(f'{where}: no title')
    if entry.get('type') not in TYPES:
        errors.append(f'{where}: type must be one of {sorted(TYPES)}')
    for ref in entry.get('sources', {}).values():
        check(ref, ROOT, where)
    for html in [entry.get('abstract', '')] + entry.get('info', []):
        for ref in Links(html).refs:
            check(ref, ROOT, where)

if errors:
    sys.exit('\n'.join(errors))
print(f'ok: data.json has {len(entries)} entries; local links resolve')
