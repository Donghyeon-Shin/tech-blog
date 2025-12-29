import { CodeXmlIcon, Command, MoonIcon, Search, SunIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { GithubIcon } from '~/assets';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu';
import { cn } from '~/lib/utils';
import { Button } from '../ui/button';
import { useEffect, useMemo, useState } from 'react';
import Searchbar from './searchbar';
import { Theme, useTheme } from 'remix-themes';
import type { getCategories } from '~/api/categories/categories-api';

export default function Header({
  categories,
}: {
  categories: Awaited<ReturnType<typeof getCategories>>;
}) {
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [theme, setTheme] = useTheme();
  const location = useLocation();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        // 입력 필드에 포커스가 있을 때는 브라우저 기본 동작 허용
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        setSearchBarOpen(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const menus = useMemo(() => {
    const projectCategoryId = categories.find((c) => c.name === 'Project')?.category_id;
    const DocsMenuItems = categories
      .filter((c) => c.name !== 'Project')
      .map((c) => ({
        title: c.name,
        to: `/posts/${c.category_id}`,
      }));

    return [
      {
        title: 'Project',
        to: `/posts/${projectCategoryId}`,
      },
      {
        title: 'Docs',
        items: DocsMenuItems,
      },
      {
        title: 'About',
        to: '/about',
      },
      {
        title: 'Dashboard',
        to: '/dashboard',
      },
    ];
  }, [categories]);

  return (
    <div className='sticky top-0 z-50 w-full border-b border-border-dark bg-background backdrop-blur'>
      <div className='h-16 flex justify-between items-center pl-10 md:pl-20'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <CodeXmlIcon className='size-6' />
            <Link to='/' className='text-2xl font-bold'>
              Dongle
            </Link>
          </div>
          <NavigationMenu className='hidden md:block'>
            <NavigationMenuList>
              {menus.map((menu) => (
                <NavigationMenuItem key={menu.title}>
                  {menu.items ? (
                    <>
                      <NavigationMenuTrigger>{menu.title}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className='grid w-[400px] font-light gap-3 p-4 grid-cols-2'>
                          {menu.items?.map((item) => (
                            <NavigationMenuItem
                              key={item.title}
                              className={cn(
                                'select-none rounded-md transition-colors focus:bg-accent hover:bg-accent',
                              )}
                            >
                              <NavigationMenuLink asChild>
                                <Link to={item.to}>
                                  <span className='text-sm font-medium leading-none'>
                                    {item.title}
                                  </span>
                                </Link>
                              </NavigationMenuLink>
                            </NavigationMenuItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location.pathname === menu.to &&
                          'bg-accent text-accent-foreground font-medium',
                      )}
                      to={menu.to ?? '/'}
                    >
                      {menu.title}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className='flex items-center gap-2 mr-5'>
          <Button
            variant='outline'
            className='hidden md:flex text-muted-foreground w-[200px] justify-start relative cursor-text'
            onClick={() => setSearchBarOpen(true)}
          >
            <Search className='size-4 ' />
            <span className='text-sm font-medium'>Search</span>
            <div className='flex items-center bg-accent rounded-md m-2 p-1 gap-1 absolute right-1'>
              <Command className='size-3' />
              <p className='text-xs font-medium'>k</p>
            </div>
          </Button>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setTheme((theme === 'dark' ? 'light' : 'dark') as Theme)}
          >
            {theme === 'dark' ? <SunIcon className='size-4' /> : <MoonIcon className='size-4' />}
          </Button>
          <Link to='https://github.com/Donghyeon-Shin'>
            <GithubIcon width={24} height={24} />
          </Link>
        </div>
      </div>
      <Searchbar open={searchBarOpen} setOpen={setSearchBarOpen} />
      <div
        aria-hidden='true'
        className='absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 w-[35%]'
      />
    </div>
  );
}
