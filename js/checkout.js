        // Micro-interaction for input fields
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', () => {
                input.previousElementSibling.style.color = '#350e1b';
                input.previousElementSibling.style.transition = 'color 0.2s ease';
            });
            input.addEventListener('blur', () => {
                input.previousElementSibling.style.color = '#B5A391';
            });
        });

        // Simple Card Format observer
        const cardInput = document.querySelector('input[placeholder*="4492"]');
        if(cardInput) {
            cardInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                let formatted = value.match(/.{1,4}/g)?.join(' ') || '';
                e.target.value = formatted.substring(0, 19);
            });
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
