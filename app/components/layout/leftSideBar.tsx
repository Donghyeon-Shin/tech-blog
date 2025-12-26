import { cva } from 'class-variance-authority';
import { LayoutGrid, StarIcon } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router';
import FolderItems from './folderItems';
import type { FolderItemProps } from '~/types/folderItemProps';
import type { Database } from 'database.types';
import { markdownToText } from '~/lib/markdown-to-text';

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

export default function LeftSidebar({
  categoriesTree,
  events,
}: {
  categoriesTree: FolderItemProps[];
  events: Database['public']['Functions']['get_latest_unique_events']['Returns'];
}) {
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
        {events && events.length > 0 && (
          <div className='flex flex-col gap-4'>
            <h1 className='text-sm font-medium text-muted-foreground/50'>NOW</h1>
            <div className='border rounded-md p-2 bg-muted-foreground/5 flex flex-col gap-5'>
              <div className='flex flex-col gap-4 ml-2'>
                {events.filter((e) => e.event_type === 'create').length > 0 && (
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                      <div className='relative flex h-3 w-3'>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75'></span>
                        <span className='relative inline-flex rounded-full h-3 w-3 bg-purple-500'></span>
                      </div>
                      <span className='text-muted-foreground font-medium text-sm capitalize'>
                        Created
                      </span>
                    </div>
                    <div className='flex flex-col gap-2'>
                      {events
                        .filter((e) => e.event_type === 'create')
                        .map((event) => (
                          <div className='flex flex-col gap-2' key={event.event_id}>
                            <Link
                              to={`/post/${event.post_id}`}
                              key={event.event_id}
                              className='flex flex-col gap-1 hover:bg-primary/10 rounded-md p-2'
                            >
                              <span className='font-medium text-xs'>{event.post_title}</span>
                              <span className='text-muted-foreground font-medium text-xs line-clamp-1'>
                                {markdownToText(event.post_excerpt || '', 100)}
                              </span>
                            </Link>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                {events.filter((e) => e.event_type === 'update').length > 0 && (
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                      <div className='relative flex h-3 w-3'>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75' />
                        <span className='relative inline-flex rounded-full h-3 w-3 bg-green-500' />
                      </div>
                      <span className='text-muted-foreground font-medium text-sm capitalize'>
                        Updated
                      </span>
                    </div>
                    <div className='flex flex-col gap-2'>
                      {events
                        .filter((e) => e.event_type === 'update')
                        .map((event) => (
                          <div className='flex flex-col gap-2' key={event.event_id}>
                            <Link
                              to={`/post/${event.post_id}`}
                              key={event.event_id}
                              className='flex flex-col gap-1 hover:bg-primary/10 rounded-md p-2'
                            >
                              <span className='font-medium text-xs'>{event.post_title}</span>
                              <span className='text-muted-foreground font-medium text-xs line-clamp-1'>
                                {markdownToText(event.post_excerpt || '', 100)}
                              </span>
                            </Link>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className='flex flex-col gap-4'>
          <h1 className='text-sm font-medium text-muted-foreground/50'>CATEGORIES</h1>
          <div className='flex flex-col gap-1'>
            {categoriesTree.map((item) => (
              <FolderItems key={item.name} item={item as FolderItemProps} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
