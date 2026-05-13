function trimEndSlash(value) {
  return String(value || '').replace(/\/+$/, '');
}

function ensureSlash(value) {
  const text = String(value || '/');
  return text.endsWith('/') ? text : `${text}/`;
}

hexo.extend.generator.register('seo-files', function () {
  const config = hexo.config;
  const theme = hexo.theme.config || {};
  const root = ensureSlash(config.root || '/');
  const siteUrl = trimEndSlash(config.url);

  function withRoot(file) {
    return `${root}${String(file).replace(/^\/+/, '')}`;
  }

  function absolute(file) {
    const cleanFile = String(file).replace(/^\/+/, '');
    const rootWithoutSlash = trimEndSlash(root);
    const urlAlreadyIncludesRoot = rootWithoutSlash && rootWithoutSlash !== '/' && siteUrl.endsWith(rootWithoutSlash);
    return urlAlreadyIncludesRoot ? `${siteUrl}/${cleanFile}` : `${siteUrl}${withRoot(cleanFile)}`;
  }

  const manifest = {
    name: config.title,
    short_name: theme.short_name || 'Ryuho',
    description: config.description,
    lang: config.language || 'zh-CN',
    start_url: root,
    scope: root,
    display: 'standalone',
    background_color: theme.background_color || '#fff4fb',
    theme_color: theme.theme_color || '#ff7bb2',
    icons: [
      {
        src: withRoot('images/avatar.png'),
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: withRoot('images/avatar.png'),
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };

  const robots = [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${absolute('sitemap.xml')}`,
    ''
  ].join('\n');

  return [
    {
      path: 'site.webmanifest',
      data: JSON.stringify(manifest, null, 2)
    },
    {
      path: 'robots.txt',
      data: robots
    }
  ];
});
