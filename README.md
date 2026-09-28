# Zhaoshen Zhai's website

This public repository contains a static academic website. Its local checkout is `~/.puppy/web`; GitHub Pages is configured for [the published site](https://zhaoshenzhai.github.io/zhaoshen-zhai/).

[index.html](index.html) defines the page. [data.json](data.json) holds research, talk, and exposition entries. [js/site.js](js/site.js) renders those entries and loads MathJax; [css/site.css](css/site.css) and the fonts and icon beside it hold the presentation. Published PDFs live in [data/](data/) and stay tracked.

Preview from the repository root with `python3 -m http.server 8000 --bind 127.0.0.1`, then open `http://127.0.0.1:8000`. Use HTTP because the page fetches `data.json`. There is no package installation or build step; MathJax loads from a CDN.

Maintain TeX sources in the private math repository. Copy only PDFs intended for public distribution into this repository and update their links. Review changes through a pull request; publishing requires separate approval.
