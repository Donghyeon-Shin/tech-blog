import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes';

export default [
  index('pages/index.tsx'),
  ...prefix('posts', [route('/:category', 'pages/posts.tsx')]),
  route('/popular', 'pages/popularPosts.tsx'),
  route('/post/:id', 'pages/post.tsx'),
  route('/about', 'pages/about.tsx'),
  route('/dashboard', 'pages/dashboard.tsx'),
  // prettier-ignore
  ...prefix('api', [
    ...prefix('settings', [
      route('/theme', 'api/settings/set-theme.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
