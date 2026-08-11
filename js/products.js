document.addEventListener('DOMContentLoaded', async () => {
  if (document.getElementById('featured-products')) {
    await renderFeaturedProducts();
  }

  if (document.getElementById('productGrid')) {
    await renderCatalog();
  }
});

async function fetchProducts() {
  try {
    const response = await fetch('data/products.json');
    if (!response.ok) throw new Error('Impossible de charger les produits.');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function renderFeaturedProducts() {
  const products = await fetchProducts();
  const featured = products.slice(0, 4);
  const container = document.getElementById('featured-products');
  if (!container) return;

  container.innerHTML = featured.map((product) => `
    <article class="product-card reveal" aria-label="${product.name}">
      <div class="product-card__image-wrap">
        <span class="product-badge">${product.badge}</span>
        <img src="${getProductImage(product)}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="product-card__body">
        <div class="product-card__meta">
          <span>${product.brand}</span>
          <span>${product.category}</span>
        </div>
        <h3>${product.name}</h3>
        <div class="price-row">
          <strong>${formatPrice(product.price)}</strong>
          <span>${formatPrice(product.oldPrice)}</span>
        </div>
        <div class="star-rating">★★★★★</div>
        <div class="product-actions">
          <button class="btn btn-primary" type="button" data-product-id="${product.id}">Ajouter au panier</button>
          <a href="product.html?id=${product.id}" class="btn btn-secondary">Voir le produit</a>
        </div>
      </div>
    </article>
  `).join('');

  attachProductButtons();
}

async function renderCatalog() {
  const products = await fetchProducts();
  const grid = document.getElementById('productGrid');
  const results = document.getElementById('resultsCount');
  const input = document.getElementById('searchInput');
  const category = document.getElementById('categoryFilter');
  const brand = document.getElementById('brandFilter');
  const size = document.getElementById('sizeFilter');
  const color = document.getElementById('colorFilter');
  const maxPrice = document.getElementById('maxPrice');
  const sortSelect = document.getElementById('sortSelect');
  const priceValue = document.getElementById('priceValue');

  if (!grid || !results) return;

  const url = new URL(window.location.href);
  const q = url.searchParams.get('q');
  const categoryParam = url.searchParams.get('category');

  if (q) input.value = q;
  if (categoryParam) category.value = categoryParam;

  const applyFilters = () => {
    const query = input.value.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesQuery = !query || [product.name, product.brand, product.category, product.description].join(' ').toLowerCase().includes(query);
      const matchesCategory = !category.value || product.category === category.value;
      const matchesBrand = !brand.value || product.brand === brand.value;
      const matchesSize = !size.value || product.sizes.includes(Number(size.value));
      const matchesColor = !color.value || product.colors.includes(color.value);
      const matchesPrice = product.price <= Number(maxPrice.value);
      return matchesQuery && matchesCategory && matchesBrand && matchesSize && matchesColor && matchesPrice;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortSelect.value) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'newest': return Number(b.new) - Number(a.new);
        default: return b.rating - a.rating;
      }
    });

    results.textContent = `${sorted.length} résultat${sorted.length > 1 ? 's' : ''}`;
    priceValue.textContent = `${maxPrice.value}€`;

    if (!sorted.length) {
      grid.innerHTML = '<div class="empty-state">Aucune chaussure ne correspond à votre recherche.</div>';
      return;
    }

    grid.innerHTML = sorted.map((product) => `
      <article class="product-card reveal" aria-label="${product.name}">
        <div class="product-card__image-wrap">
          <span class="product-badge">${product.badge}</span>
          <img src="${getProductImage(product)}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="product-card__body">
          <div class="product-card__meta">
            <span>${product.brand}</span>
            <span>${product.category}</span>
          </div>
          <h3>${product.name}</h3>
          <div class="price-row">
            <strong>${formatPrice(product.price)}</strong>
            <span>${formatPrice(product.oldPrice)}</span>
          </div>
          <div class="star-rating">★★★★★</div>
          <div class="product-actions">
            <button class="btn btn-primary" type="button" data-product-id="${product.id}">Ajouter au panier</button>
            <a href="product.html?id=${product.id}" class="btn btn-secondary">Voir le produit</a>
          </div>
        </div>
      </article>
    `).join('');

    attachProductButtons();
  };

  [input, category, brand, size, color, maxPrice, sortSelect].forEach((element) => {
    element.addEventListener('input', applyFilters);
    element.addEventListener('change', applyFilters);
  });

  applyFilters();
}

function attachProductButtons() {
  document.querySelectorAll('[data-product-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = Number(button.dataset.productId);
      const cart = JSON.parse(localStorage.getItem('mixmelo-cart') || '[]');
      const productData = { productId, quantity: 1, size: 42 };
      const existing = cart.find((item) => item.productId === productId && item.size === productData.size);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push(productData);
      }

      localStorage.setItem('mixmelo-cart', JSON.stringify(cart));
      updateCartCount();
      button.textContent = 'Ajouté';
      setTimeout(() => {
        button.textContent = 'Ajouter au panier';
      }, 1000);
    });
  });
}
