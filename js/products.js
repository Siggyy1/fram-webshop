const products = [
  { id:"oats", name:"Oats", price:16, unit:"kr / kg", amount:"1 kg", img:"assets/img/oats.jpg" },
  { id:"red-onions", name:"Red Onions", price:45, unit:"kr / kg", amount:"1 kg", img:"assets/img/red-onions.jpg" },
  { id:"garlic", name:"Garlic", price:38, unit:"kr", amount:"0.2 kg", img:"assets/img/garlic.jpg" },
  { id:"potato", name:"Potato", price:32, unit:"kr / kg", amount:"1 kg", img:"assets/img/potatoes.jpg" },
  { id:"carrots", name:"Carrots", price:48, unit:"kr / kg", amount:"1 kg", img:"assets/img/carrots.jpg" },
];

function productCard(p){
  return `
    <article class="product-card">
      <div class="product-img-wrap">
        <img class="product-img" src="${p.img}" alt="${p.name}" loading="lazy"/>
        <button class="add-overlay" data-add="${p.id}" type="button" aria-label="Add ${p.name} to basket">
          Add to basket ↑
        </button>
      </div>
      <div class="product-meta">
        <div>
          <p class="name">${p.name}</p>
          <p class="small">${p.amount}</p>
        </div>
        <div>
          <p class="name">${p.price} ${p.unit}</p>
        </div>
      </div>
    </article>
  `;
}

/** Safe cart helpers (works even if window.FRAM is missing) */
function getCartSafe(){
  try {
    if (window.FRAM?.getCart) return window.FRAM.getCart();
  } catch (_) {}
  try {
    return JSON.parse(localStorage.getItem("fram_cart_v1") || "[]");
  } catch (_) {
    return [];
  }
}

function setCartSafe(cart){
  try {
    if (window.FRAM?.setCart) return window.FRAM.setCart(cart);
  } catch (_) {}
  localStorage.setItem("fram_cart_v1", JSON.stringify(cart));
}

function addToCartSafe(item){
  try {
    if (window.FRAM?.addToCart) return window.FRAM.addToCart(item);
  } catch (_) {}
  const cart = getCartSafe();
  cart.push(item);
  setCartSafe(cart);
}

function updateHeaderCount(){
  const el = document.getElementById("cartCount");
  if (!el) return;
  const cart = getCartSafe();
  el.textContent = String(cart.length);
}

/** Bind add-to-basket clicks for a grid element */
function bindGridAddButtons(container){
  if (!container) return;
  container.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;

    const id = btn.getAttribute("data-add");
    const p = products.find(x => x.id === id);
    if (!p) return;

    addToCartSafe({ id: p.id, name: p.name, price: p.price });
    updateHeaderCount();

    btn.textContent = "Added ✓";
    setTimeout(() => (btn.textContent = "Add to basket ↑"), 900);
  });
}

/* Render products page grid */
const grid = document.getElementById("productsGrid");
if (grid){
  grid.innerHTML = products.map(productCard).join("");
  bindGridAddButtons(grid);
}

/* Render popular on index */
const popular = document.getElementById("popularGrid");
if (popular){
  popular.innerHTML = products.slice(0,3).map(productCard).join("");
  bindGridAddButtons(popular);
}

/* Always update count on load */
updateHeaderCount();
