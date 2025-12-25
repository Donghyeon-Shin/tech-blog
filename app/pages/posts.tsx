import { NavLink } from 'react-router';
import type { Route } from './+types/posts';
import { cva } from 'class-variance-authority';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const category = url.pathname.split('/')[2];
  console.log(category);
  return { category };
};

const navLinkVariants = cva('rounded-full border px-4 py-1', {
  variants: {
    isActive: {
      true: 'bg-primary font-medium text-primary-foreground',
      false: 'hover:bg-primary/10',
    },
  },
});
export default function Posts() {
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-4xl font-bold'>All Posts</h1>
        <p className='text-muted-foreground'>
          A collection of 42 articles on programming, technology and life.
        </p>
      </div>
      <div className='flex flex-row gap-2'>
        <NavLink to='/posts/all' className={({ isActive }) => navLinkVariants({ isActive })}>
          View All
        </NavLink>
        <NavLink
          to='/posts/development'
          className={({ isActive }) => navLinkVariants({ isActive })}
        >
          Development
        </NavLink>
      </div>
    </div>
  );
}
