# Working on the website

This is a static public site; [README.md](README.md) describes its layout. Production is the GitHub Pages site at https://zhaoshenzhai.github.io/zhaoshen-zhai/. `.github/workflows/static.yml` deploys it on every push to `main`, so merging a pull request publishes it. Do not change that workflow or the Pages settings during unrelated work.

The Pages workflow publishes every tracked file except hidden paths, so a new non-hidden file, this one included, is served at the site URL. Put tooling that should not be served in a hidden directory such as `.githooks/`. The repository is public, so keep personal administrative files and private mathematical sources out of Git entirely. PDFs under `data/` are published assets and belong in Git. Some are no longer linked from the page. Keep them, because old direct links may point to them. `data/cv.pdf` links to `data/moduli_spaces.pdf` by absolute URL, so that path must not change.

The page is one file of each kind: [index.html](index.html), [css/site.css](css/site.css), [js/site.js](js/site.js). `js/site.js` sets the MathJax config, injects MathJax from the CDN, then renders `data.json` entries into the three sections by their `type`. Preserve the `research`, `talk`, and `exposition` record types.

The page uses standards mode. Two rules in `css/site.css` keep the look of the page's earlier quirks-mode rendering. Compare the page before removing either:
- inline math has `line-height: 0`
- the section `[+]` buttons have `line-height: 1.34` and a 1px vertical margin

MathJax sizes math to the text font, so `js/site.js` typesets only after `mlmt` loads. A ResizeObserver keeps each open abstract's `max-height` equal to its content. Below 1200px, where the desktop layout would scroll sideways, the nav sits above the content without a backdrop. With a backdrop, Chrome's automatic dark mode darkens the page.

The only check is `lockf -k /private/tmp/local-checks.lock nice -n 10 python3 .githooks/check.py`. It confirms that `data.json` is a list of entries with valid types, and that local links, anchors and asset paths resolve. The tracked pre-push hook runs it on the pushed commit. `~/.puppy/web` sets `core.hooksPath` to `.githooks`; another clone needs `git config core.hooksPath .githooks`. For visible changes, serve the repository as in [README.md](README.md) and verify the affected page, navigation, abstracts, and mathematics in a browser at 1440px, at 1200px and 1199px on either side of the layout breakpoint, and at 375px. Compare math only after the fonts have loaded.

[gate.json](gate.json) gives the merge gate that check as both its fast and full tier and maps paths to its kinds of change: the page, its styles, scripts, `data.json` and the PDFs are `visible`; the Pages workflow is `hosted`; AGENTS.md is `model-text`; `.githooks/` and `gate.json` are `tooling`. The real interface for a `visible` change is the local preview in a browser, as above. The workflow runs only when it publishes, so the real run of a `hosted` change is the owner's to approve or waive. No check spends money. Release is the merge, which publishes the site. The gate reads `gate.json` only at the root, so it is served like any other non-hidden file; it holds the check command and these path patterns.
