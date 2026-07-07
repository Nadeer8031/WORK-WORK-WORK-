        // ---- Profile page state, driven by the shared AuraAuth store ----

        var DEFAULT_TIER = 'Member';

        function renderProfile() {
            var session = window.AuraAuth ? window.AuraAuth.getSession() : null;
            var loggedOut = document.getElementById('profile-logged-out');
            var authed = document.getElementById('profile-authenticated');

            if (!session) {
                loggedOut.classList.remove('hidden');
                authed.classList.add('hidden');
                return;
            }

            loggedOut.classList.add('hidden');
            authed.classList.remove('hidden');

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

        // ---- Mini inline login form (logged-out state) ----
        // Validation rules are kept identical to login.html/login.js so the
        // two forms behave the same way.
        // BACKEND HOOK: once real auth exists, keep validateForm() as the
        // client-side check, but replace the AuraAuth.login(...) call below
        // with a real API request; on success, call AuraAuth.login() with
        // the fields the server returns.
        (function () {
            var passwordInput = document.getElementById('profile-login-password');
            var visibilityBtn = document.getElementById('profile-login-password-toggle');
            if (passwordInput && visibilityBtn) {
                visibilityBtn.addEventListener('click', function () {
                    var type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                    passwordInput.setAttribute('type', type);
                    visibilityBtn.querySelector('.material-symbols-outlined').textContent =
                        type === 'password' ? 'visibility' : 'visibility_off';
                });
            }

            var form = document.getElementById('profile-login-form');
            if (!form) return;

            function validateForm() {
                var email = document.getElementById('profile-login-email').value.trim();
                var pass = document.getElementById('profile-login-password').value;
                var email_error = document.getElementById('profile_email_error');
                var pass_error = document.getElementById('profile_pass_error');

                email_error.textContent = '';
                pass_error.textContent = '';

                var valid = true;
                var atIndex = email.indexOf('@');
                var dotIndex = email.lastIndexOf('.com');

                // Email validation
                if (email === '') {
                    email_error.textContent = 'Email Address cannot be empty';
                    valid = false;
                } else if (
                    atIndex === -1 ||
                    atIndex === 0 ||
                    dotIndex <= atIndex + 1 ||
                    !email.endsWith('.com') ||
                    email.length > dotIndex + 4
                ) {
                    if (!email.endsWith('.com')) {
                        email_error.textContent = 'Email must end with .com';
                    } else if (email.length > dotIndex + 4) {
                        email_error.textContent = 'Nothing should come after .com';
                    } else if (atIndex === -1) {
                        email_error.textContent = 'Email must contain @';
                    } else if (atIndex === 0) {
                        email_error.textContent = 'Email must not start with @';
                    } else if (dotIndex <= atIndex + 1) {
                        email_error.textContent = 'Email must contain a domain (ex: @gmail)';
                    } else {
                        email_error.textContent = 'Invalid Email Address';
                    }
                    valid = false;
                }

                // Password validation
                if (pass === '') {
                    pass_error.textContent = 'Please enter your password';
                    valid = false;
                } else if (/\s/.test(pass)) {
                    pass_error.textContent = 'Password cannot contain spaces';
                    valid = false;
                } else if (pass.length < 8) {
                    pass_error.textContent = 'Password must be at least 8 characters';
                    valid = false;
                } else if (pass.length > 16) {
                    pass_error.textContent = 'Password must be less than 16 characters';
                    valid = false;
                } else if (!/[A-Z]/.test(pass)) {
                    pass_error.textContent = 'Password must contain at least one uppercase letter';
                    valid = false;
                } else if (!/[0-9]/.test(pass)) {
                    pass_error.textContent = 'Password must contain at least one number';
                    valid = false;
                }

                return valid;
            }

            form.addEventListener('submit', function (e) {
                e.preventDefault();
                if (!validateForm()) return;

                var email = document.getElementById('profile-login-email').value.trim();
                if (!window.AuraAuth) return;
                window.AuraAuth.login({
                    name: email.split('@')[0],
                    email: email,
                    phone: '',
                    location: '',
                    tier: DEFAULT_TIER,
                });
                renderProfile();
            });
        })();

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
                renderProfile();
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
