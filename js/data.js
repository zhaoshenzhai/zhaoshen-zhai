document.addEventListener('DOMContentLoaded', (e) => {
    var research = document.getElementById('research');
    var talks = document.getElementById('talks');
    var exposition = document.getElementById('exposition');

    fetch('./data.json').then(response => response.json())
    .then((data) => {
        var researchList = Object.values(data).filter(item => item.type == 'research');
        insertData(research, researchList, 'ol');

        var talksList = Object.values(data).filter(item => item.type == 'talk');
        insertData(talks, talksList, 'ul');

        var expositionList = Object.values(data).filter(item => item.type == 'exposition');
        insertData(exposition, expositionList, 'ul');
    });
});

function insertData(container, list, type) {
    var listContainer = document.createElement(type);
    listContainer.classList.add('data_list');
    container.appendChild(listContainer);

    for (var i = 0; i < list.length; i++) {
        var item = document.createElement('li');
        item.classList.add('data_item');
        listContainer.appendChild(item);

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
            title.classList.add('data_title_button')
            title.addEventListener('click', function () { toggleAbstract(this) });
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
    div.appendChild(el);

    parEl.appendChild(div);
}

function toggleAbstract(el) {
    var par = el.parentElement;
    var abs = par.getElementsByClassName('data_abstract')[0];
    if (abs.style.maxHeight) {
        abs.style.maxHeight = null;
    } else {
        abs.style.maxHeight = abs.scrollHeight + 'px';
    }
}
