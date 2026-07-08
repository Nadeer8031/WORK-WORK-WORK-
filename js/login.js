(function () {
  // mobile menu toggle (basic)
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const icon = document.getElementById("mobile-menu-icon");
  const spacer = document.getElementById("mobile-menu-spacer");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      const expanded =
        this.getAttribute("aria-expanded") === "true" ? false : true;
      this.setAttribute("aria-expanded", expanded);
      mobileMenu.classList.toggle("hidden");
      if (spacer) {
        if (expanded) {
          spacer.style.height = mobileMenu.scrollHeight + "px";
        } else {
          spacer.style.height = "0px";
        }
      }
      icon.textContent = expanded ? "close" : "menu";
    });
  }

  // password toggle
  const toggleBtn = document.getElementById("togglePasswordBtn");
  const passwordInput = document.getElementById("password");
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", function () {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      const iconSpan = this.querySelector(".material-symbols-outlined");
      if (iconSpan) {
        iconSpan.textContent =
          type === "password" ? "visibility" : "visibility_off";
      }
    });
  }

  // Login link validation
  const loginLink = document.getElementById("loginLink");
  if (loginLink) {
    loginLink.addEventListener("click", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const pass = document.getElementById("password").value.trim();
      const emailErr = document.getElementById("email_error");
      const passErr = document.getElementById("pass_error");
      let valid = true;

      // Email validation
      if (!email) {
        emailErr.textContent = "Email is required.";
        valid = false;
      } else if (!email.includes("@") || !email.includes(".")) {
        emailErr.textContent = "Please enter a valid email address.";
        valid = false;
      } else {
        emailErr.textContent = "";
      }

      // Password validation
      if (!pass) {
        passErr.textContent = "Password is required.";
        valid = false;
      } else if (pass.length < 8) {
        passErr.textContent = "Password must be at least 8 characters.";
        valid = false;
      } else if (pass.length > 16) {
        passErr.textContent = "Password must not exceed 16 characters.";
        valid = false;
      } else if (!/[A-Z]/.test(pass)) {
        passErr.textContent =
          "Password must contain at least one uppercase letter.";
        valid = false;
      } else if (!/[0-9]/.test(pass)) {
        passErr.textContent = "Password must contain at least one number.";
        valid = false;
      } else {
        passErr.textContent = "";
      }

      if (!valid) return;

      var originalText = loginLink.textContent;
      loginLink.textContent = "Signing in...";
      loginLink.setAttribute("aria-busy", "true");

      var formData = new FormData();
      formData.append("email", email);
      formData.append("password", pass);

      fetch("auth/login.php", { method: "POST", body: formData })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (data.success) {
            if (window.AuraAuth) {
              window.AuraAuth.login({
                name: data.user.email.split("@")[0],
                email: data.user.email,
              });
            }
            window.location.href = "home.html";
          } else {
            passErr.textContent = data.message || "Invalid email or password.";
            loginLink.textContent = originalText;
            loginLink.removeAttribute("aria-busy");
          }
        })
        .catch(function () {
          passErr.textContent = "Something went wrong. Please try again.";
          loginLink.textContent = originalText;
          loginLink.removeAttribute("aria-busy");
        });
    });
  }
})();
