import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import { useEffect } from 'react';

import type { Route } from './+types/root';
import './app.css';
import Header from './components/layout/header';
import { themeSessionResolver } from './lib/theme-session.server';
import { ThemeProvider, useTheme } from 'remix-themes';
import { Toaster } from 'sonner';
import { client } from './supa-client';
import { getCategories } from './api/categories/categories-api';
import { getAllPostsForBuildingCategoriesTree } from './api/posts/posts-api';
import { buildCategoriesTree } from './lib/buildCategoriesTree';
import { getEvents } from './api/events/events-api';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  {
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
    integrity: 'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github-dark.min.css',
  },
  {
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github.min.css',
  },
];

export const shouldRevalidate = (
  currentUrl: URL | undefined,
  nextUrl: URL | undefined,
  formMethod: string | undefined,
  defaultShouldRevalidate: boolean,
) => {
  if (currentUrl?.pathname !== nextUrl?.pathname) {
    return false;
  }

  return defaultShouldRevalidate;
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.DATABASE_URL) {
    throw new Error('Missing environment variables');
  }
  const { getTheme } = await themeSessionResolver(request);
  const theme = getTheme();

  const [categories, posts, events] = await Promise.all([
    getCategories(client),
    getAllPostsForBuildingCategoriesTree(client),
    getEvents(client),
  ]);

  const topLevelCategories = categories.filter((c) => c.parent_id === null);
  const categoriesTree = buildCategoriesTree(categories, posts, null);

  return {
    theme,
    categoriesTree,
    topLevelCategories,
    categories,
    events,
  };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData('root');
  return (
    <ThemeProvider
      specifiedTheme={data?.theme ?? 'dark'} // Default to dark theme if none is specified
      themeAction='/api/settings/theme' // API endpoint for changing theme
    >
      <InnerLayout>{children}</InnerLayout>
    </ThemeProvider>
  );
}

export function InnerLayout({ children }: { children: React.ReactNode }) {
  const [theme] = useTheme();
  const currentTheme = theme ?? 'dark';

  useEffect(() => {
    // highlight.js 테마 CSS 동적 제어
    const darkThemeLink = document.querySelector(
      'link[href*="github-dark.min.css"]',
    ) as HTMLLinkElement;
    const lightThemeLink = document.querySelector(
      'link[href*="github.min.css"]',
    ) as HTMLLinkElement;

    if (darkThemeLink && lightThemeLink) {
      if (currentTheme === 'dark') {
        darkThemeLink.disabled = false;
        lightThemeLink.disabled = true;
      } else {
        darkThemeLink.disabled = true;
        lightThemeLink.disabled = false;
      }
    }
  }, [currentTheme]);

  return (
    <html lang='en' className={currentTheme}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster position='top-center' />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <Header categories={loaderData.topLevelCategories} />
      <Outlet context={{ loaderData }} />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
