        // Password visibility toggle logic (optional enhancement)
        document.querySelectorAll('input[type="password"]').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.querySelector('.material-symbols-outlined').style.color = '#350e1b';
            });
            input.addEventListener('blur', () => {
                input.parentElement.querySelector('.material-symbols-outlined').style.color = '#837376';
            });
        });

        // Simple input highlight
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', () => {
                const label = input.parentElement.parentElement.querySelector('label');
                if (label) label.classList.replace('text-outline', 'text-primary');
            });
            input.addEventListener('blur', () => {
                const label = input.parentElement.parentElement.querySelector('label');
                if (label) label.classList.replace('text-primary', 'text-outline');
            });
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
