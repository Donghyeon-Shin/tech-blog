import { cva } from 'class-variance-authority';
import { BookIcon, LayoutGrid, StarIcon } from 'lucide-react';
import { NavLink } from 'react-router';
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

export default function LeftSidebar() {
  return (
    <div className='hidden md:block'>
      <div className='flex flex-col gap-10 justify-center'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-sm font-medium text-muted-foreground/50'>DISCOVER</h1>
          <div className='flex flex-col gap-2'>
            <NavLink
              to='/posts/all'
              prefetch='intent'
              className={({ isActive }) => navLinkVariants({ isActive })}
            >
              <LayoutGrid className='size-4' />
              <span>All Posts</span>
            </NavLink>
            <NavLink
              to='/posts/popular'
              prefetch='intent'
              className={({ isActive }) => navLinkVariants({ isActive })}
            >
              <StarIcon className='size-4' />
              <span>Popular Posts</span>
            </NavLink>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
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
