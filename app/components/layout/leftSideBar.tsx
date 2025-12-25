import { cva } from 'class-variance-authority';
import { LayoutGrid, StarIcon } from 'lucide-react';
import { NavLink } from 'react-router';

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

export default function LeftSidebar() {
  return (
    <div className='hidden md:block'>
      <div className='flex flex-col gap-4 justify-center'>
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
      </div>
    </div>
  );
}
