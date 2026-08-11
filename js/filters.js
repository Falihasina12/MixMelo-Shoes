document.addEventListener('DOMContentLoaded', () => {
  const maxPrice = document.getElementById('maxPrice');
  const priceValue = document.getElementById('priceValue');

  if (maxPrice && priceValue) {
    maxPrice.addEventListener('input', () => {
      priceValue.textContent = `${maxPrice.value}€`;
    });
  }
});
