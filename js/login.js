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
