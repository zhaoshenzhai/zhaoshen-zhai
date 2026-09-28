# Working on the website

This is a static public site; [README.md](README.md) describes its layout. Keep personal administrative files and private mathematical sources out of it. PDFs under `data/` are published assets and belong in Git. Some are no longer linked from the page. Keep them, because old direct links may point to them. `data/cv.pdf` links to `data/moduli_spaces.pdf` by absolute URL, so that path must not change.

The page is one file of each kind: [index.html](index.html), [css/site.css](css/site.css), [js/site.js](js/site.js). `js/site.js` sets the MathJax config, injects MathJax from the CDN, then renders `data.json` entries into the three sections by their `type`. Preserve the `research`, `talk`, and `exposition` record types.

`index.html` has no doctype, so browsers render it in quirks mode, where class names match case-insensitively. Adding a doctype switches to standards mode, so compare the rendering before and after rather than treating it as a cleanup (issue #7).

Run `python3 .github/check.py` after any change; `data.json` must stay a list of entries. It checks that `data.json` parses and has valid types, and that local links, anchors and asset paths resolve. The pull-request workflow runs it, and so does the tracked pre-push hook once a clone runs `git config core.hooksPath .githooks`. For visible changes, serve the repository over HTTP and verify the affected page, navigation, abstracts, and mathematics in a browser at desktop and phone widths. MathJax sizes math from the text font, so compare math only after the fonts have loaded.

Do not change deployment settings during unrelated work.
