        // Populate the order summary from the shared cart. If the cart is
        // empty there's nothing to check out, so send the shopper back.
        (function () {
            if (!window.AuraCart) return;
            var cart = window.AuraCart.getCart();
            if (!cart.length) {
                window.location.href = 'cart.html';
                return;
            }

            var itemsContainer = document.getElementById('checkout-items');
            itemsContainer.innerHTML = cart.map(function (item) {
                var lineTotal = (item.price * item.qty).toFixed(2);
                var imageMarkup = item.image
                    ? '<img class="w-full h-full object-cover" src="' + item.image + '" alt="' + item.name + '">'
                    : '<div class="w-full h-full flex items-center justify-center text-secondary material-symbols-outlined">inventory_2</div>';
                return (
                    '<div class="flex gap-4">' +
                        '<div class="w-20 h-20 bg-white border border-secondary-container rounded-lg overflow-hidden flex-shrink-0">' +
                            imageMarkup +
                        '</div>' +
                        '<div class="flex flex-grow flex-col justify-between">' +
                            '<div>' +
                                '<h3 class="font-headline-md text-[18px] text-primary">' + item.name + '</h3>' +
                                (item.subtitle ? '<p class="font-label-md text-label-md text-on-surface-variant">' + item.subtitle + '</p>' : '') +
                            '</div>' +
                            '<div class="flex justify-between items-center">' +
                                '<span class="font-label-md text-label-md text-secondary">Qty: ' + item.qty + '</span>' +
                                '<span class="font-body-md font-semibold text-primary">$' + lineTotal + '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
                );
            }).join('');

            var totals = window.AuraCart.getTotals(cart);
            document.getElementById('checkout-subtotal').textContent = window.AuraCart.formatUSD(totals.subtotal);
            document.getElementById('checkout-tax').textContent = window.AuraCart.formatUSD(totals.tax);
            document.getElementById('checkout-total').textContent = window.AuraCart.formatUSD(totals.total);
            document.getElementById('checkout-cta-label').textContent = 'Confirm & Pay ' + window.AuraCart.formatUSD(totals.total);
        })();

        // Micro-interaction for input fields
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', () => {
                input.previousElementSibling.style.color = '#350e1b';
                input.previousElementSibling.style.transition = 'color 0.2s ease';
            });
            input.addEventListener('blur', () => {
                input.previousElementSibling.style.color = '#B5A391';
            });
        });

        // Simple Card Format observer
        const cardInput = document.querySelector('input[placeholder*="4492"]');
        if(cardInput) {
            cardInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                let formatted = value.match(/.{1,4}/g)?.join(' ') || '';
                e.target.value = formatted.substring(0, 19);
            });
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
