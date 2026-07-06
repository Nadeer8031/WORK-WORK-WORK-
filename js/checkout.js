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
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
        var isHidden = menu.classList.contains('hidden');
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
        btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        if (icon) icon.textContent = isHidden ? 'close' : 'menu';
    });
})();
