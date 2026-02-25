import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  route('/sitemap.xml', 'pages/sitemap-xml.tsx'),
  layout('components/layout/leftSidebarLayout.tsx', [
    index('pages/index.tsx'),
    ...prefix('posts', [route('/:category', 'pages/posts.tsx')]),
    route('/popular', 'pages/popularPosts.tsx'),
    route('/post/:title', 'pages/post.tsx'),
    route('/about', 'pages/about.tsx'),
    route('/dashboard', 'pages/dashboard.tsx'),
  ]),
  // prettier-ignore
  ...prefix('api', [
    ...prefix('settings', [
      route('/theme', 'api/settings/set-theme.tsx'),
    ]),
    route('/search/:searchTerm', 'api/search/search.tsx'),
  ]),
  route('*', 'pages/not-found.tsx'),
] satisfies RouteConfig;
