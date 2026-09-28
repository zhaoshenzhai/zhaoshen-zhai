// MathJax sizes math to the surrounding text font, so it must not typeset
// before that font loads. document.fonts.ready alone can resolve before the
// font is requested; loading it by name cannot. A failed load typesets anyway.
var textFontReady = () => document.fonts.load('1em mlmt').catch(() => {}).then(() => document.fonts.ready);

// Loaded synchronously in <head>: MathJax reads this config when its script runs.
window.MathJax = {
    tex: {
        inlineMath: [['$', '$']],
        packages: {'[+]': ['mathtools']},
        processEscapes: true,
        processEnvironments: true
    },
    svg: { fontCache: 'global' },
    loader: {load: ['[tex]/mathtools']},
    startup: {
        pageReady() {
            return textFontReady().then(() => MathJax.startup.defaultPageReady());
        }
    }
};

var mathJaxScript = document.createElement('script');
mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js';
mathJaxScript.async = true;
document.head.appendChild(mathJaxScript);

document.addEventListener('DOMContentLoaded', () => {
    fetch('./data.json').then(response => response.json()).then(async data => {
        insertData('research', data, 'research');
        insertData('seminar_talks', data, 'talk');
        insertData('expositions', data, 'exposition');
        await textFontReady();
        if (window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }
    });

    for (const section of document.getElementsByClassName('section_content')) {
        const button = section.querySelector('.section_button');
        section.addEventListener('mouseenter', () => button.classList.add('shown'));
        section.addEventListener('mouseleave', () => button.classList.remove('shown'));
        button.addEventListener('click', toggleSection);
    }

    document.getElementById('title').addEventListener('click', () => window.scrollTo(0, 0));

    // Highlight the nav link of every section inside the viewport, less a 150px margin.
    var observer = new IntersectionObserver(entries => {
        for (var entry of entries) {
            var link = document.querySelector(`nav li a[href="#${entry.target.id}"]`);
            link.parentElement.classList.toggle('active', entry.intersectionRatio > 0);
        }
    }, {rootMargin: '-150px'});
    document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
});

function add(parent, tag, className) {
    var element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    return parent.appendChild(element);
}

// Each entry: arrow, title, [source] links, info lines, and a collapsible abstract.
function insertData(sectionId, data, type) {
    var list = add(document.getElementById(sectionId), 'ol');
    for (var entry of data.filter(entry => entry.type == type)) {
        var item = add(list, 'div', 'data_item');
        var arrow = add(item, entry.abstract ? 'button' : 'img', 'noSelect');
        var icon = entry.abstract ? add(arrow, 'img', 'noSelect') : arrow;
        icon.src = 'css/fa/arrow-head.svg';
        icon.alt = '';
        add(item, 'span', 'data_title').innerText = entry.title;

        for (var [name, href] of Object.entries(entry.sources || {})) {
            var link = add(add(item, 'span', 'source'), 'a');
            link.innerText = '[' + name + ']';
            link.href = href;
            link.target = '_blank';
        }
        for (var info of entry.info || []) {
            add(item, 'span', 'data_info').innerHTML = info;
        }

        if (entry.abstract) {
            arrow.type = 'button';
            arrow.setAttribute('aria-expanded', 'false');
            arrow.setAttribute('aria-label', 'Show abstract');
            arrow.classList.add('data_arrow');
            arrow.addEventListener('click', toggleAbstract);
            add(add(item, 'div', 'data_abstract'), 'p').innerHTML = 'Abstract. ' + entry.abstract;
        } else {
            arrow.classList.add('data_arrow_disabled');
        }
    }
}

function isExpanded(arrow) {
    return Boolean(arrow.parentElement.querySelector('.data_abstract').style.maxHeight);
}

function setExpanded(arrow, expanded) {
    var abstract = arrow.parentElement.querySelector('.data_abstract');
    abstract.style.maxHeight = expanded ? abstract.scrollHeight + 'px' : null;
    abstract.style.opacity = expanded ? '1' : '0';
    arrow.style.rotate = expanded ? '-180deg' : '0deg';
    arrow.setAttribute('aria-expanded', String(expanded));
    arrow.setAttribute('aria-label', expanded ? 'Hide abstract' : 'Show abstract');
}

function toggleAbstract() {
    setExpanded(this, !isExpanded(this));
    updateButton(this.closest('.section_content'));
}

// [+] expands every abstract in the section, [-] collapses them all.
function toggleSection() {
    var section = this.parentElement;
    var expand = !mostlyExpanded(section);
    for (var arrow of section.getElementsByClassName('data_arrow')) {
        setExpanded(arrow, expand);
    }
    updateButton(section);
}

function mostlyExpanded(section) {
    var arrows = [...section.getElementsByClassName('data_arrow')];
    return arrows.filter(isExpanded).length / arrows.length > 0.5;
}

function updateButton(section) {
    var expanded = mostlyExpanded(section);
    var button = section.querySelector('.section_button');
    button.innerText = expanded ? '[-]' : '[+]';
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', expanded ? 'Hide all abstracts' : 'Show all abstracts');
}
