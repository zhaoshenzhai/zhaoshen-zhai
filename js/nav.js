document.addEventListener('DOMContentLoaded', (e) => {
    var title = document.getElementById('title');
    title.addEventListener('click', function() { window.scrollTo(0, 0) });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            if (entry.intersectionRatio > 0) {
                document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.add('active');
            } else {
                document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.remove('active');
            }
        });
    }, {rootMargin: '-150px'});

    document.querySelectorAll('section[id]').forEach((section) => {
        observer.observe(section);
    });
});
