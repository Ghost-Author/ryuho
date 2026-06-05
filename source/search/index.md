---
title: 搜索
description: 在博客中搜索文章
layout: page
---

<div class="search-container">
  <input type="text" id="search-input" placeholder="输入关键词搜索..." aria-label="搜索输入框">
  <div id="search-results" class="search-results" aria-live="polite"></div>
</div>

<script src="https://unpkg.com/lunr@2.3.9/lunr.min.js"></script>
<script>
(function() {
  let searchIndex;
  let searchResults;

  fetch('../search-index.json')
    .then(response => response.json())
    .then(data => {
      searchIndex = lunr.Index.load(data);
      searchResults = data.documents;
    })
    .catch(err => console.error('Failed to load search index:', err));

  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');

  function performSearch(query) {
    if (!searchIndex || !query.trim()) {
      resultsContainer.innerHTML = '';
      return;
    }

    const results = searchIndex.search(query);
    const html = results.map(result => {
      const doc = searchResults.find(d => d.id === result.ref);
      if (!doc) return '';

      return `
        <article class="search-result">
          <h3><a href="${doc.url}">${doc.title}</a></h3>
          <p>${doc.excerpt || doc.content.substring(0, 150) + '...'}</p>
          <time>${doc.date}</time>
        </article>
      `;
    }).join('');

    resultsContainer.innerHTML = html || '<p>没有找到相关结果</p>';
  }

  let debounceTimer;
  searchInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => performSearch(this.value), 300);
  });
})();
</script>
