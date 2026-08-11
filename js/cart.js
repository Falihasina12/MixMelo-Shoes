document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cart-items')) {
    renderCart();
  }
  if (document.getElementById('checkout-form')) {
    initCheckout();
  }
});

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('mixmelo-cart') || '[]');
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('mixmelo-cart', JSON.stringify(cart));
  updateCartCount();
}

function calculateSubtotal(cart) {
  return cart.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0);
}

function calculateShipping(subtotal) {
  return subtotal > 0 ? (subtotal > 150 ? 0 : 12) : 0;
}

function calculateTotal(subtotal) {
  return subtotal + calculateShipping(subtotal);
}

function renderCart() {
  const cart = loadCart();
  const container = document.getElementById('cart-items');
  if (!container) return;

  if (!cart.length) {
    container.innerHTML = '<div class="empty-state">Votre panier est vide. Ajoutez une chaussure pour commencer votre commande.</div>';
  } else {
    container.innerHTML = cart.map((item) => `
      <article class="cart-item">
        <img src="${getProductImage({ image: item.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80' })}" alt="${item.name || 'Produit'}" />
        <div>
          <h3>${item.name || 'Produit MixMelo'}</h3>
          <div class="cart-item__meta">Taille: ${item.size} · Couleur: ${item.color || 'Noir'} · ${formatPrice(item.price)} / unité</div>
          <div class="cart-item__controls">
            <div class="cart-item__quantity">
              <button type="button" data-action="decrease" data-product-id="${item.productId}" data-size="${item.size}">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-action="increase" data-product-id="${item.productId}" data-size="${item.size}">+</button>
            </div>
            <button type="button" class="remove-btn" data-remove-id="${item.productId}" data-size="${item.size}">Supprimer</button>
          </div>
        </div>
        <strong>${formatPrice(item.price * item.quantity)}</strong>
      </article>
    `).join('');
  }

  const subtotal = calculateSubtotal(cart);
  document.getElementById('subtotal')?.replaceChildren(document.createTextNode(formatPrice(subtotal)));
  const shipping = calculateShipping(subtotal);
  document.getElementById('shipping')?.replaceChildren(document.createTextNode(formatPrice(shipping)));
  document.getElementById('total')?.replaceChildren(document.createTextNode(formatPrice(calculateTotal(subtotal))));

  document.getElementById('checkout-subtotal')?.replaceChildren(document.createTextNode(formatPrice(subtotal)));
  document.getElementById('checkout-shipping')?.replaceChildren(document.createTextNode(formatPrice(shipping)));
  document.getElementById('checkout-total')?.replaceChildren(document.createTextNode(formatPrice(calculateTotal(subtotal))));

  bindCartActions();
}

function bindCartActions() {
  document.querySelectorAll('[data-action="increase"]').forEach((button) => {
    button.addEventListener('click', () => updateItemQuantity(Number(button.dataset.productId), Number(button.dataset.size), 1));
  });

  document.querySelectorAll('[data-action="decrease"]').forEach((button) => {
    button.addEventListener('click', () => updateItemQuantity(Number(button.dataset.productId), Number(button.dataset.size), -1));
  });

  document.querySelectorAll('[data-remove-id]').forEach((button) => {
    button.addEventListener('click', () => removeFromCart(Number(button.dataset.removeId), Number(button.dataset.size)));
  });
}

function updateItemQuantity(productId, size, change) {
  const cart = loadCart();
  const item = cart.find((entry) => entry.productId === productId && Number(entry.size) === Number(size));
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(productId, size);
    return;
  }

  saveCart(cart);
  renderCart();
}

function removeFromCart(productId, size) {
  const cart = loadCart().filter((item) => !(item.productId === productId && Number(item.size) === Number(size)));
  saveCart(cart);
  renderCart();
}

function initCheckout() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  const cart = loadCart();
  const subtotal = calculateSubtotal(cart);
  document.getElementById('checkout-subtotal').textContent = formatPrice(subtotal);
  document.getElementById('checkout-shipping').textContent = formatPrice(calculateShipping(subtotal));
  document.getElementById('checkout-total').textContent = formatPrice(calculateTotal(subtotal));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const orderNumber = `MM-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    localStorage.removeItem('mixmelo-cart');
    updateCartCount();
    form.innerHTML = `
      <div class="empty-state">
        <h2>Commande confirmée !</h2>
        <p>Votre numéro de commande est : <strong>${orderNumber}</strong></p>
        <p>Merci pour votre commande chez MixMelo Shoes.</p>
      </div>
    `;
  });
}
