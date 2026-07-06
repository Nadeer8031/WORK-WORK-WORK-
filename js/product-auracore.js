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
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
        var isHidden = menu.classList.contains('hidden');
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
        btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        if (icon) icon.textContent = isHidden ? 'close' : 'menu';
    });
})();
