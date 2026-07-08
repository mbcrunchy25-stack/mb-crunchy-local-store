/*!
 * MB Crunchy Commerce v2
 * File: assets/js/app.js
 * Shared Frontend Utilities
 */

const App = (() => {

  const STORAGE_KEY = "cart";
  const API_BASE = window.API_BASE || "YOUR_APPS_SCRIPT_WEB_APP_URL?action=";

  function apiUrl(action, params = {}) {
    const url = new URL(API_BASE, window.location.href);
    url.searchParams.set("action", action);
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== null && params[k] !== "") {
        url.searchParams.set(k, params[k]);
      }
    });
    return url.toString();
  }

  function getCart() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
  }

  function addToCart(productId, qty = 1) {
    const cart = getCart();
    const item = cart.find(x => x.productId === productId);

    if (item) {
      item.qty += qty;
    } else {
      cart.push({ productId, qty });
    }

    saveCart(cart);
    toast("Added to cart");
  }

  function removeFromCart(productId) {
    saveCart(getCart().filter(x => x.productId !== productId));
    toast("Removed from cart");
  }

  function updateQty(productId, qty) {
    const cart = getCart();
    const item = cart.find(x => x.productId === productId);
    if (!item) return;

    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    item.qty = qty;
    saveCart(cart);
  }

  function clearCart() {
    localStorage.removeItem(STORAGE_KEY);
    updateCartBadge();
  }

  function cartCount() {
    return getCart().reduce((t, i) => t + i.qty, 0);
  }

  function updateCartBadge() {
    const badge = document.getElementById("cartCount");
    if (badge) badge.textContent = cartCount();
  }

  async function get(action, params = {}) {
    const res = await fetch(apiUrl(action, params));
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  }

  async function post(payload) {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  }

  function toast(message, timeout = 2500) {
    let box = document.getElementById("toast");

    if (!box) {
      box = document.createElement("div");
      box.id = "toast";
      box.style.cssText =
        "position:fixed;bottom:20px;right:20px;background:#222;color:#fff;padding:12px 18px;border-radius:8px;z-index:99999;box-shadow:0 4px 12px rgba(0,0,0,.25)";
      document.body.appendChild(box);
    }

    box.textContent = message;
    box.style.display = "block";

    clearTimeout(box._timer);
    box._timer = setTimeout(() => {
      box.style.display = "none";
    }, timeout);
  }

  function showLoader() {
    let loader = document.getElementById("loader");
    if (!loader) {
      loader = document.createElement("div");
      loader.id = "loader";
      loader.style.cssText =
        "position:fixed;inset:0;background:rgba(255,255,255,.75);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:bold;z-index:99998";
      loader.innerHTML = "Loading...";
      document.body.appendChild(loader);
    }
    loader.style.display = "flex";
  }

  function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
  }

  document.addEventListener("DOMContentLoaded", updateCartBadge);

  return {
    API_BASE,
    get,
    post,
    getCart,
    saveCart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    cartCount,
    updateCartBadge,
    toast,
    showLoader,
    hideLoader
  };

})();
