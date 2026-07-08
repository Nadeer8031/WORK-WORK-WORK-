        // Micro-interaction: Update quantity count
        // Note: Inline logic added directly to button onclick for simplicity in this demo.

        var AURACORE_BASE_PRICE = 2299.0;

        // Image gallery: clicking a thumbnail swaps the main hero image and
        // marks that thumbnail as the active one.
        (function () {
            var heroImg = document.getElementById('auracore-hero-img');
            var thumbs = document.querySelectorAll('#auracore-thumbnails [data-thumb]');
            if (!heroImg || !thumbs.length) return;

            function selectThumb(thumb) {
                var img = thumb.querySelector('img');
                if (!img) return;
                heroImg.src = img.src;
                heroImg.setAttribute('data-alt', img.getAttribute('data-alt') || '');
                thumbs.forEach(function (t) {
                    t.classList.remove('thumb-active', 'border-2', 'border-primary');
                    t.classList.add('border', 'border-secondary-container');
                });
                thumb.classList.remove('border', 'border-secondary-container');
                thumb.classList.add('thumb-active', 'border-2', 'border-primary');
            }

            thumbs.forEach(function (thumb) {
                thumb.addEventListener('click', function () {
                    selectThumb(thumb);
                });
            });
        })();

        // Initialize inventory bar animation
        window.addEventListener('load', () => {
            const fill = document.querySelector('.inventory-fill');
            fill.style.width = '25%'; // Trigger transition
        });

        // Delivery frequency: applies a 10% discount to the displayed price
        // when the Quarterly Refill option is selected.
        (function () {
            var freqEl = document.getElementById('auracore-frequency');
            var priceEl = document.getElementById('auracore-price');
            if (!freqEl || !priceEl) return;

            function currentUnitPrice() {
                return freqEl.value.indexOf('Save 10%') !== -1
                    ? AURACORE_BASE_PRICE * 0.9
                    : AURACORE_BASE_PRICE;
            }

            function updatePriceDisplay() {
                priceEl.textContent = '$' + currentUnitPrice().toFixed(2);
            }

            freqEl.addEventListener('change', updatePriceDisplay);
            updatePriceDisplay();
        })();

        // Add to Cart: read the selected quantity/frequency and push the
        // Pill Pal Buddy Home Bundle into the shared cart, applying the
        // quarterly discount if selected, then go to cart.
        (function () {
            var addBtn = document.getElementById('auracore-add-to-cart');
            if (!addBtn || !window.AuraCart) return;
            addBtn.addEventListener('click', function () {
                var qtyEl = document.getElementById('auracore-qty');
                var freqEl = document.getElementById('auracore-frequency');
                var qty = qtyEl ? parseInt(qtyEl.innerText, 10) || 1 : 1;
                var frequency = freqEl ? freqEl.value : 'One-time Purchase';
                var unitPrice =
                    frequency.indexOf('Save 10%') !== -1
                        ? AURACORE_BASE_PRICE * 0.9
                        : AURACORE_BASE_PRICE;
                window.AuraCart.addToCart({
                    id: 'pill-pal-buddy-home-bundle',
                    name: 'Pill Pal Buddy Home Bundle',
                    subtitle: frequency,
                    price: unitPrice,
                    image:
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuDwNXaARTIl-j-AXaok2dm1NTITAT0Kt05-rGlMQ0WoXI_OQpA23qn75Ypd8z9ecXal2yaqsKpfKGDpewtuAZi_SwzIeyF1R7M5Sfa0XZB92Im6jD5TBpi54PWAa74UAohB2xttm2w35F5Oa6iyRMggyrzFzA052X-7Qi9lSD4zGLXttQi14aEleOli7hYmIqe9aOX22hu881zjaC3Wb02O2BkInKDzJw-zwOwPoE5fTdTvGeycAOEcOaNo7LJqsysJOW-RVTD6LA',
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
