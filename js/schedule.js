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
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
        var isHidden = menu.classList.contains('hidden');
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
        btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        if (icon) icon.textContent = isHidden ? 'close' : 'menu';
    });
})();
