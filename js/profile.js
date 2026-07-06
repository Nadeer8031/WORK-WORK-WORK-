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
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
        var isHidden = menu.classList.contains('hidden');
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
        btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        if (icon) icon.textContent = isHidden ? 'close' : 'menu';
    });
})();
