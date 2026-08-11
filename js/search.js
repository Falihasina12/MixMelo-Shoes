document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchForm = document.querySelector('.header-search');

  if (searchForm) {
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = searchForm.querySelector('input');
      if (!input || !input.value.trim()) return;
      const url = new URL('products.html', window.location.href);
      url.searchParams.set('q', input.value.trim());
      window.location.href = url.toString();
    });
  }

  if (searchInput) {
    const url = new URL(window.location.href);
    const query = url.searchParams.get('q');
    if (query) searchInput.value = query;
  }
});
