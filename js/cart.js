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
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
        var isHidden = menu.classList.contains('hidden');
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
        btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        if (icon) icon.textContent = isHidden ? 'close' : 'menu';
    });
})();
