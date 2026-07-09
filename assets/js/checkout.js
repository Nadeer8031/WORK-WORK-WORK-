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

// ===== CHECKOUT VALIDATION & ORDER PROCESSING =====
(function () {
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm) return;

    // Get all form fields
    const fullName = document.getElementById('fullName');
    const streetAddress = document.getElementById('streetAddress');
    const city = document.getElementById('city');
    const state = document.getElementById('state');
    const zip = document.getElementById('zip');
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');

    // Error display elements
    const fullNameError = document.getElementById('fullName_error');
    const streetAddressError = document.getElementById('streetAddress_error');
    const cityError = document.getElementById('city_error');
    const stateError = document.getElementById('state_error');
    const zipError = document.getElementById('zip_error');
    const cardNumberError = document.getElementById('cardNumber_error');
    const expiryDateError = document.getElementById('expiryDate_error');
    const cvvError = document.getElementById('cvv_error');

    function validateCheckoutForm() {
        // Clear all errors
        const errors = [fullNameError, streetAddressError, cityError, stateError, 
                       zipError, cardNumberError, expiryDateError, cvvError];
        errors.forEach(el => {
            if (el) el.textContent = '';
        });

        let valid = true;

        // Validate Full Name
        if (!fullName || fullName.value.trim() === '') {
            if (fullNameError) fullNameError.textContent = 'Full name is required';
            valid = false;
        } else if (fullName.value.trim().length < 2) {
            if (fullNameError) fullNameError.textContent = 'Name must be at least 2 characters';
            valid = false;
        }

        // Validate Street Address
        if (!streetAddress || streetAddress.value.trim() === '') {
            if (streetAddressError) streetAddressError.textContent = 'Street address is required';
            valid = false;
        }

        // Validate City
        if (!city || city.value.trim() === '') {
            if (cityError) cityError.textContent = 'City is required';
            valid = false;
        }

        // Validate State
        if (!state || state.value.trim() === '') {
            if (stateError) stateError.textContent = 'State is required';
            valid = false;
        } else if (state.value.trim().length !== 2) {
            if (stateError) stateError.textContent = 'State must be 2 characters (e.g., CA)';
            valid = false;
        }

        // Validate ZIP
        if (!zip || zip.value.trim() === '') {
            if (zipError) zipError.textContent = 'ZIP code is required';
            valid = false;
        } else if (!/^\d{5}$/.test(zip.value.trim())) {
            if (zipError) zipError.textContent = 'ZIP must be 5 digits';
            valid = false;
        }

        // Validate Card Number
        const cardNum = cardNumber ? cardNumber.value.replace(/\s/g, '') : '';
        if (cardNum === '') {
            if (cardNumberError) cardNumberError.textContent = 'Card number is required';
            valid = false;
        } else if (!/^\d{16}$/.test(cardNum)) {
            if (cardNumberError) cardNumberError.textContent = 'Card number must be 16 digits';
            valid = false;
        }

        // Validate Expiry Date
        if (!expiryDate || expiryDate.value.trim() === '') {
            if (expiryDateError) expiryDateError.textContent = 'Expiry date is required';
            valid = false;
        } else {
            const expiry = expiryDate.value.trim();
            if (!/^\d{2}\s*\/\s*\d{2}$/.test(expiry)) {
                if (expiryDateError) expiryDateError.textContent = 'Use MM/YY format';
                valid = false;
            } else {
                const parts = expiry.split('/');
                const month = parseInt(parts[0].trim());
                const year = parseInt(parts[1].trim());
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear() % 100;
                const currentMonth = currentDate.getMonth() + 1;

                if (month < 1 || month > 12) {
                    if (expiryDateError) expiryDateError.textContent = 'Invalid month';
                    valid = false;
                } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                    if (expiryDateError) expiryDateError.textContent = 'Card has expired';
                    valid = false;
                }
            }
        }

        // Validate CVV
        if (!cvv || cvv.value.trim() === '') {
            if (cvvError) cvvError.textContent = 'CVV is required';
            valid = false;
        } else if (!/^\d{3,4}$/.test(cvv.value.trim())) {
            if (cvvError) cvvError.textContent = 'CVV must be 3-4 digits';
            valid = false;
        }

        return valid;
    }

    // Handle form submission
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isValid = validateCheckoutForm();
        
        if (!isValid) {
            // Scroll to first error
            const firstError = document.querySelector('.error-message:not(:empty)');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Process the order
        processOrder();
    });

    function processOrder() {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            alert('Please log in to complete your order.');
            window.location.href = 'login.html';
            return;
        }

        // Get cart items
        const cart = window.AuraCart ? window.AuraCart.getCart() : [];
        if (!cart.length) {
            window.location.href = 'cart.html';
            return;
        }

        // Create order object
        const order = {
            id: 'ORD-' + Date.now().toString().slice(-8),
            date: new Date().toISOString(),
            items: cart.map(item => ({
                name: item.name,
                quantity: item.qty,
                price: item.price,
                subtotal: (item.price * item.qty)
            })),
            totals: window.AuraCart.getTotals(cart),
            shipping: {
                fullName: fullName.value.trim(),
                streetAddress: streetAddress.value.trim(),
                city: city.value.trim(),
                state: state.value.trim().toUpperCase(),
                zip: zip.value.trim()
            },
            status: 'Processing'
        };

        // Save order to user's orders
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        
        if (userIndex !== -1) {
            if (!users[userIndex].orders) {
                users[userIndex].orders = [];
            }
            users[userIndex].orders.push(order);
            
            // Update localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // Update current user
            const updatedUser = users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            
            // Clear cart
            if (window.AuraCart) {
                window.AuraCart.clearCart();
            }
            
            // Show confirmation popup, then redirect to profile on continue
            showOrderSuccessModal(order);
        } else {
            alert('User not found. Please log in again.');
            window.location.href = 'login.html';
        }
    }

    function showOrderSuccessModal(order) {
        const modal = document.getElementById('orderSuccessModal');
        if (!modal) {
            // Fallback if the modal markup isn't present
            window.location.href = 'profile.html?order=' + encodeURIComponent(JSON.stringify(order));
            return;
        }

        const idLabel = document.getElementById('orderSuccessId');
        if (idLabel) idLabel.textContent = 'Order #' + order.id;

        modal.classList.remove('hidden');
        modal.classList.add('flex');

        const goToProfile = function () {
            window.location.href = 'profile.html?order=' + encodeURIComponent(JSON.stringify(order));
        };

        const continueBtn = document.getElementById('orderSuccessContinue');
        if (continueBtn) {
            continueBtn.addEventListener('click', goToProfile, { once: true });
        }

        // Clicking outside the card also continues to the profile page
        modal.addEventListener('click', function (e) {
            if (e.target === modal) goToProfile();
        }, { once: true });
    }
})();