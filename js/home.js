      // Simple intersection observer for reveal effects
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("opacity-100", "translate-y-0");
              entry.target.classList.remove("opacity-0", "translate-y-8");
            }
          });
        },
        { threshold: 0.1 },
      );

      document.querySelectorAll("section").forEach((section) => {
        section.classList.add(
          "transition-all",
          "duration-1000",
          "opacity-0",
          "translate-y-8",
        );
        observer.observe(section);
      });

      // Form submission micro-interaction
      document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        const btn = e.target.querySelector("button");
        const originalContent = btn.innerHTML;
        btn.innerHTML = "Sending...";
        btn.classList.add("opacity-70", "pointer-events-none");

        setTimeout(() => {
          btn.innerHTML = "Inquiry Received";
          btn.classList.remove("bg-primary");
          btn.classList.add("bg-green-800");
          setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.classList.remove(
              "bg-green-800",
              "opacity-70",
              "pointer-events-none",
            );
            btn.classList.add("bg-primary");
          }, 3000);
        }, 1500);
      });
    

(function () {
    var btn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    var icon = document.getElementById('mobile-menu-icon');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
        var isHidden = menu.classList.contains('hidden');
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
        btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        if (icon) icon.textContent = isHidden ? 'close' : 'menu';
    });
})();
