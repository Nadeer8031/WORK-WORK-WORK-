        // Micro-interaction for order rows
        document.querySelectorAll('.order-row').forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.transform = 'translateX(8px)';
            });
            row.addEventListener('mouseleave', () => {
                row.style.transform = 'translateX(0)';
            });
        });

        // Atmospheric parallax effect on background
        window.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) / 100;
            const moveY = (e.clientY - window.innerHeight / 2) / 100;
            document.body.style.backgroundPosition = `${moveX}px ${moveY}px`;
        });
    

(function () {
    var btn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    var icon = document.getElementById('mobile-menu-icon');
    var spacer = document.getElementById('mobile-menu-spacer');
    if (!btn || !menu) return;
    function openMenu() {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
        btn.setAttribute('aria-expanded', 'true');
        if (icon) icon.textContent = 'close';
        if (spacer) spacer.style.height = menu.scrollHeight + 'px';
    }
    function closeMenu() {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
        btn.setAttribute('aria-expanded', 'false');
        if (icon) icon.textContent = 'menu';
        if (spacer) spacer.style.height = '0px';
    }
    btn.addEventListener('click', function () {
        var isHidden = menu.classList.contains('hidden');
        if (isHidden) {
            openMenu();
        } else {
            closeMenu();
        }
    });
    window.addEventListener('resize', function () {
        if (spacer && !menu.classList.contains('hidden')) {
            spacer.style.height = menu.scrollHeight + 'px';
        }
    });
})();
