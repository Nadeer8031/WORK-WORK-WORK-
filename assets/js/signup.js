        // Simple input highlight
        // (icon color swap on focus is handled entirely by CSS via #id:focus rules)
        document.querySelectorAll('.form-group input').forEach(input => {
            const group = input.closest('.form-group');
            const label = group ? group.querySelector('label') : null;
            if (!label) return;
            input.addEventListener('focus', () => {
                label.classList.add('label-focused');
            });
            input.addEventListener('blur', () => { 
                label.classList.remove('label-focused');
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
    var phone = document.getElementById("phone").value.trim();
    var gender = document.querySelector('input[name="gender"]:checked');
    var email = document.getElementById("email").value.trim();
    var pass = document.getElementById("pass").value;
    var confirmPass = document.getElementById("confirm_password").value;
    var terms = document.getElementById("terms");

    var username_error = document.getElementById("username_error");
    var phone_error = document.getElementById("phone_error");
    var gender_error = document.getElementById("gender_error");
    var email_error = document.getElementById("email_error");
    var pass_error = document.getElementById("pass_error");
    var confirm_password_error = document.getElementById("confirm_password_error");
    var terms_error = document.getElementById("terms_error");

    username_error.textContent = "";
    phone_error.textContent = "";
    gender_error.textContent = "";
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

    if (phone === "") {
      phone_error.textContent = "Phone number cannot be empty";
      valid = false;
    } else if (!/^[0-9()+\-\s]{8,20}$/.test(phone)) {
      phone_error.textContent = "Enter a valid phone number";
      valid = false;
    }

    if (!gender) {
      gender_error.textContent = "Please select a gender";
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
    } else if (/\s/.test(pass)) {
      pass_error.textContent = "Password cannot contain spaces";
      valid = false;
    } else if (pass.length < 8) {
      pass_error.textContent = "Password must be at least 8 characters";
      valid = false;
    } else if (pass.length > 16) {
      pass_error.textContent = "Password must be less than 16 characters";
      valid = false;
    } else if (!/[A-Z]/.test(pass)) {
      pass_error.textContent =
        "Password must contain at least one uppercase letter";
      valid = false;
    } else if (!/[0-9]/.test(pass)) {
      pass_error.textContent = "Password must contain at least one number";
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
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn ? submitBtn.textContent : "Sign up";

    if (!validateForm()) {
      e.preventDefault();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Creating account...";
    }

    // var formData = new FormData();
    // formData.append("email", email);
    // formData.append("password", password);

    // fetch("auth/register.php", { method: "POST", body: formData })
    //   .then(function (res) {
    //     return res.json();
    //   })
    //   .then(function (data) {
    //     if (data.success) {
    //       if (window.AuraAuth) {
    //         window.AuraAuth.login({
    //           name: data.user.email.split("@")[0],
    //           email: data.user.email,
    //         });
    //       }
    //       window.location.href = "home.html";
    //     } else {
    //       email_error.textContent = data.message || "Could not create your account.";
    //       if (submitBtn) {
    //         submitBtn.disabled = false;
    //         submitBtn.textContent = originalText;
    //       }
    //     }
    //   })
    //   .catch(function () {
    //     email_error.textContent = "Something went wrong. Please try again.";
    //     if (submitBtn) {
    //       submitBtn.disabled = false;
    //       submitBtn.textContent = originalText;
    //     }
    //   });
  });
})();
