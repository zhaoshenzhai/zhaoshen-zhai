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
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    document.head.appendChild(script);
})();
