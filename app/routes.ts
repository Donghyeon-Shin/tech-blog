import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes';

export default [
  index('pages/index.tsx'),
  ...prefix('posts', [route('/:category/:page?', 'pages/posts.tsx')]),
  route('/popular', 'pages/popularPosts.tsx'),
  route('post', 'pages/post.tsx'),
  route('/about', 'pages/about.tsx'),
  // prettier-ignore
  ...prefix('api', [
    ...prefix('settings', [
      route('/theme', 'api/settings/set-theme.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
