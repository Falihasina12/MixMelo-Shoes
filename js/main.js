document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  initMobileMenu();
  initSearchForms();
  initializeRevealAnimations();
});

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('mixmelo-cart') || '[]');
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach((element) => {
    element.textContent = String(count);
  });
}

function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (!toggle || !mobileMenu) return;

  toggle.addEventListener('click', () => {
    const isOpen = mobileMenu.style.display === 'block';
    mobileMenu.style.display = isOpen ? 'none' : 'block';
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });
}

function initSearchForms() {
  document.querySelectorAll('.header-search').forEach((form) => {
    form.addEventListener('submit', (event) => {
      const input = form.querySelector('input');
      if (!input || !input.value.trim()) {
        event.preventDefault();
      }
    });
  });
}

function initializeRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
}

function getProductImage(product) {
  return product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80';
}
