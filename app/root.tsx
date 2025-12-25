import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';
import Header from './components/layout/header';
import { themeSessionResolver } from './lib/theme-session.server';
import { ThemeProvider, useTheme } from 'remix-themes';
import LeftSidebar from './components/layout/leftSideBar';
import { Toaster } from 'sonner';

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
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.DATABASE_URL) {
    throw new Error('Missing environment variables');
  }

  const { getTheme } = await themeSessionResolver(request);
  const theme = getTheme();

  return { theme };
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
  return (
    <html lang='en' className={theme ?? 'dark'}>
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

export default function App() {
  return (
    <div>
      <Header />
      <div className='mx-auto xl:mx-20 grid grid-cols-1 md:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr] gap-8 px-6 py-8'>
        <LeftSidebar />
        <Outlet />
      </div>
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
