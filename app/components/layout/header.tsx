import { BarChart3Icon, BellIcon, CodeXmlIcon, MessageCircleIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
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

const menus: {
  title: string;
  to?: string;
  items?: {
    title: string;
    to: string;
  }[];
}[] = [
  {
    title: 'Project',
    items: [
      {
        title: 'Document AI Secretary',
        to: '/projects/document-ai-secretary',
      },
      {
        title: 'Insight Box',
        to: '/projects/insight-box',
      },
      {
        title: 'Minecraft GPT',
        to: '/projects/minecraft-gpt',
      },
    ],
  },
  {
    title: 'Docs',
    items: [
      {
        title: 'Algorithm',
        to: '/docs/algorithm',
      },
      {
        title: 'Books',
        to: '/docs/books',
      },
      {
        title: 'Langchain',
        to: '/docs/langchain',
      },
    ],
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

export default function Header() {
  return (
    <div className='sticky top-0 z-50 w-full border-b border-border-dark bg-background backdrop-blur'>
      <div className='h-16 flex justify-between items-center px-20'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <CodeXmlIcon className='size-6' />
            <p className='text-2xl font-bold'>Dongle</p>
          </div>
          <NavigationMenu>
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
                    <Link className={navigationMenuTriggerStyle()} to={menu.to ?? '/'}>
                      {menu.title}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div>오른쪽</div>
      </div>
      <div
        aria-hidden='true'
        className='absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 w-[35%]'
      ></div>
    </div>
  );
}
