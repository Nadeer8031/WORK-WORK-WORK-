        // ---- Profile page state, driven by the shared AuraAuth store ----

        var DEFAULT_TIER = 'Member';

        function renderProfile() {
            var session = window.AuraAuth ? window.AuraAuth.getSession() : null;

            // Safety net: nav-auth.js already redirects logged-out visitors
            // to login.html before this runs, but bail out cleanly if this
            // ever executes without a session.
            if (!session) {
                window.location.replace('login.html');
                return;
            }

            setText('profile-greeting-name', firstName(session.name));
            setText('profile-full-name', session.name);
            setText('profile-tier', session.tier || DEFAULT_TIER);
            setText('profile-email', session.email);
            setText('profile-phone', session.phone || '—');
            setText('profile-location', session.location || '—');

            // Order history: BACKEND HOOK — once real orders exist, render
            // them into #order-history-list and hide #order-history-empty
            // and reveal #order-history-view-all. Left empty for now.
        }

        function setText(id, value) {
            var el = document.getElementById(id);
            if (el) el.textContent = value;
        }

        function firstName(name) {
            if (!name) return 'there';
            return name.split(' ')[0];
        }

        // ---- Edit Profile ----
        (function () {
            var editBtn = document.getElementById('edit-profile-btn');
            if (!editBtn) return;
            var editableFields = ['profile-full-name', 'profile-email', 'profile-phone', 'profile-location'];
            var editing = false;

            editBtn.addEventListener('click', function () {
                if (!editing) {
                    editableFields.forEach(function (id) {
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
                    editableFields.forEach(function (id) {
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
                        if (id === 'profile-location') patch.location = value;
                    });
                    if (window.AuraAuth) window.AuraAuth.updateSession(patch);
                    renderProfile();
                    editBtn.textContent = 'Edit Profile';
                    editing = false;
                }
            });
        })();

        // ---- Logout ----
        (function () {
            var logoutBtn = document.getElementById('logout-btn');
            if (!logoutBtn) return;
            logoutBtn.addEventListener('click', function () {
                if (window.AuraAuth) window.AuraAuth.logout();
                window.location.href = 'login.html';
            });
        })();

        document.addEventListener('DOMContentLoaded', renderProfile);

        // Micro-interaction for order rows (kept for when the backend adds
        // real rows into #order-history-list; a no-op while it's empty)
        document.querySelectorAll('.order-row').forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.transform = 'translateX(8px)';
            });
            row.addEventListener('mouseleave', () => {
                row.style.transform = 'translateX(0)';
            });
        });

        // Atmospheric parallax effect on background
        window.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) / 100;
            const moveY = (e.clientY - window.innerHeight / 2) / 100;
            document.body.style.backgroundPosition = `${moveX}px ${moveY}px`;
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
