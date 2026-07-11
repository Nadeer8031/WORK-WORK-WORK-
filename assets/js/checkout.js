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
document.querySelectorAll('input').forEach(function(input) {
    input.addEventListener('focus', function() {
        input.previousElementSibling.style.color = '#350e1b';
        input.previousElementSibling.style.transition = 'color 0.2s ease';
    });
    input.addEventListener('blur', function() {
        input.previousElementSibling.style.color = '#B5A391';
    });
});

// Simple Card Format observer
var cardInput = document.querySelector('input[placeholder*="4492"]');
if (cardInput) {
    cardInput.addEventListener('input', function(e) {
        var value = e.target.value.replace(/\D/g, '');
        var formatted = value.match(/.{1,4}/g) ? value.match(/.{1,4}/g).join(' ') : '';
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
        if (isHidden) { openMenu(); } else { closeMenu(); }
    });
    window.addEventListener('resize', function () {
        if (spacer && !menu.classList.contains('hidden')) {
            spacer.style.height = menu.scrollHeight + 'px';
        }
    });
})();

// ===== CHECKOUT VALIDATION & ORDER PROCESSING =====
(function () {
    var checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm) return;

    var fullName = document.getElementById('fullName');
    var streetAddress = document.getElementById('streetAddress');
    var city = document.getElementById('city');
    var state = document.getElementById('state');
    var zip = document.getElementById('zip');
    var cardNumber = document.getElementById('cardNumber');
    var expiryDate = document.getElementById('expiryDate');
    var cvv = document.getElementById('cvv');

    var fullNameError = document.getElementById('fullName_error');
    var streetAddressError = document.getElementById('streetAddress_error');
    var cityError = document.getElementById('city_error');
    var stateError = document.getElementById('state_error');
    var zipError = document.getElementById('zip_error');
    var cardNumberError = document.getElementById('cardNumber_error');
    var expiryDateError = document.getElementById('expiryDate_error');
    var cvvError = document.getElementById('cvv_error');

    function validateCheckoutForm() {
        var errors = [fullNameError, streetAddressError, cityError, stateError,
                       zipError, cardNumberError, expiryDateError, cvvError];
        errors.forEach(function(el) {
            if (el) el.textContent = '';
        });

        var valid = true;

        if (!fullName || fullName.value.trim() === '') {
            if (fullNameError) fullNameError.textContent = 'Full name is required';
            valid = false;
        } else if (fullName.value.trim().length < 2) {
            if (fullNameError) fullNameError.textContent = 'Name must be at least 2 characters';
            valid = false;
        }

        if (!streetAddress || streetAddress.value.trim() === '') {
            if (streetAddressError) streetAddressError.textContent = 'Street address is required';
            valid = false;
        }

        if (!city || city.value.trim() === '') {
            if (cityError) cityError.textContent = 'City is required';
            valid = false;
        }

        if (!state || state.value.trim() === '') {
            if (stateError) stateError.textContent = 'State is required';
            valid = false;
        } else if (state.value.trim().length !== 2) {
            if (stateError) stateError.textContent = 'State must be 2 characters (e.g., CA)';
            valid = false;
        }

        if (!zip || zip.value.trim() === '') {
            if (zipError) zipError.textContent = 'ZIP code is required';
            valid = false;
        } else if (!/^\d{5}$/.test(zip.value.trim())) {
            if (zipError) zipError.textContent = 'ZIP must be 5 digits';
            valid = false;
        }

        var cardNum = cardNumber ? cardNumber.value.replace(/\s/g, '') : '';
        if (cardNum === '') {
            if (cardNumberError) cardNumberError.textContent = 'Card number is required';
            valid = false;
        } else if (!/^\d{16}$/.test(cardNum)) {
            if (cardNumberError) cardNumberError.textContent = 'Card number must be 16 digits';
            valid = false;
        }

        if (!expiryDate || expiryDate.value.trim() === '') {
            if (expiryDateError) expiryDateError.textContent = 'Expiry date is required';
            valid = false;
        } else {
            var expiry = expiryDate.value.trim();
            if (!/^\d{2}\s*\/\s*\d{2}$/.test(expiry)) {
                if (expiryDateError) expiryDateError.textContent = 'Use MM/YY format';
                valid = false;
            } else {
                var parts = expiry.split('/');
                var month = parseInt(parts[0].trim());
                var year = parseInt(parts[1].trim());
                var currentDate = new Date();
                var currentYear = currentDate.getFullYear() % 100;
                var currentMonth = currentDate.getMonth() + 1;

                if (month < 1 || month > 12) {
                    if (expiryDateError) expiryDateError.textContent = 'Invalid month';
                    valid = false;
                } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                    if (expiryDateError) expiryDateError.textContent = 'Card has expired';
                    valid = false;
                }
            }
        }

        if (!cvv || cvv.value.trim() === '') {
            if (cvvError) cvvError.textContent = 'CVV is required';
            valid = false;
        } else if (!/^\d{3,4}$/.test(cvv.value.trim())) {
            if (cvvError) cvvError.textContent = 'CVV must be 3-4 digits';
            valid = false;
        }

        return valid;
    }

    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var isValid = validateCheckoutForm();

        if (!isValid) {
            var firstError = document.querySelector('.error-message:not(:empty)');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        processOrder();
    });

    function processOrder() {
        var cart = window.AuraCart ? window.AuraCart.getCart() : [];
        if (!cart.length) {
            window.location.href = 'cart.html';
            return;
        }

        var totals = window.AuraCart.getTotals(cart);
        var orderCode = 'ORD-' + Date.now().toString().slice(-8);

        var order = {
            id: orderCode,
            date: new Date().toISOString(),
            items: cart.map(function(item) {
                return {
                    name: item.name,
                    quantity: item.qty,
                    price: item.price,
                    subtotal: (item.price * item.qty)
                };
            }),
            totals: totals,
            shipping: {
                fullName: fullName.value.trim(),
                streetAddress: streetAddress.value.trim(),
                city: city.value.trim(),
                state: state.value.trim().toUpperCase(),
                zip: zip.value.trim()
            },
            status: 'Processing'
        };

        var isLoggedIn = !!(window.AuraAuth && window.AuraAuth.isLoggedIn());

        if (!isLoggedIn) {
            if (window.AuraCart) {
                window.AuraCart.clearCart();
            }
            showOrderSuccessModal(order);
            return;
        }

        // Send order to backend for logged-in users
        fetch('auth/orders.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: cart.map(function(item) {
                    var match = /^product-(\d+)$/.exec(String(item.id));
                    return {
                        product_id: match ? parseInt(match[1], 10) : 0,
                        price: item.price,
                        qty: item.qty
                    };
                })
            })
        })
        .then(function(r) { return r.json(); })
        .then(function(result) {
            if (result.success) {
                order.id = 'ORD-' + result.order_id;
            }
            if (window.AuraCart) {
                window.AuraCart.clearCart();
            }
            showOrderSuccessModal(order);
        })
        .catch(function() {
            if (window.AuraCart) {
                window.AuraCart.clearCart();
            }
            showOrderSuccessModal(order);
        });
    }

    function showOrderSuccessModal(order) {
        var isLoggedIn = !!(window.AuraAuth && window.AuraAuth.isLoggedIn());
        var continueDestination = isLoggedIn ? 'profile.html' : 'login.html';

        var modal = document.getElementById('orderSuccessModal');
        if (!modal) {
            window.location.href = continueDestination;
            return;
        }

        var idLabel = document.getElementById('orderSuccessId');
        if (idLabel) idLabel.textContent = 'Order #' + order.id;

        var continueLabel = document.getElementById('orderSuccessContinue');
        if (continueLabel && !isLoggedIn) {
            continueLabel.textContent = 'Log In to View My Order';
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');

        var goToNext = function () {
            window.location.href = continueDestination;
        };

        var continueBtn = document.getElementById('orderSuccessContinue');
        if (continueBtn) {
            continueBtn.addEventListener('click', goToNext, { once: true });
        }

        modal.addEventListener('click', function (e) {
            if (e.target === modal) goToNext();
        }, { once: true });
    }
})();
