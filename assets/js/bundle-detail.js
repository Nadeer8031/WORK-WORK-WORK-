// ---------- BUNDLE DETAIL PAGE ----------
// Reads ?id=X from URL, fetches bundle data from auth/bundles.php,
// and populates the detail page dynamically.
(function () {
    var FALLBACK_IMAGE =
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBfe7lQuXHbCcK9JCQxDnw4YJVTJiUBMmM18DlTWz3vfWw4EHiCb9_AbIRHY0Nkv8FB7kBgFqGErZfV22EzjwNYbipORRuh_bZLJPnz7awenHmSD9GZ62jEA7pYOUNbdIT-mwO3C2OXRB_YY97GPfUBi_9M2Sek9PKouWKmOVREgUn__4ApyNXRX2baB6jy9_TcZ8svKqaQSkZxPS1cdYNZD11-gNyXDQNx3t-XVQ37Kxp-PQ81Fkim8-xies_xQcGkNaYH5l8j4w';

    var bundleData = null;
    var BASE_PRICE = 0;

    function formatPrice(n) {
        return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function getBundleId() {
        var params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id'), 10);
    }

    function showNotFound() {
        document.getElementById('bundleNotFound').classList.remove('hidden');
        document.getElementById('bundleContent').classList.add('hidden');
        document.title = 'Bundle Not Found | AuraMed Smart Systems';
    }

    function populatePage(bundle) {
        bundleData = bundle;
        BASE_PRICE = Number(bundle.bundle_price) || 0;

        document.getElementById('breadcrumbName').textContent = bundle.bundle_name;
        document.getElementById('bundle-title').textContent = bundle.bundle_name;
        document.getElementById('bundle-price').textContent = formatPrice(BASE_PRICE);
        document.getElementById('bundle-description').textContent =
            'Premium bundle curated for comprehensive health management. Includes coordinated devices and premium support.';
        document.getElementById('bundle-detail-description').textContent =
            'The ' + bundle.bundle_name + ' is designed to provide complete health management solutions. ' +
            'Each component is carefully selected to work seamlessly together, delivering clinical-grade accuracy ' +
            'in the comfort of your home.';

        var stock = Number(bundle.stock_quantity) || 0;
        var stockStatusEl = document.getElementById('bundle-stock-status');
        var stockTextEl = document.getElementById('bundle-stock-text');
        var inventoryBar = document.getElementById('bundle-inventory-bar');
        var addToCartBtn = document.getElementById('bundle-add-to-cart');

        if (stock <= 0) {
            stockStatusEl.textContent = 'Out of Stock';
            stockStatusEl.className = 'font-label-md text-label-md text-error font-semibold';
            stockTextEl.textContent = 'This bundle is currently unavailable.';
            inventoryBar.style.width = '0%';
            if (addToCartBtn) {
                addToCartBtn.disabled = true;
                addToCartBtn.classList.add('opacity-50', 'cursor-not-allowed');
                addToCartBtn.textContent = 'Out of Stock';
            }
        } else if (stock <= 5) {
            stockStatusEl.textContent = 'Low Stock';
            stockStatusEl.className = 'font-label-md text-label-md text-error font-semibold';
            stockTextEl.textContent = 'Only ' + stock + ' bundles remaining in current production batch.';
            inventoryBar.style.width = Math.min(100, (stock / 50) * 100) + '%';
        } else {
            stockStatusEl.textContent = 'In Stock';
            stockStatusEl.className = 'font-label-md text-label-md text-primary-container font-semibold';
            stockTextEl.textContent = stock + ' bundles available.';
            inventoryBar.style.width = Math.min(100, (stock / 50) * 100) + '%';
        }

        document.title = bundle.bundle_name + ' | Bundle Details';
    }

    // Image gallery: clicking a thumbnail swaps the main hero image
    (function () {
        var heroImg = document.getElementById('bundle-hero-img');
        var thumbs = document.querySelectorAll('#bundle-thumbnails [data-thumb]');
        if (!heroImg || !thumbs.length) return;

        function selectThumb(thumb) {
            var img = thumb.querySelector('img');
            if (!img) return;
            heroImg.src = img.src;
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

    // Delivery frequency: applies a 10% discount when Quarterly is selected
    (function () {
        var freqEl = document.getElementById('bundle-frequency');
        var priceEl = document.getElementById('bundle-price');
        if (!freqEl || !priceEl) return;

        function currentUnitPrice() {
            return freqEl.value.indexOf('Save 10%') !== -1
                ? BASE_PRICE * 0.9
                : BASE_PRICE;
        }

        function updatePriceDisplay() {
            priceEl.textContent = '$' + currentUnitPrice().toFixed(2);
        }

        freqEl.addEventListener('change', updatePriceDisplay);
        updatePriceDisplay();
    })();

    // Add to Cart
    (function () {
        var addBtn = document.getElementById('bundle-add-to-cart');
        if (!addBtn) return;
        addBtn.addEventListener('click', function () {
            if (!window.AuraCart || !bundleData) return;
            if (addBtn.disabled) return;
            var qtyEl = document.getElementById('bundle-qty');
            var freqEl = document.getElementById('bundle-frequency');
            var qty = qtyEl ? parseInt(qtyEl.innerText, 10) || 1 : 1;
            var frequency = freqEl ? freqEl.value : 'One-time Purchase';
            var unitPrice =
                frequency.indexOf('Save 10%') !== -1
                    ? BASE_PRICE * 0.9
                    : BASE_PRICE;
            window.AuraCart.addToCart({
                id: 'bundle-' + bundleData.bundle_id,
                name: bundleData.bundle_name,
                subtitle: frequency,
                price: unitPrice,
                image: FALLBACK_IMAGE,
                qty: qty,
            });
            window.location.href = 'cart.html';
        });
    })();

    // Mobile menu
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

    // ---------- INIT: Fetch bundle data and populate page ----------
    var bundleId = getBundleId();
    if (!bundleId) {
        showNotFound();
    } else {
        fetch('auth/bundles.php')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var bundles = (data && data.success && data.bundles) ? data.bundles : [];
                var bundle = bundles.find(function (b) { return b.bundle_id === bundleId; });
                if (!bundle) {
                    showNotFound();
                } else {
                    document.getElementById('bundleContent').classList.remove('hidden');
                    populatePage(bundle);
                }
            })
            .catch(function () {
                showNotFound();
            });
    }
})();
