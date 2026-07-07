/* AuraAuth: tiny shared session store backed by localStorage.
   Include this file on every page that needs to know if someone is
   logged in (profile.html, and eventually login.html / signup.html)
   BEFORE the page's own script.

   BACKEND HOOK: once a real auth backend exists, replace the body of
   login()/logout()/getSession() with real API calls (e.g. fetch a
   session cookie or JWT instead of localStorage), keeping the same
   function names so the pages that call AuraAuth don't need to change.
*/
(function (global) {
  var SESSION_KEY = "auramed_session";

  function getSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveSession(session) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      /* storage unavailable, fail silently */
    }
    try {
      global.dispatchEvent(new CustomEvent("auraauth:change", { detail: session }));
    } catch (e) {}
    return session;
  }

  // user: { name, email, phone, location, tier }
  function login(user) {
    var session = Object.assign(
      {
        name: "Member",
        email: "",
        phone: "",
        location: "",
        tier: "Member",
      },
      user || {}
    );
    return saveSession(session);
  }

  function updateSession(patch) {
    var session = getSession() || {};
    session = Object.assign({}, session, patch);
    return saveSession(session);
  }

  function logout() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
    try {
      global.dispatchEvent(new CustomEvent("auraauth:change", { detail: null }));
    } catch (e) {}
  }

  function isLoggedIn() {
    return !!getSession();
  }

  global.AuraAuth = {
    getSession: getSession,
    login: login,
    updateSession: updateSession,
    logout: logout,
    isLoggedIn: isLoggedIn,
    SESSION_KEY: SESSION_KEY,
  };
})(window);
