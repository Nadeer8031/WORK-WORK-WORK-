var DEFAULT_TIER = 'Member';

function renderProfile() {
    fetch("auth/get_profile.php")
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (!data.success) {
                window.location.href = "login.html";
                return;
            }

            var user = data.user;
            setText("profile-full-name", user.username);
            setText("profile-greeting-name", firstName(user.username));
            setText("profile-email", user.user_email);
            setText("profile-phone", user.phone || '\u2014');
            setText("profile-gender", user.gender ? (user.gender.charAt(0).toUpperCase() + user.gender.slice(1)) : '\u2014');

            // Gender-based profile picture
            var malePic = document.getElementById('malePic');
            var femalePic = document.getElementById('femalePic');
            if (malePic && femalePic) {
                if (user.gender && user.gender.toLowerCase() === 'male') {
                    malePic.classList.remove('hidden');
                    femalePic.classList.add('hidden');
                } else if (user.gender && user.gender.toLowerCase() === 'female') {
                    femalePic.classList.remove('hidden');
                    malePic.classList.add('hidden');
                } else {
                //     malePic.classList.remove('hidden');
                //     femalePic.classList.add('hidden');
                }
            }

            // Load orders
            loadOrders();
        });
}

function loadOrders() {
    fetch("auth/orders.php")
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (!data.success) return;

            var ordersList = document.getElementById('order-history-list');
            var emptyState = document.getElementById('order-history-empty');
            var viewAllBtn = document.getElementById('order-history-view-all');

            if (!ordersList) return;

            if (!data.orders || data.orders.length === 0) {
                if (emptyState) emptyState.style.display = '';
                if (viewAllBtn) viewAllBtn.classList.add('hidden');
                return;
            }

            if (emptyState) emptyState.style.display = 'none';
            if (viewAllBtn) viewAllBtn.classList.remove('hidden');

            var html = '';
            data.orders.forEach(function(order) {
                var date = new Date(order.created_at);
                var dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                var itemNames = '';
                if (order.items && Array.isArray(order.items)) {
                    itemNames = order.items.map(function(i) { return i.product_name + ' x' + i.quantity; }).join(', ');
                }
                var orderCode = 'ORD-' + order.order_id;

                html += '<div class="order-row flex items-center justify-between px-8 py-5 hover:bg-surface-container-low transition-all cursor-pointer">' +
                    '<div class="flex flex-col gap-1">' +
                        '<span class="font-headline-md text-[16px] text-primary">' + escapeHtml(orderCode) + '</span>' +
                        '<span class="font-label-sm text-label-sm text-on-surface-variant">' + escapeHtml(itemNames) + '</span>' +
                    '</div>' +
                    '<div class="text-right">' +
                        '<p class="font-body-md font-semibold text-primary">$' + parseFloat(order.total).toFixed(2) + '</p>' +
                        '<p class="font-label-sm text-label-sm text-primary-container">Completed &middot; ' + dateStr + '</p>' +
                    '</div>' +
                '</div>';
            });

            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            while (tempDiv.firstChild) {
                ordersList.insertBefore(tempDiv.firstChild, emptyState);
            }
        });
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text || ''));
    return div.innerHTML;
}

function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value || '\u2014';
}

function firstName(name) {
    if (!name) return 'there';
    return name.split(' ')[0];
}

// ---- Edit Profile ----
(function() {
    var editBtn = document.getElementById('edit-profile-btn');
    if (!editBtn) return;
    var editableFields = ['profile-full-name', 'profile-email', 'profile-phone', 'profile-gender'];
    var editing = false;

    editBtn.addEventListener('click', function() {
        if (!editing) {
            editableFields.forEach(function(id) {
                var display = document.getElementById(id);
                var input = document.getElementById(id + '-input');
                if (!display || !input) return;
                input.value = display.textContent.trim();
                display.classList.add('hidden');
                input.classList.remove('hidden');
            });
            editBtn.textContent = 'Save Changes';
            editing = true;
        } else {
            var patch = {};
            editableFields.forEach(function(id) {
                var display = document.getElementById(id);
                var input = document.getElementById(id + '-input');
                if (!display || !input) return;
                var value = input.value.trim();
                display.textContent = value;
                display.classList.remove('hidden');
                input.classList.add('hidden');
                if (id === 'profile-full-name') patch.name = value;
                if (id === 'profile-email') patch.email = value;
                if (id === 'profile-phone') patch.phone = value;
                if (id === 'profile-gender') patch.gender = value;
            });

            var formData = new FormData();
            formData.append("username", patch.name);
            formData.append("email", patch.email);
            formData.append("phone", patch.phone);
            formData.append("gender", patch.gender);

            fetch("auth/update_profile.php", {
                method: "POST",
                body: formData
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (!data.success && data.message) {
                    alert(data.message);
                }
                renderProfile();
            });

            editBtn.textContent = 'Edit Profile';
            editing = false;
        }
    });
})();

// ---- Logout ----
(function() {
    var logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;
    logoutBtn.addEventListener('click', function() {
        // Clear the client-side session flag too, otherwise nav-auth.js on
        // the next page still thinks someone is logged in (stale localStorage).
        if (window.AuraAuth) window.AuraAuth.logout();
        window.location.href = 'auth/logout.php';
    });
})();

document.addEventListener('DOMContentLoaded', renderProfile);

// Micro-interaction for order rows
document.querySelectorAll('.order-row').forEach(function(row) {
    row.addEventListener('mouseenter', function() {
        row.style.transform = 'translateX(8px)';
    });
    row.addEventListener('mouseleave', function() {
        row.style.transform = 'translateX(0)';
    });
});

// Atmospheric parallax effect on background
window.addEventListener('mousemove', function(e) {
    var moveX = (e.clientX - window.innerWidth / 2) / 100;
    var moveY = (e.clientY - window.innerHeight / 2) / 100;
    document.body.style.backgroundPosition = moveX + 'px ' + moveY + 'px';
});

(function() {
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
    btn.addEventListener('click', function() {
        var isHidden = menu.classList.contains('hidden');
        if (isHidden) { openMenu(); } else { closeMenu(); }
    });
    window.addEventListener('resize', function() {
        if (spacer && !menu.classList.contains('hidden')) {
            spacer.style.height = menu.scrollHeight + 'px';
        }
    });
})();
