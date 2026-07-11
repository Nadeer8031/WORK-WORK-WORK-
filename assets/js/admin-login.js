(function () {
    "use strict";

    // ---- PASSWORD TOGGLE ----
    var toggleBtn = document.getElementById('togglePasswordBtn');
    var passwordInput = document.getElementById('password');
    var eyeIcon = document.getElementById('eyeIcon');

    if (toggleBtn && passwordInput && eyeIcon) {
        toggleBtn.addEventListener('click', function () {
            var isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            if (isPassword) {
                eyeIcon.innerHTML =
                    '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
            } else {
                eyeIcon.innerHTML =
                    '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"></path><circle cx="12" cy="12" r="3"></circle>';
            }
        });
    }

    // ---- LOGIN HANDLER ----
    var loginBtn = document.getElementById('loginBtn');
    var emailInput = document.getElementById('email');
    var passInput = document.getElementById('password');
    var emailErr = document.getElementById('email_error');
    var passErr = document.getElementById('pass_error');

    if (loginBtn) {
        loginBtn.addEventListener('click', function (e) {
            e.preventDefault();

            var email = emailInput.value.trim();
            var pass = passInput.value.trim();
            var valid = true;

            emailErr.textContent = '';
            passErr.textContent = '';

            if (!email) {
                emailErr.textContent = 'Email is required.';
                valid = false;
            } else if (!email.includes('@') || !email.includes('.')) {
                emailErr.textContent = 'Please enter a valid email address.';
                valid = false;
            }

            if (!pass) {
                passErr.textContent = 'Password is required.';
                valid = false;
            } else if (pass.length < 8) {
                passErr.textContent = 'Password must be at least 8 characters.';
                valid = false;
            } else if (pass.length > 16) {
                passErr.textContent = 'Password must not exceed 16 characters.';
                valid = false;
            } else if (!/[A-Z]/.test(pass)) {
                passErr.textContent = 'Password must contain at least one uppercase letter.';
                valid = false;
            } else if (!/[0-9]/.test(pass)) {
                passErr.textContent = 'Password must contain at least one number.';
                valid = false;
            }

            if (!valid) return;

            var originalText = loginBtn.querySelector('span').textContent;
            loginBtn.querySelector('span').textContent = 'Signing in\u2026';
            loginBtn.setAttribute('aria-busy', 'true');

            var formData = new FormData();
            formData.append('email', email);
            formData.append('password', pass);

            fetch('auth/admin_login.php', { method: 'POST', body: formData })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    if (data.success) {
                        window.location.href = 'dashboard.html';
                    } else {
                        passErr.textContent = data.message || 'Invalid admin credentials.';
                        loginBtn.querySelector('span').textContent = originalText;
                        loginBtn.removeAttribute('aria-busy');
                    }
                })
                .catch(function () {
                    passErr.textContent = 'Something went wrong. Please try again.';
                    loginBtn.querySelector('span').textContent = originalText;
                    loginBtn.removeAttribute('aria-busy');
                });
        });
    }

    // Prevent default form submission
    var form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
        });
    }
})();
