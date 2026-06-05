const fs = require('fs');
const path = require('path');
const lunr = require('lunr');

hexo.extend.generator.register('search-index', function(locals) {
  const documents = [];
  const posts = locals.posts.sort('-date');

  posts.forEach(post => {
    const content = post.content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const excerpt = content.substring(0, 200) + (content.length > 200 ? '...' : '');

    documents.push({
      id: post._id,
      title: post.title,
      content: content,
      excerpt: excerpt,
      url: post.permalink,
      date: post.date.format('YYYY-MM-DD'),
      tags: post.tags ? post.tags.map(tag => tag.name) : [],
      categories: post.categories ? post.categories.map(cat => cat.name) : []
    });
  });

  const idx = lunr(function() {
    this.ref('id');
    this.field('title', { boost: 10 });
    this.field('content');
    this.field('tags', { boost: 5 });
    this.field('categories', { boost: 3 });

    documents.forEach(doc => this.add(doc));
  });

  const indexData = {
    index: idx.toJSON(),
    documents: documents
  };

  return {
    path: 'search-index.json',
    data: JSON.stringify(indexData)
  };
});