---
title: 搜索
description: 在博客中搜索文章
layout: page
---

<div class="search-container">
  <input type="text" id="search-input" placeholder="输入关键词搜索..." aria-label="搜索输入框">
  <div id="search-results" class="search-results" aria-live="polite"></div>
</div>

<script>
(function() {
  let searchDocuments = [];

  fetch('../search-index.json')
    .then(response => response.json())
    .then(data => {
      searchDocuments = data.documents || [];
    })
    .catch(err => console.error('Failed to load search index:', err));

  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function(char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function normalize(value) {
    return String(value || '').toLowerCase();
  }

  function scoreDocument(doc, terms) {
    const title = normalize(doc.title);
    const tags = normalize((doc.tags || []).join(' '));
    const categories = normalize((doc.categories || []).join(' '));
    const content = normalize(doc.content);
    let score = 0;

    terms.forEach(function(term) {
      if (title.includes(term)) score += 8;
      if (tags.includes(term)) score += 5;
      if (categories.includes(term)) score += 3;
      if (content.includes(term)) score += 1;
    });

    return score;
  }

  function performSearch(query) {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (!searchDocuments.length || !terms.length) {
      resultsContainer.innerHTML = '';
      return;
    }

    const results = searchDocuments
      .map(function(doc) {
        return { doc: doc, score: scoreDocument(doc, terms) };
      })
      .filter(function(item) {
        return item.score > 0;
      })
      .sort(function(a, b) {
        return b.score - a.score;
      })
      .slice(0, 12);

    const html = results.map(function(result) {
      const doc = result.doc;
      return `
        <article class="search-result">
          <h3><a href="../${escapeHtml(doc.url)}">${escapeHtml(doc.title)}</a></h3>
          <p>${escapeHtml(doc.excerpt || doc.content.substring(0, 150) + '...')}</p>
          <time>${escapeHtml(doc.date)}</time>
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
