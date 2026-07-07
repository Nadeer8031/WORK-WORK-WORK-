/* AuraCart: tiny shared cart store backed by localStorage.
   Include this file on every page BEFORE the page's own script
   (products.js, product-nexus.js, product-auracore.js, cart.js, checkout.js).
*/
(function (global) {
  var CART_KEY = "auramed_cart";
  var TAX_RATE = 0.08; // 8% estimated tax

  function getCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      /* storage unavailable, fail silently */
    }
    // Let other listeners (e.g. a cart icon badge) know the cart changed.
    try {
      global.dispatchEvent(new CustomEvent("auracart:change", { detail: cart }));
    } catch (e) {}
    return cart;
  }

  // item: { id, name, subtitle, price, image, qty }
  function addToCart(item) {
    var cart = getCart();
    var qtyToAdd = item.qty && item.qty > 0 ? item.qty : 1;
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === item.id) {
        existing = cart[i];
        break;
      }
    }
    if (existing) {
      existing.qty += qtyToAdd;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        subtitle: item.subtitle || "",
        price: item.price,
        image: item.image || "",
        qty: qtyToAdd,
      });
    }
    return saveCart(cart);
  }

  function updateQty(id, qty) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        cart[i].qty = Math.max(1, qty | 0);
      }
    }
    return saveCart(cart);
  }

  function removeFromCart(id) {
    var cart = getCart().filter(function (i) {
      return i.id !== id;
    });
    return saveCart(cart);
  }

  function clearCart() {
    return saveCart([]);
  }

  function getItemCount(cart) {
    cart = cart || getCart();
    return cart.reduce(function (sum, i) {
      return sum + i.qty;
    }, 0);
  }

  function getTotals(cart) {
    cart = cart || getCart();
    var subtotal = cart.reduce(function (sum, i) {
      return sum + i.price * i.qty;
    }, 0);
    var shipping = 0; // complimentary white-glove delivery
    var tax = subtotal * TAX_RATE;
    var total = subtotal + shipping + tax;
    return { subtotal: subtotal, shipping: shipping, tax: tax, total: total };
  }

  function formatUSD(n) {
    return (
      "$" +
      n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
  }

  global.AuraCart = {
    getCart: getCart,
    saveCart: saveCart,
    addToCart: addToCart,
    updateQty: updateQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    getItemCount: getItemCount,
    getTotals: getTotals,
    formatUSD: formatUSD,
  };
})(window);
