        // Password visibility toggle logic (optional enhancement)
        document.querySelectorAll('input[type="password"]').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.querySelector('.material-symbols-outlined').style.color = '#350e1b';
            });
            input.addEventListener('blur', () => {
                input.parentElement.querySelector('.material-symbols-outlined').style.color = '#837376';
            });
        });

        // Simple input highlight
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', () => {
                const label = input.parentElement.parentElement.querySelector('label');
                if (label) label.classList.replace('text-outline', 'text-primary');
            });
            input.addEventListener('blur', () => {
                const label = input.parentElement.parentElement.querySelector('label');
                if (label) label.classList.replace('text-primary', 'text-outline');
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

(function () {
  var form = document.getElementById("signupForm");
  if (!form) return;

  function validateForm() {
    var username = document.getElementById("username").value.trim();
    var email = document.getElementById("email").value.trim();
    var pass = document.getElementById("password").value;
    var confirmPass = document.getElementById("confirm-password").value;
    var terms = document.getElementById("terms");

    var username_error = document.getElementById("username_error");
    var email_error = document.getElementById("email_error");
    var pass_error = document.getElementById("pass_error");
    var confirm_password_error = document.getElementById("confirm_password_error");
    var terms_error = document.getElementById("terms_error");

    username_error.textContent = "";
    email_error.textContent = "";
    pass_error.textContent = "";
    confirm_password_error.textContent = "";
    terms_error.textContent = "";

    var valid = true;
    var atIndex = email.indexOf("@");
    var dotIndex = email.lastIndexOf(".com");

    if (username === "") {
      username_error.textContent = "Username cannot be empty";
      valid = false;
    }

    if (email === "") {
      email_error.textContent = "Email Address cannot be empty";
      valid = false;
    } else if (
      atIndex === -1 ||
      atIndex === 0 ||
      dotIndex <= atIndex + 1 ||
      !email.endsWith(".com") ||
      email.length > dotIndex + 4
    ) {
      if (!email.endsWith(".com")) {
        email_error.textContent = "Email must end with .com";
      } else if (email.length > dotIndex + 4) {
        email_error.textContent = "Nothing should come after .com";
      } else if (atIndex === -1) {
        email_error.textContent = "Email must contain @";
      } else if (atIndex === 0) {
        email_error.textContent = "Email must not start with @";
      } else if (dotIndex <= atIndex + 1) {
        email_error.textContent = "Email must contain a domain (ex: @gmail)";
      } else {
        email_error.textContent = "Invalid Email Address";
      }
      valid = false;
    }

    if (pass === "") {
      pass_error.textContent = "Password cannot be empty";
      valid = false;
    } else if (pass.length < 8) {
      pass_error.textContent = "Password must be at least 8 characters";
      valid = false;
    } else if (pass.length > 20) {
      pass_error.textContent = "Password must be less than 20 characters";
      valid = false;
    } else if (!/[A-Z]/.test(pass)) {
      pass_error.textContent =
        "Password must contain at least one uppercase letter";
      valid = false;
    } else if (!/[a-z]/.test(pass)) {
      pass_error.textContent =
        "Password must contain at least one lowercase letter";
      valid = false;
    } else if (!/[0-9]/.test(pass)) {
      pass_error.textContent = "Password must contain at least one number";
      valid = false;
    } else if (!/[!@#$%^&*]/.test(pass)) {
      pass_error.textContent =
        "Password must contain at least one special character (!@#$%^&*)";
      valid = false;
    } else if (/\s/.test(pass)) {
      pass_error.textContent = "Password cannot contain spaces";
      valid = false;
    }

    if (confirmPass === "") {
      confirm_password_error.textContent = "Confirm Password cannot be empty";
      valid = false;
    } else if (confirmPass !== pass) {
      confirm_password_error.textContent = "Passwords do not match";
      valid = false;
    }

    if (!terms.checked) {
      terms_error.textContent = "You must agree to the Terms and Conditions";
      valid = false;
    }

    return valid;
  }

  form.addEventListener("submit", function (e) {
    var isValid = validateForm();
    if (!isValid) {
      e.preventDefault();
    }
    // If valid, the browser submits the form normally to the
    // action/method set on #signupForm, so your PHP backend receives it.
  });
})();
