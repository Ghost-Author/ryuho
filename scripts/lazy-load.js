hexo.extend.filter.register('after_render:html', function (str, data) {
  // 为内容中的图片添加懒加载
  return str.replace(/<img([^>]+)>/g, function (match, attrs) {
    // 如果已经有loading属性，跳过
    if (attrs.includes('loading=')) {
      return match;
    }
    // 添加loading="lazy"
    return match.replace('<img', '<img loading="lazy"');
  });
});