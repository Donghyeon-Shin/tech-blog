import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes';

export default [
  index('pages/home/home.tsx'),
  ...prefix('posts', [
    route('/all', 'pages/allPosts.tsx'),
    route('/popular', 'pages/popularPosts.tsx'),
  ]),
  // prettier-ignore
  ...prefix('api', [
    ...prefix('settings', [
      route('/theme', 'api/settings/set-theme.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
