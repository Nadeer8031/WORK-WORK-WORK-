/* AuraNav: keeps the shared header nav (and a couple of protected pages)
   in sync with the AuraAuth session.

   Include this AFTER js/auth-store.js and BEFORE the page's own script,
   on every page that uses the standard site header:
   home, products, schedule, profile, cart, checkout, product pages,
   login, signup.

   - Hides the "Schedule" and "Profile" nav links (desktop + mobile) when
     no one is logged in, and shows them once a session exists.
   - Swaps the "Log In" / "Sign Up" buttons for a "Log Out" button when
     logged in.
   - Pages that must never be shown to a logged-out visitor (schedule.html
     and profile.html) redirect straight to login.html if visited
     directly without a session. login.html is the single, shared login
     screen for the whole site — no page keeps its own inline login form.
*/
(function () {
  var GUARDED_PAGES = ["schedule.html", "profile.html"];

  function currentPage() {
    var path = window.location.pathname;
    var file = path.substring(path.lastIndexOf("/") + 1);
    return file || "home.html";
  }

  function isLoggedIn() {
    return !!(window.AuraAuth && window.AuraAuth.isLoggedIn());
  }

  function enforcePageGuard() {
    if (GUARDED_PAGES.indexOf(currentPage()) !== -1 && !isLoggedIn()) {
      window.location.replace("login.html");
    }
  }

  function toggle(el, show) {
    if (!el) return;
    el.classList.toggle("hidden", !show);
  }

  function buildLogoutLink(templateLink) {
    var logout = document.createElement("a");
    logout.href = "#";
    logout.className = templateLink.className;
    logout.textContent = "Log Out";
    logout.addEventListener("click", function (e) {
      e.preventDefault();
      fetch("auth/logout.php").catch(function () {});
      if (window.AuraAuth) window.AuraAuth.logout();
      window.location.href = "login.html";
    });
    return logout;
  }

  function syncNav() {
    var loggedIn = isLoggedIn();

    // Show/hide the protected nav links wherever they appear.
    document
      .querySelectorAll('a[href="schedule.html"], a[href="profile.html"]')
      .forEach(function (link) {
        toggle(link, loggedIn);
      });

    // Swap Log In / Sign Up for a Log Out button.
    if (loggedIn) {
      document.querySelectorAll('a[href="login.html"]').forEach(function (loginLink) {
        var container = loginLink.parentElement;
        var signupLink = container
          ? container.querySelector('a[href="signup.html"]')
          : null;
        var logoutLink = buildLogoutLink(loginLink);
        loginLink.replaceWith(logoutLink);
        if (signupLink) toggle(signupLink, false);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    enforcePageGuard();
    syncNav();
  });

  window.addEventListener("auraauth:change", syncNav);
})();
