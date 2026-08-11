document.addEventListener('DOMContentLoaded', async () => {
  const productDetail = document.getElementById('product-detail');
  if (!productDetail) return;

  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id')) || 1;
  const products = await fetchProducts();
  const product = products.find((item) => item.id === productId) || products[0];

  if (!product) {
    productDetail.innerHTML = '<div class="empty-state">Produit introuvable.</div>';
    return;
  }

  productDetail.innerHTML = `
    <div class="gallery">
      <div class="gallery-large">
        <img id="mainProductImage" src="${getProductImage(product)}" alt="${product.name}" />
      </div>
      <div class="gallery-thumbs">
        ${[product.image, product.image, product.image].map((img, index) => `
          <img class="${index === 0 ? 'active' : ''}" src="${img || getProductImage(product)}" alt="${product.name} vue ${index + 1}" data-image="${img || getProductImage(product)}" />
        `).join('')}
      </div>
    </div>

    <div class="product-summary">
      <span class="eyebrow">${product.category}</span>
      <h1>${product.name}</h1>
      <div class="product-meta">
        <span>${product.brand}</span>
        <span>★★★★★ ${product.rating} (${product.reviews} avis)</span>
      </div>

      <div class="price-block">
        <span class="current">${formatPrice(product.price)}</span>
        <span class="old">${formatPrice(product.oldPrice)}</span>
        <span class="discount">-${product.discount}%</span>
      </div>

      <p>${product.description}</p>

      <div class="size-selector">
        <h3>Choisir une taille</h3>
        <div class="size-list">
          ${product.sizes.map((size) => `<button type="button" class="size-item ${size === product.sizes[0] ? 'active' : ''}" data-size="${size}">${size}</button>`).join('')}
        </div>
      </div>

      <div class="color-selector">
        <h3>Couleurs</h3>
        <div class="color-list">
          ${product.colors.map((color, index) => `<button type="button" class="color-item ${index === 0 ? 'active' : ''}" data-color="${color}">${color}</button>`).join('')}
        </div>
      </div>

      <div class="product-actions-large">
        <div class="quantity-selector" aria-label="Sélecteur de quantité">
          <button type="button" data-action="decrease">−</button>
          <span id="quantityValue">1</span>
          <button type="button" data-action="increase">+</button>
        </div>
        <button id="addToCartBtn" type="button" class="btn btn-primary">Ajouter au panier</button>
        <a href="cart.html" class="btn btn-secondary">Acheter maintenant</a>
      </div>
    </div>
  `;

  const mainImage = document.getElementById('mainProductImage');
  document.querySelectorAll('.gallery-thumbs img').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      if (mainImage) mainImage.src = thumb.dataset.image;
      document.querySelectorAll('.gallery-thumbs img').forEach((img) => img.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  let selectedSize = product.sizes[0];
  let selectedColor = product.colors[0];
  let quantity = 1;

  document.querySelectorAll('.size-item').forEach((button) => {
    button.addEventListener('click', () => {
      selectedSize = Number(button.dataset.size);
      document.querySelectorAll('.size-item').forEach((item) => item.classList.toggle('active', item === button));
    });
  });

  document.querySelectorAll('.color-item').forEach((button) => {
    button.addEventListener('click', () => {
      selectedColor = button.dataset.color;
      document.querySelectorAll('.color-item').forEach((item) => item.classList.toggle('active', item === button));
    });
  });

  document.querySelector('[data-action="decrease"]').addEventListener('click', () => {
    quantity = Math.max(1, quantity - 1);
    document.getElementById('quantityValue').textContent = quantity;
  });

  document.querySelector('[data-action="increase"]').addEventListener('click', () => {
    quantity = quantity + 1;
    document.getElementById('quantityValue').textContent = quantity;
  });

  const addButton = document.getElementById('addToCartBtn');
  addButton.addEventListener('click', () => {
    if (!selectedSize) {
      alert('Veuillez choisir une taille.');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('mixmelo-cart') || '[]');
    const existing = cart.find((item) => item.productId === product.id && item.size === selectedSize);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        size: selectedSize,
        color: selectedColor,
        price: product.price,
        quantity
      });
    }

    localStorage.setItem('mixmelo-cart', JSON.stringify(cart));
    updateCartCount();
    addButton.textContent = 'Ajouté !';
    setTimeout(() => {
      addButton.textContent = 'Ajouter au panier';
    }, 1000);
  });

  const description = document.createElement('div');
  description.className = 'product-description';
  description.innerHTML = `
    <div>
      <h3>Description</h3>
      <p>${product.description}</p>
    </div>
    <div>
      <h3>Caractéristiques</h3>
      <ul>
        ${product.features.map((feature) => `<li>${feature}</li>`).join('')}
      </ul>
    </div>
  `;
  productDetail.appendChild(description);
});

async function fetchProducts() {
  try {
    const response = await fetch('data/products.json');
    if (!response.ok) throw new Error('Erreur de données produits');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
