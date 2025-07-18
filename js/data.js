document.addEventListener('DOMContentLoaded', (e) => {
    var research = document.getElementById('publications');
    var talks = document.getElementById('seminar_talks');
    var exposition = document.getElementById('expositions');

    fetch('./data.json').then(response => response.json())
    .then((data) => {
        var researchList = Object.values(data).filter(item => item.type == 'research');
        insertData(research, researchList);

        var talksList = Object.values(data).filter(item => item.type == 'talk');
        insertData(talks, talksList);

        var expositionList = Object.values(data).filter(item => item.type == 'exposition');
        insertData(exposition, expositionList);
    });
});

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
            arrow.addEventListener('click', function () { toggleAbstract(this) });
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
    div.appendChild(el);

    parEl.appendChild(div);
}

function toggleAbstract(el) {
    console.log(el);
    var par = el.parentElement;
    var abs = par.getElementsByClassName('data_abstract')[0];
    if (abs.style.maxHeight) {
        abs.style.maxHeight = null;
        abs.style.opacity = '0';
        el.style.rotate = '0deg';
    } else {
        abs.style.maxHeight = abs.scrollHeight + 'px';
        abs.style.opacity = '1';
        el.style.rotate = '-180deg';
    }
}
