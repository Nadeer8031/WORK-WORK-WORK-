        // Micro-interaction: Update quantity count
        // Note: Inline logic added directly to button onclick for simplicity in this demo.
        
        // Micro-interaction: Image Hover Effects
        document.querySelectorAll('.cursor-pointer').forEach(thumb => {
            thumb.addEventListener('mouseenter', function() {
                const mainImg = document.querySelector('.hero-zoom img');
                const tempSrc = this.querySelector('img').src;
                // In a real app, we would swap sources here.
            });
        });

        // Initialize inventory bar animation
        window.addEventListener('load', () => {
            const fill = document.querySelector('.inventory-fill');
            fill.style.width = '25%'; // Trigger transition
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
