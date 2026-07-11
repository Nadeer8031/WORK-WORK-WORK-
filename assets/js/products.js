        // Add a product/bundle straight from the listing page into the
        // shared cart, then take the shopper to the cart to confirm it.
        function addProductToCart(item) {
            if (!window.AuraCart) return;
            window.AuraCart.addToCart({
                id: item.id,
                name: item.name,
                subtitle: item.subtitle || '',
                price: item.price,
                image: item.image || '',
                qty: 1
            });
            window.location.href = 'cart.html';
        }

        // Simple micro-interaction for inventory bars
        document.addEventListener('DOMContentLoaded', () => {
            const bars = document.querySelectorAll('.h-full.bg-primary');
            bars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 500);
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

// ---------- LIVE PRODUCT CATALOG (synced with admin dashboard) ----------
// Pulls real product/price/stock data from auth/products.php so that
// whatever the admin manages in dashboard.html actually shows up here.
(function () {
    var FALLBACK_IMAGE =
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBqyizNranRcUbMokCxc0owlGX5Kq3b_o9cCXHHzjYwC0sWEFrzuZlgr2qtS0cJd974wWBjNw1vAfYKebs_zK3IGKjpbJEqUaJpFYg9sBaOvW5W_BJOPhadrrGdYgCYP1lTuIUML5JbOByaWQ150_64MdIc_ktewav5uxyQsUsJdS1FvOSw5LBbpduT3eNTa4lrqnZRzSAPwXKGPdLCgemkRGcuXkxJIs6ZlLufJvzTu5Z03-nsWQ3FgpwDAMrS19ffwXFluJOpoQ';

    function formatPrice(n) {
        return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function wireAddToCart(btn, product) {
        btn.addEventListener('click', function () {
            if (!window.AuraCart) return;
            window.AuraCart.addToCart({
                id: 'product-' + product.product_id,
                name: product.product_name,
                subtitle: '',
                price: Number(product.price) || 0,
                image: FALLBACK_IMAGE,
                qty: 1
            });
            window.location.href = 'cart.html';
        });
    }

    function renderFeatured(product) {
        var nameEl = document.getElementById('featuredProductName');
        var priceEl = document.getElementById('featuredProductPrice');
        var badgeEl = document.getElementById('featuredProductBadge');
        var addBtn = document.getElementById('featuredProductAddBtn');
        if (!nameEl || !priceEl) return;

        nameEl.textContent = product.product_name;
        priceEl.textContent = formatPrice(product.price);

        var stock = Number(product.stock_quantity) || 0;
        if (badgeEl) {
            if (stock <= 0) {
                badgeEl.textContent = 'OUT OF STOCK';
            } else if (stock <= 5) {
                badgeEl.textContent = 'LOW STOCK — ' + stock + ' LEFT';
            } else {
                badgeEl.textContent = 'BEST SELLER';
            }
        }
        if (addBtn) {
            if (stock <= 0) {
                addBtn.disabled = true;
                addBtn.classList.add('opacity-50', 'cursor-not-allowed');
                addBtn.textContent = 'Out of Stock';
            } else {
                wireAddToCart(addBtn, product);
            }
        }
    }

    function renderExtraCard(product) {
        var stock = Number(product.stock_quantity) || 0;
        var inStock = stock > 0;
        var card = document.createElement('div');
        card.className = 'bg-white border border-secondary-container p-6 smooth-shadow flex flex-col';
        card.innerHTML =
            '<div class="w-full aspect-[4/3] bg-surface-container rounded-sm mb-6 flex items-center justify-center">' +
                '<span class="material-symbols-outlined text-[40px] text-on-primary-container">medication</span>' +
            '</div>' +
            '<h4 class="font-headline-md text-headline-md mb-1">' + escapeHtml(product.product_name) + '</h4>' +
            '<p class="text-label-sm font-label-sm mb-4 ' + (inStock ? 'text-secondary' : 'text-error') + '">' +
                (inStock ? (stock <= 5 ? 'Low stock — ' + stock + ' left' : stock + ' in stock') : 'Out of stock') +
            '</p>' +
            '<div class="font-headline-md text-primary mb-6 mt-auto">' + formatPrice(product.price) + '</div>' +
            '<button class="add-extra-btn w-full bg-primary text-on-primary px-6 py-3 font-label-md text-label-md transition-all hover:opacity-90' +
                (inStock ? '' : ' opacity-50 cursor-not-allowed') + '"' + (inStock ? '' : ' disabled') + '>' +
                (inStock ? 'Add to Cart' : 'Out of Stock') +
            '</button>';

        var btn = card.querySelector('.add-extra-btn');
        if (inStock) wireAddToCart(btn, product);
        return card;
    }

    function escapeHtml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var countEl = document.getElementById('individualSystemsCount');
        var extraGrid = document.getElementById('extraProductsGrid');
        if (!countEl && !extraGrid) return; // not on products.html

        fetch('auth/products.php')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var products = (data && data.success && data.products) ? data.products : [];
                if (countEl) {
                    countEl.textContent = products.length + (products.length === 1 ? ' MODEL AVAILABLE' : ' MODELS AVAILABLE');
                }
                if (products.length === 0) return;

                renderFeatured(products[0]);

                if (extraGrid) {
                    products.slice(1).forEach(function (p) {
                        extraGrid.appendChild(renderExtraCard(p));
                    });
                }
            })
            .catch(function () {
                if (countEl) countEl.textContent = '1 MODEL AVAILABLE';
            });
    });
})();

// ---------- LIVE BUNDLE CATALOG (synced with admin dashboard) ----------
// Pulls real bundle data from auth/bundles.php so that whatever the admin
// manages in dashboard.html automatically shows up here.
(function () {
    var BUNDLE_FALLBACK_IMAGE =
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBfe7lQuXHbCcK9JCQxDnw4YJVTJiUBMmM18DlTWz3vfWw4EHiCb9_AbIRHY0Nkv8FB7kBgFqGErZfV22EzjwNYbipORRuh_bZLJPnz7awenHmSD9GZ62jEA7pYOUNbdIT-mwO3C2OXRB_YY97GPfUBi_9M2Sek9PKouWKmOVREgUn__4ApyNXRX2baB6jy9_TcZ8svKqaQSkZxPS1cdYNZD11-gNyXDQNx3t-XVQ37Kxp-PQ81Fkim8-xies_xQcGkNaYH5l8j4w';

    function formatBundlePrice(n) {
        return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function escapeBundleHtml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function renderFeaturedBundle(bundle) {
        var grid = document.getElementById('bundlesGrid');
        if (!grid) return;
        var stock = Number(bundle.stock_quantity) || 0;
        var inStock = stock > 0;
        var card = document.createElement('div');
        card.className = 'grid grid-cols-1 lg:grid-cols-12 bg-primary-container text-on-primary rounded-lg overflow-hidden min-h-[400px]';
        card.innerHTML =
            '<div class="lg:col-span-5 relative">' +
                '<img class="w-full h-full object-cover" src="' + BUNDLE_FALLBACK_IMAGE + '" />' +
                '<div class="absolute inset-0 bg-primary-container/20"></div>' +
            '</div>' +
            '<div class="lg:col-span-7 p-12 flex flex-col justify-center">' +
                '<div class="flex items-center gap-2 text-primary-fixed-dim mb-4">' +
                    '<span class="material-symbols-outlined text-[18px]" style="font-variation-settings: &quot;FILL&quot; 1">star</span>' +
                    '<span class="text-label-sm font-label-sm uppercase tracking-widest">Most Selected</span>' +
                '</div>' +
                '<h4 class="font-headline-lg text-headline-lg text-white mb-4">' + escapeBundleHtml(bundle.bundle_name) + '</h4>' +
                '<p class="text-on-primary-container text-body-lg mb-8 max-w-xl">' +
                    (inStock ? stock + ' units in stock' : 'Currently unavailable') +
                '</p>' +
                '<div class="flex items-center gap-8">' +
                    '<div class="text-headline-md">' + formatBundlePrice(bundle.bundle_price) + '</div>' +
                    '<a class="inline-flex items-center bg-primary-fixed text-on-primary-fixed px-8 py-4 font-label-md text-label-md transition-all hover:bg-primary-fixed-dim" href="bundle-detail.html?id=' + bundle.bundle_id + '">' +
                        'View Details' +
                    '</a>' +
                '</div>' +
            '</div>';
        grid.appendChild(card);
    }

    function renderExtraBundleCard(bundle) {
        var grid = document.getElementById('bundlesGrid');
        if (!grid) return;
        var stock = Number(bundle.stock_quantity) || 0;
        var inStock = stock > 0;
        var card = document.createElement('div');
        card.className = 'bg-white border border-secondary-container p-10 smooth-shadow relative group';
        card.innerHTML =
            '<h4 class="font-headline-md text-headline-md mb-2">' + escapeBundleHtml(bundle.bundle_name) + '</h4>' +
            '<p class="text-on-surface-variant mb-10">' +
                (inStock ? stock + ' units available' : 'Currently unavailable') +
            '</p>' +
            '<div class="flex justify-between items-center pt-6 border-t border-secondary-container">' +
                '<div class="font-headline-md text-primary">' + formatBundlePrice(bundle.bundle_price) + '</div>' +
                '<div class="flex items-center gap-4">' +
                    '<a class="text-primary font-label-md flex items-center gap-2 hover:translate-x-1 transition-transform" href="bundle-detail.html?id=' + bundle.bundle_id + '">' +
                        'View Details' +
                        '<span class="material-symbols-outlined">chevron_right</span>' +
                    '</a>' +
                '</div>' +
            '</div>';
        grid.appendChild(card);
    }

    document.addEventListener('DOMContentLoaded', function () {
        var countEl = document.getElementById('bundlesCount');
        var grid = document.getElementById('bundlesGrid');
        if (!countEl && !grid) return;

        fetch('auth/bundles.php')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var bundles = (data && data.success && data.bundles) ? data.bundles : [];
                if (countEl) {
                    countEl.textContent = bundles.length + (bundles.length === 1 ? ' BUNDLE AVAILABLE' : ' BUNDLES AVAILABLE');
                }
                if (bundles.length === 0) {
                    if (countEl) countEl.textContent = 'NO BUNDLES YET';
                    return;
                }

                renderFeaturedBundle(bundles[0]);

                bundles.slice(1).forEach(function (b) {
                    renderExtraBundleCard(b);
                });
            })
            .catch(function () {
                if (countEl) countEl.textContent = '2 BUNDLES AVAILABLE';
            });
    });
})();
