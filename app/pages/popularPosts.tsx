import { NavLink } from 'react-router';
import { getTopLevelCategories } from '~/api/categories/categories-api';
import { getPopularPosts } from '~/api/posts/posts-api';
import PopularPostCard from '~/components/ui/popularPostCard';
import client from '~/supa-client';
import type { Route } from './+types/popularPosts';

export const loader = async () => {
  const posts = await getPopularPosts(client);
  const categories = await getTopLevelCategories(client);
  return { posts, categories };
};

export default function PopularPosts({ loaderData }: Route.ComponentProps) {
  const { posts, categories } = loaderData;
  return (
    <div className='flex flex-col gap-8 max-w-[1400px] md:ml-20'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-4xl font-bold'>Popular Posts</h1>
        <p className='text-muted-foreground'>Most read articles on my blog</p>
      </div>
      <div className='flex flex-col gap-4'>
        {posts.map((post, index) => (
          <PopularPostCard
            key={post.title}
            title={post.title}
            description={post.content.slice(0, 100)}
            category={
              categories?.find((c) => c.category_id === post.tag)?.name as
                | 'Algorithm'
                | 'Book'
                | 'LangChain'
                | 'React'
                | 'Research'
                | 'SQL'
                | 'Project'
            }
            date={new Date(post.created_at)}
            link={`/post/${post.post_id}`}
            views={post.view_count}
            readTime={post.read_time}
            rank={index + 1}
          />
        ))}
      </div>

      <div className='flex items-center justify-center'>
        <NavLink
          to='/posts/all'
          className='text-sm text-muted-foreground hover:text-foreground border rounded-full p-4'
        >
          Load More Articles
        </NavLink>
      </div>
    </div>
  );
}
