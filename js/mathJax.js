window.MathJax = {
    tex: {
        inlineMath: [['$', '$']],
        packages: {'[+]': ['mathtools']}
    },
    svg: { fontCache: 'global' },
    loader: {load: ['[tex]/mathtools']},
    processEscapes: true,
    processEnvironments: true
};

(function() {
    fetch('./macros.sty')
        .then(response => response.text())
        .then((data) => {
            var preamble = document.getElementById('preamble');
            if (preamble) { preamble.innerHTML = '$' + data + '$'; }

            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
            document.head.appendChild(script);
        });
})();
