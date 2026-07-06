document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password");
  const visibilityBtn = passwordInput.nextElementSibling;

  visibilityBtn.addEventListener("click", () => {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    visibilityBtn.querySelector(".material-symbols-outlined").textContent =
      type === "password" ? "visibility" : "visibility_off";
  });

  // Smooth subtle movement on mouse move for the background effect
  const background = document.querySelector(".absolute.inset-0.z-0");
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) * 20;
    const y = (e.clientY / window.innerHeight) * 20;
    background.style.transform = `translate(${x}px, ${y}px)`;
  });
});

(function () {
  var btn = document.getElementById("mobile-menu-btn");
  var menu = document.getElementById("mobile-menu");
  var icon = document.getElementById("mobile-menu-icon");
  var spacer = document.getElementById("mobile-menu-spacer");
  if (!btn || !menu) return;
  function openMenu() {
    menu.classList.remove("hidden");
    menu.classList.add("flex");
    btn.setAttribute("aria-expanded", "true");
    if (icon) icon.textContent = "close";
    if (spacer) spacer.style.height = menu.scrollHeight + "px";
  }
  function closeMenu() {
    menu.classList.add("hidden");
    menu.classList.remove("flex");
    btn.setAttribute("aria-expanded", "false");
    if (icon) icon.textContent = "menu";
    if (spacer) spacer.style.height = "0px";
  }
  btn.addEventListener("click", function () {
    var isHidden = menu.classList.contains("hidden");
    if (isHidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });
  window.addEventListener("resize", function () {
    if (spacer && !menu.classList.contains("hidden")) {
      spacer.style.height = menu.scrollHeight + "px";
    }
  });
})();

(function () {
  var form = document.getElementById("loginForm");
  if (!form) return;

  function validateForm() {
    var email = document.getElementById("email").value.trim();
    var pass = document.getElementById("password").value;
    var email_error = document.getElementById("email_error");
    var pass_error = document.getElementById("pass_error");

    email_error.textContent = "";
    pass_error.textContent = "";

    var valid = true;
    var atIndex = email.indexOf("@");
    var dotIndex = email.lastIndexOf(".com");

    // Email validation
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

    // Password validation
    if (pass === "") {
      pass_error.textContent = "Please enter your password";
      valid = false;
    } else if (/\s/.test(pass)) {
      pass_error.textContent = "Password cannot contain spaces";
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
    // action/method set on #loginForm, so your PHP backend receives it.
  });
})();