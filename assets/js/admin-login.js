  (function() {
    "use strict";

    // ---- 1. PASSWORD TOGGLE (clean) ----
    const toggleBtn = document.getElementById('togglePasswordBtn');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (toggleBtn && passwordInput && eyeIcon) {
      toggleBtn.addEventListener('click', function() {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        // update eye icon (open/closed)
        if (isPassword) {
          eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>
          `;
        } else {
          eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          `;
        }
      });
    }

    // ---- 2. LOGIN HANDLER (no unused menu/spacer) ----
    const loginBtn = document.getElementById('loginBtn');
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('password');
    const emailErr = document.getElementById('email_error');
    const passErr = document.getElementById('pass_error');

    if (loginBtn) {
      loginBtn.addEventListener('click', function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const pass = passInput.value.trim();
        let valid = true;

        // reset errors
        emailErr.textContent = '';
        passErr.textContent = '';

        // Email validation
        if (!email) {
          emailErr.textContent = 'Email is required.';
          valid = false;
        } else if (!email.includes('@') || !email.includes('.')) {
          emailErr.textContent = 'Please enter a valid email address.';
          valid = false;
        }

        // Password validation
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

        // ---- simulate fetch (no actual backend) ----
        const originalText = loginBtn.querySelector('span').textContent;
        loginBtn.querySelector('span').textContent = 'Signing in…';
        loginBtn.setAttribute('aria-busy', 'true');

        // Simulate async request (replace with real fetch if needed)
        setTimeout(function() {
          // Demo: accept any valid credential (for showcase)
          // In real scenario you would call auth/login.php
          // but we keep it self-contained: mock success after 1.2s
          const mockSuccess = true; // always success for demo
          if (mockSuccess) {
            // mimic AuraAuth if present
            if (window.AuraAuth && typeof window.AuraAuth.login === 'function') {
              window.AuraAuth.login({
                name: email.split('@')[0],
                email: email,
              });
            }
            // redirect to home.html (simulated)
            window.location.href = 'home.html';
          } else {
            passErr.textContent = 'Invalid email or password.';
            loginBtn.querySelector('span').textContent = originalText;
            loginBtn.removeAttribute('aria-busy');
          }
        }, 1200);

        // NOTE: the original code used "loginLink" (id) but we use "loginBtn" (button)
        // we also removed the unused mobile menu and spacer logic.
      });
    }

    // ---- 3. (optional) prevent default form submission ----
    const form = document.getElementById('loginForm');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault(); // handled by button click
      });
    }

  })();
