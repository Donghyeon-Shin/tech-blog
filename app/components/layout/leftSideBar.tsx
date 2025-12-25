import { cva } from 'class-variance-authority';
import { BookIcon, LayoutGrid, StarIcon } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router';
import FolderItems from './folderItems';
import type { FolderItemProps } from '~/types/folderItemProps';

const navLinkVariants = cva(
  'hover:bg-primary/10 hover:text-primary px-2 py-2 rounded-md transition-colors flex items-center gap-2',
  {
    variants: {
      isActive: {
        true: 'bg-primary/20 font-medium text-primary rounded-md',
        false: 'text-muted-foreground hover:bg-primary/10',
      },
    },
  },
);

const foloderList: FolderItemProps[] = [
  {
    name: 'Algorithm',
    isFolder: true,
    children: [
      {
        name: 'Algorithm Content',
        isFolder: true,
        children: [
          {
            name: 'Array',
            isFolder: true,
            children: [
              {
                name: 'Binary Search',
                isFolder: false,
              },
              {
                name: 'MITM(Meet in the Middle)',
                isFolder: false,
              },
              {
                name: 'PBS(Parallel Binary Search)',
                isFolder: false,
              },
            ],
          },
          {
            name: 'Graph Theory',
            isFolder: true,
            children: [
              {
                name: 'BFS(Breadth-First Search)',
                isFolder: false,
              },
              {
                name: 'DFS(Depth-First Search)',
                isFolder: false,
              },
              {
                name: 'Topological Sorting',
                isFolder: false,
              },
              {
                name: 'Shortest Path',
                isFolder: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Books',
    isFolder: true,
    children: [
      {
        name: 'Books Content',
        isFolder: false,
        icon: <BookIcon className='size-4' />,
      },
      {
        name: 'Books Content',
        isFolder: true,
        children: [
          {
            name: 'Book 1',
            isFolder: false,
          },
          {
            name: 'Book 2',
            isFolder: false,
          },
          {
            name: 'Book 3',
            isFolder: false,
          },
          {
            name: 'Book 4',
            isFolder: false,
          },
        ],
      },
    ],
  },
];

interface NowList {
  type: 'update' | 'create';
  posts: {
    title: string;
    link: string;
    description: string;
  }[];
}

const nowList: NowList[] = [
  {
    type: 'update',
    posts: [
      {
        title: 'Update 1',
        link: '/posts/update-1',
        description: 'Update 1 description',
      },
      {
        title: 'Update 2',
        link: '/posts/update-2',
        description: 'Update 2 description',
      },
    ],
  },
  {
    type: 'create',
    posts: [
      {
        title: 'Create 1',
        link: '/posts/create-1',
        description: 'Create 1 description',
      },
    ],
  },
];

export default function LeftSidebar() {
  const location = useLocation();
  const isPostsActive = location.pathname.startsWith('/posts');

  return (
    <div className='hidden md:block'>
      <div className='flex flex-col gap-10 justify-center'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-sm font-medium text-muted-foreground/50'>DISCOVER</h1>
          <div className='flex flex-col gap-2'>
            <NavLink
              to='/posts/all'
              prefetch='intent'
              className={() => navLinkVariants({ isActive: isPostsActive })}
            >
              <LayoutGrid className='size-4' />
              <span>All Posts</span>
            </NavLink>
            <NavLink
              to='/popular'
              prefetch='intent'
              className={({ isActive }) => navLinkVariants({ isActive })}
            >
              <StarIcon className='size-4' />
              <span>Popular Posts</span>
            </NavLink>
          </div>
        </div>
        {nowList && nowList.length > 0 && (
          <div className='flex flex-col gap-4'>
            <h1 className='text-sm font-medium text-muted-foreground/50'>NOW</h1>
            <div className='border rounded-md p-2 bg-muted-foreground/5 flex flex-col gap-5'>
              {nowList.map((item) => (
                <div key={item.type} className='flex flex-col gap-2 ml-2'>
                  <div className='flex items-center gap-2'>
                    <span className='relative flex h-3 w-3'>
                      {item.type === 'update' ? (
                        <>
                          <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                          <span className='relative inline-flex rounded-full h-3 w-3 bg-green-500'></span>
                        </>
                      ) : (
                        <>
                          <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75'></span>
                          <span className='relative inline-flex rounded-full h-3 w-3 bg-purple-500'></span>
                        </>
                      )}
                    </span>
                    <span className='text-muted-foreground font-medium text-sm capitalize'>
                      {item.type}
                    </span>
                  </div>
                  <div className='flex flex-col gap-2'>
                    {item.posts.map((post) => (
                      <Link to={post.link} key={post.title} className='flex flex-col gap-1'>
                        <span className='font-medium text-xs'>{post.title}</span>
                        <span className='text-muted-foreground font-medium text-xs line-clamp-2'>
                          {post.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className='flex flex-col gap-4'>
          <h1 className='text-sm font-medium text-muted-foreground/50'>CATEGORIES</h1>
          <div className='flex flex-col gap-1'>
            {foloderList.map((item) => (
              <FolderItems key={item.name} item={item as FolderItemProps} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
