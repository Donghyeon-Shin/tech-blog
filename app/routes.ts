import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes';

export default [
  index('pages/allPosts.tsx'),
  ...prefix('posts', [
    route('/all', 'pages/allPosts.tsx', { id: 'posts-all' }),
    route('/popular', 'pages/popularPosts.tsx'),
  ]),
  route('post', 'pages/post.tsx'),
  // prettier-ignore
  ...prefix('api', [
    ...prefix('settings', [
      route('/theme', 'api/settings/set-theme.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
