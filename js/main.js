(function () {
  const progress = document.querySelector('.reading-progress');
  const backTop = document.querySelector('.back-to-top');

  function updateProgress() {
    if (!progress) return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const percent = height > 0 ? (scrollTop / height) * 100 : 0;
    progress.style.width = percent + '%';
  }

  function toggleBackTop() {
    if (!backTop) return;
    const show = (document.documentElement.scrollTop || document.body.scrollTop) > 300;
    backTop.classList.toggle('visible', show);
  }

  function onScroll() {
    updateProgress();
    toggleBackTop();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', onScroll);

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const searchInput = document.querySelector('[data-search-input]');
  const postItems = Array.from(document.querySelectorAll('[data-post-item]'));
  if (searchInput && postItems.length) {
    searchInput.addEventListener('input', function (e) {
      const q = e.target.value.trim().toLowerCase();
      postItems.forEach(function (item) {
        const title = (item.getAttribute('data-title') || '').toLowerCase();
        item.style.display = title.includes(q) ? '' : 'none';
      });
    });
  }
})();
