window.MathJax = {
    tex: {
        inlineMath: [['$', '$']],
        packages: {'[+]': ['mathtools']},
        processEscapes: true,
        processEnvironments: true
    },
    svg: { fontCache: 'global' },
    loader: {load: ['[tex]/mathtools']}
};

(function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);
})();
