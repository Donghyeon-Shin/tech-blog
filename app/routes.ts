import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes';

export default [
  index('pages/home/home.tsx'),
  // prettier-ignore
  ...prefix('api', [
    ...prefix('settings', [
      route('/theme', 'api/settings/set-theme.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
