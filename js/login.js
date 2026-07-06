        document.addEventListener('DOMContentLoaded', () => {
            const passwordInput = document.getElementById('password');
            const visibilityBtn = passwordInput.nextElementSibling;
            
            visibilityBtn.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                visibilityBtn.querySelector('.material-symbols-outlined').textContent = type === 'password' ? 'visibility' : 'visibility_off';
            });

            // Smooth subtle movement on mouse move for the background effect
            const background = document.querySelector('.absolute.inset-0.z-0');
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth) * 20;
                const y = (e.clientY / window.innerHeight) * 20;
                background.style.transform = `translate(${x}px, ${y}px)`;
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
