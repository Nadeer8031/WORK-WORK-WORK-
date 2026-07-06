        function increment(btn) {
            const display = btn.parentNode.querySelector('.quantity-display');
            let count = parseInt(display.innerText);
            display.innerText = count + 1;
            // Add subtle pulse effect
            display.classList.add('scale-110');
            setTimeout(() => display.classList.remove('scale-110'), 200);
        }

        function decrement(btn) {
            const display = btn.parentNode.querySelector('.quantity-display');
            let count = parseInt(display.innerText);
            if (count > 1) {
                display.innerText = count - 1;
                display.classList.add('scale-90');
                setTimeout(() => display.classList.remove('scale-90'), 200);
            }
        }

        // Micro-interaction for primary CTA (guarded in case markup changes with backend integration)
        var primaryCta = document.querySelector('a.bg-primary, button.bg-primary');
        if (primaryCta) {
            primaryCta.addEventListener('mousedown', function() { this.style.transform = 'scale(0.98)'; });
            primaryCta.addEventListener('mouseup', function() { this.style.transform = 'scale(1)'; });
        }
    

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
