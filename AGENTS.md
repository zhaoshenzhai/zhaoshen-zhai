# Working on the website

This is a static public site; [README.md](README.md) describes its layout. Keep personal administrative files and private mathematical sources out of it. PDFs under `data/` are published assets and belong in Git. Some are no longer linked from the page. Keep them, because old direct links may point to them. `data/cv.pdf` links to `data/moduli_spaces.pdf` by absolute URL, so that path must not change.

The page is one file of each kind: [index.html](index.html), [css/site.css](css/site.css), [js/site.js](js/site.js). `js/site.js` sets the MathJax config, injects MathJax from the CDN, then renders `data.json` entries into the three sections by their `type`. Preserve the `research`, `talk`, and `exposition` record types.

The page uses standards mode. It rendered in quirks mode until PR #9, and a few rules in `css/site.css` keep that look:
- inline math has `line-height: 0`
- the section `[+]` buttons have `line-height: 1.34` and a 1px vertical margin

MathJax sizes math to the text font, so `js/site.js` typesets only after `mlmt` loads. A ResizeObserver keeps each open abstract's `max-height` equal to its content. Below 1200px, where the desktop layout would scroll sideways, the nav sits above the content without a backdrop. With a backdrop, Chrome's automatic dark mode darkens the page.

Checks run only on this machine; the only workflow is the Pages deploy. Run `lockf -k /private/tmp/local-checks.lock nice -n 10 python3 .githooks/check.py` after any change, and on the final commit before a pull request is merged; the pull request names the command and its result. `data.json` must stay a list of entries. The check confirms that `data.json` parses and has valid types, and that local links, anchors and asset paths resolve. The tracked pre-push hook runs it the same way once a clone runs `git config core.hooksPath .githooks`. The checker stays in a hidden directory because Pages publishes the repository root except hidden paths. For visible changes, serve the repository over HTTP and verify the affected page, navigation, abstracts, and mathematics in a browser at desktop and phone widths. Compare math only after the fonts have loaded, and test a cold load with the font delayed.

Do not change deployment settings during unrelated work.
