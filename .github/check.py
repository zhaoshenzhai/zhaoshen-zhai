#!/usr/bin/env python3
"""Check that data.json parses and every local link and asset path resolves.

Run from anywhere: python3 .github/check.py [site-root]. The site root defaults
to this repository. The pull-request workflow and .githooks/pre-push run it.
It lives under .github/ so Pages does not publish it.
"""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).parent.parent).resolve()
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
    """Report ref if it is local and names a missing file or anchor.

    A bare #fragment is checked against ids, the page the reference lands on.
    A fragment after an .html path is checked against that file's ids.
    """
    url = urlsplit(ref)
    if url.scheme or url.netloc:
        return
    if url.path:
        target = (base / unquote(url.path)).resolve()
        if not target.is_file():
            errors.append(f'{where}: missing {ref}')
            return
        if target.suffix != '.html':
            return
        ids = Links(target.read_text()).ids
    fragment = unquote(url.fragment)
    if fragment and fragment not in ids:
        errors.append(f'{where}: no element with id "{fragment}" for {ref}')


index = Links((ROOT / 'index.html').read_text())
for ref in index.refs:
    check(ref, ROOT, 'index.html', index.ids)

for css in ROOT.glob('css/*.css'):
    for _, quoted, bare in re.findall(r"""url\(\s*(?:(['"])(.*?)\1|([^'"\s)]*))\s*\)""", css.read_text()):
        check(quoted or bare, css.parent, css.relative_to(ROOT))

# JS paths resolve against the page, so against ROOT. Check every string or
# static template literal that looks like a URL to a file with an extension.
for js in ROOT.glob('js/*.js'):
    for _, literal in re.findall(r"(['\"`])((?:\\.|(?!\1).)*)\1", js.read_text()):
        if '${' in literal or not re.fullmatch(r"[\w./%?#=&@+~-]+", literal):
            continue
        if re.search(r"[^/.]\.\w+$", urlsplit(literal).path):
            check(literal, ROOT, js.relative_to(ROOT))

try:
    entries = json.loads((ROOT / 'data.json').read_text())
except json.JSONDecodeError as e:
    sys.exit(f'data.json: {e}')
if not isinstance(entries, list) or not all(isinstance(e, dict) for e in entries):
    sys.exit('data.json: must be a list of entry objects')
for n, entry in enumerate(entries):
    where = f'data.json entry {n}'
    if not entry.get('title'):
        errors.append(f'{where}: no title')
    if entry.get('type') not in TYPES:
        errors.append(f'{where}: type must be one of {sorted(TYPES)}')
    for ref in entry.get('sources', {}).values():
        check(ref, ROOT, where, index.ids)
    for html in [entry.get('abstract', '')] + entry.get('info', []):
        for ref in Links(html).refs:
            check(ref, ROOT, where, index.ids)

if errors:
    sys.exit('\n'.join(errors))
print(f'ok: data.json has {len(entries)} entries; local links resolve')
