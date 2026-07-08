      // Add a product/bundle straight from the pricing tiers into the
      // shared cart, then take the shopper to the cart to confirm it.
      function addProductToCart(item) {
        if (!window.AuraCart) return;
        window.AuraCart.addToCart({
          id: item.id,
          name: item.name,
          subtitle: item.subtitle || "",
          price: item.price,
          image: item.image || "",
          qty: 1,
        });
        window.location.href = "cart.html";
      }

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
