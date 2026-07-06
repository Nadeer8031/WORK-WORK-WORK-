        function toggleMenu(btn) {
            // Close all other menus
            document.querySelectorAll('.action-menu').forEach(menu => {
                if (menu !== btn.nextElementSibling) {
                    menu.classList.remove('active');
                }
            });
            // Toggle current
            const menu = btn.nextElementSibling;
            menu.classList.toggle('active');
            
            // Handle closing when clicking outside
            const closeMenu = (e) => {
                if (!btn.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.remove('active');
                    document.removeEventListener('click', closeMenu);
                }
            };
            
            if (menu.classList.contains('active')) {
                setTimeout(() => document.addEventListener('click', closeMenu), 1);
            }
        }

        // Add visual weight to "Schedule" in nav links since we are on that page
        // Handled via static HTML above.
    

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
