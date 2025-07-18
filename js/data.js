document.addEventListener('DOMContentLoaded', (e) => {
    initData();
    initSectionButtons();
});

function initData() {
    var research = document.getElementById('publications');
    var talks = document.getElementById('seminar_talks');
    var exposition = document.getElementById('expositions');

    fetch('./data.json').then(response => response.json())
    .then((data) => {
        var values = Object.values(data);
        var researchList = values.filter(item => item.type == 'research');
        insertData(research, researchList);

        var talksList = values.filter(item => item.type == 'talk');
        insertData(talks, talksList);

        var expList = values.filter(item => item.type == 'exposition');
        insertData(exposition, expList);
    });
}

function initSectionButtons() {
    var sections = document.getElementsByClassName('section_content');
    for (var i = 0; i < sections.length; i++) {
        sections[i].addEventListener('mouseenter', function() {
            var button = this.getElementsByClassName('section_button')[0];
            button.style.opacity = '1';
        });
        sections[i].addEventListener('mouseleave', function() {
            var button = this.getElementsByClassName('section_button')[0];
            button.style.opacity = '0';
        });
    }

    var buttons = document.getElementsByClassName('section_button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function() {
            var section = this.parentElement;
            var ratio = calculateExpandedRatio(section);
            var arrows = section.getElementsByClassName('data_arrow');

            for (var j = 0; j < arrows.length; j++) {
                var arrow = arrows[j];
                if (ratio > 0.5) {
                    collapseAbstract(arrow);
                } else {
                    expandAbstract(arrow);
                }
            }

            ratio = calculateExpandedRatio(section);
            updateButton(this, ratio);
        });
    }
}

function insertData(container, list) {
    var listContainer = document.createElement('ol');
    listContainer.classList.add('data_list');
    container.appendChild(listContainer);

    for (var i = 0; i < list.length; i++) {
        var item = document.createElement('div');
        item.classList.add('data_item');
        listContainer.appendChild(item);

        var arrow = document.createElement('img');
        arrow.classList.add('data_arrow');
        arrow.classList.add('noSelect');
        arrow.src = "css/fa/arrow-head.svg";
        item.appendChild(arrow);

        var title = document.createElement('span');
        title.classList.add('data_title');
        title.innerText = list[i].title;
        item.appendChild(title);

        if (list[i].sources) {
            for(var [key, val] of Object.entries(list[i].sources)) {
                createSource(item, key, val);
            }
        }

        if (list[i].info) {
            for (var info of list[i].info) {
                createInfo(item, info);
            }
        }

        if (list[i].abstract) {
            createAbstract(item, list[i].abstract);
            arrow.addEventListener('click', function () {
                toggleAbstract(this)
            });
        } else {
            arrow.classList.remove('data_arrow');
            arrow.classList.add('data_arrow_disabled');
            arrow.style.opacity = '0';
            arrow.pointer_events = 'none';
        }
    }
}

function createSource(parEl, name, data) {
    var link = document.createElement('a');
    link.innerText = '[' + name + ']';
    link.href = data;
    link.setAttribute('target', '_blank');

    var el = document.createElement('span');
    el.classList.add('source');
    el.innerHTML = link.outerHTML;

    parEl.appendChild(el);
}

function createInfo(parEl, info) {
    var el = document.createElement('span');
    el.classList.add('data_info');
    el.innerHTML = info;

    parEl.appendChild(el);
}

function createAbstract(parEl, data) {
    var el = document.createElement('p');
    el.innerHTML = 'Abstract. ' + data;

    var div = document.createElement('div');
    div.classList.add('data_abstract');
    div.classList.add('data_abstract_collapsed');
    div.appendChild(el);

    parEl.appendChild(div);
}

function toggleAbstract(arrow) {
    var item = arrow.parentElement;
    var abs = item.getElementsByClassName('data_abstract')[0];
    if (abs.style.maxHeight) {
        collapseAbstract(arrow);
    } else {
        expandAbstract(arrow);
    }

    var section = item.parentElement.parentElement;
    var ratio = calculateExpandedRatio(section);
    var button = section.getElementsByClassName('section_button')[0];
    updateButton(button, ratio);
}

function expandAbstract(arrow) {
    var item = arrow.parentElement;
    var abs = item.getElementsByClassName('data_abstract')[0];

    abs.style.maxHeight = abs.scrollHeight + 'px';
    abs.style.opacity = '1';
    arrow.style.rotate = '-180deg';
    arrow.classList.add('data_abstract_expanded');
    arrow.classList.remove('data_abstract_collapsed');
}
function collapseAbstract(arrow) {
    var item = arrow.parentElement;
    var abs = item.getElementsByClassName('data_abstract')[0];

    abs.style.maxHeight = null;
    abs.style.opacity = '0';
    arrow.style.rotate = '0deg';
    arrow.classList.add('data_abstract_collapsed');
    arrow.classList.remove('data_abstract_expanded');
}

function calculateExpandedRatio(section) {
    var arrows = section.getElementsByClassName('data_arrow');

    var numExpanded = 0;
    for (var i = 0; i < arrows.length; i++) {
        if (arrows[i].classList.contains('data_abstract_expanded')) {
            numExpanded++;
        }
    }

    return numExpanded / arrows.length;
}

function updateButton(button, ratio) {
    if (ratio > 0.5) {
        button.innerText = '[-]';
    } else {
        button.innerText = '[+]';
    }
}
