document.addEventListener('DOMContentLoaded', (e) => {
    var research = document.getElementById('research');
    var exposition = document.getElementById('exposition');

    fetch('./writings.json').then(response => response.json())
    .then((data) => {
        var researchList = Object.values(data).filter(
            item => item.type == 'research');
        insertWriting(research, researchList);

        var expositionList = Object.values(data).filter(
            item => item.type == 'exposition');
        insertWriting(exposition, expositionList);
    });
});

function insertWriting(container, list) {
    var listContainer = document.createElement('ol');
    listContainer.classList.add('writing_list');
    container.appendChild(listContainer);

    for (var i = 0; i < list.length; i++) {
        var item = document.createElement('li');
        item.classList.add('writing_item');

        var title = document.createElement('span');
        title.classList.add('writing_title');
        title.innerText = list[i].title;
        item.appendChild(title);

        if (list[i].pdf) { createSource(item, list[i].pdf, 'pdf'); }

        if (list[i].arxiv) { createSource(item, list[i].arxiv, 'arxiv'); }

        if (list[i].journal) {
            createSource(item, list[i].journal, 'journal');
            createCitation(item, list[i]);
        }

        createAbstract(item, list[i].abstract);

        listContainer.appendChild(item);
    }
}

function createSource(parEl, data, name) {
    var link = document.createElement('a');
    link.innerText = name;
    link.href = data;
    link.setAttribute('target', '_blank');

    var el = document.createElement('span');
    el.classList.add('source');
    el.innerHTML = ' [' + link.outerHTML + ']';

    parEl.appendChild(el);
}

function createCitation(parEl, data) {
    var el = document.createElement('span');
    el.classList.add('writing_cite');
    
    if (data.journal_name) {
        el.innerHTML += '<i>' + data.journal_name + '</i>';
    }

    if (data.journal_volume) {
        el.innerHTML += ' <b>' + data.journal_volume + '</b>';
    }

    if (data.journal_year) {
        el.innerHTML += ' (' + data.journal_year + ')';
    }

    if (data.journal_number) {
        el.innerHTML += ', no. ' + data.journal_number;
    }

    el.innerHTML += '.';
    parEl.appendChild(el);
}

function createAbstract(parEl, data) {
    var el = document.createElement('p');
    el.classList.add('writing_abstract');

    el.innerText = 'Abstract. ' + data;

    parEl.appendChild(el);
}
