(function () {
  const progress = document.querySelector('.reading-progress');
  const backTop = document.querySelector('.back-to-top');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeIcon = document.querySelector('[data-theme-icon]');

  function setTheme(theme) {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
      themeToggle.setAttribute('aria-label', nextTheme === 'dark' ? '切换浅色模式' : '切换深色模式');
    }
    if (themeIcon) themeIcon.textContent = nextTheme === 'dark' ? '☀' : '☾';
  }

  setTheme(document.documentElement.dataset.theme || 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', nextTheme);
      } catch (e) {}
      setTheme(nextTheme);
    });
  }

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

  const content = document.querySelector('.post-content, .page-content');
  if (content) {
    Array.from(content.querySelectorAll('a[href^="http"]')).forEach(function (link) {
      if (link.hostname !== window.location.hostname) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    });

    Array.from(content.querySelectorAll('img:not([loading])')).forEach(function (img) {
      img.loading = 'lazy';
    });

    Array.from(content.querySelectorAll('table')).forEach(function (table) {
      if (table.parentElement && table.parentElement.classList.contains('table-scroll')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    Array.from(content.querySelectorAll('h2[id], h3[id], h4[id]')).forEach(function (heading) {
      if (heading.querySelector('.heading-anchor')) return;
      const anchor = document.createElement('a');
      anchor.className = 'heading-anchor';
      anchor.href = '#' + heading.id;
      anchor.setAttribute('aria-label', '复制或打开这一段链接');
      anchor.textContent = '#';
      heading.appendChild(anchor);
    });

    Array.from(content.querySelectorAll('pre')).forEach(function (pre) {
      if (pre.parentElement && pre.parentElement.classList.contains('code-block')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block';
      const button = document.createElement('button');
      button.className = 'code-copy';
      button.type = 'button';
      button.textContent = '复制';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(button);
      wrapper.appendChild(pre);

      button.addEventListener('click', function () {
        const code = pre.textContent || '';
        const reset = function () {
          window.setTimeout(function () {
            button.textContent = '复制';
          }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(function () {
            button.textContent = '已复制';
            reset();
          }).catch(function () {
            button.textContent = '复制失败';
            reset();
          });
        }
      });
    });
  }

  const copyLink = document.querySelector('[data-copy-link]');
  if (copyLink) {
    copyLink.addEventListener('click', function () {
      const originalText = copyLink.getAttribute('data-copy-text') || copyLink.textContent;
      const copiedText = copyLink.getAttribute('data-copied-text') || '已复制';
      const url = window.location.href;
      const done = function () {
        copyLink.textContent = copiedText;
        window.setTimeout(function () {
          copyLink.textContent = originalText;
        }, 1800);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(function () {
          window.prompt('复制这篇文章链接：', url);
        });
      } else {
        window.prompt('复制这篇文章链接：', url);
      }
    });
  }

  const searchInput = document.querySelector('[data-search-input]');
  const postItems = Array.from(document.querySelectorAll('[data-post-item]'));
  const searchEmpty = document.querySelector('[data-search-empty]');
  const searchCount = document.querySelector('[data-search-count]');
  if (searchInput && postItems.length) {
    searchInput.addEventListener('input', function (e) {
      const q = e.target.value.trim().toLowerCase();
      let visibleCount = 0;
      postItems.forEach(function (item) {
        const title = (item.getAttribute('data-title') || '').toLowerCase();
        const excerpt = (item.getAttribute('data-excerpt') || '').toLowerCase();
        const tags = (item.getAttribute('data-tags') || '').toLowerCase();
        const visible = [title, excerpt, tags].some(function (text) {
          return text.includes(q);
        });
        item.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (searchEmpty) searchEmpty.hidden = visibleCount > 0;
      if (searchCount) searchCount.textContent = visibleCount + ' 篇';
    });
  }
})();
