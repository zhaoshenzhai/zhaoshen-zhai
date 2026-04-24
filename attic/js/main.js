const params = new URLSearchParams(window.location.search);
const noteId = params.get('note');
const container = document.getElementById('svg-container');

if (noteId) {
    let pageNum = 1;

    function loadNextPage() {
        const svgPath = `notes/${noteId}-${pageNum}.svg`;

        fetch(svgPath, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    const obj = document.createElement('object');
                    obj.data = svgPath;
                    obj.type = "image/svg+xml";
                    obj.className = "latex-document";
                    obj.style.marginBottom = "2rem";

                    obj.onload = function() {
                        const svgDoc = obj.contentDocument;
                        if (svgDoc) {
                            svgDoc.querySelectorAll('a').forEach(a => {
                                a.setAttribute('target', '_top');
                                try {
                                    const bbox = a.getBBox();
                                    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                                    rect.setAttribute("x", bbox.x);
                                    rect.setAttribute("y", bbox.y);
                                    rect.setAttribute("width", bbox.width);
                                    rect.setAttribute("height", bbox.height);
                                    rect.setAttribute("fill", "transparent");
                                    rect.setAttribute("pointer-events", "all");
                                    a.insertBefore(rect, a.firstChild);
                                } catch(e) { }
                            });
                        }

                        pageNum++;
                        loadNextPage();
                    };

                    container.appendChild(obj);
                } else if (pageNum === 1) {
                    container.innerHTML = "<div class='error-msg'>Note not found or has not been compiled yet.</div>";
                }
            })
            .catch(err => {
                if (pageNum === 1) {
                    container.innerHTML = "<div class='error-msg'>Network error loading note.</div>";
                }
            });
    }

    loadNextPage();

} else {
    container.innerHTML = "<div class='error-msg'>No note ID provided. Please use a link with ?note=ID</div>";
}
