        // ---- Cart rendering, driven by the shared AuraCart store ----

        function cartItemTemplate(item) {
            var lineTotal = (item.price * item.qty).toFixed(2);
            var imageMarkup = item.image
                ? '<img class="w-full h-full object-cover" src="' + item.image + '" alt="' + item.name + '">'
                : '<div class="w-full h-full flex items-center justify-center text-secondary material-symbols-outlined">inventory_2</div>';
            return (
                '<div class="flex flex-col sm:flex-row gap-6 p-6 bg-surface-container-lowest border border-secondary-container luxury-shadow" data-cart-item="' + item.id + '">' +
                    '<div class="w-full sm:w-28 h-28 bg-white border border-secondary-container rounded-lg overflow-hidden flex-shrink-0">' +
                        imageMarkup +
                    '</div>' +
                    '<div class="flex flex-grow flex-col sm:flex-row justify-between gap-4">' +
                        '<div>' +
                            '<h3 class="font-headline-md text-headline-md text-primary">' + item.name + '</h3>' +
                            (item.subtitle ? '<p class="font-label-md text-label-md text-on-surface-variant mt-1">' + item.subtitle + '</p>' : '') +
                            '<button type="button" class="mt-4 flex items-center gap-1 text-secondary hover:text-primary transition-colors font-label-sm text-label-sm" data-remove="' + item.id + '">' +
                                '<span class="material-symbols-outlined text-[16px]">delete</span> Remove' +
                            '</button>' +
                        '</div>' +
                        '<div class="flex sm:flex-col items-center sm:items-end justify-between gap-4">' +
                            '<div class="flex items-center border border-secondary-container rounded p-1 bg-white">' +
                                '<button type="button" class="p-1 hover:text-primary transition-colors" data-decrement="' + item.id + '">' +
                                    '<span class="material-symbols-outlined text-[18px]">remove</span>' +
                                '</button>' +
                                '<span class="w-10 text-center font-label-md quantity-display">' + item.qty + '</span>' +
                                '<button type="button" class="p-1 hover:text-primary transition-colors" data-increment="' + item.id + '">' +
                                    '<span class="material-symbols-outlined text-[18px]">add</span>' +
                                '</button>' +
                            '</div>' +
                            '<span class="font-headline-md text-headline-md text-primary" data-line-total>$' + lineTotal + '</span>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );
        }

        function renderCart() {
            if (!window.AuraCart) return;
            var cart = window.AuraCart.getCart();
            var container = document.getElementById('cart-items');
            var emptyState = document.getElementById('cart-empty-state');
            var checkoutBtn = document.getElementById('checkout-btn');

            // Clear out everything except the empty-state markup, then
            // rebuild from scratch based on the current cart.
            container.innerHTML = '';

            if (!cart.length) {
                container.appendChild(emptyState);
                emptyState.classList.remove('hidden');
            } else {
                var wrapper = document.createElement('div');
                wrapper.className = 'space-y-6';
                wrapper.innerHTML = cart.map(cartItemTemplate).join('');
                container.appendChild(wrapper);
                wireItemControls(container);
            }

            var totals = window.AuraCart.getTotals(cart);
            document.getElementById('summary-subtotal').textContent = window.AuraCart.formatUSD(totals.subtotal);
            document.getElementById('summary-tax').textContent = window.AuraCart.formatUSD(totals.tax);
            document.getElementById('summary-total').textContent = window.AuraCart.formatUSD(totals.total);
            var shippingEl = document.getElementById('summary-shipping');
            shippingEl.textContent = cart.length ? 'Complimentary' : '—';

            if (checkoutBtn) {
                checkoutBtn.disabled = cart.length === 0;
            }
        }

        function wireItemControls(container) {
            container.querySelectorAll('[data-increment]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var id = btn.getAttribute('data-increment');
                    var cart = window.AuraCart.getCart();
                    var item = cart.find(function (i) { return i.id === id; });
                    if (item) window.AuraCart.updateQty(id, item.qty + 1);
                    renderCart();
                });
            });
            container.querySelectorAll('[data-decrement]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var id = btn.getAttribute('data-decrement');
                    var cart = window.AuraCart.getCart();
                    var item = cart.find(function (i) { return i.id === id; });
                    if (item) window.AuraCart.updateQty(id, Math.max(1, item.qty - 1));
                    renderCart();
                });
            });
            container.querySelectorAll('[data-remove]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var id = btn.getAttribute('data-remove');
                    window.AuraCart.removeFromCart(id);
                    renderCart();
                });
            });
        }

        document.addEventListener('DOMContentLoaded', renderCart);

        // Send the shopper to checkout only once there's something to buy.
        (function () {
            var checkoutBtn = document.getElementById('checkout-btn');
            if (!checkoutBtn) return;
            checkoutBtn.addEventListener('click', function () {
                if (checkoutBtn.disabled) return;
                window.location.href = 'checkout.html';
            });
        })();

        // Micro-interaction for primary CTA (guarded in case markup changes with backend integration)
        var primaryCta = document.querySelector('a.bg-primary, button.bg-primary');
        if (primaryCta) {
            primaryCta.addEventListener('mousedown', function() { this.style.transform = 'scale(0.98)'; });
            primaryCta.addEventListener('mouseup', function() { this.style.transform = 'scale(1)'; });
        }
    

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
