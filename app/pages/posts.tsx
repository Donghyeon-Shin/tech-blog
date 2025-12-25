import { NavLink } from 'react-router';
import type { Route } from './+types/posts';
import { cva } from 'class-variance-authority';
import PostCard from '~/components/layout/postCard';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const category = url.pathname.split('/')[2];
  return { category };
};

const navLinkVariants = cva('rounded-full border px-4 py-1', {
  variants: {
    isActive: {
      true: 'bg-foreground font-medium text-background',
      false: 'hover:bg-primary/10',
    },
  },
});

type PostCategory = 'Algorithm' | 'Book' | 'LangChain' | 'React' | 'Research' | 'SQL' | 'Project';

const categoryList: PostCategory[] = [
  'Algorithm',
  'Book',
  'LangChain',
  'React',
  'Research',
  'SQL',
  'Project',
];

interface Post {
  title: string;
  description: string;
  category: PostCategory;
  date: Date;
  link: string;
  readTime: number;
}

const postList: Post[] = [
  {
    title: 'Post 1',
    description: 'Post 1 description',
    category: 'Algorithm',
    date: new Date('2025-01-01'),
    link: '/post/post-1',
    readTime: 10,
  },
  {
    title: 'Post 2',
    description: 'Post 2 description',
    category: 'Book',
    date: new Date('2025-01-01'),
    link: '/post/post-2',
    readTime: 10,
  },
  {
    title: 'Post 3',
    description: 'Post 3 description',
    category: 'LangChain',
    date: new Date('2025-01-01'),
    link: '/post/post-3',
    readTime: 10,
  },
];

export default function Posts() {
  return (
    <div className='flex flex-col gap-8 max-w-[1400px] md:ml-20'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-4xl font-bold'>All Posts</h1>
        <p className='text-muted-foreground'>
          A collection of 42 articles on programming, technology and life.
        </p>
      </div>
      <div className='flex flex-row flex-wrap gap-2'>
        <NavLink to='/posts/all' className={({ isActive }) => navLinkVariants({ isActive })}>
          View All
        </NavLink>
        {categoryList.map((category) => (
          <NavLink
            key={category}
            to={`/posts/${category}`}
            className={({ isActive }) => navLinkVariants({ isActive })}
          >
            {category}
          </NavLink>
        ))}
      </div>
      <div className='flex flex-col gap-4'>
        {postList.map((post) => (
          <PostCard
            key={post.title}
            title={post.title}
            description={post.description}
            category={post.category}
            date={post.date}
            link={post.link}
            readTime={post.readTime}
          />
        ))}
      </div>
    </div>
  );
}
