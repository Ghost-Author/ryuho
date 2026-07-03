hexo.extend.generator.register('search-index', function(locals) {
  const documents = [];
  const posts = locals.posts.sort('-date');

  posts.forEach(post => {
    const content = String(post.content || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const excerpt = content.substring(0, 200) + (content.length > 200 ? '...' : '');

    documents.push({
      id: post._id,
      title: post.title || '',
      content: content,
      excerpt: post.description || excerpt,
      url: post.path,
      date: post.date.format('YYYY-MM-DD'),
      tags: post.tags ? post.tags.map(tag => tag.name) : [],
      categories: post.categories ? post.categories.map(cat => cat.name) : []
    });
  });

  return {
    path: 'search-index.json',
    data: JSON.stringify({ documents })
  };
});
