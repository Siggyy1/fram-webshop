// ---------- Drawer menu ----------
const drawer = document.getElementById("drawer");
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");

function openDrawer(){
  if (!drawer) return;
  drawer.classList.add("open");
  menuBtn?.setAttribute("aria-expanded", "true");
  closeBtn?.focus();
}

function closeDrawer(){
  if (!drawer) return;
  drawer.classList.remove("open");
  menuBtn?.setAttribute("aria-expanded", "false");
  menuBtn?.focus();
}

menuBtn?.addEventListener("click", openDrawer);
closeBtn?.addEventListener("click", closeDrawer);
drawer?.addEventListener("click", (e) => {
  if (e.target.tagName === "A") closeDrawer();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});



// ---------- Cart helpers ----------
const CART_KEY = "fram_cart_v1";

function getCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) ?? []; }
  catch { return []; }
}
function setCart(items){
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartCount();
  renderBasket(); // only updates content if modal exists
}
function addToCart(product){
  const cart = getCart();
  cart.push(product);
  setCart(cart);
}
function removeFromCart(index){
  const cart = getCart();
  cart.splice(index, 1);
  setCart(cart);
}
function clearCart(){
  setCart([]);
}

function updateCartCount(){
  const countEl = document.getElementById("cartCount");
  if (!countEl) return;
  countEl.textContent = String(getCart().length);
}

// ---------- Basket modal ----------
const basketBtn = document.getElementById("basketBtn");
const basketModal = document.getElementById("basketModal");
const basketCloseBtn = document.getElementById("basketCloseBtn");
const overlay = document.getElementById("overlay");

const basketList = document.getElementById("basketList");
const basketTotal = document.getElementById("basketTotal");
const clearCartBtn = document.getElementById("clearCartBtn");

let lastFocusedEl = null;

function openBasket(){
  if (!basketModal || !overlay) return;
  lastFocusedEl = document.activeElement;

  overlay.hidden = false;
  basketModal.hidden = false;

  renderBasket();
  basketCloseBtn?.focus();
}

function closeBasket(){
  if (!basketModal || !overlay) return;
  overlay.hidden = true;
  basketModal.hidden = true;

  if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
    lastFocusedEl.focus();
  }
}

basketBtn?.addEventListener("click", () => {
  // toggle
  if (basketModal && !basketModal.hidden) closeBasket();
  else openBasket();
});

basketCloseBtn?.addEventListener("click", closeBasket);
overlay?.addEventListener("click", closeBasket);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && basketModal && !basketModal.hidden) {
    closeBasket();
  }
});

clearCartBtn?.addEventListener("click", () => {
  clearCart();
});

// IMPORTANT: renderBasket must NOT unhide the modal
function renderBasket(){
  if (!basketList || !basketTotal) return;

  const cart = getCart();

  if (cart.length === 0){
    basketList.innerHTML = `<p class="body muted">Basket is empty.</p>`;
    basketTotal.textContent = "0 KR";
    return;
  }

  let total = 0;

  basketList.innerHTML = cart.map((item, idx) => {
    total += item.price;
    return `
      <div class="basket-item">
        <div class="left">
          <p class="name">${item.name}</p>
          <p class="meta">Item</p>
        </div>
        <div class="right">
          <p class="price">${item.price} kr</p>
          <button class="remove" type="button" data-remove="${idx}">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  basketTotal.textContent = `${total} KR`;

  basketList.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-remove"));
      removeFromCart(i);
    });
  });
}

// ---------- Newsletter validation (only if exists) ----------
const newsletterForm = document.getElementById("newsletterForm");
if (newsletterForm){
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName");
    const email = document.getElementById("email");
    const ok = document.getElementById("newsletterOk");

    const firstNameError = document.getElementById("firstNameError");
    const emailError = document.getElementById("emailError");

    firstNameError.textContent = "";
    emailError.textContent = "";
    ok.textContent = "";

    let valid = true;
    if (!firstName.value || firstName.value.trim().length < 2){
      firstNameError.textContent = "Please enter your first name (min 2 characters).";
      valid = false;
    }
    if (!email.value || !email.validity.valid){
      emailError.textContent = "Please enter a valid email address.";
      valid = false;
    }

    if (valid){
      ok.textContent = "Thanks! You’re signed up.";
      newsletterForm.reset();
    }
  });
}

// expose
window.FRAM = {
  getCart,
  setCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartCount,
  openBasket,
  closeBasket
};

// init (DO NOT open modal)
updateCartCount();
renderBasket();

// cross-tab sync
window.addEventListener("storage", (e) => {
  if (e.key === CART_KEY) {
    updateCartCount();
    renderBasket();
  }
});
