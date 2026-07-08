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

        // Add to Cart: read the selected quantity/frequency and push the
        // AuraMed Nexus into the shared cart, then take the user to the cart.
        (function () {
            var addBtn = document.getElementById('nexus-add-to-cart');
            if (!addBtn || !window.AuraCart) return;
            addBtn.addEventListener('click', function () {
                var qtyEl = document.getElementById('nexus-qty');
                var freqEl = document.getElementById('nexus-frequency');
                var qty = qtyEl ? parseInt(qtyEl.innerText, 10) || 1 : 1;
                var frequency = freqEl ? freqEl.value : 'One-time Purchase';
                window.AuraCart.addToCart({
                    id: 'nexus',
                    name: 'AuraMed Nexus',
                    subtitle: frequency,
                    price: 1249.0,
                    image:
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuBqyizNranRcUbMokCxc0owlGX5Kq3b_o9cCXHHzjYwC0sWEFrzuZlgr2qtS0cJd974wWBjNw1vAfYKebs_zK3IGKjpbJEqUaJpFYg9sBaOvW5W_BJOPhadrrGdYgCYP1lTuIUML5JbOByaWQ150_64MdIc_ktewav5uxyQsUsJdS1FvOSw5LBbpduT3eNTa4lrqnZRzSAPwXKGPdLCgemkRGcuXkxJIs6ZlLufJvzTu5Z03-nsWQ3FgpwDAMrS19ffwXFluJOpoQ',
                    qty: qty,
                });
                window.location.href = 'cart.html';
            });
        })();
    

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
